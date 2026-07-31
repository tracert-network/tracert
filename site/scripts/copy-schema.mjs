// Prebuild: copy the TRACE Manifest schema into the site so the submission API
// can validate against it at runtime (a serverless function can't reliably read
// files outside its own bundle). Runs before `next build` via the prebuild hook.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const candidates = [
  process.env.TRACERT_REGISTRY_DIR,
  resolve(process.cwd(), "..", "registry"),
  resolve(process.cwd(), "registry"),
].filter(Boolean);

let src;
for (const dir of candidates) {
  const p = join(dir, "schemas", "manifest.schema.json");
  if (existsSync(p)) { src = p; break; }
}
if (!src) {
  console.error("copy-schema: manifest.schema.json not found in", candidates);
  process.exit(1);
}
mkdirSync(resolve(process.cwd(), "src", "generated"), { recursive: true });
copyFileSync(src, resolve(process.cwd(), "src", "generated", "manifest.schema.json"));
console.log("copy-schema: manifest.schema.json -> src/generated/");
