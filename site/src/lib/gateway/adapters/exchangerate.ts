// FX read — fetch the keyless open endpoint. Stable for the day, so the
// receipt's output commitment is reproducible by re-fetching and re-hashing.
import type { AdapterOutcome } from "../types";
import type { AdapterMode } from "./errors";
import { AdapterFailure } from "./errors";
import { nowIso } from "../canonical";

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
      evidence: [{ type: "simulated_execution", note: "canned rates, no upstream call.", observed_at: nowIso() }],
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
