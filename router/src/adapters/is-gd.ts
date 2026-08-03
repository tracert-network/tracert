// Adapter for is-gd.shorten-url — a PUBLIC WRITE, so it is gated exactly like
// the directory-submit adapter:
//   disabled  (default)                      — reject with instructions
//   simulated (TRACERT_DEV_FAKE_EXECUTE=1)   — pipeline shape, no public write
//   live      (TRACERT_ENABLE_LIVE_SUBMIT=1) — real is.gd call (creates a link)
// is.gd responds synchronously, so there is no PR-style polling to do.
import type { AdapterOutcome } from "../types.js";
import type { AdapterMode } from "./errors.js";
import { AdapterFailure, AdapterRejection } from "./errors.js";
import { nowIso } from "../canonical.js";

const ENDPOINT = "https://is.gd/create.php";

export async function executeShortenUrl(
  input: Record<string, unknown>,
  mode: AdapterMode,
): Promise<AdapterOutcome> {
  if (mode === "disabled") {
    throw new AdapterRejection([
      {
        code: "live_write_disabled",
        message:
          "is-gd.shorten-url creates a public short link (a public write). This router build ships with writes off: run with TRACERT_ENABLE_LIVE_SUBMIT=1 to create the link for real, or TRACERT_DEV_FAKE_EXECUTE=1 for a simulated execution.",
      },
    ]);
  }

  if (mode === "simulated") {
    return {
      output: { shorturl: "https://is.gd/simulated", target: String(input.url ?? "") },
      artifacts: [{ type: "url", url: "https://is.gd/simulated", note: "SIMULATED — no link was created" }],
      evidence: [
        { type: "simulated_execution", note: "TRACERT_DEV_FAKE_EXECUTE=1 — no public write was performed.", observed_at: nowIso() },
      ],
    };
  }

  const params = new URLSearchParams({ format: "json", url: String(input.url ?? "") });
  if (input.shorturl) params.set("shorturl", String(input.shorturl));
  const url = `${ENDPOINT}?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(15_000) });
  } catch (e) {
    throw new AdapterFailure([{ code: "unavailable", message: `is.gd unreachable: ${String(e)}` }]);
  }
  const body = (await res.json().catch(() => null)) as
    | { shorturl?: string; errorcode?: number; errormessage?: string }
    | null;
  if (!body) {
    throw new AdapterFailure([{ code: "unavailable", message: `is.gd returned a non-JSON body (${res.status})` }]);
  }
  if (body.errorcode) {
    const msg = body.errormessage ?? `error ${body.errorcode}`;
    // 1 = long URL invalid/disallowed, 2 = custom code invalid/taken → input problems (reject).
    if (body.errorcode === 1 || body.errorcode === 2) {
      throw new AdapterRejection([{ code: "invalid_input", message: `is.gd rejected the request: ${msg}` }]);
    }
    // 3 = throttled, 4 = service/maintenance → transient failures.
    const code = body.errorcode === 3 ? "rate_limited" : "unavailable";
    throw new AdapterFailure(
      [{ code, message: `is.gd error: ${msg}` }],
      [{ type: "http_observation", url: ENDPOINT, observed_status: res.status, observed_at: nowIso() }],
    );
  }
  if (!body.shorturl) {
    throw new AdapterFailure([{ code: "unavailable", message: "is.gd returned no shorturl" }]);
  }
  return {
    output: { shorturl: body.shorturl, target: String(input.url ?? "") },
    artifacts: [{ type: "url", url: body.shorturl, note: "public is.gd short link" }],
    evidence: [{ type: "http_observation", url: ENDPOINT, observed_status: res.status, observed_at: nowIso() }],
  };
}
