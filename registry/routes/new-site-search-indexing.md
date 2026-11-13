---
slug: new-site-search-indexing
intent: Get a newly launched website discovered and indexed as fast as possible by Google, Bing and the other web indexes, and by the AI search products that draw on them.
summary: "Google: verify in Search Console, submit a sitemap, request indexing per URL (quota unpublished). Others: one IndexNow POST to api.indexnow.org reaches Bing, Yandex, Seznam, Naver, Yep. ChatGPT search draws on Bing."
task_type: how-to
region: global
tags: index new website, submit site to google, google search console, request indexing, url inspection, sitemap submission, bing webmaster tools, indexnow, api.indexnow.org, yandex webmaster, seznam, naver search advisor, brave search, duckduckgo, chatgpt search, oai-searchbot, perplexitybot, claude-searchbot, robots.txt, get indexed fast, ai search visibility
hosts: developers.google.com, support.google.com, indexnow.org, www.indexnow.org, www.bing.com, yandex.com, platform.openai.com, developers.openai.com, docs.perplexity.ai, support.claude.com, search.brave.com, duckduckgo.com
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 34
---

# How to get a new website indexed fast by Google, Bing and AI search engines (Search Console, Bing Webmaster Tools, IndexNow)

## TL;DR — fastest path
- **Fix crawlability first.** The robots.txt must return 200 or 404, never 5xx. Google stops crawling a site for 12 hours when robots.txt returns 5xx. Pages also need no stray `noindex`, and robots.txt should carry a `Sitemap:` line with an absolute URL. Brave's crawler follows Googlebot's crawl permissions, so blocking Googlebot also blocks Brave (observed 2026-11-07).
- **Google:** verify a **Domain property** through a DNS TXT record (DNS is the only method for a Domain property), then submit the sitemap in the Sitemaps report. Use URL Inspection and then "Request indexing" for the homepage and a few key pages only, because the daily quota exists but Google publishes no number. Google's sitemap "ping" endpoint stopped working after June 2023, and its Indexing API is only for JobPosting and BroadcastEvent pages. Skip both.
- **Everyone else, in one call:** set up IndexNow. Host the `{key}.txt` file at the site root, then POST up to 10,000 URLs to `https://api.indexnow.org/indexnow`. That one call is shared with Bing, Yandex, Seznam, Naver and Yep. As of 2026-11-07, indexnow.org/searchengines.json also lists the Internet Archive and Amazonbot. Google does not take part. Submit only new, changed or deleted URLs (observed 2026-11-07).
- **Bing Webmaster Tools:** add the site by importing it from Google Search Console. This brings over the verified sites and sitemaps (third-party). Bing now treats IndexNow as its main route for submissions, and the old "URL Submission API" page now shows IndexNow content (observed 2026-11-07).
- **AI search:** ChatGPT search may send de-identified queries to **Bing** (first-party claim: OpenAI's help article on ChatGPT search for Enterprise and Edu; OpenAI's launch post says it uses "third-party search providers"), so Bing/IndexNow coverage matters there. It also needs `OAI-SearchBot` allowed. Perplexity needs `PerplexityBot` allowed. Claude needs `Claude-SearchBot` allowed. Claude's search is *reported* to use Brave Search's index (third-party, March 2025). Brave and DuckDuckGo take no IndexNow submissions. DuckDuckGo's links come "largely" from Bing (observed).
- **Needs a human:** every webmaster console (Google, Bing, Yandex, Naver, Seznam) needs a signed-in account plus a DNS or HTML change on the site.

## Verify first
1. **IndexNow participants** — fetch `https://indexnow.org/searchengines.json` — expect 7 entries: Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazonbot (observed 2026-11-07) — if the list differs → re-explore the IndexNow section.
2. **IndexNow response codes and limits** — fetch `https://indexnow.org/documentation` — expect 200, 202, 400, 403, 422 and 429, with up to 10,000 URLs per POST — if not → re-explore the IndexNow section.
3. **Google request-indexing behaviour** — fetch `https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl` — expect the quota to be mentioned with no number, plus "a few days to a few weeks" and a statement that repeat requests don't speed things up — if changed → re-explore the Google section.
4. **AI crawler tokens** — fetch `https://developers.openai.com/api/docs/bots`, `https://docs.perplexity.ai/guides/bots` and `https://support.claude.com/en/articles/8896518` — expect OAI-SearchBot, PerplexityBot and Claude-SearchBot as the search crawlers — if renamed → re-explore the AI search section.
5. **Claude's search provider (unconfirmed)** — check Anthropic's current subprocessor list for "Brave Search" under web search — this run did not open that list; the claim rests on third-party reports from March 2025 — if Brave isn't listed → mark the Brave claim stale in the support.claude.com and search.brave.com sections.

## Domains

### developers.google.com + support.google.com (Google Search Central / Search Console) — essential; slowest and least controllable
- **Access** (2026-11-07, observed): all pages listed below fetched fine without login. Search Console itself needs a Google account (not opened).
- **Verification methods** (observed, support.google.com/webmasters/answer/9008080):
  - URL-prefix properties: HTML file upload, HTML `<meta>` tag in `<head>`, Google Analytics snippet (gtag.js/analytics.js), Google Tag Manager container (needs Publish/Admin), Google Sites/Blogger.
  - **Domain property: DNS record only** (TXT or CNAME). DNS also verifies URL-prefix properties. Some DNS providers can add the record automatically. Records can take "a day or two, sometimes up to three" to appear.
  - The token must stay in place. Google re-checks it periodically, and permissions are lost after a grace period. Don't overwrite another owner's token.
- **Sitemaps** (observed, build-sitemap page):
  - Limit is 50 MB uncompressed or 50,000 URLs per file. Use a sitemap index for more.
  - The file must be UTF-8 and use absolute URLs.
  - Submission routes: the Search Console Sitemaps report, the Search Console API, or a `Sitemap:` line in robots.txt (multiple lines allowed). For feeds, WebSub.
  - A sitemap is "merely a hint". `priority` and `changefreq` are ignored. `lastmod` is used only if it is consistently accurate and reflects significant changes.
- **Sitemap ping is dead** (first-party claim via search snippet of the Search Central blog post of 2023-06-26): the ping endpoint was to stop working about 6 months after the announcement. Calling it "will also not do anything useful".
- **URL Inspection → Request indexing** (observed, answer/9012289 and the ask-google-to-recrawl page):
  - Only owners or full users can request indexing.
  - There is a per-property daily limit on inspections, live tests and index requests. **No number is published.** A commonly repeated figure of about 10 per day was **not** confirmed in this run (third-party folklore; treat as unknown).
  - A page that fails the live test can't be submitted.
  - Requesting the same URL again "won't get it crawled any faster".
  - "Submitting a request does not guarantee" indexing.
- **Time-to-index** (first-party claims, observed): the recrawl page says "Crawling can take anywhere from a few days to a few weeks". The URL Inspection help says it "typically takes only a day or so, but can take much longer", elsewhere "up to a week or two". Third-party SEO blogs (2026-11-07 search) give "a few days to a few weeks", with some saying months for new sites. No formal study was found.
- **Indexing API** (observed, indexing-api quickstart): only for pages with `JobPosting` or a `BroadcastEvent` embedded in a `VideoObject`. Abuse can get access revoked. This is **not** a general fast-index route.
- **robots.txt rules** (observed, robots_txt spec):
  - Google caches robots.txt for up to 24 h. `Cache-Control: max-age` can change this.
  - 4xx (except 429) means no restrictions.
  - **5xx or unreachable means Google stops crawling for the first 12 h.** It then uses the last good copy for 30 days. With no cached copy, it assumes no restrictions.
  - The size limit is 500 KiB.
  - Rules apply per host, protocol and port, so each subdomain needs its own file.
  - A disallowed URL can still be indexed without a snippet. Disallow does not mean noindex.
- **Gotchas:**
  - Don't block a page in robots.txt if you need Google to see its `noindex`.
  - Keep `lastmod` honest.
  - A new Domain property's DNS record can take days. Start this before launch.

### indexnow.org / api.indexnow.org — the single highest-leverage step for non-Google engines
- **Access** (2026-11-07, observed): the documentation, FAQ and searchengines.json pages all fetched fine.
- **Participants** (observed, searchengines.json): Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazonbot. The FAQ page lists Amazon, Bing, Naver, Seznam.cz, Yandex and Yep (no Internet Archive), so the two pages disagree slightly. **Google is not listed.** A third-party source says Google had not adopted it as of April 2026.
- **Sharing** (observed): participating engines agree that submitted URLs "will be automatically shared with all other participating search engines". One call is enough.
- **Protocol** (observed):
  - **Single URL:** GET `https://<engine>/indexnow?url=<url-escaped>&key=<key>`. The `&keyLocation=` parameter is optional.
  - **Bulk:** POST JSON (`Content-Type: application/json; charset=utf-8`) to `https://api.indexnow.org/indexnow` with `host`, `key`, `keyLocation` (optional) and `urlList`. Up to **10,000 URLs per POST**. http and https URLs can be mixed.
  - **Key:** 8–128 characters. The docs say "hexadecimal" but also allow a–z, A–Z, 0–9 and dashes, which is an inconsistency on the page.
  - **Key file, option 1:** a UTF-8 `{key}.txt` file at the site root containing the key.
  - **Key file, option 2:** the file elsewhere on the same host plus `keyLocation`. A key file in a subfolder only covers URLs under that folder.
- **Response codes** (observed):

| Code | Meaning |
|---|---|
| 200 | Submitted |
| 202 | Received, key validation pending |
| 400 | Invalid format |
| 403 | Key not valid or key file missing |
| 422 | URL not on the host, or key doesn't match the schema |
| 429 | Too many requests, potential spam |

  Bing's own get-started page lists the same codes except 202.
- **Rules** (observed, FAQ):
  - Only for new, updated or deleted URLs. Do not dump a whole existing site or backfill. Submit redirected and 404/410 URLs too.
  - Each engine sets its own daily per-site threshold, and none are published. Every submitted URL counts toward the site's crawl quota.
  - No indexing guarantee.
  - Resubmit timing: the FAQ says wait at least 5 minutes between updates in one place and at least 10 minutes in the 429 section. On a 429, honour `Retry-After`.
- **How:** many CMS plugins and CDNs (Cloudflare Crawler Hints is named on Bing's page) do this automatically (first-party claim, observed on bing.com/indexnow/getstarted).

### www.bing.com (Bing Webmaster Tools + IndexNow pages) — do it; also feeds ChatGPT search and DuckDuckGo links
- **Access** (2026-11-07):
  - `bing.com/indexnow` and `bing.com/indexnow/getstarted` were readable (observed).
  - **Blocker:** `bing.com/webmasters/help/...` pages are client-rendered and returned only the page title to a plain fetch. The verification and import details below therefore come from third-party sources.
- **Verification** (third-party and first-party blog snippets): you can import from Google Search Console, which brings over the verified properties, user roles and sitemaps after you grant OAuth access to GSC. Domain Connect, XML file, meta tag and CNAME are also listed. Exact current steps were not seen today.
- **URL submission:**
  - `bing.com/webmasters/url-submission-api` now shows the IndexNow overview, with no URL Submission API content (observed 2026-11-07).
  - Older figures (first-party blog, Jan 2019, via search): up to 10,000 URLs/day per site, adaptive by site age and impressions, 500 per batch. Third-party sources say the quota resets at midnight UTC/GMT and can be lower per site. The remaining quota is shown under "Submit URLs" in the portal.
  - Third-party (2025–26) sources report Bing calls IndexNow "strongly recommended" and says manual or API submission "may be deprecated". Not confirmed on a first-party page today.
- **Sitemap ping:** Bing no longer accepts sitemap pings (third-party, ctrl.blog). Use IndexNow or submit the sitemap in Webmaster Tools.
- **Gotchas:** Bing submissions do nothing for Google. Bing's getstarted page says to use Webmaster Tools to check that IndexNow URLs were received (observed).

### yandex.com (Yandex Webmaster) — only if targeting Russian-speaking markets; IndexNow covers discovery
- **Access** (2026-11-07, observed): the help page was readable.
- **How** (observed): GET or POST to `https://yandex.com/indexnow`. "Yandex checks the key in every API request." The page mentions Yandex Webmaster's Page reindexing tool as an option for small sites, with no quota stated. "This method doesn't guarantee that the sent pages will be indexed."
- **Gotchas:** no per-request maximum or daily limit is stated on this page. Webmaster registration needs a Yandex account (not explored).

### Seznam (search.seznam.cz) and Naver (searchadvisor.naver.com) — reached via IndexNow; register only if targeting Czechia or Korea
- **Access** (2026-11-07): neither site was opened. Their IndexNow endpoints are listed in indexnow.org/searchengines.json (observed). A third-party report (Search Engine Land, 2023) says Naver supports IndexNow.
- **Gotchas:** this run did not research Naver Search Advisor or Seznam webmaster registration steps or quotas.

### developers.openai.com (OpenAI crawlers) — ChatGPT search
- **Access** (2026-11-07, observed): `platform.openai.com/docs/bots` gives a 301 redirect to `developers.openai.com/api/docs/bots`.
- **Rules** (observed):
  - **OAI-SearchBot** controls whether a site appears in ChatGPT search answers. Opted-out sites can still appear as navigational links.
  - **GPTBot** is the training crawler and is independent of search, so blocking it does not affect search.
  - **ChatGPT-User** fetches pages on user request; "robots.txt rules may not apply".
  - **OAI-AdsBot** checks ad landing pages.
  - robots.txt changes take about 24 h to apply.
  - IP lists: `openai.com/searchbot.json`, `gptbot.json`, `chatgpt-user.json`, `adsbot.json`.
- **Index dependency** (first-party claim via search snippets of help.openai.com/articles/10093903, re-checked 2026-11-08): ChatGPT "may share disassociated search queries with the Bing search engine". That article is titled "ChatGPT search for Enterprise and Edu"; equivalent consumer-plan wording wasn't seen. Structured queries can go to Bing or to data providers. Launch-era wording: "leverages third-party search providers" plus partner content. ChatGPT for Healthcare workspaces don't use Bing. **Implication:** Bing indexing plus OAI-SearchBot access are the levers. There is no ChatGPT submission console (none found).

### docs.perplexity.ai — Perplexity
- **Access** (2026-11-07, observed): readable.
- **Rules** (observed):
  - **PerplexityBot** surfaces and links sites in Perplexity search and is not used for model training. Allow it to appear in results.
  - **Perplexity-User** fetches on user request and "generally ignores robots.txt".
  - Changes take up to 24 h.
  - IP lists: `perplexity.ai/perplexitybot.json` and `perplexity-user.json`.
- **Index dependency:** the page does not say whether Perplexity also uses third-party indexes. Treat it as its own crawler, upstream sources unknown. No submission tool found.

### support.claude.com (Anthropic crawlers) — Claude search
- **Access** (2026-11-07, observed): readable. The page says "Updated this week" and mentions an October 30, 2026 change.
- **Rules** (observed):
  - **Claude-SearchBot** crawls to improve search results. Blocking it may reduce visibility and accuracy.
  - **Claude-User** fetches on user request. Blocking it may reduce visibility in user-directed search.
  - **ClaudeBot** is the training crawler.
  - All three honour robots.txt and the non-standard `Crawl-delay`. Blocking by IP "may not work reliably". IP list: `claude.com/crawling/bots.json`.
  - The page adds support for an IETF aipref "no AI training" signal, being rolled out.
- **Index dependency:** the help page does **not** name a search provider (observed). **Third-party (March 2025: TechCrunch, Simon Willison):** Brave Search was added to Anthropic's subprocessor list under web search, and Claude's citations matched Brave results in a test. Not re-verified first-party today. **Implication:** being crawlable by Brave (and so by Googlebot rules) plus allowing Claude-SearchBot are the levers.

### search.brave.com — Brave Search (independent index; also reportedly behind Claude search)
- **Access** (2026-11-07, observed): the help page was readable.
- **Rules** (observed):
  - Brave runs its own crawler with **no distinct user agent**.
  - "If a domain or page is not crawlable by Googlebot, then Brave Search's bot will not crawl it either."
  - robots.txt does not control Brave indexing. Use `noindex`, which Brave must re-fetch the page to see.
  - Discovery is partly powered by the opt-in Web Discovery Project.
  - A **submit-URL tool** exists for re-fetch or delisting requests (not opened). Brave also lists a not-found address for delisting.
- **Gotchas:** Brave does not participate in IndexNow. No time-to-index is stated. Third-party sites describe a "Bravebot" token, but Brave says it doesn't advertise one.

### duckduckgo.com — no direct action needed; covered via Bing
- **Access** (2026-11-07, observed): the help page was readable.
- **Rules** (observed): traditional links and images are "largely" sourced from Bing. DuckDuckGo also runs its own crawler (DuckDuckBot) and indexes. No URL submission is mentioned.

## Dead ends
- **Google sitemap ping** (`google.com/ping?sitemap=`): deprecated in a 2023-06-26 announcement and non-functional afterwards. Calling it does nothing.
- **Bing sitemap ping:** no longer accepted (third-party). Use IndexNow instead.
- **Google Indexing API for ordinary pages:** restricted to JobPosting and BroadcastEvent/VideoObject pages, with spam detection and revocation risk.
- **Repeated "Request indexing" on the same URL:** Google says it won't speed up crawling.
- **IndexNow for Google:** Google is not a participant.
- **Expecting IndexNow to reach Brave or DuckDuckGo:** neither is listed as a participant. DuckDuckGo is reached indirectly via Bing.
- **Bing help pages** (`bing.com/webmasters/help/...`): client-rendered, so a plain fetch returns only the title. Use a real browser (a human, logged out, is fine) or third-party summaries.
- **`bing.com/webmasters/url-submission-api`:** now shows the IndexNow overview, with no legacy API details.
- **Blocking GPTBot or ClaudeBot to "protect" content:** these are the training crawlers and don't control search inclusion. Blocking OAI-SearchBot or Claude-SearchBot is what removes search visibility.

## Prep checklist
- [ ] robots.txt at the root of every host and subdomain, returning 200 (or 404). Never 5xx. Under 500 KiB.
- [ ] robots.txt does not disallow Googlebot (Brave follows Googlebot permissions), OAI-SearchBot, PerplexityBot, Claude-SearchBot or Bingbot.
- [ ] robots.txt includes a `Sitemap: https://example.com/sitemap.xml` line (absolute URL).
- [ ] Sitemap is UTF-8 with absolute canonical URLs, at most 50k URLs or 50 MB per file, and accurate `lastmod`.
- [ ] No leftover `noindex` from staging. Canonical tags point to live URLs. Pages render without login.
- [ ] DNS access for the Google Search Console Domain property TXT record. Leave the record in place.
- [ ] IndexNow key generated (8–128 characters from a–z, A–Z, 0–9, dash) and `{key}.txt` at the root, served as UTF-8.
- [ ] After launch: one POST to api.indexnow.org with the launch URLs, then push only changed or new URLs. Log response codes and back off on 429.
- [ ] If firewalls or bot rules are in use, allowlist the published IP ranges (OpenAI, Perplexity and Anthropic JSON lists) rather than user agents alone.

## Needs a human
- Signing in to and verifying ownership in Google Search Console, Bing Webmaster Tools (including the OAuth grant for GSC import), Yandex Webmaster, Naver Search Advisor and Seznam. All need an account.
- Adding DNS TXT/CNAME records at the registrar, or uploading verification files or meta tags.
- Clicking "Request indexing" in URL Inspection (an interactive, quota-limited UI action).
- Using Brave's submit-URL tool. Whether it needs only a form or more was not checked.
- Raising a Bing quota-increase support ticket, if needed.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-08 — reviewed (independent): re-confirmed the 7 IndexNow participants; scoped the ChatGPT-uses-Bing claim to OpenAI's Enterprise/Edu help article plus the launch post's "third-party search providers", and softened the summary to match; added an "if not" pointer to Verify-first step 5.
- 2026-11-13 — verification (routine): 4/5 checks held (IndexNow's 7 participants unchanged; response codes 200/202/400/403/422/429 and 10,000 URLs per POST; Google: quota with no number, "a few days to a few weeks", repeat requests don't speed things up; OAI-SearchBot, PerplexityBot and Claude-SearchBot unchanged, the Perplexity bots page now at docs.perplexity.ai/docs/resources/perplexity-crawlers). Check 5 inconclusive again: trust.anthropic.com/subprocessors renders by script, so a plain fetch shows no list, and the Brave claim stays third-party and unverified. last_verified left at 2026-11-07.
