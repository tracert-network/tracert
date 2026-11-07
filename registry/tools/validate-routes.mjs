#!/usr/bin/env node
// Route validator — every public route (registry/routes/*.md) passes this before publication.
//
// Per file:
//   1. Front matter parses (YAML between --- lines) and conforms to schemas/route.schema.json.
//   2. slug equals the file name; last_verified >= first_observed; dates not in the future.
//   3. Required sections exist: "## TL;DR", "## Verify first", "## Domains".
//   4. Safety: no raw HTML/script/iframe/style tags, no "ignore previous instructions"-style
//      text (routes are read by agents — they must stay data, never instructions).
//   5. Privacy lint (warnings): email addresses, phone-like numbers, order/quote/draft numbers.
//   6. Moderation: no host in moderation/denylist.json.
//
// Exit 0 = valid (warnings allowed) or no routes. Exit 1 = errors.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { REGISTRY_ROOT, newAjv, loadJson } from "./lib.mjs";

const ROUTES_DIR = join(REGISTRY_ROOT, "routes");
const ajv = newAjv();
const validateFront = ajv.compile(loadJson(join(REGISTRY_ROOT, "schemas", "route.schema.json")));
const denylist = existsSync(join(REGISTRY_ROOT, "moderation", "denylist.json"))
  ? loadJson(join(REGISTRY_ROOT, "moderation", "denylist.json"))
  : { domains: [] };
const denyDomains = (denylist.domains ?? []).map((d) => String(d).toLowerCase());

const files = existsSync(ROUTES_DIR)
  ? readdirSync(ROUTES_DIR).filter((f) => f.endsWith(".md") && f !== "README.md").sort()
  : [];

let failed = 0;
let warned = 0;
const today = new Date().toISOString().slice(0, 10);

if (!files.length) console.log("0 routes under routes/ — OK.");

for (const f of files) {
  const errors = [];
  const warnings = [];
  const text = readFileSync(join(ROUTES_DIR, f), "utf8");
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) {
    report(f, ["missing front matter (--- ... ---)"], []);
    failed++;
    continue;
  }
  let front;
  try {
    front = parseYaml(m[1]);
  } catch (e) {
    report(f, [`front matter YAML: ${e.message}`], []);
    failed++;
    continue;
  }
  // YAML turns bare dates into Date objects; the schema wants strings.
  for (const k of ["first_observed", "last_verified"]) {
    if (front?.[k] instanceof Date) front[k] = front[k].toISOString().slice(0, 10);
  }
  const body = m[2];

  if (!validateFront(front)) {
    for (const e of validateFront.errors) errors.push(`schema: ${e.instancePath || "$"} ${e.message}`);
  }
  if (front?.slug && `${front.slug}.md` !== f) errors.push(`slug "${front.slug}" must equal the file name (${f})`);
  if (front?.first_observed && front?.last_verified && front.last_verified < front.first_observed) {
    errors.push("last_verified is before first_observed");
  }
  for (const k of ["first_observed", "last_verified"]) {
    if (front?.[k] && front[k] > today) errors.push(`${k} is in the future`);
  }

  for (const heading of ["TL;DR", "Verify first", "Domains"]) {
    if (!new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "m").test(body)) {
      errors.push(`missing required section "## ${heading}"`);
    }
  }

  if (/<\s*(script|iframe|style|object|embed|form|img|svg)\b/i.test(body)) {
    errors.push("raw HTML tags (script/iframe/style/object/embed/form/img/svg) are not allowed");
  }
  if (/ignore (all |any )?(previous|prior|above) (instructions|prompts)|disregard (the|your) (instructions|system prompt)|you are now|system prompt:/i.test(body)) {
    errors.push("text that reads as instructions to an agent (prompt-injection pattern) is not allowed");
  }

  const emails = body.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? [];
  if (emails.length) warnings.push(`contains email address(es): ${[...new Set(emails)].join(", ")} — only a vendor's own published contact is OK`);
  if (/(\+?\d[\d ()-]{9,}\d)/.test(body.replace(/\d{4}-\d{2}-\d{2}/g, ""))) {
    warnings.push("contains a phone-like number — only a vendor's own published number is OK");
  }
  if (/\b(order|quote|draft|invoice|ticket)\s*(no\.?|number|#)\s*[:#]?\s*[A-Z0-9-]{4,}/i.test(body)) {
    errors.push("contains an order/quote/draft/invoice number — never publish these");
  }

  const hosts = Array.isArray(front?.hosts) ? front.hosts : String(front?.hosts ?? "").split(",");
  for (const h of hosts.map((x) => String(x).trim().toLowerCase()).filter(Boolean)) {
    for (const d of denyDomains) {
      if (h === d || h.endsWith("." + d)) errors.push(`host "${h}" matches denylisted domain "${d}"`);
    }
  }

  report(f, errors, warnings);
  if (errors.length) failed++;
  warned += warnings.length;
}

console.log(`\n${files.length} route(s) checked: ${failed} with errors, ${warned} warning(s).`);
process.exit(failed ? 1 : 0);

function report(f, errors, warnings) {
  if (!errors.length && !warnings.length) return console.log(`OK   routes/${f}`);
  console.log(`${errors.length ? "FAIL" : "WARN"} routes/${f}`);
  for (const e of errors) console.log(`     error: ${e}`);
  for (const w of warnings) console.log(`     warn:  ${w}`);
}
