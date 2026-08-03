// Build-time registry snapshot for the hosted MCP gateway. The gateway runs in
// a serverless function that can't fs-read the registry at request time, so we
// bake a static JSON the route imports: [{ manifest, manifestHash, inputSchema,
// outputSchema }]. manifestHash uses the same canonical-JSON sha256 as the site
// and router, so receipts stay consistent across all three.
import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { parse as parseYaml } from "yaml";

const REG = [
  process.env.TRACERT_REGISTRY_DIR,
  resolve(process.cwd(), "..", "registry"),
  resolve(process.cwd(), "registry"),
].filter(Boolean).find((d) => existsSync(join(d, "schemas", "manifest.schema.json")));

const caps = [];
if (REG) {
  const providersDir = join(REG, "providers");
  if (existsSync(providersDir)) {
    for (const provider of readdirSync(providersDir)) {
      const capsDir = join(providersDir, provider, "capabilities");
      if (!existsSync(capsDir) || !statSync(capsDir).isDirectory()) continue;
      for (const file of readdirSync(capsDir)) {
        if (!/\.ya?ml$/.test(file)) continue;
        const manifestPath = join(capsDir, file);
        const manifest = parseYaml(readFileSync(manifestPath, "utf8"));
        caps.push({
          manifest,
          manifestHash: sha256Commitment(manifest),
          inputSchema: loadSchema(manifestPath, manifest.capability.input.schema_ref),
          outputSchema: loadSchema(manifestPath, manifest.capability.output.schema_ref),
        });
      }
    }
  }
}

caps.sort((a, b) => a.manifest.capability.id.localeCompare(b.manifest.capability.id));
const out = resolve(process.cwd(), "src/generated/gateway-registry.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(caps) + "\n");
console.log(`gateway-registry: ${caps.length} capability(ies) -> src/generated/gateway-registry.json`);

function loadSchema(manifestPath, ref) {
  if (/^https?:\/\//.test(ref)) return null;
  const p = resolve(dirname(manifestPath), ref);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
}
function canonical(v) {
  return JSON.stringify(sortValue(v));
}
function sortValue(v) {
  if (Array.isArray(v)) return v.map(sortValue);
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v).sort()) o[k] = sortValue(v[k]);
    return o;
  }
  return v;
}
function sha256Commitment(v) {
  return "sha256:" + createHash("sha256").update(canonical(v)).digest("hex");
}
