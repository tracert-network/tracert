---
slug: mcp-server-registries
intent: Get a free, public, remote (Streamable HTTP) MCP server listed in the official MCP Registry and the main third-party MCP directories so people and agents can discover and install it.
task_type: research
region: global
tags: mcp, model context protocol, mcp registry, server.json, mcp-publisher, smithery, glama, pulsemcp, mcp.so, mcpservers.org, mcp market, awesome-mcp-servers, awesome-remote-mcp-servers, cline marketplace, cursor directory, claude connectors directory, remote mcp, streamable http, list mcp server, submit mcp server
hosts: registry.modelcontextprotocol.io, github.com, smithery.ai, glama.ai, www.pulsemcp.com, mcp.so, mcpservers.org, mcpmarket.com, claude.com, www.apideck.com
summary: "Publish a remote MCP server to the official registry with domain auth and no repo; Smithery self-publish ended 31 Oct 2026 and PulseMCP is paused, so start upstream."
first_observed: 2026-11-07
last_verified: 2026-11-07
method: mixed
observed_by: Tracert Labs agents (research run; then a real publish of site.tracert/tracert, first-party for tracert.site)
explorer_steps: 31
reuse_runs: 1
---

# How to list an MCP server in the official MCP Registry and other MCP directories (no GitHub repo needed)

Labels: **observed** means I saw it on the site's own page on 2026-11-07. **First-party claim** means the site's own docs or marketing say it (including search-result snippets of those docs). **Third-party** means a blog or list about the site. Every fact is dated 2026-11-07 unless a different date is given.

## TL;DR — fastest path

- **Executed 2026-11-07: a remote-only server with a domain namespace was published in ~22 tool calls, with no CLI download and no GitHub repo needed.** Steps:
  1. Generate an Ed25519 key. On macOS, Node's `crypto.generateKeyPairSync("ed25519")` avoids the LibreSSL problem.
  2. Serve `v=MCPv1; k=ed25519; p=<base64 32-byte pubkey>` at `https://<domain>/.well-known/mcp-registry-auth` (200, **no redirect**; `application/octet-stream` was accepted).
  3. `POST https://registry.modelcontextprotocol.io/v0/auth/http` with `{"domain","timestamp" (RFC3339 UTC, no fractional seconds),"signed_timestamp" (hex Ed25519 signature of the timestamp string)}` returns `registry_token`.
  4. `POST /v0.1/publish` with `server.json` as the body and `Authorization: Bearer <token>`.

  The response was 200 and the server appeared in `GET /v0.1/servers?search=` immediately (observed).
- **Publish to the official MCP Registry first.** It's the upstream source other directories read from. PulseMCP's submit page tells you to publish there, and Glama's connector IDs use registry namespaces. It's free and has no human review step. A remote-only server needs only a `remotes` entry (`"type": "streamable-http"`, public `url`). No package is needed, and **no GitHub repo is needed** if you use a domain namespace (DNS or HTTP auth). (first-party claim + observed, 2026-11-07)
- **Choose the namespace first, because it decides what the human has to do.** For `io.github.<user>/<name>`, they need a GitHub account and a device-code login, but no repo. For `com.example/<name>`, they need control of example.com: either an apex DNS TXT record or a file at `https://example.com/.well-known/mcp-registry-auth`, plus an Ed25519 key. (first-party claim, 2026-11-07)
- **Skip these for now.** PulseMCP has paused submissions, and once you're in the official registry it says it picks you up automatically. Smithery shut down its proxy, CLI, accounts and API on 2026-10-31, and its directory is now curated by Arcade with no visible self-publish. On awesome-mcp-servers, remote-only servers are out of scope, so use awesome-remote-mcp-servers instead. (observed, 2026-11-07)
- **Free web forms that accept a server without a GitHub repo:** mcpservers.org takes a website or docs link, has a "remote" checkbox, needs a contact email, and reviews free entries "within 2 weeks". Glama ingests registry connectors, and the owner can claim the listing afterwards. **Forms that require a GitHub repo URL:** mcp.so, MCP Market, the Cline marketplace and awesome-mcp-servers. (observed, 2026-11-07)
- **Anthropic's Connectors Directory needs a human on a paid Claude plan.** You submit at claude.ai/directory/manage. It's remote-only, and no-auth is allowed for public data. Every tool needs a `title` plus `readOnlyHint` or `destructiveHint`. You also need a privacy policy URL, a docs URL, an icon and reviewer test instructions. Submissions are auto-scanned and listed as "Community" by default. (first-party claim, 2026-11-07)
- **Every step here that writes something needs a human or explicit approval:** sign-ins, DNS or key handling, opening a PR or issue from their GitHub, entering a contact email, and paying for paid tiers.

## Verify first

1. **The official registry lists remote-only servers that have no repo.** GET `https://registry.modelcontextprotocol.io/v0.1/servers?limit=5&search=weather`. Expect `remotes[].type = "streamable-http"`, and some entries without `repository`. On 2026-11-07 these included `ai.precip/weather` and `app.gamedayweather/gdw`. If not, re-explore "registry.modelcontextprotocol.io".
2. **PulseMCP is still paused.** Fetch `https://www.pulsemcp.com/submit`. Expect "not accepting new MCP server or client submissions" with advice to publish to the official registry. If it's open, re-explore "www.pulsemcp.com".
3. **Smithery still has no self-publish.** Fetch `https://smithery.ai/future`. Expect a statement that the proxy, CLI, accounts and API stopped on 2026-10-31 and the directory continues under Arcade. If a publish path appears, re-explore "smithery.ai".
4. **Anthropic portal requirements are unchanged.** Fetch `https://claude.com/docs/connectors/building/submission.md`. Expect the claude.ai/directory/manage portal, a paid Claude plan, tool annotations, and auto-listing as Community. If it differs, re-explore "claude.com".
5. **mcpservers.org is still free with a 2-week review.** Fetch `https://mcpservers.org/submit`. Expect Free at $0 with "Review within 2 weeks" and Premium at $39 with 24h review. If it differs, re-explore "mcpservers.org".

## Domains

### registry.modelcontextprotocol.io (+ github.com/modelcontextprotocol/registry docs) — do this first; free, CLI-based, remote-only friendly
- **Access** (2026-11-07, observed): The home page renders with search and a "Recently Updated" list. It offers Production, Staging (`staging.registry.modelcontextprotocol.io`) and Local API environments. The public API at `/v0.1/servers` returned JSON without auth.
- **Offers:** The canonical metadata registry. It "only hosts metadata, not artifacts" (first-party claim, quickstart.mdx). The FAQ says the registry is **in preview**, and breaking changes or data resets may happen before GA (first-party claim).
- **How** (first-party claim, quickstart.mdx and authentication.mdx):
  1. Install the `mcp-publisher` CLI. Its commands are `init`, `login`, `logout`, `publish`, `status` and `validate`.
  2. Run `mcp-publisher init` to generate a `server.json`, then edit it. Fields seen in the examples are `$schema`, `name`, `title`, `description` (max 100 chars), `version`, `repository` (optional), and `remotes: [{ "type": "streamable-http", "url": "https://…" }]`. A remote-only server omits `packages`.
  3. Log in with one of these:
     - `mcp-publisher login github`, using the device-code flow, for the `io.github.<user>/*` namespace. Org namespaces need the Owner role. The device flow can't publish to orgs (issue #1468), so use `--token <PAT>` with `read:org` instead.
     - GitHub Actions OIDC.
     - `mcp-publisher login dns --domain example.com --private-key <key>`. This needs an apex TXT record `v=MCPv1; k=ed25519; p=<base64 pubkey>`. Selector subdomains like `_mcp-auth.` are NOT read.
     - `mcp-publisher login http --domain example.com --private-key <key>`. This needs the same string served at `https://example.com/.well-known/mcp-registry-auth`.

     DNS and HTTP auth give the `com.example.*/*` namespace. Ed25519 is the default, `ecdsap384` is optional, and GCP KMS and Azure Key Vault variants exist.
  4. Run `mcp-publisher publish`.
  5. Verify with `GET /v0.1/servers?search=<name>`.
- **Gotchas** (first-party claim unless noted):
  - Ed25519 key generation needs OpenSSL 3.0 or later.
  - The HTTP auth file is fetched from registry infrastructure with a 10s timeout and a 4096-byte limit. **No redirects** are followed (any 3xx fails), and WAFs, geo-blocks or a broken AAAA record can fail it even when the file loads in a browser.
  - The registry verifies the namespace but **not control of the remote URL**.
  - Published versions are immutable, so bump `version` to update.
  - "Delete" is a status change (`mcp-publisher status`), and metadata is never removed.
  - `_meta.io.modelcontextprotocol.registry/publisher-provided` has a 4 KB limit.
  - Abuse reports go to a GitHub issue titled "Abuse report:".
  - Cost and review time are not stated in the docs I read. There appears to be no human review gate (not stated). Apideck says it is free and "automated" (third-party, 2026-10-31).
  - Observed 2026-11-07: entries with no `repository` field exist (`ai.precip/weather` → `https://api.precip.ai/mcp`, `app.gamedayweather/gdw`).

### www.pulsemcp.com — skip for now; paused, and it will pull from the official registry
- **Access** (2026-11-07, observed): The /submit page loaded. On 2026-11-10 it returned HTTP 403 to a plain read-only fetch, so the paused status was not re-checked.
- **Offers:** A curated directory.
- **How:** The page says "not accepting new MCP server or client submissions right now" and is not changing existing listings. It recommends publishing to the Official MCP Registry ("the best first step even when we are not paused"), which PulseMCP will "pick … up automatically" when it reopens. (observed / first-party claim)
- **Gotchas:** No reopening date is given.

### glama.ai — likely auto-ingests registry connectors; claim the listing afterwards
- **Access** (2026-11-07, observed): `/mcp/servers` and `/mcp/connectors/<id>` loaded. The `/mcp/servers/add` content did not reveal its requirements (likely JS- or login-gated).
- **Offers:** The servers list has Remote (46,036), Local (44,404) and Hybrid (22,022) filters, plus Claimed and Official filters and letter grades for license, quality and maintenance (observed). A separate **MCP Connectors** section uses registry-style IDs, for example `net.nexlab/nexlab-mcp` and `io.github.ceedot-rock/slid-phi-labs` (observed). The connector pages show transport, URL, an OAuth "Works in Glama" field, uptime, and a "Last tested" timestamp. One page showed a 2026-11-07 health check marked Unhealthy with 0.0% uptime (observed).
- **How:** Publish to the official registry and the connector appears with the same namespace. That is an inference from the matching IDs, and Apideck says Glama "re-publishes registry entries" (third-party, 2026-10-31). Then use "claim ownership", which requires sign-in. Verification can be GitHub identity (fastest for `io.github.*`), an HTTP file at `/.well-known/glama.json` on the connector origin, or a DNS record. Glama re-checks periodically and gives a 7-day grace period if the token disappears (first-party claim, via search snippets of Glama docs). An "Add Server" button exists for repos or URLs (observed button; Apideck says it takes a GitHub repo or URL, third-party).
- **Gotchas:** Health checks need working test credentials. A listing can show "Unhealthy" if its test profile is missing (observed). Older claim instructions used a `maintainers` email in glama.json, but the current docs say never to publish an email and to use the claim token shown in your claim screen (first-party claim). A $49/month boost exists according to Apideck (third-party, unverified).

### smithery.ai — skip for self-listing; the platform pivoted on 2026-10-31
- **Access** (2026-11-07, observed): The home page and /future loaded. All `/docs/build/*` pages, including the `.md` variants, returned **404** to the fetcher.
- **Offers:** "MCP servers, now part of Arcade." It is a public, non-proxied directory with "curated, verified servers" showing direct vendor URLs (observed, /future).
- **How:** No publish or add-server link is visible (observed). Before the pivot, the docs described publishing a URL at smithery.ai/new, running `smithery mcp publish "<url>" -n @org/name`, and a static `/.well-known/mcp/server-card.json`. Its scanner used UA `SmitheryBot/1.0` and wanted a 401, not a 403, for unauthenticated requests (first-party claim via search snippets, now likely stale).
- **Gotchas:** On 2026-10-31 these shut down: the MCP Proxy, managed identity, the Smithery API, Connect, Toolbox, accounts, API keys, and the CLI and SDKs (deprecated). The `run.tools` and `server.smithery.ai` URLs stopped working (observed, /future). The official registry still lists `ai.smithery/*` entries pointing at `server.smithery.ai` (observed via API), which are probably dead now (inference).

### mcp.so — web form; requires a repository URL; $39 option skips review
- **Access** (2026-11-07, observed): /submit loaded, and a "Sign In" link is in the header.
- **Offers:** Submission types are MCP Server, **Remote Server**, MCP Client and AI Product.
- **How:** The only required field is **Repository URL**. A Name field is also shown. A free submission is reviewed, with no timeframe stated. A paid submission is **$39 one-time** and publishes "immediately without review", with a Verified badge, featured placement and a dofollow link (observed).
- **Gotchas:** A server with no repo is blocked by the required Repository URL field, even for the "Remote Server" type. The page doesn't say whether login is needed to submit.

### mcpservers.org — web form; accepts website/docs instead of a repo; free with 2-week review
- **Access** (2026-11-07, observed): /submit loaded.
- **How:** The form fields are server name, category (15 options), short description, repository/website/documentation link, **optional official MCP Registry name**, a **remote-connection checkbox**, contact email, and plan. Free is $0 with "Review within 2 weeks". Premium is a **$39** one-time fee with 24h review, an official badge, search priority, and a dofollow (DR 72) link (observed).
- **Gotchas:** A contact email is required, and that is personal data, so the human must approve it. The page says nothing about an account.

### mcpmarket.com — web form; GitHub repo URL required
- **Access** (2026-11-07, observed): /submit loaded.
- **How:** You "Enter the full URL to the GitHub repository". A "Remote MCP" option is shown. Free Queue is $0, averaging **4–6 weeks**. "Get Listed Now" is **$29** one-time, listed within 24h, with an Official badge and a "Try Now" link. You get an email when the listing goes live (observed).
- **Gotchas:** A server with no GitHub repo is effectively blocked. Apideck notes you may already be listed from GitHub crawling (third-party).

### github.com/punkpeye/awesome-mcp-servers — PR; public GitHub repo required; remote-only is out of scope
- **Access** (2026-11-07, observed): CONTRIBUTING.md loaded.
- **How:** Fork, edit README.md, and add one line per server with the name linked to its repo and a short description, in the right category and in alphabetical order. Then open a PR. Agent-submitted PRs can add "🤖🤖🤖" to the PR title for a fast-track merge (observed).
- **Gotchas:** "Only servers with a public GitHub repository". Remote-only hosted servers belong in awesome-remote-mcp-servers (observed). Apideck says a Glama listing with a score badge is required first (third-party). CONTRIBUTING.md does not say this, so check the PR template or the README before submitting.

### github.com/jaw9c/awesome-remote-mcp-servers — PR; the right awesome list for remote-only servers, but auth criteria may block no-auth servers
- **Access** (2026-11-07, observed): The README loaded. It has 231 commits and ~1.2k stars, with no archived notice, but commit dates weren't visible.
- **How:** Fork, add a row to the right category (Name, Category, URL, Authentication, Maintainer), and open a PR (observed).
- **Gotchas:** The list is "curated, opinionated". It prefers official or vendor-maintained, production-ready servers. The criteria say "OAuth 2.0 or API Key support required", yet the table includes some "Open" (no-auth) entries, so the rules conflict. A free no-auth server may be rejected (observed).

### github.com/cline/mcp-marketplace — GitHub issue; repo + logo required
- **Access** (2026-11-07, observed): The repo README loaded. It has 36 commits on main and ~3.2k issues, with no deprecation notice.
- **How:** Open an issue with the submission template. It asks for the **GitHub Repo URL**, a **400×400 PNG logo**, and a reason for addition. First test that Cline can install the server from the README and/or an optional `llms-install.md`. The team "aims to review within a couple of days" (first-party claim). With ~3.2k issues open, expect a backlog (inference).
- **Gotchas:** A GitHub repo is required, so a remote-only server with no repo is blocked. Even with a repo, the README needs remote-URL install instructions that Cline can follow.

### cursor.directory / Cursor Marketplace — not verified (429)
- **Access** (2026-11-07): cursor.directory returned **HTTP 429** to the fetcher (blocker).
- **How** (third-party, Apideck 2026-10-31): On cursor.directory you submit a GitHub repo, which is detected as a plugin in "Agent Plugins" format. The example shows an HTTP config for a remote endpoint. The free review time is not stated. The Cursor Marketplace takes a publisher application, is open-source plugins only, and each plugin and update is hand-vetted. Another guide describes a fork-and-PR JSON flow for cursor.directory, which conflicts (third-party). No official Cursor doc was found.
- **Gotchas:** Both paths appear to need a GitHub repo (third-party). Re-verify by opening cursor.directory in a real browser.

### claude.com (Anthropic Connectors Directory) — portal; paid Claude plan; human-operated
- **Access** (2026-11-07, observed): `claude.com/docs/connectors/building/submission` loaded as first-party docs. The portal itself, claude.ai/directory/manage, was not opened because it is login-walled.
- **How** (first-party claim): Go to the portal, choose **Submit new**, then **MCP connector**. The steps are:
  1. Connection (an `https://` URL)
  2. Tools (auto-synced; flags missing annotations)
  3. Listing (name ≤100, one-liner ≤200, description ≤2,000, 1–5 categories, docs URL, privacy policy URL, support contact, icon, a slug that is permanent)
  4. Use cases
  5. Company
  6. Authentication ("no authentication for public data" is allowed; OAuth 2.0 for user-account tools)
  7. Data handling
  8. Test & launch (reviewer instructions; confirm every tool was run via MCP Inspector or as a custom connector)
  9. Compliance (7 acknowledgments)
  10. Review and submit

  After submission it is scanned automatically and listed as a **Community** connector by default. Some submissions also get a human review, with variable times. Escalations go to `mcp-review@anthropic.com`.
- **Gotchas:** "Any paid Claude plan" is needed to submit. An older support FAQ and some third-party guides conflict on plan and role requirements, so check `claude.com/docs/directory/publish.md`. Remote only: local servers and MCPB bundles are no longer accepted, so a local server has to go in a plugin. You must comply with the Anthropic Software Directory Terms and Policy. Cost: no fee is mentioned.

## Dead ends

- `smithery.ai/docs/build/publish`, `/docs/build/external`, `/docs/build/publish.md` and `/docs/build.md` all returned 404 on 2026-11-07. The docs were likely removed after the Arcade pivot. The Smithery CLI `smithery mcp publish` is deprecated as of 2026-10-31.
- `glama.ai/mcp/servers/add` loaded, but its requirements weren't readable without JS or login. Use registry ingestion plus claim instead.
- PulseMCP /submit is paused, so there's nothing to submit.
- The modelcontextprotocol/servers README "third-party servers" list is retired and takes issues only (third-party, Apideck 2026-10-31). Don't PR it.
- goose (Block) extension directory is closed to new third-party servers, and the advice is to publish to the official registry instead (third-party, Apideck 2026-10-31).
- The support.claude.com "Connectors Directory server review form" was superseded by the claude.ai/directory/manage portal (search snippet, 2026-11-07).
- awesome-mcp-servers (punkpeye) doesn't fit a remote-only server with no repo.
- **Not researched (out of budget):** GitHub MCP Registry (github.com/mcp), VS Code MCP gallery, Docker MCP Catalog, Microsoft MCP Center (Apideck says you comment on a GitHub issue, 1–2 weeks), API Tracker (auto-imports from the registry per Apideck), mcp.directory, Prowl.
- **Blockers hit:** cursor.directory returned HTTP 429. Smithery docs returned 404. The Claude portal and every "claim" flow are login-walled and were not attempted.

## Prep checklist

- [ ] A public HTTPS endpoint speaking **Streamable HTTP**, reachable without a WAF blocking bots. Scanners (registry HTTP auth, Glama health checks, Anthropic sync) fetch from their own infrastructure. Return **401, not 403**, for unauthenticated OAuth calls.
- [ ] Choose a namespace: `io.github.<user>/<server>`, which needs a GitHub account, or `com.<yourdomain>/<server>`, which needs DNS or `.well-known` control. If you're using HTTP auth, serve `/.well-known/mcp-registry-auth` with no redirects and under 4 KB.
- [ ] An Ed25519 keypair (OpenSSL 3.0+) if you're using DNS or HTTP auth. The private key stays with the human.
- [ ] `server.json` with `name`, `title`, `description` ≤100 chars, `version`, and `remotes: [{type: "streamable-http", url}]`. Add `repository` if you have one.
- [ ] Every tool has a `title` plus `readOnlyHint` or `destructiveHint` (Anthropic requirement; good hygiene everywhere).
- [ ] A docs URL, a **privacy policy URL**, a support contact, an icon, and a **400×400 PNG logo** (Cline).
- [ ] A short description (≤100 chars for the registry; ≤200 for the Anthropic one-liner) and a category pick.
- [ ] If you want the listings that require a repo (mcp.so, MCP Market, Cline, awesome-mcp-servers): a public GitHub repo whose README has remote-URL install snippets for common clients.
- [ ] Reviewer or test instructions. For a free no-auth server, state "no authentication; public data".

## Needs a human

- GitHub device-code login (`mcp-publisher login github`), or creating a PAT for an org namespace.
- Adding a DNS TXT record, or holding or using the private key for DNS or HTTP auth.
- Signing in to Glama to claim a listing, and to the Claude portal (paid plan required).
- Opening PRs or issues (awesome lists, Cline) from their GitHub account. An agent may draft them, but the human approves the posting.
- Entering a contact email or company details in forms (mcpservers.org, Anthropic portal), and submitting any form.
- Any paid tier: mcp.so $39, mcpservers.org $39, MCP Market $29, and Glama boost (~$49/month, third-party).
- Accepting the Anthropic Software Directory Terms, the 7 compliance acknowledgments, and the directory ToS of the other sites.

## Changelog
- 2026-11-07 — created (research run, no submissions).
- 2026-11-07 — executed: published `site.tracert/tracert` (remote streamable-http, domain namespace via HTTP proof, `$schema` 2025-12-11) through the raw API in ~22 tool calls. Verify-first #1 held exactly. Added the no-CLI method to the TL;DR.
- 2026-11-10 — verified (routine, partial): 4/5 checks held (official registry still lists remote-only servers with no repo, e.g. `ai.precip/weather`; Smithery's 31 Oct shutdown and Arcade-run directory; Anthropic portal rules and Community auto-listing; mcpservers.org Free $0 / 2 weeks and Premium $39 / 24 h). PulseMCP /submit returned 403 to a plain fetch, so not re-checked. last_verified left at 2026-11-07.
