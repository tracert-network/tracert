// Minimal structural types over the TRACE Manifest / Receipt shapes the router
// actually touches. The registry JSON Schemas remain the source of truth;
// these types deliberately stay loose where the router is a pass-through.

export interface ManifestDoc {
  schema: string;
  provider: { id: string; name: string; url?: string; operator?: string };
  service: { id: string; name?: string; url?: string };
  capability: Capability;
}

export interface Capability {
  id: string;
  version: string;
  status: "draft" | "active" | "degraded" | "deprecated" | "suspended" | "historical";
  promise: string;
  description?: string;
  tags?: string[];
  excludes?: string[];
  input: IoContract;
  output: IoContract;
  errors?: { code: string; meaning: string; retriable?: boolean }[];
  interfaces: { type: string; [k: string]: unknown }[];
  pricing: {
    free: boolean;
    mode: "free" | "fixed" | "quote";
    amount?: { value: string; currency: string };
    unit?: string;
    payment_offers?: string[];
    refund_policy?: string;
    [k: string]: unknown;
  };
  operations: {
    idempotency: "supported" | "required" | "not_supported";
    expected_latency_seconds?: { p50: number; p95?: number };
    timeout_seconds?: number;
    [k: string]: unknown;
  };
  data_policy: { input_retention: string; training_use: string; [k: string]: unknown };
  evidence?: Record<string, unknown>;
  provenance: { integration_status: string; adapter_operator?: string; notes?: string };
}

export interface IoContract {
  schema_ref: string;
  media_types?: string[];
  max_bytes?: number;
  notes?: string;
}

export interface LoadedCapability {
  manifest: ManifestDoc;
  capability: Capability;
  manifestPath: string;
  manifestHash: string;
  inputSchema: object | null;
  outputSchema: object | null;
}

export type ReceiptStatus =
  | "rejected"
  | "quoted"
  | "authorized"
  | "running"
  | "succeeded"
  | "failed"
  | "unknown"
  | "cancelled";

export interface ReceiptReason {
  code: string;
  message: string;
  field?: string;
}

export interface Receipt {
  schema: string;
  execution_id: string;
  capability: { id: string; version: string; manifest_hash: string };
  quote?: {
    id: string;
    amount: string;
    currency: string;
    expires_at: string;
  };
  request: { received_at: string; commitment: string; idempotency_key?: string };
  result: {
    status: ReceiptStatus;
    completed_at?: string;
    commitment?: string;
    reasons?: ReceiptReason[];
    artifacts?: { type: "url" | "hash"; url?: string; media_type?: string; sha256?: string; note?: string }[];
  };
  payment: { mode: string; status: string; evidence_ref?: string };
  evidence?: { type: string; [k: string]: unknown }[];
  operator: { gateway_id: string; signature?: string; signed_at?: string };
}

export interface Quote {
  id: string;
  capability_id: string;
  amount: string;
  currency: string;
  expires_at: string;
  payment_offers: string[];
  note?: string;
}

export interface AdapterOutcome {
  output: Record<string, unknown>;
  artifacts: NonNullable<Receipt["result"]["artifacts"]>;
  evidence: NonNullable<Receipt["evidence"]>;
}

export const RECEIPT_SCHEMA_URI = "https://tracert.site/schemas/receipt/v0.1";
export const GATEWAY_ID = "tracert-dev";
