// Build-time snapshot of the public routes (registry/routes/*.md) for the site,
// the routes search/outcome APIs and the hosted MCP gateway. Serverless
// functions can't fs-read the registry at request time, so everything reads
// src/generated/routes.json. Validation happens in the registry
// (tools/validate-routes.mjs); this script only parses and normalises.
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { parse as parseYaml } from "yaml";

const REG = [
  process.env.TRACERT_REGISTRY_DIR,
  resolve(process.cwd(), "..", "registry"),
  resolve(process.cwd(), "registry"),
].filter(Boolean).find((d) => existsSync(join(d, "schemas", "manifest.schema.json")));

const list = (v) =>
  (Array.isArray(v) ? v : String(v ?? "").split(","))
    .map((s) => String(s).trim())
    .filter(Boolean);
const date = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""));

const routes = [];
const dir = REG ? join(REG, "routes") : null;
if (dir && existsSync(dir)) {
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".md") && x !== "README.md").sort()) {
    const text = readFileSync(join(dir, f), "utf8");
    const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
    if (!m) continue;
    const fm = parseYaml(m[1]) ?? {};
    const body = m[2].replace(/^\n+/, "");
    const title = (/^# (.+)$/m.exec(body)?.[1] ?? fm.slug).trim();
    // Number of Verify-first checks (numbered items in that section) — the
    // "cost to verify" an agent compares with explorer_steps.
    const verifySection = /^## Verify first[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(body)?.[1] ?? "";
    const verify_checks = (verifySection.match(/^\d+\.\s/gm) ?? []).length;
    // Changelog lines "- YYYY-MM-DD — text" → [{date, text}], newest first.
    const changeSection = /^## Changelog[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(body)?.[1] ?? "";
    const changelog = [...changeSection.matchAll(/^- (\d{4}-\d{2}-\d{2})\s*[—–:-]+\s*(.+)$/gm)]
      .map((m) => ({ date: m[1], text: m[2].trim() }))
      .sort((a, b) => b.date.localeCompare(a.date));
    routes.push({
      slug: fm.slug,
      title,
      intent: fm.intent,
      summary: typeof fm.summary === "string" ? fm.summary : null,
      verify_checks,
      task_type: fm.task_type,
      region: fm.region,
      tags: list(fm.tags),
      hosts: list(fm.hosts),
      first_observed: date(fm.first_observed),
      last_verified: date(fm.last_verified),
      method: fm.method,
      observed_by: fm.observed_by,
      explorer_steps: typeof fm.explorer_steps === "number" ? fm.explorer_steps : null,
      reuse_runs: typeof fm.reuse_runs === "number" ? fm.reuse_runs : 0,
      changelog,
      body,
      raw: text,
      sha256: "sha256:" + createHash("sha256").update(text).digest("hex"),
    });
  }
}

// Topic hubs (validated in the registry); kept in their own snapshot.
let hubs = [];
const hubsFile = dir ? join(dir, "_hubs.yaml") : null;
if (hubsFile && existsSync(hubsFile)) {
  const known = new Set(routes.map((r) => r.slug));
  hubs = (parseYaml(readFileSync(hubsFile, "utf8"))?.hubs ?? []).map((h) => ({
    slug: h.slug,
    title: h.title,
    summary: h.summary,
    intro: h.intro.trim(),
    sections: (h.sections ?? []).map((s) => ({
      heading: s.heading,
      routes: (s.routes ?? []).filter((r) => known.has(r.slug)).map((r) => ({ slug: r.slug, why: r.why })),
    })),
  }));
}
writeFileSync(resolve(process.cwd(), "src/generated/route-hubs.json"), JSON.stringify(hubs) + "\n");
console.log(`routes: ${hubs.length} hub(s) -> src/generated/route-hubs.json`);

const out = resolve(process.cwd(), "src/generated/routes.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(routes) + "\n");
console.log(`routes: ${routes.length} route(s) -> src/generated/routes.json`);
