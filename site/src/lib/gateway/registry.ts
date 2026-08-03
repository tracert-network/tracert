// Gateway registry — loaded from the build-time snapshot (src/generated/
// gateway-registry.json) rather than the filesystem, so it works inside a
// serverless function. Same manifest_hash as the site and router.
import { Ajv2020 } from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import snapshot from "@/generated/gateway-registry.json";
import type { LoadedCapability, ManifestDoc } from "./types";

interface SnapshotRow {
  manifest: ManifestDoc;
  manifestHash: string;
  inputSchema: object | null;
  outputSchema: object | null;
}

function newAjv(): Ajv2020 {
  const ajv = new Ajv2020({ allErrors: true, strict: false, allowUnionTypes: true });
  addFormats(ajv as never);
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
  const ajv = newAjv();
  for (const row of snapshot as SnapshotRow[]) {
    const cap = row.manifest.capability;
    const loaded: LoadedCapability = {
      manifest: row.manifest,
      capability: cap,
      manifestHash: row.manifestHash,
      inputSchema: row.inputSchema,
      outputSchema: row.outputSchema,
    };
    byId.set(cap.id, loaded);
    if (loaded.inputSchema) inputValidators.set(cap.id, ajv.compile(loaded.inputSchema));
  }
  cache = { byId, inputValidators };
  return cache;
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
  invocable_here: boolean;
  match_reasons: string[];
}

// Which capability ids the public gateway can actually execute (safe reads).
const EXECUTABLE_HERE = new Set([
  "exchangerate-api.latest-rates",
  "free-dictionary.define-word",
  "qr-server.create-qr-code",
]);

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
    if (c.pricing.free) reasons.push("free route — no wallet or payment handshake required");

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
        invocable_here: EXECUTABLE_HERE.has(c.id) && c.status === "active",
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
