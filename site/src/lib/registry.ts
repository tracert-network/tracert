// Build-time registry loader: the site is generated from the same manifests
// the router serves. Nothing on tracert.site is hand-maintained marketing for
// a capability — pages, index and schemas all derive from the registry.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

export const SITE_ORIGIN = "https://tracert.site";
export const REPO_URL = "https://github.com/tracert-network/tracert";
export const REGISTRY_URL = `${REPO_URL}/tree/main/registry`;

export interface ManifestDoc {
  schema: string;
  provider: { id: string; name: string; url?: string; operator?: string };
  service: { id: string; name?: string; url?: string };
  capability: {
    id: string;
    version: string;
    status: string;
    promise: string;
    description?: string;
    tags?: string[];
    excludes?: string[];
    input: IoContract;
    output: IoContract;
    errors?: { code: string; meaning: string; retriable?: boolean }[];
    interfaces: { type: string; endpoint?: string; docs_url?: string; openapi_url?: string; server_url?: string; install_url?: string; agent_card?: string; notes?: string }[];
    pricing: { free: boolean; mode: string; amount?: { value: string; currency: string }; unit?: string; payment_offers?: string[]; refund_policy?: string };
    operations: { idempotency: string; expected_latency_seconds?: { p50: number; p95?: number }; timeout_seconds?: number; rate_limits?: string; availability_endpoint?: string };
    data_policy: {
      input_retention: { policy: "none" | "ephemeral" | "fixed_window" | "indefinite" | "undisclosed"; max_hours?: number; notes?: string };
      training_use: "none" | "opt_out" | "opt_in" | "yes" | "undisclosed";
      regions?: string[];
      subprocessors?: string[];
      notes?: string;
    };
    evidence?: { public_examples?: string; recent_executions?: string; test_vectors?: string; repository?: string };
    provenance: { integration_status: string; adapter_operator?: string; notes?: string };
  };
}

interface IoContract {
  schema_ref: string;
  media_types?: string[];
  max_bytes?: number;
  notes?: string;
}

export interface LoadedCapability {
  manifest: ManifestDoc;
  manifestHash: string;
  inputSchema: object | null;
  outputSchema: object | null;
}

// Resolve the registry regardless of which directory the build runs from —
// TRACERT_REGISTRY_DIR wins, then a sibling `../registry` (Vercel root =
// site/), then `./registry` (Vercel root = repo root). Picking by ground
// truth means neither the site nor its Vercel root-directory setting has to
// know the other's layout.
const REGISTRY_DIR = resolveRegistryDir();

function resolveRegistryDir(): string {
  const candidates = [
    process.env.TRACERT_REGISTRY_DIR,
    resolve(process.cwd(), "..", "registry"),
    resolve(process.cwd(), "registry"),
  ].filter(Boolean) as string[];
  for (const dir of candidates) {
    if (existsSync(join(dir, "schemas", "manifest.schema.json"))) return dir;
  }
  return candidates[candidates.length - 1];
}

let cache: Map<string, LoadedCapability> | null = null;

export function loadCapabilities(): Map<string, LoadedCapability> {
  if (cache) return cache;
  const byId = new Map<string, LoadedCapability>();
  const providersDir = join(REGISTRY_DIR, "providers");
  if (!existsSync(providersDir)) {
    throw new Error(`Registry not found at ${REGISTRY_DIR} — set TRACERT_REGISTRY_DIR`);
  }
  for (const provider of readdirSync(providersDir)) {
    const capsDir = join(providersDir, provider, "capabilities");
    if (!existsSync(capsDir) || !statSync(capsDir).isDirectory()) continue;
    for (const file of readdirSync(capsDir)) {
      if (!/\.ya?ml$/.test(file)) continue;
      const manifestPath = join(capsDir, file);
      const manifest = parseYaml(readFileSync(manifestPath, "utf8")) as ManifestDoc;
      byId.set(manifest.capability.id, {
        manifest,
        manifestHash: sha256Commitment(manifest),
        inputSchema: loadIoSchema(manifestPath, manifest.capability.input.schema_ref),
        outputSchema: loadIoSchema(manifestPath, manifest.capability.output.schema_ref),
      });
    }
  }
  cache = byId;
  return byId;
}

export function getCapability(id: string): LoadedCapability | undefined {
  return loadCapabilities().get(id);
}

export function allCapabilities(): LoadedCapability[] {
  return [...loadCapabilities().values()].sort((a, b) =>
    a.manifest.capability.id.localeCompare(b.manifest.capability.id),
  );
}

export function registrySchema(name: "manifest" | "receipt"): object {
  return JSON.parse(readFileSync(join(REGISTRY_DIR, "schemas", `${name}.schema.json`), "utf8")) as object;
}

// Same shape as the registry's own build-index export — one source of truth
// for what an "index row" is would be premature while both are 40 lines.
export function buildIndex() {
  return {
    schema: `${SITE_ORIGIN}/schemas/index/v0.1`,
    built_from: "tracert-registry",
    capability_count: allCapabilities().length,
    capabilities: allCapabilities().map(({ manifest }) => {
      const c = manifest.capability;
      return {
        id: c.id,
        version: c.version,
        status: c.status,
        promise: c.promise,
        tags: c.tags ?? [],
        provider: { id: manifest.provider.id, name: manifest.provider.name },
        service: { id: manifest.service.id },
        free: c.pricing.free,
        pricing_mode: c.pricing.mode,
        payment_offers: c.pricing.payment_offers ?? [],
        input_media_types: c.input.media_types ?? [],
        output_media_types: c.output.media_types ?? [],
        interfaces: c.interfaces.map((i) => i.type),
        expected_latency_p50_s: c.operations.expected_latency_seconds?.p50 ?? null,
        manifest_url: `${SITE_ORIGIN}/capabilities/${c.id}/manifest.json`,
        page_url: `${SITE_ORIGIN}/capabilities/${c.id}`,
      };
    }),
  };
}

function loadIoSchema(manifestPath: string, ref: string): object | null {
  if (/^https?:\/\//.test(ref)) return null;
  const path = resolve(dirname(manifestPath), ref);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as object;
}

function sha256Commitment(value: unknown): string {
  return "sha256:" + createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortValue((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}
