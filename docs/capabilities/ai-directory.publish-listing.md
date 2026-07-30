# Execution contract — `ai-directory.publish-listing` v0.2

> Normative spec for the routed execution of Tracert's first capability: publishing a listing on the **PromptFrenzy AI Directory** ([github.com/Prompt-Frenzy/ai-directory](https://github.com/Prompt-Frenzy/ai-directory), pages at `https://www.promptfrenzy.com/directory/<slug>`). Companion to the manifest at `../../registry/providers/prompt-frenzy/capabilities/publish-listing.yaml` and the TRACE Receipt state model. Contract facts sourced from the directory README + `schema.json` on 2026-07-30.

## Contract summary

| Field | Value |
|---|---|
| Capability | `ai-directory.publish-listing` (free, wallet-free) |
| Provider / service | PromptFrenzy / AI Directory — first-party |
| Input | JSON mirroring the directory submit API: `name`, `url`, `description` (20–200), `category` (12-value enum), `pricing` (free\|freemium\|paid\|subscription), `badge_url` required; `tags`, `pricing_detail`, `key_features`, `works_with`, `platforms`, `logo`, `submitted_by` encouraged |
| Precondition | The PromptFrenzy badge is live at `badge_url` — static HTML, dofollow, on the submitted domain |
| Output | `listing_url` + `pr_url` (+ `pr_number`, `slug`, `host_tier`) |
| Terminal target | Live listing page + merged PR in the public repository, both independently verifiable |
| Timeout | 900 s end-to-end (validation ≤ 60 s; submit + merge + page wait ≤ 840 s) |
| Idempotency | `supported` — see §4 |

## 1. Pipeline

`received → validate → submit → observe → verify → receipt`

Every invocation produces exactly one receipt. The submit API is the only external write; it either creates a PR (201 + `pr_url`) or changes nothing (400). There is no half-created state on our side to clean up — the PR/merge lifecycle is the provider's own public state machine.

## 2. Validation stage (≤ 60 s, no external writes)

Cheapest checks first; first failure short-circuits to `rejected` with a machine-actionable reason (`result.reasons[].code` + `field`).

1. **Schema** — input validates against `publish-listing.input.schema.json` → else `invalid_input` (failing field named) or `invalid_url` for URL-pattern failures on `url`/`badge_url`/`logo`.
2. **URL policy** — `url` and `badge_url` HTTPS, no credentials-in-URL, no literal IPs, no private/reserved hosts after DNS resolution (SSRF rule; re-resolve at fetch time) → `invalid_url`.
3. **Host tier** — classify `url`'s host per the directory's tiers: own domain → full; platform subdomain (`*.vercel.app`, `*.netlify.app`, `*.github.io`, `*.pages.dev`, `*.hf.space`, `*.streamlit.app`, …) → early-stage (proceed, annotate); raw IP / tunnel (`ngrok`, `trycloudflare`, `loca.lt`) / shortener (`linktr.ee`, `bit.ly`) / `localhost` → `host_rejected`.
4. **Badge precheck** — fetch `badge_url` (isolated fetcher, 15 s, byte-capped) and look for the badge anchor: `<a href="https://www.promptfrenzy.com/directory" …>` without `rel="nofollow"`/`rel="sponsored"`, in static HTML (the provider's verifier does not execute JS). Missing → `badge_not_found` (retriable — the agent can paste the badge and re-invoke). Page unreachable → `unreachable_url`. This precheck saves a doomed submit; the provider's verifier remains authoritative.
5. **Duplicate** — canonicalize `url` (lowercase host, strip default port/fragment/tracking params, trailing-slash normalize) and look it up in `https://www.promptfrenzy.com/.well-known/ai-tools.json` → `duplicate_listing`, rejection carries the existing `listing_url` (an agent asked to "make sure this site is listed" can treat that as satisfied).

Rejections charge nothing (the capability is free regardless) and are terminal — `result.status: rejected`.

## 3. Submit → observe → verify (≤ 840 s)

1. **Submit** — `POST https://www.promptfrenzy.com/api/directory/submit` (canonical `www` host — the apex 307s; follow redirects) with the validated payload. `201` → record `pr_url`, `pr_number` immediately (durable public evidence). `400` → map the field-level details onto `rejected` reasons verbatim (`invalid_input` / `badge_not_found` / `host_rejected` per the response). `5xx`/network → `failed` / `submit_failed` (retriable).
2. **Observe** — poll the PR state via the public GitHub API (unauthenticated is fine at this rate): the directory bot comments pass/fail and auto-merges, typically < 60 s. Bot comment = fail → `failed` / `badge_not_found` (its comment says exactly what was missing). PR closed unmerged → `failed` / `publication_failed`.
3. **Verify** — after merge, resolve the listing: poll `.well-known/ai-tools.json` for the canonical `url` (yields `slug`), then fetch `https://www.promptfrenzy.com/directory/<slug>` over public HTTPS (fresh connection, no auth): must return `200` and reference the submitted `url`. Success requires *independent verification*, not merge status alone. Merged but page never appears → `failed` / `verification_failed`.
4. **Deadline** — at 900 s total: PR exists but not merged → `failed` / `publication_timeout` (retriable; the PR may still merge later — the receipt's evidence keeps the `pr_url`, and a later `get_execution` re-check MAY upgrade an `unknown`, never a `failed`). Provider state genuinely undeterminable (e.g. GitHub outage mid-flight) → `unknown`, §5.

## 4. Idempotency and retries

- Callers SHOULD send `idempotency_key` (8–128 chars). Same key + same capability ⇒ the stored receipt returns verbatim; no re-execution, ever.
- Same key, *different* input commitment ⇒ `rejected` / `idempotency_conflict` — never silently execute two different requests under one key.
- Without a key, the duplicate check (§2.5) is the safety net: replaying a completed submission yields `duplicate_listing` with the live URL, so accidental double-publication is impossible either way.
- Retriable codes (`badge_not_found`, `unreachable_url`, `submit_failed`, `publication_timeout`) invite a *new* invocation with a *new* key after the condition clears; a receipt never auto-retries across the terminal boundary.

## 5. `unknown` handling

`unknown` is a temporary state, not a resting place: re-check on a backoff schedule (1 min → 5 min → 30 min, max 24 h) until provable `succeeded` (merged PR + live page) or `failed` (neither). The receipt updates under the same `execution_id` (append-only store; `get_execution` serves the latest fold). Payment implication is nil here (free), but the discipline is the template for paid capabilities: *never charge, refund or retry out of `unknown` — resolve it first.*

## 6. Receipt binding (evidence)

A `succeeded` receipt carries at minimum:

- `request.commitment` — `sha256:` over the canonical JSON of the validated input.
- `result.commitment` — `sha256:` over the canonical JSON of the output object.
- `result.artifacts[]` — the `listing_url` (type `url`).
- `evidence[]` — `git_pr` (the `pr_url` — public repository record) + `http_observation` (the verification fetch: URL, status, timestamp). Public by design: this capability's inputs are intended for publication (declared in the manifest data policy).
- `capability.manifest_hash` — `sha256:` over the canonical JSON of the manifest version invoked.

## 7. Receipt state map

| Pipeline outcome | `result.status` | Notes |
|---|---|---|
| Any §2 failure, or API 400 | `rejected` | reasons name rule + field; no external state was created |
| Submitted, PR/merge/page in flight | `running` | visible via `get_execution` for async callers |
| Merged + page independently verified | `succeeded` | artifacts + evidence per §6 |
| Bot fail / closed unmerged / page missing / deadline | `failed` | retriable flag per reason code |
| Provider state undeterminable | `unknown` | §5 loop; never terminal by fiat |
| Caller cancelled before submit | `cancelled` | free capability: no settlement implications |

(`quoted`/`authorized` appear only for paid capabilities; the free route skips the payment handshake by design.)

## 8. Router safety gate

The live submit is an outward-facing write (a public PR + permanent public listing). The router's adapter therefore runs in one of three modes:

| Mode | Env | Behavior |
|---|---|---|
| Disabled (default) | — | `rejected` / `live_submission_disabled` with instructions |
| Simulated | `TRACERT_DEV_FAKE_EXECUTE=1` | Full pipeline shape with fabricated artifacts, unmistakably marked `simulated_execution` in evidence; no network calls |
| Live | `TRACERT_ENABLE_LIVE_SUBMIT=1` | Real API path above |

Live mode is flipped deliberately, per session, for the Phase 1 exit demo and beyond — never left on by default while the router is a local dev tool.

## 9. MVP acceptance criteria (from the brief, restated as tests)

1. Fresh agent discovers the capability from a natural-language intent via `search_capabilities`.
2. Agent understands required inputs (including the badge precondition) from the manifest alone.
3. No wallet or Tracert account required.
4. Success returns a live page URL + receipt linking public evidence (PR + page fetch).
5. Duplicate, invalid and ineligible inputs fail safely with machine-actionable reasons (test vectors: `../../registry/providers/prompt-frenzy/evidence/test-vectors.json`).
6. Capability page displays recent public executions or test vectors.
7. Manifest + change history public in the registry.

## Open items

- Verify empirically how the submit API responds to an already-listed `url` (assumed 400 → `duplicate_listing`; confirm and adjust §2.5/§3.1 mapping).
- Confirm PR-polling etiquette/rate limits with the directory bot (unauthenticated GitHub API is assumed sufficient).
- The brief described the input as "website URL + required image URL" — the real contract has no required image (the badge is the eligibility mechanism; `logo` is optional). Modeled reality.
