// Append-only JSONL receipt store. State = fold of all lines, last line per
// execution_id wins — the multi-writer-safe shape the workspace conventions
// mandate for anything more than one session might touch.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Receipt } from "./types.js";

const moduleDir = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.TRACERT_DATA_DIR ?? resolve(moduleDir, "..", "data");
const RECEIPTS = () => join(DATA_DIR, "receipts.jsonl");
const SEARCH_GAPS = () => join(DATA_DIR, "search-gaps.jsonl");

export function appendReceipt(receipt: Receipt): void {
  mkdirSync(DATA_DIR, { recursive: true });
  appendFileSync(RECEIPTS(), JSON.stringify(receipt) + "\n");
}

function foldReceipts(): Map<string, Receipt> {
  const state = new Map<string, Receipt>();
  if (!existsSync(RECEIPTS())) return state;
  for (const line of readFileSync(RECEIPTS(), "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const r = JSON.parse(line) as Receipt;
      state.set(r.execution_id, r);
    } catch {
      // never die on a mangled line; the log is an inbox
    }
  }
  return state;
}

export function getReceipt(executionId: string): Receipt | undefined {
  return foldReceipts().get(executionId);
}

export function findByIdempotencyKey(capabilityId: string, key: string): Receipt | undefined {
  for (const r of foldReceipts().values()) {
    if (r.capability.id === capabilityId && r.request.idempotency_key === key) return r;
  }
  return undefined;
}

// The unmet-intent log — the brief's "search gap" metric primitive. Every
// zero-result search is demand evidence for supply recruitment.
export function logSearchGap(query: string, filters: Record<string, unknown>): void {
  mkdirSync(DATA_DIR, { recursive: true });
  appendFileSync(
    SEARCH_GAPS(),
    JSON.stringify({ ts: new Date().toISOString(), query, filters }) + "\n",
  );
}
