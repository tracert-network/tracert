// Adapter for tinyurl.shorten-url — a PUBLIC WRITE, gated like the directory
// adapter (disabled default / simulated / live). TinyURL's keyless create
// endpoint returns the short URL as text/plain and dedupes identical URLs, so
// the write is idempotent. Synchronous — no polling.
import type { AdapterOutcome } from "../types.js";
import type { AdapterMode } from "./errors.js";
import { AdapterFailure, AdapterRejection } from "./errors.js";
import { nowIso } from "../canonical.js";

const ENDPOINT = "https://tinyurl.com/api-create.php";

export async function executeShortenUrl(
  input: Record<string, unknown>,
  mode: AdapterMode,
): Promise<AdapterOutcome> {
  if (mode === "disabled") {
    throw new AdapterRejection([
      {
        code: "live_write_disabled",
        message:
          "tinyurl.shorten-url creates a public short link (a public write). This router build ships with writes off: run with TRACERT_ENABLE_LIVE_SUBMIT=1 to create the link for real, or TRACERT_DEV_FAKE_EXECUTE=1 for a simulated execution.",
      },
    ]);
  }

  if (mode === "simulated") {
    return {
      output: { shorturl: "https://tinyurl.com/simulated", target: String(input.url ?? "") },
      artifacts: [{ type: "url", url: "https://tinyurl.com/simulated", note: "SIMULATED — no link was created" }],
      evidence: [
        { type: "simulated_execution", note: "TRACERT_DEV_FAKE_EXECUTE=1 — no public write was performed.", observed_at: nowIso() },
      ],
    };
  }

  const params = new URLSearchParams({ url: String(input.url ?? "") });
  if (input.alias) params.set("alias", String(input.alias));
  const url = `${ENDPOINT}?${params.toString()}`;

  let res: Response;
  let text: string;
  try {
    res = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "TracertBot/0.1 (+https://tracert.site)" },
    });
    text = (await res.text()).trim();
  } catch (e) {
    throw new AdapterFailure([{ code: "unavailable", message: `TinyURL unreachable: ${String(e)}` }]);
  }
  if (!res.ok) {
    throw new AdapterFailure(
      [{ code: "unavailable", message: `TinyURL returned ${res.status}` }],
      [{ type: "http_observation", url: ENDPOINT, observed_status: res.status, observed_at: nowIso() }],
    );
  }
  // Success is a tinyurl.com URL in the body; anything else is an error string
  // (e.g. "Error" for a bad URL, or a taken custom alias).
  if (!/^https:\/\/tinyurl\.com\/\S+$/.test(text)) {
    throw new AdapterRejection([
      { code: "invalid_input", message: `TinyURL rejected the request: ${text.slice(0, 160) || "no short URL returned"}` },
    ]);
  }
  return {
    output: { shorturl: text, target: String(input.url ?? "") },
    artifacts: [{ type: "url", url: text, note: "public TinyURL short link" }],
    evidence: [{ type: "http_observation", url: ENDPOINT, observed_status: res.status, observed_at: nowIso() }],
  };
}
