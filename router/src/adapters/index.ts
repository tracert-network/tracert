// Adapter registry — capability id → the code that executes it and issues an
// AdapterOutcome (output + artifacts + evidence). Each entry declares a kind:
//   read  — safe, no side effects → executed LIVE by default; simulated in CI.
//   write — outward-facing side effect → gated OFF by default (opt-in per run).
// The dispatcher in tools.ts wraps every outcome in an identical receipt shape,
// so adding supply is a one-line entry here, never a change to the receipt path.
import type { AdapterOutcome } from "../types.js";
import type { AdapterMode } from "./errors.js";
import { executePublishListing } from "./ai-directory.js";
import { executeLatestRates } from "./exchangerate.js";
import { executeDefineWord } from "./dictionary.js";
import { executeCreateQrCode } from "./qr.js";
import { executeShortenUrl } from "./tinyurl.js";

export type AdapterKind = "read" | "write";
export type Adapter = (input: Record<string, unknown>, mode: AdapterMode) => Promise<AdapterOutcome>;
export interface AdapterEntry {
  kind: AdapterKind;
  run: Adapter;
}

export const ADAPTERS = new Map<string, AdapterEntry>([
  // Directory submission (the same submit contract under two ids).
  ["ai-directory.publish-listing", { kind: "write", run: (i, m) => executePublishListing(i, m) }],
  ["promptfrenzy.list-ai-tool", { kind: "write", run: (i, m) => executePublishListing(i, m) }],
  // Free unofficial wrappers.
  ["exchangerate-api.latest-rates", { kind: "read", run: executeLatestRates }],
  ["free-dictionary.define-word", { kind: "read", run: executeDefineWord }],
  ["qr-server.create-qr-code", { kind: "read", run: executeCreateQrCode }],
  ["tinyurl.shorten-url", { kind: "write", run: executeShortenUrl }],
]);

export function getAdapter(id: string): AdapterEntry | undefined {
  return ADAPTERS.get(id);
}

// Env-driven mode. Writes are off unless explicitly enabled; reads run live by
// default (they have no side effects) and only simulate when asked to.
export function resolveMode(kind: AdapterKind): AdapterMode {
  if (process.env.TRACERT_ENABLE_LIVE_SUBMIT === "1") return "live";
  if (process.env.TRACERT_DEV_FAKE_EXECUTE === "1") return "simulated";
  return kind === "read" ? "live" : "disabled";
}
