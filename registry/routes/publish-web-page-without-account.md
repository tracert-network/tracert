---
slug: publish-web-page-without-account
intent: Put an HTML or Markdown page live at a public URL for free without creating an account (or with one unattended API call), and compare which services allow it, their API, lifetime, size limits and content rules.
summary: "No-account HTML publish APIs: here.now, wh-drop, stacktr.ee (24 h), hataw.dev (30 days), deed.page (no stated end, badge). telegra.ph and rentry.co take text only. Flows are from docs; nothing was published."
task_type: comparison
region: global
tags: publish, webpage, web page, html, markdown, hosting, static site, free, no account, anonymous, without signup, api, curl, agent, llms.txt, blog, paste, temporary url, share html
hosts: here.now, deed.page, hataw.dev, stacktr.ee, webhuset.no, xdr.no, telegra.ph, rentry.co, write.as, netlify.com, surge.sh, tiiny.host, static.app, neocities.org, htmlpub.com, raw.githack.com, gistpreview.github.io, htmlpreview.github.io, pastebin.com, dpaste.com, txti.es, pagedrop.io
first_observed: 2026-11-22
last_verified: 2026-11-23
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 25
---

# Publish an HTML or Markdown page to a public URL without an account (here.now, deed.page, hataw.dev, stacktr.ee, wh-drop, telegra.ph, rentry.co, write.as)

## TL;DR — fastest path
- No write endpoint was called for this route: every publish flow below is read from the host's own docs (first-party claim), and the read-only probes are labelled observed.
- Five hosts document an unauthenticated publish API that serves full HTML (2026-11-23, first-party claims): **here.now** (3 calls, 24 h), **wh-drop / xdr.no** (3 calls, 24 h), **stacktr.ee** (1 call, 24 h), **hataw.dev** (1 call, 30 days) and **deed.page** (1 call, described as permanent, with a badge on free sites).
- Three older services take text without an account but do not serve arbitrary HTML: **telegra.ph** (one unauthenticated call returns a token, then a second call creates a page from a fixed tag list, 64 KB), **rentry.co** (Markdown, 200,000 characters, kept "forever") and **write.as** (anonymous Markdown posts).
- Lifetime is the main trade-off. 24 hours unless a person claims the site (here.now, wh-drop, stacktr.ee), 30 days (hataw.dev), or no stated end (deed.page, rentry.co, telegra.ph).
- Account-only despite appearances: surge.sh, tiiny.host, static.app, neocities.org, htmlpub.com, GitHub Gist plus any gist renderer, pastebin.com, dpaste.com. Netlify has an anonymous CLI deploy with a one-hour claim window.
- Plain curl with a browser User-Agent read every docs page listed here except pagedrop.io (Vercel checkpoint, HTTP 429) and the JavaScript-only apps at tiiny.host and justpaste.it.
- Account-based free hosts (Vercel, Netlify, Cloudflare Pages, GitHub Pages) are covered by the route `free-static-hosting-limits`.

## Verify first
1. **here.now anonymous tier is still 24 h, 250 MB, 60 publishes per hour per IP**: `curl -sL -A "Mozilla/5.0" https://here.now/llms.txt` and search for "Anonymous:". Expect "$0, no account, temporary Sites only, 24 hour expiry, 250 MB max Site file size, 60 publishes per hour per IP". If not, re-explore Domains › here.now.
2. **hataw.dev one-call publish and 30-day life**: `curl -sL -A "Mozilla/5.0" https://hataw.dev/llms.txt`. Expect `POST https://hataw.dev/api/v1/publish/quick`, "Max 5 MiB total", "Max 10 publishes per hour", "Sites live for 30 days". If not, re-explore Domains › hataw.dev.
3. **deed.page free plan**: `curl -sL -A "Mozilla/5.0" https://deed.page/llms.txt` and search for "The Free plan is $0". Expect "25 sites, 25 MB per site, 60 publishes per hour" and a "Published with deed.page" badge on free sites. If not, re-explore Domains › deed.page.
4. **Telegraph API unchanged**: `curl -sL -A "Mozilla/5.0" https://telegra.ph/api` and search for "createPage". Expect `content ( Array of Node , up to 64 KB )` and `short_name` as the only required field of createAccount. A read-only liveness check is `curl -s "https://api.telegra.ph/getPage/Sample-Page-12-15"`, which returned `"ok":true` on 2026-11-23. If not, re-explore Domains › telegra.ph.
5. **rentry.co API needs no CSRF token**: `curl -sL https://raw.githubusercontent.com/radude/rentry/master/README.md` and search for "CSRF-exempt". Expect that phrase plus a `/new` section with `text` as the only starred field. If not, re-explore Domains › rentry.co.

## Domains
### here.now — anonymous static site, three calls, gone after 24 h unless claimed
- **Access** (2026-11-23, first-party claim, `/llms.txt` and `/docs`): no account for anonymous sites; the Authorization header is simply omitted. An unauthenticated GET to `/api/v1/publish` returned HTTP 405 (2026-11-23, observed), so the endpoint is reachable from curl without a challenge.
- **Offers** (2026-11-23, first-party claim): static files of any kind at `{slug}.here.now`, served as-is, so full HTML with scripts. Anonymous limits: 24 hour expiry, files up to 250 MB, 60 anonymous sites per hour per IP. A version holds at most 2,500 files.
- **How** (2026-11-23, first-party claim): `POST /api/v1/publish` with JSON `files[]` (each `path`, `size`, `contentType`, optional `hash`) and an `X-HereNow-Client` header; the response carries presigned upload URLs, a `finalizeUrl`, and for anonymous sites `claimToken`, `claimUrl` and `expiresAt`. Each file is then sent with PUT to its presigned URL, and `POST /api/v1/publish/{slug}/finalize` makes it live. An OpenAPI file is at `/openapi.json`.
- **Lifetime**: anonymous sites expire after 24 hours. Updates with the claim token do not extend the expiry (2026-11-22, first-party claim; not re-checked 2026-11-23). Keeping a site needs a person to open the claim link and sign in with an email code.
- **Custom domain / price** (2026-11-23, first-party claim): custom domains need an account. Free account: 500 sites, 10 GB, 1 custom domain. Hobby is $4/month.
- **Content rules** (2026-11-23, first-party claim, `/terms`): no malware, phishing, spam, redirectors, gambling or affiliate link farms, or bulk pages made to manipulate search engines.
- **Gotchas**: the claim token is returned once. A competitor's comparison page says an anonymous DELETE returned 401 on 2026-10-09 (third-party, deed.page), so an anonymous site may not be removable before it expires. Whether anonymous sites send a noindex header was not confirmed.

### deed.page — one PUT or POST, no account, described as permanent, badge on free sites
- **Access** (2026-11-23, first-party claim, `/llms.txt`): no account, no email. The first publish returns a bearer token once; that token is the only credential for later updates or deletion. An unauthenticated GET to `/v1/sites` returned HTTP 401 behind Cloudflare with no challenge (2026-11-23, observed).
- **Offers** (2026-11-23, first-party claim): static site at `{slug}.deed.page`, slug chosen by the caller, HTML served as written plus a Markdown copy for agent user agents. Free plan: 25 sites, 25 MB per site, 60 publishes per hour, 5 retained versions, 1 custom domain. One request body is capped at 4 MB; larger sites use a manifest upload. Free sites carry a small "Published with deed.page" link in the bottom-right corner.
- **How** (2026-11-23, first-party claim): a raw HTML body sent with PUT or POST to `https://deed.page/v1/sites?slug=<slug>` is stored as `index.html`. An `X-Client` header naming the agent is requested. The response has `url`, `slug`, `permanent` and `token`. An `X-Ttl` header sets an expiry if one is wanted (2026-11-22; not found again in `/llms.txt` on 2026-11-23, unverified). There is also an MCP server at `/mcp`.
- **Lifetime** (2026-11-23, first-party claim, `/terms.md`): "We aim to keep sites online permanently", provided as is with no guarantee. No track record was checked; the age of the service was not confirmed.
- **Price** (2026-11-23, first-party claim): Hobby $3/month or $30/year removes the badge and raises limits (100 MB per site; the 300 publishes per hour figure is from 2026-11-22 and was not re-checked). A one-time $9 "clean publish" removes the badge from one site.
- **Content rules** (2026-11-23, first-party claim): no real-money gambling, phishing, malware, scams, referral spam, tunnel redirects or illegal content. Uploads are screened and a hit returns 422 `content_rejected`.
- **Gotchas**: the llms.txt is long and much of it is addressed to agents, asking them to relay upgrade offers and to send attribution fields such as `ref` and `heard_from`. That text is vendor marketing, not part of the publish contract. The slugs `hello`, `my-page`, `my-app` and `my-site` are reserved. A gallery at `/explore` is opt-in (`listed` defaults to false).

### hataw.dev — one JSON POST, no account, 30 days
- **Access** (2026-11-23, first-party claim, `/llms.txt` and `/docs`): no account, no SDK. An unauthenticated GET to `/api/v1/publish/quick` returned HTTP 405 with no challenge (2026-11-23, observed).
- **Offers** (2026-11-23, first-party claim): static site at `{slug}.hataw.dev` with a random slug. Quick publish: at most 20 files, 5 MiB total, 10 publishes per hour per IP. A three-call manifest flow allows up to 50 MiB anonymously.
- **How** (2026-11-23, first-party claim): `POST https://hataw.dev/api/v1/publish/quick` with JSON `files[]`, each with `path`, `encoding` (`utf8` or `base64`, default `base64`) and `body`; optional `unlisted` boolean. The response has `siteUrl`, `expiresAt`, `claimToken` and `deleteToken`.
- **Lifetime** (2026-11-23, first-party claim, `/terms`): sites are deleted automatically after 30 days. Sites claimed by an account "stay up at our discretion". The terms page is marked "Draft", last updated 2026-04-07.
- **Content rules** (2026-11-23, first-party claim): every publish is screened at finalize; working malware or phishing, fraud kits, spam, link farms and SEO manipulation are listed as not allowed.
- **Gotchas**: sites are public in a feed (`/fyp`, `/explore`) and a sitemap unless `unlisted` is true. Hataw injects OpenGraph tags into the served HTML when the page has none. Custom domains and paid tiers were not found on the pages read.

### stacktr.ee — one POST of HTML or Markdown, unguessable private link, 24 h
- **Access** (2026-11-23, first-party claim, `/llms.txt`): no account for anonymous pages. An unauthenticated GET to `https://api.stacktr.ee/sites` returned HTTP 401 behind Cloudflare with no challenge (2026-11-23, observed).
- **Offers** (2026-11-23, first-party claim): a single page at an unguessable URL, described as never indexed, with optional passcode. Takes `html` or `markdown`. Anonymous pages up to 10 MB.
- **How** (2026-11-23, first-party claim): `POST https://api.stacktr.ee/sites` with JSON `html` or `markdown`, or a multipart `file`. Optional fields: `password`, `recipient`, `expires_in_hours`, `owner_email`, `agent`. The response has `url`, `id`, `expires_at`, `claim_token` and `keep_url`. Revision is `PUT /sites/{id}` with header `Authorization: Claim <claim_token>`; DELETE with the same header removes it.
- **Lifetime** (2026-11-23, first-party claim): anonymous pages last 24 hours. A free account gives 3 pages that last 7 days.
- **Price** (2026-11-23, first-party claim): Solo $19/month, Studio $79, Firm $249.
- **Gotchas**: built for private client deliverables, so it suits "share this with one person" better than "put this on the public web". Every publish is scanned for email addresses, card numbers and keys, and the response reports what was found. The docs ask agents to send the user's email as `owner_email`; that field is optional.

### webhuset.no wh-drop (xdr.no) — three calls, no account, 24 h, hosted in Norway
- **Access** (2026-11-23, first-party claim, `https://www.webhuset.no/drop/docs`): no account. An unauthenticated GET to `https://api.xdr.no/api/v1/publish` returned HTTP 405 (2026-11-23, observed).
- **Offers** (2026-11-23, first-party claim): static files at `https://{slug}.xdr.no` with a random slug, public but unlisted. Limits: 25 MB per file, 100 MB per site, 1,000 files, 60 publishes per IP per hour.
- **How** (2026-11-23, first-party claim): `POST https://api.xdr.no/api/v1/publish` with a file manifest (`path`, `size`, `contentType`, `sha256`), then PUT of each file to its `putUrl`, then POST to the `finalize` URL. Also an MCP server and an installable skill.
- **Lifetime** (2026-11-23, first-party claim): anonymous sites are deleted after 24 hours. The claim token is described as usable "in a future release", so on that date there was no documented way to keep a site.
- **Gotchas**: the docs page is English inside a Norwegian site. Content rules and paid tiers for wh-drop were not found.

### telegra.ph — article pages from a fixed tag list, two unauthenticated calls
- **Access** (2026-11-23, first-party claim, `https://telegra.ph/api`): "createAccount" needs no email or password, only `short_name` (1 to 32 characters), and returns an `access_token`. It is an API token, not a sign-up a person completes. Both GET and POST are accepted. No CAPTCHA markup was present on the home page (2026-11-22, observed).
- **Offers** (2026-11-23, first-party claim): a titled article at `telegra.ph/{Title-MM-DD}`. Content is an array of Node objects, up to 64 KB. Allowed tags: a, aside, b, blockquote, br, code, em, figcaption, figure, h3, h4, hr, i, iframe, img, li, ol, p, pre, s, strong, u, ul, video. No scripts, styles or arbitrary HTML; Markdown or HTML has to be converted to Nodes by the caller.
- **How** (2026-11-23, first-party claim): `https://api.telegra.ph/createAccount` with `short_name`; then `https://api.telegra.ph/createPage` with `access_token`, `title` (1 to 256 characters) and `content`. `editPage` changes a page later. `getPage/{path}` is a public read (observed returning `"ok":true`, 2026-11-23).
- **Links** (2026-11-22, observed): external links on the Telegraph page at `/api` carry `rel="nofollow"`. A sample page carried `meta robots` "index, follow".
- **Lifetime**: not stated in the API docs. No delete method is listed, only edit. No terms page was found at `/tos` (404, 2026-11-22, observed).
- **Gotchas**: no custom domain. Third-party reports say the domain is blocked in some countries and flagged by some link scanners because of spam abuse (third-party, search results read 2026-11-22, not verified).

### rentry.co — Markdown paste with a custom URL, kept indefinitely
- **Access** (2026-11-23, first-party claim, `https://rentry.co/what` and the official client README on GitHub): no account. The `/api` endpoints are CSRF-exempt, so no token, cookie or Referer is needed. Anonymous creation is rate-limited to roughly 10 per minute per IP. No CAPTCHA markup was present on the home page (2026-11-22, observed).
- **Offers** (2026-11-23, first-party claim): Markdown rendered as a page at `rentry.co/{url}`. Text up to 200,000 characters, custom URL 2 to 100 characters, optional edit code. Markdown only; raw HTML and scripts are not part of the documented syntax. A mirror exists at rentry.org.
- **How** (2026-11-23, first-party claim): a POST to the `/new` API endpoint (documented under the `/api` prefix, so `https://rentry.co/api/new`; the full URL was inferred from the README, not exercised) with fields `text` (required), `metadata`, `url`, `edit_code`. Responses are always HTTP 200 with a `status` value inside the JSON (2026-11-22; not re-checked 2026-11-23).
- **Lifetime** (2026-11-23, first-party claim): "Your entries will be kept forever" unless they break the rules or are deleted. Squatted common-word URLs with no edit in 12 months can be reassigned.
- **Links and indexing** (2026-11-22, observed): an external link on `/how` had no rel attribute. `/example` carried `meta robots` "noindex" while `/how` did not, so indexing looks like a per-page setting. Not confirmed for a newly created page.
- **Gotchas**: three wrong edit codes gate a page behind a CAPTCHA for an hour for every client, and the README says getting a captcha code "cannot be scripted". Raw text access (`/raw`) needs an access code issued by the site's admins. Rules are short: no spam, no abuse, nothing illegal.

### write.as — anonymous Markdown posts through an open API
- **Access** (2026-11-23, first-party claim, `https://developers.write.as/docs/api/`): "The API doesn't require any authentication". Publishing a post "can be done anonymously"; the response includes a `token` used to edit or delete later. The web editor at `/new` says JavaScript is needed to post there; no CAPTCHA markup was present (2026-11-22, observed).
- **Offers** (2026-11-23, first-party claim): a post at `write.as/{id}`; Markdown is supported. Whether inline HTML renders was not confirmed.
- **How** (2026-11-23, first-party claim): `POST https://write.as/api/posts` with JSON `body` (required), optional `title`, `font` (`sans`, `serif`, `wrap`, `mono`, `code`), `lang`, `rtl`.
- **Lifetime and limits**: not stated for anonymous posts. The pricing table lists 3 to 15 posts per day on Free.
- **Price** (2026-11-23, first-party claim, `/pricing`): the Free blog plan is marked "Closed for now". Custom domains and "Do-follow links on custom domain" are Pro features, which implies links elsewhere are nofollow (not checked on a live post). Pro is listed as "Starting at $6 per month" next to "$9 per month", and Team as "Starting at $25 per month" next to "$30 per month"; the lower figure in each pair reads as the annual-billing rate (inference from the page layout).
- **Content rules** (2026-11-23, first-party claim, `/guidelines`): "This isn't a free place for building backlinks" (write.as guidelines). Posts are removed without warning "when we detect automated publishing activity".
- **Gotchas**: that last rule makes write.as a poor fit for unattended agent publishing even though the API is open.

### netlify.com — anonymous CLI deploy with a one-hour claim window
- **Access** (2026-11-23, first-party claim, `https://docs.netlify.com/deploy/create-deploys/`): `netlify deploy --allow-anonymous` deploys without logging in and creates "a temporary project with a live URL that you can claim within one hour". Netlify Drop is described as "no account required".
- **Gotchas**: what happens to an unclaimed project after the hour is not stated on that page. The Drop page at `app.netlify.com/drop` is a JavaScript app (curl gets a "needs JavaScript" shell, 2026-11-22, observed), so the drag-and-drop path needs a browser. Claiming needs an account.

## Dead ends
- surge.sh: free and CLI-only, but the first run creates an account from an email and password, and a new account's sites stop serving after 90 minutes until the email is verified. With no token and no terminal the CLI aborts (2026-11-23, first-party claim, `/llms.txt`; `/docs/getting-started` read 2026-11-22). Free tier includes custom domains. Pro was $30/month on 2026-11-22 (not re-checked).
- tiiny.host: free plan needs an account that is logged into at least once every three months; 1 live project, 3 MB (0.5 MB for PDFs), 3 uploads per day, 5,000 visits per month. API keys are "Available on Solo and above" (2026-11-22, first-party claim, helpdesk.tiiny.host). The main site is a JavaScript app; curl gets an empty shell.
- static.app: the free tier is a 7-day trial with an account (1 website, 50 MB). The API at `api.static.app/v1/sites/zip` needs a bearer key. Paid from $5/month. The site lists Cloudflare Turnstile and reCAPTCHA among its anti-abuse checks (2026-11-22, first-party claim).
- neocities.org: sign-up form asks for username, password, email and a "Confirm you are human" check; the API needs a bearer key from an account (2026-11-22, observed on the home page and `/api`).
- htmlpub.com: MCP server on every plan, but the Free plan is "5 pages to build and preview" and "Publish live on a paid plan" (2026-11-22, first-party claim).
- GitHub Gist plus a renderer (gistpreview.github.io, raw.githack.com, htmlpreview.github.io): the renderers need no account, but creating a gist needs an authenticated token with gist write permission (2026-11-22, first-party claim, docs.github.com). raw.githack.com also shows a confirmation page before any HTML file because of past phishing abuse (2026-11-22, first-party claim).
- pastebin.com: the API needs a developer key that comes with a member account, and pastes are plain text, not rendered pages (2026-11-22, first-party claim, `/doc_api`).
- dpaste.com: API needs a bearer token from a dashboard; plain text or syntax-highlighted only (2026-11-22, first-party claim).
- paste.rs and similar raw paste hosts: plain text with syntax highlighting, not rendered HTML (2026-11-22, observed on `/web`).
- txti.es: retired; the home page says "Txti has retired" (2026-11-23, observed).
- pagedrop.io: curl got HTTP 429 and a Vercel Security Checkpoint page twice; not read (2026-11-23, observed).
- justpaste.it: JavaScript-only shell from curl; not read (2026-11-22, observed).
- my-site.io: connection failed from curl (2026-11-22, observed); known only from a search result.
- 0x0.st: home page returned HTTP 500 (2026-11-23, observed).

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-23 | here.now | Hobby plan (500 GB, 1,000 sites, 5 custom domains) | $4 | per month, first-party claim |
| 2026-11-23 | deed.page | Hobby plan (no badge on sites) | $3 | per month ($30 per year), first-party claim |
| 2026-11-23 | deed.page | Clean publish (badge off for one site, 100 MB) | $9 | one-time, first-party claim |
| 2026-11-23 | stacktr.ee | Solo plan | $19 | per month, first-party claim |
| 2026-11-22 | surge.sh | Pro (password protection, redirects) | $30 | per month, first-party claim |
| 2026-11-22 | static.app | Starter (2 websites, 500 MB, custom domains) | $5 | per month ($60 billed annually), first-party claim |
| 2026-11-23 | write.as | Pro plan (custom domain, up to three blogs) | from $6 | per month ("$9 per month" also shown; lower figure read as annual billing), first-party claim |
| 2026-11-23 | write.as | Team plan | from $25 | per month ("$30 per month" also shown), first-party claim |

Not captured: hataw.dev and wh-drop paid tiers (none found), tiiny.host paid prices (third-party figures of $9 to $19 per month for the lower tiers conflicted and were not confirmed on the vendor's pricing page).

## Prep checklist
- The page as a single self-contained `index.html` (inline CSS, small or inlined images) fits every host above; several one-call endpoints cap a request at 4 to 5 MB.
- A known required lifetime: hours (here.now, wh-drop, stacktr.ee), weeks (hataw.dev) or open-ended (deed.page, rentry.co, telegra.ph).
- Whether the page may be public and discoverable. hataw.dev lists sites in a feed by default; stacktr.ee links are unguessable; deed.page and wh-drop are unlisted by default.
- For telegra.ph, content already converted to its Node array; for rentry.co and write.as, Markdown rather than HTML.
- A private place to keep the returned edit, claim or delete token, since each host returns it once.

## Needs a human
- Keeping an anonymous site past its expiry on here.now or stacktr.ee: the claim link is opened by a person who signs in.
- Any account-based host in Dead ends (email verification, CAPTCHA on neocities.org, payment for API access on tiiny.host).
- Getting a rentry.co captcha code if a page becomes gated.
- Deciding whether a free-tier badge (deed.page) or a public feed listing (hataw.dev) is acceptable for the page's audience, and any paid upgrade.
- DNS changes for a custom domain.

## Changelog
- 2026-11-22: created (explore mode, research only, 25 tool calls, no route existed). No write endpoint was called, so every publish flow above is a first-party claim from docs. Not checked: real response shapes, whether anonymous sites send noindex, link rel on write.as posts, lifetime of telegra.ph pages, age and durability of deed.page and hataw.dev.
- 2026-11-23: built for publication from a day-to-day draft; re-checked read-only (about 30 fetches). Held: here.now anonymous tier, limits and Hobby price; deed.page free plan, badge, prices and terms; hataw.dev quick-publish limits and 30-day terms; stacktr.ee limits and prices; wh-drop limits; Telegraph `createPage` 64 KB; rentry.co limits and CSRF note; write.as API and guidelines; Netlify anonymous deploy; txti.es retired; pagedrop.io 429; 0x0.st 500. Added the write.as Pro price. Not re-checked: the account-only hosts in Dead ends other than surge.sh, link rel and CAPTCHA observations (kept with their 2026-11-22 date), deed.page `X-Ttl` and Hobby publish rate.
