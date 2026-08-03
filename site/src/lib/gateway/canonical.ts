import { createHash, randomBytes } from "node:crypto";

// Canonical JSON: recursively key-sorted, no whitespace. Commitments must be
// reproducible by any verifier from the same logical value — identical to the
// router's and the site's build-time hashing.
export function canonicalJson(value: unknown): string {
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

export function sha256Commitment(value: unknown): string {
  return "sha256:" + createHash("sha256").update(canonicalJson(value)).digest("hex");
}

export function newId(prefix: "tr_exec" | "tr_quote"): string {
  return `${prefix}_${Date.now().toString(36)}${randomBytes(6).toString("hex")}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
