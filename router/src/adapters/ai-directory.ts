// Adapter for ai-directory.publish-listing — the PromptFrenzy AI Directory.
// Contract: docs/capabilities/ai-directory.publish-listing.md (sections 3 and 8).
//
// Three modes (the contract doc, section 8): the live submit is an outward-facing write (public PR
// + permanent public listing), so it is opt-in per process:
//   disabled  (default)                — reject with instructions
//   simulated (TRACERT_DEV_FAKE_EXECUTE=1)   — pipeline shape, fabricated artifacts
//   live      (TRACERT_ENABLE_LIVE_SUBMIT=1) — real API path
import type { AdapterOutcome } from "../types.js";
import type { AdapterMode } from "./errors.js";
import { AdapterFailure, AdapterRejection } from "./errors.js";
import { nowIso } from "../canonical.js";

const SUBMIT_URL = "https://www.promptfrenzy.com/api/directory/submit";
const TOOLS_INDEX_URL = "https://www.promptfrenzy.com/.well-known/ai-tools.json";
const DIRECTORY_BASE = "https://www.promptfrenzy.com/directory";
const REPO_API = "https://api.github.com/repos/Prompt-Frenzy/ai-directory";

export async function executePublishListing(
  input: Record<string, unknown>,
  mode: AdapterMode,
  deadlineMs = 840_000,
): Promise<AdapterOutcome> {
  if (mode === "simulated") return simulated(input);
  if (mode === "live") return live(input, deadlineMs);
  throw new AdapterRejection([
    {
      code: "live_submission_disabled",
      message:
        "This router build ships with live submission off: invoking would open a public PR and create a permanent public listing. Run the router with TRACERT_ENABLE_LIVE_SUBMIT=1 to submit for real, or TRACERT_DEV_FAKE_EXECUTE=1 for a simulated execution.",
    },
  ]);
}

function simulated(input: Record<string, unknown>): AdapterOutcome {
  const slug = String(input.name ?? "tool")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const listingUrl = `${DIRECTORY_BASE}/${slug}`;
  const output = {
    listing_url: listingUrl,
    pr_url: "https://github.com/Prompt-Frenzy/ai-directory/pull/0",
    pr_number: 1,
    slug,
    host_tier: "full" as const,
  };
  return {
    output,
    artifacts: [
      { type: "url", url: listingUrl, note: "SIMULATED — no listing was created; dev pipeline test only" },
    ],
    evidence: [
      {
        type: "simulated_execution",
        note: "TRACERT_DEV_FAKE_EXECUTE=1 — no external calls were made; artifacts are fabricated to exercise the receipt pipeline.",
        observed_at: nowIso(),
      },
    ],
  };
}

async function live(input: Record<string, unknown>, deadlineMs: number): Promise<AdapterOutcome> {
  const deadline = Date.now() + deadlineMs;

  // 1. Submit. 201 = PR created; 400 = field-level rejection, relayed verbatim.
  let res: Response;
  try {
    res = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
  } catch (e) {
    throw new AdapterFailure([{ code: "submit_failed", message: `submit API unreachable: ${String(e)}` }]);
  }
  const bodyText = await res.text();
  if (res.status === 400) {
    // Field-level details come back in the body; exact shape gets hardened
    // after the first live runs (spec "Open items").
    throw new AdapterRejection([
      { code: "invalid_input", message: `submit API rejected the payload: ${bodyText.slice(0, 800)}` },
    ]);
  }
  if (res.status !== 201) {
    throw new AdapterFailure([
      { code: "submit_failed", message: `submit API returned ${res.status}: ${bodyText.slice(0, 300)}` },
    ]);
  }
  const created = JSON.parse(bodyText) as { pr_url: string; pr_number: number };
  const evidence: { type: string; [k: string]: unknown }[] = [
    { type: "git_pr", url: created.pr_url, observed_at: nowIso() },
  ];

  // 2. Observe — poll the PR until the bot merges (or fails) it.
  let merged = false;
  while (Date.now() < deadline) {
    const pr = await getJson<{ merged: boolean; state: string }>(
      `${REPO_API}/pulls/${created.pr_number}`,
    );
    if (pr?.merged) { merged = true; break; }
    if (pr && pr.state === "closed") {
      throw new AdapterFailure(
        [{ code: "publication_failed", message: "PR was closed without merging — the verifier's comment on the PR says what failed (most often the badge was not found)." }],
        evidence,
      );
    }
    await sleep(10_000);
  }
  if (!merged) {
    throw new AdapterFailure(
      [{ code: "publication_timeout", message: `PR not merged within the deadline; it may still merge — see ${created.pr_url}` }],
      evidence,
    );
  }

  // 3. Verify — resolve the slug from the machine index, then independently
  // fetch the listing page and confirm it references the submitted URL.
  const submittedUrl = String(input.url);
  let listingUrl: string | null = null;
  let slug: string | null = null;
  while (Date.now() < deadline && !listingUrl) {
    const index = await getJson<{ tools?: { url?: string; slug?: string }[] }>(TOOLS_INDEX_URL);
    const entries = Array.isArray(index) ? (index as { url?: string; slug?: string }[]) : (index?.tools ?? []);
    const hit = entries.find((t) => normalizeUrl(t.url ?? "") === normalizeUrl(submittedUrl));
    if (hit?.slug) {
      slug = hit.slug;
      listingUrl = `${DIRECTORY_BASE}/${hit.slug}`;
      break;
    }
    await sleep(15_000);
  }
  if (!listingUrl) {
    throw new AdapterFailure(
      [{ code: "verification_failed", message: "PR merged but the tool never appeared in the machine index within the deadline." }],
      evidence,
    );
  }
  const page = await fetch(listingUrl, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
  const pageOk = page.status === 200 && (await page.text()).includes(new URL(submittedUrl).hostname);
  evidence.push({ type: "http_observation", url: listingUrl, observed_status: page.status, observed_at: nowIso() });
  if (!pageOk) {
    throw new AdapterFailure(
      [{ code: "verification_failed", message: `listing page did not independently verify (${listingUrl} returned ${page.status})` }],
      evidence,
    );
  }

  return {
    output: { listing_url: listingUrl, pr_url: created.pr_url, pr_number: created.pr_number, slug },
    artifacts: [{ type: "url", url: listingUrl }],
    evidence,
  };
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function normalizeUrl(u: string): string {
  try {
    const url = new URL(u);
    return `${url.hostname.toLowerCase()}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return u.toLowerCase();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
