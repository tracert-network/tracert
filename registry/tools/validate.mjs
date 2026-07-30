#!/usr/bin/env node
// Registry validator — the automated check every contribution passes before publication.
//
// Checks, per manifest:
//   1. Schema conformance against schemas/manifest.schema.json (ajv, draft 2020-12).
//   2. Capability ID discipline: first segment must equal provider.id or service.id.
//   3. schema_ref / test_vectors resolution: relative refs must exist; referenced
//      JSON Schemas must themselves compile.
//   4. Placeholder discipline: ".example" hosts and "TODO" markers are allowed only
//      while capability.status is "draft".
//   5. Filename convention (warning): <capability-id-after-first-dot>.yaml.
//
// Exit 0 = all manifests valid (warnings allowed). Exit 1 = errors, listed per file.
import { existsSync } from "node:fs";
import { relative } from "node:path";
import {
  REGISTRY_ROOT, newAjv, loadJson, findManifestFiles, loadManifest, resolveRef, walkStrings,
} from "./lib.mjs";

const ajv = newAjv();
const validateManifest = ajv.compile(loadJson(`${REGISTRY_ROOT}/schemas/manifest.schema.json`));
// Receipt schema isn't instantiated in the registry, but it must always compile.
ajv.compile(loadJson(`${REGISTRY_ROOT}/schemas/receipt.schema.json`));

const files = findManifestFiles();
let errorCount = 0;
let warnCount = 0;

if (files.length === 0) {
  // An empty registry is a valid state — a fresh network (or a fresh fork)
  // has no capabilities yet. Nothing to validate, nothing wrong.
  console.log("0 manifests under providers/*/capabilities/ — empty registry, OK.");
  process.exit(0);
}

for (const file of files) {
  const rel = relative(REGISTRY_ROOT, file);
  const errors = [];
  const warnings = [];
  let manifest;

  try {
    manifest = loadManifest(file);
  } catch (e) {
    report(rel, [`YAML parse failure: ${e.message}`], []);
    errorCount++;
    continue;
  }

  if (!validateManifest(manifest)) {
    for (const e of validateManifest.errors) {
      errors.push(`schema: ${e.instancePath || "$"} ${e.message}`);
    }
  }

  const cap = manifest?.capability;
  if (cap?.id && manifest?.provider?.id && manifest?.service?.id) {
    const prefix = cap.id.split(".")[0];
    if (prefix !== manifest.provider.id && prefix !== manifest.service.id) {
      errors.push(
        `identity: capability id prefix "${prefix}" matches neither provider.id "${manifest.provider.id}" nor service.id "${manifest.service.id}"`,
      );
    }
    const expectedName = cap.id.slice(prefix.length + 1);
    if (!new RegExp(`(^|/)${expectedName}\\.ya?ml$`).test(file)) {
      warnings.push(`naming: expected filename ${expectedName}.yaml for capability ${cap.id}`);
    }
  }

  for (const side of ["input", "output"]) {
    const ref = cap?.[side]?.schema_ref;
    if (!ref) continue;
    const r = resolveRef(file, ref);
    if (r.kind === "url") {
      warnings.push(`${side}.schema_ref is a URL (${ref}) — not fetched during validation`);
      continue;
    }
    if (!existsSync(r.target)) {
      errors.push(`${side}.schema_ref does not resolve: ${ref}`);
      continue;
    }
    try {
      newAjv().compile(loadJson(r.target));
    } catch (e) {
      errors.push(`${side}.schema_ref does not compile as JSON Schema: ${ref} (${e.message})`);
    }
  }

  const tv = cap?.evidence?.test_vectors;
  if (tv) {
    const r = resolveRef(file, tv);
    if (r.kind === "file" && !existsSync(r.target)) {
      errors.push(`evidence.test_vectors does not resolve: ${tv}`);
    }
  }

  if (cap?.status && cap.status !== "draft") {
    walkStrings(manifest, (path, value) => {
      // $.schema pins the registry's own version URI — it flips registry-wide
      // when the production domain lands, not per manifest.
      if (path === "$.schema") return;
      if (/https:\/\/[a-z0-9.-]*\.example([/:]|$)/.test(value)) {
        errors.push(`placeholder: ${path} contains a .example host but status is "${cap.status}" (only draft may carry placeholders)`);
      }
      if (/TODO/.test(value)) {
        errors.push(`placeholder: ${path} contains a TODO marker but status is "${cap.status}"`);
      }
    });
  }

  report(rel, errors, warnings);
  errorCount += errors.length ? 1 : 0;
  warnCount += warnings.length;
}

console.log(
  `\n${files.length} manifest(s): ${files.length - errorCount} valid, ${errorCount} with errors, ${warnCount} warning(s).`,
);
process.exit(errorCount ? 1 : 0);

function report(rel, errors, warnings) {
  if (!errors.length && !warnings.length) {
    console.log(`OK   ${rel}`);
    return;
  }
  console.log(`${errors.length ? "FAIL" : "WARN"} ${rel}`);
  for (const e of errors) console.log(`     error: ${e}`);
  for (const w of warnings) console.log(`     warn:  ${w}`);
}
