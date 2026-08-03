// Adapter for free-dictionary.define-word — a FREE, safe knowledge read.
// Live: fetch the community endpoint; a 404 is the capability's declared
// not_found (a terminal failed state, not a rejection). Surfaces the first
// pronunciation clip as a portable artifact. Simulated: canned entry, no call.
import type { AdapterOutcome } from "../types.js";
import type { AdapterMode } from "./errors.js";
import { AdapterFailure } from "./errors.js";
import { nowIso } from "../canonical.js";

const ENDPOINT = "https://api.dictionaryapi.dev/api/v2/entries/en";

export async function executeDefineWord(
  input: Record<string, unknown>,
  mode: AdapterMode,
): Promise<AdapterOutcome> {
  const word = String(input.word ?? "");

  if (mode === "simulated") {
    return {
      output: {
        word: word || "serendipity",
        entries: [
          {
            word: word || "serendipity",
            meanings: [{ partOfSpeech: "noun", definitions: [{ definition: "simulated definition — no upstream call" }] }],
          },
        ],
      },
      artifacts: [],
      evidence: [
        { type: "simulated_execution", note: "TRACERT_DEV_FAKE_EXECUTE=1 — canned entry, no upstream call.", observed_at: nowIso() },
      ],
    };
  }

  const url = `${ENDPOINT}/${encodeURIComponent(word)}`;
  let res: Response;
  try {
    res = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(12_000) });
  } catch (e) {
    throw new AdapterFailure([{ code: "unavailable", message: `dictionary endpoint unreachable: ${String(e)}` }]);
  }
  if (res.status === 404) {
    throw new AdapterFailure(
      [{ code: "not_found", message: `no dictionary entry for "${word}"` }],
      [{ type: "http_observation", url, observed_status: 404, observed_at: nowIso() }],
    );
  }
  if (!res.ok) {
    const code = res.status === 429 ? "rate_limited" : "unavailable";
    throw new AdapterFailure(
      [{ code, message: `dictionary endpoint returned ${res.status}` }],
      [{ type: "http_observation", url, observed_status: res.status, observed_at: nowIso() }],
    );
  }
  const entries = (await res.json().catch(() => null)) as unknown;
  if (!Array.isArray(entries)) {
    throw new AdapterFailure([{ code: "unavailable", message: "dictionary endpoint returned an unexpected body" }]);
  }

  const artifacts: AdapterOutcome["artifacts"] = [];
  const audio = firstAudio(entries);
  if (audio) artifacts.push({ type: "url", url: audio, media_type: "audio/mpeg", note: "pronunciation audio" });

  return {
    output: { word, entries } as Record<string, unknown>,
    artifacts,
    evidence: [{ type: "http_observation", url, observed_status: res.status, observed_at: nowIso() }],
  };
}

function firstAudio(entries: unknown[]): string | null {
  for (const e of entries) {
    const phonetics = (e as { phonetics?: { audio?: string }[] }).phonetics ?? [];
    for (const p of phonetics) {
      if (p.audio && /^https:\/\//.test(p.audio)) return p.audio;
    }
  }
  return null;
}
