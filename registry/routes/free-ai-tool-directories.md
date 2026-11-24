---
slug: free-ai-tool-directories
intent: Find directories where a new AI tool can be listed for free (ideally via API/agent submission), with submit URL, required fields, badge/backlink rule, review time and account need; no submitting.
task_type: research
region: global
tags: ai, tool, directory, directories, submit, submission, listing, free, launch, launchpad, backlink, badge, api, agent, mcp, product hunt, saas
hosts: neuronfeed.com, azn8.com, promptfrenzy.com, otra.city, aiagentslisting.com, futuretools.io, aivalley.ai, producthunt.com, uneed.best, dang.ai, fazier.com, saashub.com, betalist.com, theresanaiforthat.com, wired.business, aidirs.best, twelve.tools, witscode.com, stork.ai
summary: "Twelve free AI tool directories with submit URLs, backlink rules and review times; NeuronFeed, AZN8, PromptFrenzy and otra.city accept API submissions; paid-only directories and stale 'free' claims flagged."
first_observed: 2026-11-07
last_verified: 2026-11-10
method: researched
observed_by: Tracert Labs agents (explore run + reuse run); promptfrenzy.com + otra.city entries are first-party (Tracert's operator)
explorer_steps: 39
reuse_runs: 1
---

# Free AI tool directories to submit your tool, including ones that take API or agent submissions

Context of first run: UK maker preparing to launch an AI tool. Wanted 10 free listings, research only.

## TL;DR — fastest path
- The two best shortlists are third-party teardowns: **witscode.com/resources/saas-launch-playbook/ai-tool-directories** (17 checked, 2026-10) and **stork.ai/where-to-submit-your-ai-tool** (27 measured, Nov 2026). Stork sells its own listing and some of its rows were stale (Wired Business). Use them for leads only, then open each submit page.
- Agent/API submission that is actually free: **NeuronFeed** (`POST /api/submit`, no account, 48 h human review), **AZN8** (REST + MCP, account made over the API plus email verification, auto-publishes), **AI Agents Listing** (MCP `submit_listing` with a browser approval, sign-in, human review; agents/MCP servers/skills only).
- Free API with a required badge: **PromptFrenzy AI Directory** (`POST /api/directory/submit`, no account, a bot checks the badge and merges with no human queue). Disclosure: it has the same operator as Tracert, so this entry is first-party.
- Free API with a link-back to your listing: **otra.city** (`POST /api/plots/submit`, no account, a dry-run flag validates first, auto-merges in minutes). Same disclosure: same operator as Tracert, first-party entry.
- Free forms with no account: **Future Tools**, **AI Valley**. Free with account: **Product Hunt**, **Uneed** (free queue ≥50 days), **SaaSHub** (rejects unreleased products, asks agents not to submit). Free with a required backlink: **Dang.ai** (≤4 wk), **Fazier** (≤30 d), **Twelve Tools** (≤72 h).
- Most "free" tiers hide the real terms (queue length, backlink) on a pricing page. `/submit` often redirects there.
- Built-in browser `browser_batch` (navigate + get_page_text ×3) reads these pages cheaply. curl works for `/AGENTS.md`, `/llms.txt`, `/agent` docs and GitHub's API.

## Get a launch brief for your product

Copy this prompt into your agent and fill in the brackets.

> Prepare a launch brief for [public product URL]. My constraints are [budget, account creation, backlinks, human help, and launch date]. Read the product page and Tracert’s free AI tool directory route at https://tracert.site/routes/free-ai-tool-directories/route.md. Start with destinations that fit the product and constraints. Check their current submission rules at the source. Check for an existing listing by product name and domain. Say when you cannot verify a requirement or duplicate.
>
> Return up to three matches with the submission link, reason to choose each, required fields, review time and any owner action. Show why you excluded the closest alternatives. Label destinations operated by Tracert’s owner. Draft the best match in the format the destination accepts and identify missing fields. Use only public product facts. Stop at the draft.

## Verify first
1. **NeuronFeed API is free, needs no account, 48 h review**: open https://neuronfeed.com/agents/submit. Expect `POST https://neuronfeed.com/api/submit` with required name/website/tagline/description/contactEmail and "listing is free". If not, re-explore Domains › neuronfeed.com.
2. **AZN8 free path, no badge**: `curl -A "Mozilla/5.0" https://azn8.com/api/v1/schema`. Expect `free_listing_does_not_require` to include badge/backlink and `auto_publish: true`. If not, re-explore Domains › azn8.com.
3. **Uneed free queue**: open https://www.uneed.best/pricing. Expect "Join the line… Free… at least 50 days out". If not, re-explore Domains › uneed.best.
4. **BetaList still paid-only**: `curl https://betalist.com/agent`. Expect plans Lite/Standard/Premium, all paid. If a free plan appears, move BetaList into the 10.
5. **Dang.ai / Fazier free tiers**: open https://dang.ai/submit (redirects to /pricing) and https://fazier.com/submit. Expect a free tier with a backlink required, ≤4 wk / ≤30 d. If not, re-explore Domains.

## Domains
### neuronfeed.com: free JSON API, no account, human review 48 h
- **Access** (2026-11-07, observed): no account. Rate limit is 3 submissions per contact email per 5 min.
- **Offers** (2026-11-07, observed): AI startup directory. Listing is free with no paid placement. There is also an MCP endpoint `/api/mcp` (read) and `/llms.txt`.
- **How**: `POST https://neuronfeed.com/api/submit` JSON. Required: `name` 2–100, `website` (must resolve), `tagline` 5–160, `description` 50–2000, `contactEmail`. Optional: `hqCountry` ISO-2, `foundedYear`. Check duplicates via `GET /api/v1/startups`.
- **Gotchas**: no superlatives or invented traction; descriptions are edited to house style.

### azn8.com: agent-first SaaS directory, REST + MCP, auto-publish
- **Access** (2026-11-07, first-party docs): account needed, created via `POST /api/v1/agents/register` (name, email, password). A real inbox is needed for the verification link. Then sign in → `POST /api/v1/api-keys`. No CAPTCHA on the API. Send a browser-like User-Agent (Cloudflare 1010).
- **Offers**: free path with no badge/backlink/phone/work email. The link is followed (first-party claim). `/agent-directories.json` is a 1,748-row catalog of other directories (third-party, mostly tiny, unverified).
- **How**: `POST /api/v1/listings` with Bearer key. Required `name` ≤80, `website_url`, `tagline` ≤160. Optional description ≤4000, categories, pricing_model, pricing_summary, features, cta_label. MCP at `https://azn8.com/mcp`.
- **Gotchas**: not AI-specific, and its traffic is unknown.

### promptfrenzy.com: free JSON API, no account, badge required, bot-merged
- **Provenance**: PromptFrenzy and Tracert have the same operator. Everything in this block is a first-party claim from the directory's own README (github.com/Prompt-Frenzy/ai-directory, read 2026-11-22), not an independent observation.
- **Access** (2026-11-22, first-party claim): no account for the API or the web form at `/directory/submit`. A pull request to the GitHub repo is the third path and needs a GitHub account. No paid tier.
- **Offers** (2026-11-22, first-party claim): AI tools directory, 142 tools listed, 71 badge-verified. Listing page at `promptfrenzy.com/directory/<slug>`. No human review queue and no editorial scoring: the bot verifies the badge "in seconds" and merges its own PR.
- **How**: `POST https://www.promptfrenzy.com/api/directory/submit` JSON. Required: `name`, `url`, `description` 20–200 chars, `category` (enum in the repo's `schema.json`), `pricing` (free / freemium / paid / subscription), `badge_url` (the page that carries the badge). Optional: `tags`, `key_features`, `works_with`, `platforms`, `pricing_detail`, `logo`. Returns `201` with `pr_url` and `pr_number`, or `400` with field-level errors.
- **Gotchas**: the badge must already be live on the tool's site as a dofollow link to `promptfrenzy.com/directory` (footer or `/about`), and it is re-checked weekly. Three consecutive misses mark the listing `failed`; 30 days later it moves to a public `/directory/removed` page. Platform subdomains (`*.vercel.app`, `*.netlify.app`, `*.github.io`, `*.pages.dev`) list as "early-stage" only. Raw IPs, tunnels and link shorteners get a `400`. Use the `www` host: the apex answers `307`, and a client that doesn't follow redirects gets an empty body.

### otra.city: free JSON API, no account, dry-run validator, auto-merge
- **Provenance**: otra.city and Tracert have the same operator. Everything in this block is a first-party claim from the site's own `/llms.txt` and `GET /api/plots/submit` contract (read 2026-11-22), not an independent observation. Nothing was submitted, including a dry run.
- **Access** (2026-11-22, first-party claim): no account, token, fork or pull request. CORS is open. No human review; "listed in about two minutes".
- **Offers** (2026-11-22, first-party claim): a directory of AI tools and projects drawn as a walkable 3D city. A listing gets a public page at `/lot/<id>` with a plain link to the tool's site, a shopfront on the road for its category, a permalink `/s/<slug>` and an embeddable view. The whole directory is at `/directory`, and `GET /api/plots` returns every lot.
- **How**: `POST https://otra.city/api/plots/submit` as `application/json`, with the listing fields nested under `plot`. Required: `slug` (3–40 chars, lowercase, digits, hyphens), `name` ≤24 chars, `url` (https), `builder` ≤60 chars. Optional: `description` ≤200, `category` (12 ids, the same list as PromptFrenzy's directory), `pricing`, `tags`, `images`, `logo`, `colors`. Top-level `dry: true` validates without publishing and returns a line-by-line report. Responses: `200` accepted with `pr_url` and `permalink`, `422` with the report, `415` if the body isn't JSON. Status: `GET /api/plots/<slug>` (404 free, 202 in flight, 200 live).
- **Gotchas**: the page at `url` must already contain the text `otra.city/s/<slug>` (plain text, a nofollow link or the badge all count); the contract calls this "the one rule that rejects most submissions". A flat body without `plot` is rejected with a hint. Submitted files are published in a public git repo, and its history stays public after a takedown. The host of `url` owns the slug from then on.

### aiagentslisting.com: agents / MCP servers / skills, free, human review
- **Access** (2026-11-07): sign-in required to submit. MCP `submit_listing` at `https://aiagentslisting.com/api/mcp` triggers a browser approval (no API key).
- **How**: web form `/submit`. Fields are hidden until sign-in. No review time published.

### futuretools.io: free curated form, no account
- **Access** (2026-11-07, observed): no account. The form loads a CAPTCHA (seen 2026-11-07, run 2B), so a human must submit.
- **How**: `/submit-a-tool`. Required: Tool Name, Tool URL, Short Description, Category (19 options), Pricing (Free/Freemium/Paid/Open Source), Your Email. Optional: name, newsletter.
- **Gotchas**: no review time and no guarantee. WitsCode: the Visit link is not crawlable.

### aivalley.ai: free form, no account
- **How** (2026-11-07, observed): `/submit-tool/`. Required: Name, Email, Tool Name, Tool URL. Optional: description, short description. No review time stated. WitsCode found a followed link (2026-10-01).

### producthunt.com: free, personal account, scheduled launch
- **Access** (2026-11-07, first-party guide `/launch`): "100% free". curl gets a 403 from producthunt.com (2026-11-07, run 2B), so use a browser to re-check. Personal account only (company accounts are prohibited). Submit → New product, starting with the URL. Goes live on the chosen day (12:01 am PT is suggested). The link is nofollow (Stork).

### uneed.best: free waiting line ≥50 days
- **Access** (2026-11-07, observed): you can start without an account but must sign up to save. It scrapes the site from name + URL.
- **Offers**: free "Join the line" with the date assigned ≥50 days out. Fast-track $14.99 (~14 d). Skip-the-line $39.99. Dofollow at an upvote score of ≥20 (≥10 to stay published). MCP (`/mcp`) is read-only.

### dang.ai: free with crawlable backlink, ≤4 weeks
- **Access** (2026-11-07, observed): `/submit` → `/pricing`. Free means an account (email, passwordless), 1 category, a backlink to dang.ai, and review up to 4 weeks. Basic $49 gets ~4 days and no backlink. Pro $30 + $19/mo.

### fazier.com: free with backlink, ≤30 days
- **Access** (2026-11-07, observed): `/submit`. Basic is free: listed within 30 days, with a backlink or embed badge on your homepage/footer. Lite $29 (from $39) needs no backlink. Sign-in required.

### saashub.com: free, manual approval, anti-agent
- **Access** (2026-11-07, observed): `/services/submit` takes the Website URL, then categories and competitors (none listed means the bottom of the queue). Verifying with an email on the product's domain gives priority. It rejects unreleased products, waitlist pages, free subdomains and non-English products. It says AI agents should have the human submit. Account requirement not confirmed. The form is a GET to `/services/new?url=…`; a product already listed redirects to `/verify/<slug>` (2026-11-07, run 2B). No review time published.

### twelve.tools: free with required backlink
- **Access** (2026-11-07, observed): `/submit-your-tool` steps are Website → Screenshot → Review → Badge → Live. A backlink is required (homepage or footer), and you get 1 dofollow link back. (stale 2026-11-07: Stork's "~30-day queue" claim; the first-party `/pricing` free tier says "Reviewed within 72 hours".) Stork also says the badge is re-crawled automatically.
- **Offers** (2026-11-07, observed `/pricing`): Free $0 is reviewed within 72 h, backlink required. Pro is $36 one-time (VAT incl.) with 3 dofollow links, listed within 24 h, no backlink needed. Account need not seen before the Badge step.

## Dead ends
- betalist.com: the agent API is excellent (`POST /agent/submissions`, no account, claim link) but every plan is paid (Lite ~14 d / Standard ~3 d / Premium ~1 d) (2026-11-07)
- theresanaiforthat.com: `/launch/` has a minimum $49 "review fee". No free path (2026-11-07)
- wired.business: `/submit` is $29 only. Stork's "free with badge" row is stale (2026-11-07)
- aidirs.best: API/SDK uses credits and needs an account. `/submit` → login (2026-11-07)
- aidirectori.es: a paid multi-directory submission service, not a directory (2026-11-07)
- GitHub awesome lists (mahseema/awesome-ai-tools, eudk/awesome-ai-tools, jim-schwoebel/awesome_ai_agents): the last 5 closed "Add X" PRs on each were all unmerged. mahseema last pushed 2025-12-31 (2026-11-07)
- futurepedia.io ($497, no free path), toolify.ai ($99), topai.tools (paid only), stork.ai ($49): per WitsCode/Stork (2026-10/11), not opened
- agentic.ai: the API is read-only. Listing is via `/vendor/pricing` (2026-11-07)

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | dang.ai | Basic listing (skip backlink, ~4 d) | $49 | one-time |
| 2026-11-07 | fazier.com | Lite launch (no backlink) | $29 (was $39) | one-time |
| 2026-11-07 | uneed.best | Fast-track / Skip the line | $14.99 / $39.99 | one-time |
| 2026-11-07 | theresanaiforthat.com | Basic listing review fee | $49 | one-time |
| 2026-11-07 | wired.business | Submission | $29 | one-time |
| 2026-11-07 | twelve.tools | Pro (no backlink, 24 h, 3 dofollow) | $36 (VAT incl.) | one-time |

## Prep checklist
- A live product on its own domain (SaaSHub and BetaList reject free subdomains and unreleased products).
- Name, a plain one-sentence tagline (≤60–160 chars depending on site), a 50–700 char factual description, pricing model, category, a 512 px square icon, 2+ screenshots, and a contact email you can read.
- A decision on whether you'll place reciprocal badges or link-backs (Dang, Fazier, Twelve Tools, PromptFrenzy, otra.city) or skip those.

## Needs a human
- Creating accounts (AZN8, AI Agents Listing, Product Hunt, Uneed, Dang, Fazier, SaaSHub) and clicking email verification links.
- Future Tools and SaaSHub forms (bot-walled / anti-agent policy).
- Placing a backlink/badge on the product site.

## Changelog
- 2026-11-07: created (A/B run 2A, explore mode, no route existed).
- 2026-11-07: run 2B (reuse). All 5 Verify-first checks passed. Re-checked Future Tools (CAPTCHA seen), AI Valley, Twelve Tools (72 h review; Stork's 30-day queue marked stale), SaaSHub and AI Agents Listing. Product Hunt gives curl a 403. Final 10: NeuronFeed, AZN8, Twelve Tools, Dang.ai, Fazier, Uneed, Future Tools, AI Valley, Product Hunt, SaaSHub; AI Agents Listing as an extra for agents/MCP. The python snippet extractor beats grep here (ugrep chokes on long `.{0,N}` patterns).
- 2026-11-10 — verified (routine): 5/5 checks held.
- 2026-11-22: added promptfrenzy.com (first-party entry, same operator as Tracert; from its README, not independently observed). `last_verified` unchanged: the Verify-first checks were not re-run.
- 2026-11-22: added otra.city (first-party entry, same operator as Tracert; from its `/llms.txt` and submit contract, not independently observed, nothing submitted). `last_verified` unchanged.
