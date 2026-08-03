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

type IsGdBody = { shorturl?: string; errorcode?: number; errormessage?: string };

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

  // is.gd occasionally answers with a transient plain-text "Error, database
  // insert failed" (HTTP 200, ignores format=json). That means the row was NOT
  // written, so a single retry is safe and usually succeeds.
  let call: { status: number; json: IsGdBody | null; text: string };
  try {
    call = await callIsGd(url);
    if (!call.json && /database insert failed/i.test(call.text)) {
      await sleep(1500);
      call = await callIsGd(url);
    }
  } catch (e) {
    throw new AdapterFailure([{ code: "unavailable", message: `is.gd unreachable: ${String(e)}` }]);
  }

  const { json, text, status } = call;
  if (!json) {
    const snippet = text.replace(/\s+/g, " ").trim().slice(0, 160) || `HTTP ${status}`;
    throw new AdapterFailure(
      [{ code: "unavailable", message: `is.gd returned a non-JSON response: ${snippet}` }],
      [{ type: "http_observation", url: ENDPOINT, observed_status: status, observed_at: nowIso() }],
    );
  }
  if (json.errorcode) {
    const msg = json.errormessage ?? `error ${json.errorcode}`;
    // 1 = long URL invalid/disallowed, 2 = custom code invalid/taken → input problems (reject).
    if (json.errorcode === 1 || json.errorcode === 2) {
      throw new AdapterRejection([{ code: "invalid_input", message: `is.gd rejected the request: ${msg}` }]);
    }
    // 3 = throttled, 4 = service/maintenance → transient failures.
    const code = json.errorcode === 3 ? "rate_limited" : "unavailable";
    throw new AdapterFailure(
      [{ code, message: `is.gd error: ${msg}` }],
      [{ type: "http_observation", url: ENDPOINT, observed_status: status, observed_at: nowIso() }],
    );
  }
  if (!json.shorturl) {
    throw new AdapterFailure([{ code: "unavailable", message: "is.gd returned no shorturl" }]);
  }
  return {
    output: { shorturl: json.shorturl, target: String(input.url ?? "") },
    artifacts: [{ type: "url", url: json.shorturl, note: "public is.gd short link" }],
    evidence: [{ type: "http_observation", url: ENDPOINT, observed_status: status, observed_at: nowIso() }],
  };
}

async function callIsGd(url: string): Promise<{ status: number; json: IsGdBody | null; text: string }> {
  const res = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
    headers: { "User-Agent": "TracertBot/0.1 (+https://tracert.site)", Accept: "application/json" },
  });
  const text = await res.text();
  let json: IsGdBody | null = null;
  try {
    json = JSON.parse(text) as IsGdBody;
  } catch {
    // is.gd returns some errors as plain text; the caller maps `text`.
  }
  return { status: res.status, json, text };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
