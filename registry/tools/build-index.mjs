#!/usr/bin/env node
// Builds the machine export: a complete, downloadable snapshot of the registry
// as dist/index.json — concise per-capability rows an agent or indexer can
// consume without parsing YAML. Deterministic for a given registry state.
import { mkdirSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { REGISTRY_ROOT, findManifestFiles, loadManifest } from "./lib.mjs";

const rows = findManifestFiles().map((file) => {
  const m = loadManifest(file);
  const c = m.capability;
  return {
    id: c.id,
    version: c.version,
    status: c.status,
    promise: c.promise,
    tags: c.tags ?? [],
    provider: { id: m.provider.id, name: m.provider.name },
    service: { id: m.service.id },
    free: c.pricing.free,
    pricing_mode: c.pricing.mode,
    payment_offers: c.pricing.payment_offers ?? [],
    input_media_types: c.input.media_types ?? [],
    output_media_types: c.output.media_types ?? [],
    interfaces: c.interfaces.map((i) => i.type),
    expected_latency_p50_s: c.operations.expected_latency_seconds?.p50 ?? null,
    manifest_path: relative(REGISTRY_ROOT, file),
  };
});

const index = {
  schema: "https://tracert.site/schemas/index/v0.1",
  built_from: "tracert-registry",
  capability_count: rows.length,
  capabilities: rows,
};

mkdirSync(`${REGISTRY_ROOT}/dist`, { recursive: true });
writeFileSync(`${REGISTRY_ROOT}/dist/index.json`, JSON.stringify(index, null, 2) + "\n");
console.log(`dist/index.json written — ${rows.length} capability(ies).`);
