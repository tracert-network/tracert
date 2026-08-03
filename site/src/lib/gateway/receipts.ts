// Receipt store for the hosted gateway. In-memory (module-global) — durable for
// the lifetime of a warm serverless instance, which is enough for a caller that
// invokes and then retrieves within a session. Cross-instance durability (so
// get_execution resolves an old id after a cold start) is a follow-up: back
// this with Upstash/Vercel KV. The invoke response always returns the full
// receipt inline regardless, so no evidence is ever lost.
import type { Receipt } from "./types";

const receipts = new Map<string, Receipt>();

export function appendReceipt(receipt: Receipt): void {
  receipts.set(receipt.execution_id, receipt);
}

export function getReceipt(executionId: string): Receipt | undefined {
  return receipts.get(executionId);
}

export function findByIdempotencyKey(capabilityId: string, key: string): Receipt | undefined {
  for (const r of receipts.values()) {
    if (r.capability.id === capabilityId && r.request.idempotency_key === key) return r;
  }
  return undefined;
}
