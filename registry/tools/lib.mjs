// Shared helpers for registry tools: manifest discovery, parsing, ajv setup.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

export const REGISTRY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function newAjv() {
  // strictRequired off: we use the idiomatic anyOf-of-required pattern for
  // "at least one of these fields", which strictRequired misreads.
  const ajv = new Ajv2020.default({ allErrors: true, strict: true, strictRequired: false, allowUnionTypes: true });
  addFormats.default(ajv);
  return ajv;
}

export function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

// Every providers/<provider>/capabilities/*.yaml|yml file is a manifest.
export function findManifestFiles(root = REGISTRY_ROOT) {
  const providersDir = join(root, "providers");
  if (!existsSync(providersDir)) return [];
  const files = [];
  for (const provider of readdirSync(providersDir)) {
    const capsDir = join(providersDir, provider, "capabilities");
    if (!existsSync(capsDir) || !statSync(capsDir).isDirectory()) continue;
    for (const f of readdirSync(capsDir)) {
      if (/\.ya?ml$/.test(f)) files.push(join(capsDir, f));
    }
  }
  return files.sort();
}

export function loadManifest(file) {
  return parseYaml(readFileSync(file, "utf8"));
}

// Resolve a registry-relative ref (from a manifest's capabilities/ dir) or pass through URLs.
export function resolveRef(manifestFile, ref) {
  if (/^https?:\/\//.test(ref)) return { kind: "url", target: ref };
  return { kind: "file", target: resolve(dirname(manifestFile), ref) };
}

// Walk all string values in a structure, calling visit(path, value).
export function walkStrings(node, visit, path = "$") {
  if (typeof node === "string") visit(path, node);
  else if (Array.isArray(node)) node.forEach((v, i) => walkStrings(v, visit, `${path}[${i}]`));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) walkStrings(v, visit, `${path}.${k}`);
  }
}
