// The five gateway tools — the same logic as the router, trimmed to a READ-ONLY
// public surface: invoke_capability executes safe reads live and refuses any
// capability that writes external state (those run via the local router).
import type { LoadedCapability, Receipt, ReceiptReason } from "./types";
import { GATEWAY_ID, RECEIPT_SCHEMA_URI } from "./types";
import { loadRegistry, searchCapabilities as searchIndex, type SearchFilters } from "./registry";
import { appendReceipt, findByIdempotencyKey, getReceipt } from "./receipts";
import { getQuoteById, issueQuote, quoteIsCurrent } from "./quotes";
import { newId, nowIso, sha256Commitment } from "./canonical";
import { getReadAdapter } from "./adapters";
import { AdapterFailure, AdapterRejection } from "./adapters/errors";

export class ToolError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export function toolSearchCapabilities(args: { query: string } & SearchFilters) {
  const { query, ...filters } = args;
  const found = searchIndex(query, filters);
  if (found.results.length === 0) {
    return {
      results: [],
      total_matched: found.total_matched,
      dropped_by_filters: found.dropped_by_filters,
      note:
        found.dropped_by_filters > 0
          ? "Capabilities matched the intent but were dropped by your constraints — relax filters to see them."
          : "No capability in the registry matched this intent.",
    };
  }
  return {
    ...found,
    next_step:
      "Call get_capability on finalists for the full contract and evidence, then get_quote before any invocation. This hosted gateway executes free reads; capabilities that write external state are marked invocable_here:false and run via the local router.",
  };
}

export function toolGetCapability(args: { capability_id: string }) {
  const cap = requireCapability(args.capability_id);
  const executableHere = getReadAdapter(cap.capability.id) !== undefined && cap.capability.status === "active";
  return {
    manifest: cap.manifest,
    manifest_hash: cap.manifestHash,
    input_schema: cap.inputSchema,
    output_schema: cap.outputSchema,
    router_notes: executableHere
      ? "Invocable on this hosted gateway (a free read). Taking a quote binds the receipt to explicit terms."
      : cap.capability.status === "active"
        ? "This capability writes external state — it is not executable on the public read-only gateway. Run the Tracert router locally to invoke it (see https://tracert.site/use)."
        : `Status is "${cap.capability.status}" — not currently invocable.`,
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

  // The public gateway is read-only: refuse any write capability up front.
  const adapter = getReadAdapter(c.id);
  if (!adapter) {
    return finalize(
      rejectedReceipt(cap, receivedAt, requestCommitment, args.idempotency_key, [
        {
          code: "write_disabled_on_gateway",
          message: `The hosted Tracert gateway is read-only. "${c.id}" is not an executable read here${c.status !== "active" ? ` (status: ${c.status})` : ""}. Free reads (exchange rates, dictionary, QR) run here; capabilities that write external state run via the local router — see https://tracert.site/use.`,
        },
      ]),
    );
  }

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
      const field =
        (e.instancePath || e.params?.missingProperty?.toString() || "").replace(/^\//, "") ||
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
  quote ??= issueQuote(cap);

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

  try {
    const outcome = await adapter(args.input, "live");
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
    throw new ToolError(
      "unknown_execution",
      `no receipt for ${args.execution_id} at this gateway. The hosted gateway retains receipts only within a warm instance; the invoke response returns the full receipt inline — keep it for later verification.`,
    );
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
