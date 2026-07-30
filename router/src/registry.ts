// Loads the Tracert registry (TRACE manifests + IO schemas) and provides
// search over it. The registry YAML is the source of truth; this loader is the
// bootstrap stand-in for the future indexer.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { ValidateFunction } from "ajv/dist/2020.js";
import type { LoadedCapability, ManifestDoc } from "./types.js";
import { sha256Commitment } from "./canonical.js";

const moduleDir = dirname(fileURLToPath(import.meta.url));
export const REGISTRY_DIR =
  process.env.TRACERT_REGISTRY_DIR ?? resolve(moduleDir, "..", "..", "registry");

export function newAjv(): Ajv2020 {
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false, allowUnionTypes: true });
  addFormats.default(ajv as never);
  return ajv;
}

interface Loaded {
  byId: Map<string, LoadedCapability>;
  inputValidators: Map<string, ValidateFunction>;
}

let cache: Loaded | null = null;

export function loadRegistry(): Loaded {
  if (cache) return cache;
  const byId = new Map<string, LoadedCapability>();
  const inputValidators = new Map<string, ValidateFunction>();
  const providersDir = join(REGISTRY_DIR, "providers");
  if (!existsSync(providersDir)) {
    throw new Error(`Registry not found at ${REGISTRY_DIR} (set TRACERT_REGISTRY_DIR)`);
  }
  const ajv = newAjv();
  for (const provider of readdirSync(providersDir)) {
    const capsDir = join(providersDir, provider, "capabilities");
    if (!existsSync(capsDir) || !statSync(capsDir).isDirectory()) continue;
    for (const file of readdirSync(capsDir)) {
      if (!/\.ya?ml$/.test(file)) continue;
      const manifestPath = join(capsDir, file);
      const manifest = parseYaml(readFileSync(manifestPath, "utf8")) as ManifestDoc;
      const cap = manifest.capability;
      const loaded: LoadedCapability = {
        manifest,
        capability: cap,
        manifestPath,
        manifestHash: sha256Commitment(manifest),
        inputSchema: loadIoSchema(manifestPath, cap.input.schema_ref),
        outputSchema: loadIoSchema(manifestPath, cap.output.schema_ref),
      };
      byId.set(cap.id, loaded);
      if (loaded.inputSchema) {
        inputValidators.set(cap.id, ajv.compile(loaded.inputSchema));
      }
    }
  }
  cache = { byId, inputValidators };
  return cache;
}

function loadIoSchema(manifestPath: string, ref: string): object | null {
  if (/^https?:\/\//.test(ref)) return null; // remote refs not fetched by the dev router
  const path = resolve(dirname(manifestPath), ref);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as object;
}

export interface SearchFilters {
  free_only?: boolean;
  media_type?: string;
  max_price_usd?: number;
  payment_modes?: string[];
  limit?: number;
}

export interface SearchRow {
  capability_id: string;
  version: string;
  status: string;
  promise: string;
  provider: string;
  free: boolean;
  price: string;
  expected_latency_p50_s: number | null;
  interfaces: string[];
  invocable_via_router: boolean;
  match_reasons: string[];
}

export function searchCapabilities(query: string, filters: SearchFilters = {}): {
  results: SearchRow[];
  total_matched: number;
  dropped_by_filters: number;
} {
  const { byId } = loadRegistry();
  const tokens = tokenize(query);
  const scored: { row: SearchRow; score: number }[] = [];
  let droppedByFilters = 0;

  for (const { manifest, capability: c } of byId.values()) {
    const reasons: string[] = [];
    let score = 0;

    const fields: [string, string, number][] = [
      ["capability id", c.id, 3],
      ["tags", (c.tags ?? []).join(" "), 3],
      ["promise", c.promise, 2],
      ["description", c.description ?? "", 1],
      ["provider", `${manifest.provider.name} ${manifest.service.name ?? ""}`, 1],
    ];
    for (const [label, text, weight] of fields) {
      const hay = text.toLowerCase();
      const hits = tokens.filter((t) => hay.includes(t));
      if (hits.length) {
        score += weight * hits.length;
        reasons.push(`${label} matches ${hits.map((h) => `"${h}"`).join(", ")}`);
      }
    }
    if (score === 0) continue;

    // Constraint filters — applied after relevance so we can report drops.
    if (filters.free_only && !c.pricing.free) { droppedByFilters++; continue; }
    if (filters.media_type) {
      const mts = [...(c.input.media_types ?? []), ...(c.output.media_types ?? [])];
      if (!mts.includes(filters.media_type)) { droppedByFilters++; continue; }
    }
    if (filters.max_price_usd !== undefined && !c.pricing.free) {
      const amt = c.pricing.mode === "fixed" ? Number(c.pricing.amount?.value ?? NaN) : NaN;
      const usd = c.pricing.amount?.currency === "USD";
      if (!(usd && amt <= filters.max_price_usd)) { droppedByFilters++; continue; }
    }
    if (filters.payment_modes?.length && !c.pricing.free) {
      const offers = c.pricing.payment_offers ?? [];
      if (!filters.payment_modes.some((m) => offers.includes(m))) { droppedByFilters++; continue; }
    }
    if (c.pricing.free) {
      reasons.push("free route — no wallet or payment handshake required");
    }

    scored.push({
      score,
      row: {
        capability_id: c.id,
        version: c.version,
        status: c.status,
        promise: c.promise,
        provider: manifest.provider.name,
        free: c.pricing.free,
        price: c.pricing.free
          ? "free"
          : c.pricing.mode === "fixed"
            ? `${c.pricing.amount?.value} ${c.pricing.amount?.currency} ${c.pricing.unit ?? ""}`.trim()
            : "quoted per invocation",
        expected_latency_p50_s: c.operations.expected_latency_seconds?.p50 ?? null,
        interfaces: c.interfaces.map((i) => i.type),
        invocable_via_router: c.status === "active",
        match_reasons: reasons,
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const limit = Math.min(Math.max(filters.limit ?? 5, 1), 20);
  return {
    results: scored.slice(0, limit).map((s) => s.row),
    total_matched: scored.length,
    dropped_by_filters: droppedByFilters,
  };
}

function tokenize(query: string): string[] {
  const stop = new Set(["a", "an", "the", "to", "of", "for", "and", "or", "in", "on", "with", "that", "this", "my", "me", "it", "is", "can", "do", "use"]);
  return [...new Set(query.toLowerCase().split(/[^a-z0-9-]+/).filter((t) => t.length > 1 && !stop.has(t)))];
}
