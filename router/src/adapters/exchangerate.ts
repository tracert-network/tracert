// Adapter for exchangerate-api.latest-rates — a FREE, safe, deterministic read.
// Live: fetch the keyless open endpoint. The upstream refreshes ~once/24h, so
// the response is stable for the day and the receipt's output commitment can be
// reproduced by any verifier who re-fetches and re-hashes before the next
// update. Simulated: canned output for offline/CI (no network call).
import type { AdapterOutcome } from "../types.js";
import type { AdapterMode } from "./errors.js";
import { AdapterFailure } from "./errors.js";
import { nowIso } from "../canonical.js";

const ENDPOINT = "https://open.er-api.com/v6/latest";

export async function executeLatestRates(
  input: Record<string, unknown>,
  mode: AdapterMode,
): Promise<AdapterOutcome> {
  const base = String(input.base_code ?? "").toUpperCase();

  if (mode === "simulated") {
    return {
      output: {
        result: "success",
        base_code: base || "USD",
        time_last_update_utc: "simulated — no upstream call",
        rates: { USD: 1, EUR: 0.86, GBP: 0.74, JPY: 158 },
      },
      artifacts: [],
      evidence: [
        { type: "simulated_execution", note: "TRACERT_DEV_FAKE_EXECUTE=1 — canned rates, no upstream call.", observed_at: nowIso() },
      ],
    };
  }

  const url = `${ENDPOINT}/${encodeURIComponent(base)}`;
  let res: Response;
  try {
    res = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(12_000) });
  } catch (e) {
    throw new AdapterFailure([{ code: "unavailable", message: `exchange-rate endpoint unreachable: ${String(e)}` }]);
  }
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    throw new AdapterFailure([{ code: "unavailable", message: `exchange-rate endpoint returned a non-JSON body (${res.status})` }]);
  }
  if (body.result !== "success") {
    const errType = String(body["error-type"] ?? "unknown");
    const code =
      errType === "unsupported-code" ? "unsupported" : errType === "malformed-request" ? "invalid_input" : "unavailable";
    throw new AdapterFailure(
      [{ code, message: `provider error: ${errType}` }],
      [{ type: "http_observation", url, observed_status: res.status, observed_at: nowIso() }],
    );
  }
  return {
    output: body,
    artifacts: [],
    evidence: [
      {
        type: "http_observation",
        url,
        observed_status: res.status,
        observed_at: nowIso(),
        note: `rates last updated ${String(body.time_last_update_utc ?? "?")}; re-fetch before the next update to reproduce the commitment`,
      },
    ],
  };
}
