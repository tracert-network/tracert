// The five router tools' logic, kept free of MCP plumbing so it stays testable
// and portable to a future HTTP search API. Search is free; results are concise
// by default; full manifests only for finalists (context economy for the model).
import type { LoadedCapability, Receipt, ReceiptReason } from "./types.js";
import { GATEWAY_ID, RECEIPT_SCHEMA_URI } from "./types.js";
import { loadRegistry, searchCapabilities as searchIndex, type SearchFilters } from "./registry.js";
import { appendReceipt, findByIdempotencyKey, getReceipt, logSearchGap } from "./receipts.js";
import { getQuoteById, issueQuote, quoteIsCurrent } from "./quotes.js";
import { newAjv } from "./registry.js";
import { newId, nowIso, sha256Commitment } from "./canonical.js";
import {
  AdapterFailure,
  AdapterRejection,
  adapterMode,
  executePublishListing,
} from "./adapters/ai-directory.js";

export class ToolError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export function toolSearchCapabilities(args: { query: string } & SearchFilters) {
  const { query, ...filters } = args;
  const found = searchIndex(query, filters);
  if (found.results.length === 0) {
    logSearchGap(query, filters); // unmet intent — demand evidence for supply recruitment
    return {
      results: [],
      total_matched: found.total_matched,
      dropped_by_filters: found.dropped_by_filters,
      note:
        found.dropped_by_filters > 0
          ? "Capabilities matched the intent but were dropped by your constraints — relax filters to see them."
          : "No capability in the registry matched this intent. The gap has been logged so supply can follow demand.",
    };
  }
  return {
    ...found,
    next_step:
      "Call get_capability on finalists for the full contract and evidence, then get_quote before any invocation.",
  };
}

export function toolGetCapability(args: { capability_id: string }) {
  const cap = requireCapability(args.capability_id);
  return {
    manifest: cap.manifest,
    manifest_hash: cap.manifestHash,
    input_schema: cap.inputSchema,
    output_schema: cap.outputSchema,
    router_notes:
      cap.capability.status === "active"
        ? "Invocable via invoke_capability. Free capabilities need no quote, but taking one binds the receipt to explicit terms."
        : `Status is "${cap.capability.status}" — not currently invocable via this router.`,
  };
}

export function toolGetQuote(args: { capability_id: string }) {
  const cap = requireCapability(args.capability_id);
  if (!cap.capability.pricing.free) {
    throw new ToolError(
      "payment_not_yet_supported",
      "Paid quoting lands with the Phase 3 payment adapter; no paid capabilities are routed yet.",
    );
  }
  const quote = issueQuote(cap);
  return { quote, next_step: "Pass quote.id as quote_id to invoke_capability before it expires." };
}

export interface InvokeArgs {
  capability_id: string;
  input: Record<string, unknown>;
  quote_id?: string;
  idempotency_key?: string;
}

export async function toolInvokeCapability(args: InvokeArgs) {
  const cap = requireCapability(args.capability_id);
  const c = cap.capability;
  const receivedAt = nowIso();
  const requestCommitment = sha256Commitment(args.input);

  // Idempotency first: an existing receipt for this key is THE answer.
  if (args.idempotency_key) {
    const existing = findByIdempotencyKey(c.id, args.idempotency_key);
    if (existing) {
      if (existing.request.commitment === requestCommitment) {
        return { receipt: existing, replayed: true };
      }
      return finalize(
        rejectedReceipt(cap, receivedAt, requestCommitment, args.idempotency_key, [
          {
            code: "idempotency_conflict",
            message: `idempotency_key already used for execution ${existing.execution_id} with different input — never reuse a key for a different request`,
          },
        ]),
      );
    }
  }

  // Input validation against the capability's declared contract.
  const validate = loadRegistry().inputValidators.get(c.id);
  if (validate && !validate(args.input)) {
    const reasons: ReceiptReason[] = (validate.errors ?? []).slice(0, 10).map((e) => {
      const field = (e.instancePath || e.params?.missingProperty?.toString() || "").replace(/^\//, "") ||
        String(e.params?.missingProperty ?? "");
      const urlField = /(^|\/)?(url|badge_url|logo|maker_url)$/.test(field);
      return {
        code: urlField && e.keyword === "pattern" ? "invalid_url" : "invalid_input",
        message: `${field || "input"} ${e.message ?? "is invalid"}`,
        ...(field ? { field } : {}),
      };
    });
    return finalize(rejectedReceipt(cap, receivedAt, requestCommitment, args.idempotency_key, reasons));
  }

  // Quote handling. Free: optional, but a stale/foreign quote is still an error.
  let quote = args.quote_id ? getQuoteById(args.quote_id) : undefined;
  if (args.quote_id && (!quote || quote.capability_id !== c.id || !quoteIsCurrent(quote))) {
    return finalize(
      rejectedReceipt(cap, receivedAt, requestCommitment, args.idempotency_key, [
        { code: "quote_invalid", message: "quote_id is unknown, expired, or for a different capability — request a fresh quote" },
      ]),
    );
  }
  if (!c.pricing.free) {
    return finalize(
      rejectedReceipt(cap, receivedAt, requestCommitment, args.idempotency_key, [
        { code: "payment_not_supported", message: "paid execution lands with the Phase 3 payment adapter" },
      ]),
    );
  }
  if (c.status !== "active") {
    return finalize(
      rejectedReceipt(cap, receivedAt, requestCommitment, args.idempotency_key, [
        { code: "capability_not_active", message: `capability status is "${c.status}" — not invocable` },
      ]),
    );
  }
  quote ??= issueQuote(cap); // receipts always bind to explicit terms

  const base = {
    schema: RECEIPT_SCHEMA_URI,
    execution_id: newId("tr_exec"),
    capability: { id: c.id, version: c.version, manifest_hash: cap.manifestHash },
    quote: { id: quote.id, amount: quote.amount, currency: quote.currency, expires_at: quote.expires_at },
    request: {
      received_at: receivedAt,
      commitment: requestCommitment,
      ...(args.idempotency_key ? { idempotency_key: args.idempotency_key } : {}),
    },
    payment: { mode: "free", status: "not_required" },
    operator: { gateway_id: GATEWAY_ID },
  } satisfies Partial<Receipt> as Omit<Receipt, "result">;

  // Adapter dispatch — the directory-submit adapter serves both the original
  // ai-directory capability id and the registry's promptfrenzy.list-ai-tool
  // (same submit contract). The dispatch table grows with supply.
  const DIRECTORY_SUBMIT_CAPS = new Set(["ai-directory.publish-listing", "promptfrenzy.list-ai-tool"]);
  if (!DIRECTORY_SUBMIT_CAPS.has(c.id)) {
    return finalize({
      ...base,
      result: {
        status: "rejected",
        reasons: [{ code: "adapter_unavailable", message: "no adapter is wired for this capability yet" }],
      },
    });
  }

  try {
    const outcome = await executePublishListing(args.input, adapterMode());
    return finalize({
      ...base,
      result: {
        status: "succeeded",
        completed_at: nowIso(),
        commitment: sha256Commitment(outcome.output),
        artifacts: outcome.artifacts,
      },
      evidence: outcome.evidence,
    });
  } catch (e) {
    if (e instanceof AdapterRejection) {
      return finalize({ ...base, result: { status: "rejected", reasons: e.reasons } });
    }
    if (e instanceof AdapterFailure) {
      return finalize({
        ...base,
        result: { status: "failed", completed_at: nowIso(), reasons: e.reasons },
        evidence: e.evidence,
      });
    }
    throw e;
  }
}

export function toolGetExecution(args: { execution_id: string }) {
  const receipt = getReceipt(args.execution_id);
  if (!receipt) {
    throw new ToolError("unknown_execution", `no receipt for ${args.execution_id} at this gateway`);
  }
  return { receipt };
}

function requireCapability(id: string): LoadedCapability {
  const cap = loadRegistry().byId.get(id);
  if (!cap) {
    throw new ToolError("unknown_capability", `capability "${id}" is not in the registry — use search_capabilities first`);
  }
  return cap;
}

function rejectedReceipt(
  cap: LoadedCapability,
  receivedAt: string,
  requestCommitment: string,
  idempotencyKey: string | undefined,
  reasons: ReceiptReason[],
): Receipt {
  return {
    schema: RECEIPT_SCHEMA_URI,
    execution_id: newId("tr_exec"),
    capability: { id: cap.capability.id, version: cap.capability.version, manifest_hash: cap.manifestHash },
    request: {
      received_at: receivedAt,
      commitment: requestCommitment,
      ...(idempotencyKey ? { idempotency_key: idempotencyKey } : {}),
    },
    result: { status: "rejected", reasons },
    payment: { mode: "free", status: "not_required" },
    operator: { gateway_id: GATEWAY_ID },
  };
}

function finalize(receipt: Receipt): { receipt: Receipt; replayed: false } {
  appendReceipt(receipt);
  return { receipt, replayed: false };
}
