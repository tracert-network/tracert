---
slug: public-api-directories
intent: Get a free or keyless public API (or the free tier of one) listed in public API directories, GitHub lists, marketplaces and agent-facing catalogues so developers and AI agents can find it.
task_type: research
region: global
tags: public api, api directory, api marketplace, list my api, submit api, public-apis, free api, keyless api, no auth, openapi, apis.guru, rapidapi, postman api network, apis.io, apis.json, api-catalog, rfc 9727, jentic, freepublicapis, publicapis.dev, agent api catalogue, mcp, developer discovery
hosts: github.com, api.github.com, apis.guru, docs.rapidapi.com, learning.postman.com, apilist.fun, www.freepublicapis.com, apis.io, www.rfc-editor.org, agentapihub.com
summary: "freepublicapis.com robot-checks keyless APIs; public-apis is merging again (~9 days); publicapis.dev merges in hours; APIs.guru has been stale since 2024, so use Jentic instead."
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 32
---

# How to list a free public API in API directories: public-apis, freepublicapis.com, Jentic and more

All facts were checked on 2026-11-07 and carry one of these labels: **observed** (seen on the site's own page or in the GitHub API today), **first-party claim** (the site's own docs or marketing), **third-party** (someone else writing about it). Anything marked *inference* is a reading of the data, not something a page states.

## TL;DR — fastest path

- **For a keyless API, start with freepublicapis.com/new.** You submit one docs link. A robot checks that at least one endpoint works without a key, lists only the endpoints that work and re-tests them daily. No sign-in was shown. (first-party claim, 2026-11-07)
- **Open one PR to `public-apis/public-apis`.** Add one table row: `| [Name](docs) | desc ≤100 chars | No | Yes | Yes/No/Unknown | [Run in Postman] |`, titled `Add Name API`, squashed to one commit, against `master`. Maintainers are merging again: 127 PRs merged 2026-11-01..07, and new-API PRs took about 8–10 days. The backlog is still 2,515 open PRs. (observed, 2026-11-07)
- **Open one PR to `marcelscruz/public-apis`, which feeds publicapis.dev.** This is the fastest GitHub list. In a sample of 10, most PRs merged within about 4 hours. It needs an `https://` homepage on a custom domain (no shared-hosting subdomains, no query parameters) and a description under 160 characters. Free, freemium and paid APIs are all allowed. (observed + first-party claim, 2026-11-07)
- **For agent-facing reach, get an OpenAPI spec into Jentic and self-publish discovery files.** Jentic's bot turns issues into "Import OpenAPI spec from Issue #N" PRs and merges them within about an hour. For crawlers, serve `/.well-known/api-catalog` (RFC 9727 Linkset) and optionally an apis.json. Then submit to apis.io, which is reviewed by hand and needs an email address. (observed, 2026-11-07)
- **Skip these:** APIs.guru has had no data commits since 2024-03-01 and has thousands of untriaged "Add API" issues. apilist.fun shows a 2019 footer. ProgrammableWeb was retired in 2023 with no successor. `public-api-lists/public-api-lists` merges in batches about 30 days late, and its last merge was 2026-09-14. (observed / third-party, 2026-11-07)
- **RapidAPI and Postman are optional extras.** Both need an account. RapidAPI also puts your API behind its proxy, the Rapid Runtime. Postman lists any workspace you make public. A public Postman collection also fills the "Call this API" column in public-apis.

## Verify first

1. **public-apis is still merging new-API PRs.** Fetch `https://api.github.com/search/issues?q=repo:public-apis/public-apis+is:pr+is:merged&sort=updated&order=desc&per_page=15`. Expect `merged_at` dates within the last ~14 days and titles like "Add X API". If not, re-explore **github.com/public-apis/public-apis** (maintainers may have paused again).
2. **freepublicapis.com still requires a keyless endpoint and has an open form.** Fetch `https://www.freepublicapis.com/new`. Expect "at least one endpoint that works without an API key", a "Fill in API info" button and no login wall. If not, re-explore **www.freepublicapis.com**.
3. **marcelscruz/public-apis still merges quickly.** Fetch `https://api.github.com/search/issues?q=repo:marcelscruz/public-apis+is:pr+is:merged&sort=updated&order=desc&per_page=10`. Expect merges within the last few days, mostly a few hours after creation. If not, re-explore **github.com/marcelscruz/public-apis**.
4. **Jentic's issue-to-PR import bot is still running.** Fetch `https://api.github.com/search/issues?q=repo:jentic/jentic-public-apis+is:pr&sort=created&order=desc&per_page=10`. Expect recent `github-actions[bot]` PRs titled "Import OpenAPI spec from Issue #N", merged. Then open the repo's "New issue" page and read the template. If not, re-explore **github.com/jentic/jentic-public-apis**.
5. **APIs.guru is still stale.** Fetch `https://api.github.com/repos/APIs-guru/openapi-directory/commits?per_page=10`. Expect no data or "update" commits after 2024-03-01. If there are new data commits, re-explore **apis.guru**, which would be worth submitting to again.

## Domains

### github.com/public-apis/public-apis — the largest list; active again, slow, with a big backlog

- **Access:** 2026-11-07, observed. CONTRIBUTING.md was readable, and the GitHub search API worked unauthenticated with no 403 or 429.
- **Offers:** A category table of free APIs. It now also has a separate **MCP server** section with columns Name, Description, Auth, Transport (`stdio`/`HTTP`/`SSE`) and Install. Install links only to marketplaces where the server is already published; Cursor, Anthropic and Glama are tracked. (first-party claim, 2026-11-07)
- **How:** Fork the repo, add one row to `README.md` and open a PR against `master`. The rules (first-party claim, 2026-11-07):
  - The API needs "full, free access or at least a free tier" and must not depend on buying a device or service.
  - Columns: API (linked to docs), Description (≤100 chars), Auth (`OAuth` / `apiKey` / `X-Mashape-Key` / `No` / `User-Agent`), HTTPS (Yes/No), CORS (`Yes` / `No` / `Unknown`), and Call this API (a public Postman collection link, which gives a "Run in Postman" button).
  - One link per PR. Keep entries alphabetical and in the best-fitting category.
  - Title the PR `Add Api-name API`. Leave the TLD out of the name and don't end the name with "API".
  - Squash commits before opening the PR and again after review changes.
  - Search for duplicates first, and never submit a new version of an API that is already listed.
  - The API must have proper documentation.
  - The automated link-validation build must pass.
  - PRs "identified as marketing attempts will not be accepted".
- **Merge activity (observed, 2026-11-07):**
  - 2,870 PRs merged all-time and 2,515 open.
  - 127 merged between 2026-11-01 and 2026-11-07, most recently 2026-11-07T19:45Z.
  - In a 28-PR sample, new-API PRs merged 8.2–10.2 days after opening (median about 8.9). Edit and fix PRs took 0.8–4 days.
  - Merges arrive in batches a few seconds apart. *Inference:* a maintainer works through recent PRs in one sitting. Older open PRs may never be reached.
- **Gotchas:**
  - 2,515 open PRs means a lot of competition, and PRs older than the current batch window may sit indefinitely. *Inference:* the acceptance rate is unknown.
  - A Postman collection is a column in the table, so create one first (see Postman below).
  - Recent merged titles include an MCP-server listing paired with an API listing for the same product (e.g. TextKit API + TextKit MCP server, 2026-11-07). That suggests a product can hold two rows.

### github.com/marcelscruz/public-apis (publicapis.dev) — fastest GitHub list; accepts paid and freemium too

- **Access:** 2026-11-07, observed. CONTRIBUTING.md and the search API were readable.
- **Offers:** A README table that is turned into the publicapis.dev site. The site uses your homepage link to generate a screenshot. (first-party claim, 2026-11-07)
- **How:** Edit `README.md` only; `/db` is auto-generated. Target `main` with one link per PR, titled "Add [Name] API". Columns: API (homepage, `https://` only, no deep links or subdomains), Description (<160 chars), Auth (same values as public-apis), CORS. An automated reviewer checks URL reachability, then a maintainer decides. (first-party claim, 2026-11-07)
- **Acceptance rules (first-party claim, 2026-11-07):**
  - Publicly reachable, documented and self-serve (no waitlists or sales contacts).
  - Free, freemium and paid APIs are all OK.
  - Custom domain required; shared-hosting subdomains are rejected.
  - Must be a standalone product. Libraries, SDKs and CLIs without a connectable API are rejected.
  - The URL must be live, with no query parameters.
- **Merge activity (observed, 2026-11-07):**
  - 940 merged all-time.
  - In a 10-PR sample: median wait about 0.16 days (about 4 hours); outliers took 5–19 days. Last merge 2026-11-07T23:07Z.
- **Gotchas:** A `*.vercel.app` or similar shared-host homepage will be rejected. Use a custom domain.

### www.freepublicapis.com — best fit for keyless APIs; robot-verified

- **Access:** 2026-11-07, observed. The home page and `/new` were readable with no login wall.
- **Offers:** "886 free public APIs" (observed header). The site says every endpoint is "called daily" and gets a health score from latency, error rate and reliability (first-party claim). No JSON feed or MCP endpoint for the directory itself was seen.
- **How:** Go to `/new`, click "Fill in API info" and submit the API's docs link. A robot reads the docs, checks that the API is free, finds the keyless endpoints and tests them. Only working endpoints are listed. (first-party claim, 2026-11-07)
- **Acceptance rules (first-party claim, 2026-11-07):**
  - Free at least for development or learning.
  - At least one endpoint that works without an API key or signup.
  - Links to the API's own documentation.
  - Not paid-only and not a duplicate.
  - HTTPS and CORS are not mentioned.
- **Gotchas:**
  - The page also says paid APIs can be listed for a one-time **$25 "after the check"**, which reads oddly next to the "no paid-only" rule. Free listing cost is not stated. *Inference:* free listings are free.
  - Review time is not stated.
  - The docs must show the keyless endpoint clearly, or the robot will not find it.

### github.com/jentic/jentic-public-apis (jentic.com/apis) — agent-facing OpenAPI catalogue with a bot import pipeline

- **Access:** 2026-11-07, observed via the GitHub search API. The repo README and the jentic.com pages were not opened; their details below come from search snippets.
- **Offers:**
  - A repository of standardised OpenAPI specs that feeds Jentic's agent-facing API directory. A search snippet says "235,000+ operations across 10,000+ APIs". (first-party claim via search snippet, 2026-11-07)
  - The README says the repo grows by "AI agents to import (and improve) existing OpenAPI documents". (first-party claim via search snippet, 2026-11-07)
  - It credits APIs.guru as the original source. (first-party claim via search snippet, 2026-11-07)
- **How:**
  - 16,786 PRs in total. Recent PRs are all bots: `github-actions[bot]` "feat: Import OpenAPI spec from Issue #N" PRs, merged about 30–60 minutes after creation, and `jentic-public-apis-automation[bot]` "Rebuild apis.json, scores.json, and API browsing indexes". Last merge 2026-11-07T09:24Z. (observed, 2026-11-07)
  - *Inference:* you submit by opening an issue that points at your OpenAPI spec, and the bot does the rest. **Verify the issue template before relying on this.**
- **Gotchas:**
  - Needs a GitHub account and a valid OpenAPI document.
  - A GitHub discussion (#4) proposes pointing `x-jentic-source-url` at a hosted raw spec instead of keeping a copy in the repo. It is a proposal, not policy. (third-party/community, 2026-11-07)
  - The repo also produces `apis.json` and `scores.json`. *Inference:* listings get a quality score, so a well-described spec helps.

### apis.io — large search engine with many agent features; hand-reviewed form

- **Access:** 2026-11-07, observed. The home page and `/add/` were readable.
- **Offers:** "38864 providers, 188885 APIs, and 6053 MCP servers" (observed counter). It also has an Agent Registry, an MCP directory, A2A agent cards, llms.txt, an AI catalogue, agent skills, and a "markdown mirror of every page". (first-party claim, 2026-11-07)
- **How:** Use the form at `/add/` or email info@apis.io. Required fields are the API or company name and your email. Optional fields are a website or **APIs.json URL**, a docs URL and free-text notes. You can also say where you already publish OpenAPI, llms.txt, an MCP server or an agent card. (first-party claim, 2026-11-07)
- **Gotchas:**
  - "Every submission is read by hand" and they list "one real company per submission". (first-party claim)
  - No review time, cost or account requirement is stated.
  - The form needs your email address, so a human must submit it.
  - The footer links apisjson.org and the `api-search` GitHub org, but the page does not describe them as intake channels. apisjson.org was not opened this run.

### www.rfc-editor.org (RFC 9727 `/.well-known/api-catalog`) — self-publish for crawl-based discovery

- **Access:** 2026-11-07, observed.
- **Offers:** An IETF Standards Track RFC from June 2025, "api-catalog: A Well-Known URI and Link Relation to Help Discovery of APIs". No listing step is needed; you publish on your own domain. (observed, 2026-11-07)
- **How:**
  - An HTTPS GET to `https://yourdomain/.well-known/api-catalog` returns a **Linkset** (`application/linkset+json`) with profile `https://www.rfc-editor.org/info/rfc9727`, linking to the API endpoints.
  - Include usage policy, version and OpenAPI links (recommended).
  - An HTTPS HEAD to the same path returns a `Link` header with `rel="api-catalog"`.
  - APIs.json and other formats are optional extras via content negotiation, but a Linkset must still be provided. (observed, 2026-11-07)
- **Gotchas:** This does nothing until a crawler or agent looks for it. It is the cheapest standards-based signal for agents and pairs well with an apis.json.

### learning.postman.com (Postman API Network) — listing is automatic once a workspace is public; account needed

- **Access:** 2026-11-07, observed. The docs pages were readable but high-level.
- **Offers:**
  - The network reaches "over 40 million users" (first-party claim).
  - Publishers share public workspaces, collections, APIs and flows.
  - A "Run in Postman" button.
  - An MCP Generator that can "create an MCP server with your public APIs" (first-party claim, 2026-11-07).
- **How:**
  - Set up a publisher team, workspace and collections, then change the workspace type to public. "Once your workspace is public, it and its collections are available on the Postman API Network." (first-party claim, 2026-11-07)
  - Postman's Secret Scanner replaces detected keys and tokens with placeholders before publishing. (first-party claim, 2026-11-07)
- **Gotchas:**
  - "Depending on your plan and role, a Community Manager may need to approve your request" (first-party claim).
  - Plan requirements and any Postman-side review are not documented on the pages read.
  - Needs a Postman account.
  - The public collection URL is also what public-apis wants in its "Call this API" column.

### docs.rapidapi.com (RapidAPI Hub) — marketplace with a proxy; account required; free APIs allowed

- **Access:** 2026-11-07, observed. `/docs/adding-an-api` returned **HTTP 404**. `/docs/hub-listing-overview` and `/docs/api-pricing` were readable; both were last updated June 2025, and the pricing page is marked legacy.
- **Offers:**
  - Hub listing tabs: General (visibility, base URLs, logo, category, descriptions, tags, health check), Definitions (endpoints, security, OpenAPI upload), Gateway (the Rapid Runtime hosted proxy with rate, quota and size limits), Docs and Monetize. (first-party claim, 2026-11-07)
  - "Free" API type: "do not require a credit card or subscription to consume", with "no quotas". (first-party claim, 2026-11-07)
- **How:** Provider Dashboard → "Add New API" → fill in the Hub Listing tabs → set visibility. The Provider Dashboard step comes from a search snippet of rapidapi.com/learn (first-party claim via search, 2026-11-07).
- **Gotchas:**
  - Consumers call through RapidAPI's proxy (Rapid Runtime), not your URL directly.
  - "Freemium" APIs "require a credit card, even for the free plan". Pick the **Free** type for a keyless or free API. (first-party claim)
  - Neither page read mentions a review or approval step or the commission rate; the pricing page points to "Payouts and Finance", which was not opened.
  - Third-party claims of BASIC plan quotas (dev.to, 2026) are unverified.
  - RapidAPI's ownership and service status in 2026 were **not verified** this run.

### apis.guru — stale; submissions pile up as untriaged GitHub issues

- **Access:** 2026-11-07, observed. The `/add-api` form page and the `APIs-guru/openapi-directory` commits and issues were read via the GitHub API.
- **Offers:** An aggregator of machine-readable definitions: OpenAPI/Swagger, API Blueprint, RAML, WADL, Google Discovery. "We only aggregate API definitions, not host them". It needs a stable definition URL. The form fields are the definition URL, its format, whether it is official, the name, a category (required) and a logo URL. A `.well-known/ai-plugin.json` URL auto-fills the form. (first-party claim, 2026-11-07)
- **Activity (observed, 2026-11-07):**
  - The last "Weekday update" data commit was **2024-03-01**. Commits since then are README and org housekeeping only, the latest on 2026-04-20.
  - 2,632 issues and PRs were created since 2026-01-01; the form appears to file them as "Add "X" API" issues.
  - Of the 10 most recent, 9 were open with 0 comments.
  - Only 88 of the 2026 items are closed. Several were closed the same day as "completed". *Inference:* those may be self-closed by submitters, since the directory data has not changed.
  - Some recent titles look like automated agent spam (e.g. "Certified forgetting for agents").
- **Gotchas:** Submitting is cheap but probably has no effect. Jentic imported APIs.guru's corpus, so getting into Jentic directly is the better route.

### apilist.fun — probably abandoned; form still loads

- **Access:** 2026-11-07, observed. `/submit` showed a 404 image. `/new` showed a submission form.
- **Offers:** The form has fields for name, URL, logo (Clearbit), Markdown description, official (Y/N), category, GitHub, Twitter, optional email, SSL support, auth model, and request and response formats. It says submissions "will be reviewed within 24 hours" (first-party claim, 2026-11-07).
- **Gotchas:** The footer reads "© 2019 ApiList.fun". No sign of recent activity was found. *Inference:* likely unmaintained, so low value.

### agentapihub.com — unreadable without JS

- **Access:** 2026-11-07, observed. Only the page title came back: "AgentAPI - API Directory for AI Agents | MCP Compatible APIs". No submission details, counts or dates were readable, so it is likely a JS-rendered SPA.
- **Offers:** A search snippet says there is a "Submit API" link in the footer (third-party via search, 2026-11-07).
- **Gotchas:** Not verified. Open it in a real browser before spending time on it.

## Dead ends

- **ProgrammableWeb:** retired. Wikipedia says MuleSoft announced the shutdown on 2023-02-03; API Evangelist says 2022 (third-party, 2026-11-07). No named successor directory was found. A "MuleSoft API Discovery Hub" item appeared in an API Evangelist list but was not confirmed as a public successor.
- **APIs.guru as a live route:** see above. No data commits since 2024-03-01 (observed).
- **`public-api-lists/public-api-lists`:** alive but slow. 389 merged all-time; last merge 2026-09-14; 8 PRs batch-merged that day after 26–36 days (observed, 2026-11-07). Low priority.
- **apilist.fun:** 2019 footer; `/submit` is a 404 (observed).
- **docs.rapidapi.com/docs/adding-an-api:** HTTP 404 (observed). Use `/docs/hub-listing-overview` instead.
- **ApyHub "7 API marketplaces for AI agents 2026" blog:** a vendor ranking itself first (third-party, from a search snippet only). Not opened and not evaluated.
- **saxi.ai "Free Public API Directory" (via peerpush.com):** appeared in search as an open-source free-API directory that takes submissions. Not opened (third-party snippet, 2026-11-07).

## Prep checklist

- Public **HTTPS docs page on a custom domain**. marcelscruz rejects shared-hosting subdomains, and every list needs docs.
- At least **one endpoint that works with no key or signup**, shown clearly in the docs. freepublicapis' robot looks for it, and it lets you use Auth = `No`.
- **CORS headers** set, if you want CORS = `Yes`.
- **OpenAPI 3 document at a stable public URL**, for Jentic, APIs.guru and RapidAPI import.
- **Public Postman collection** in a public workspace, for the public-apis "Call this API" column and the Postman API Network.
- **Descriptions:** one ≤100 chars (public-apis) and one <160 chars (marcelscruz). The name has no TLD and no trailing "API".
- **Pick a category** that already exists in each list. Rows go in alphabetically.
- **Logo URL**, for APIs.guru, apilist.fun and RapidAPI.
- **Self-published discovery files:** `/.well-known/api-catalog` (RFC 9727 Linkset), optionally `apis.json`, and optionally `llms.txt`.
- If you also ship an **MCP server**, list it on at least one marketplace first. public-apis' MCP section only links marketplaces where the server already exists.
- Search each repo's open PRs and issues for your name first, to avoid duplicates (a stated rejection reason).

## Needs a human

- **GitHub account** to fork and open PRs (public-apis, marcelscruz/public-apis) and to open an issue (Jentic). These are public posts under the user's identity.
- **apis.io form or email:** needs the submitter's email address and a reply loop.
- **freepublicapis.com form:** submitting a form. Decide whether the optional $25 paid listing is ever wanted.
- **Postman:** account, publisher team, making a workspace public, and possibly Community Manager approval.
- **RapidAPI:** provider account, the Terms of Use step, and payout setup if any paid plan is added.
- Choosing to list in marketplaces that **proxy** traffic (RapidAPI) is a product decision. You lose direct traffic and evidence.

## Changelog
- 2026-11-07 — created (research run, no submissions).
