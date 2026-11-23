---
slug: tool-newsletters-free-submission
intent: Find newsletters and editorial roundups that accept free submissions of a new software or AI tool, with each one's submission path, required fields, account need, selection criteria, paid alternative and bot blocking.
summary: "Big AI dailies (TLDR, The Rundown, Superhuman AI) publish no free pitch path, only ads. Free and written down: Console (email), PyCoder's (Google Form), Web Tools Weekly (DM), Changelog News (sign-in), Sidebar."
task_type: research
region: global
tags: newsletter, newsletters, roundup, editorial, submit, submission, free, tool, ai tool, dev tool, launch, feature, sponsor, classified, console, changelog, pycoders, tldr, rundown, superhuman, uneed, launch llama
hosts: console.dev, changelog.com, pycoders.com, webtoolsweekly.com, techproductivity.co, launchllama.co, tools.launchllama.co, uneed.best, selfh.st, sidebar.io, cooperpress.com, therundown.ai, futuretools.io, tldr.tech, advertise.tldr.tech, superhuman.ai, newsletter.theresanaiforthat.com, producthunt.com, indiehackers.com, hackernewsletter.com, bensbites.com, theaireport.ai, betalist.com, densediscovery.com, refind.com, recomendo.com
first_observed: 2026-11-22
last_verified: 2026-11-23
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 25
---

# Newsletters that accept free submissions of a new software or AI tool (Console, PyCoder's Weekly, Changelog News, Web Tools Weekly, Uneed, Launch Llama) and the ones that are ads-only (TLDR, The Rundown, Superhuman AI)

## TL;DR — fastest path
- The big AI dailies (TLDR, The Rundown, Superhuman AI, There's An AI For That, The AI Report, The Neuron, Ben's Bites) publish **no free submission path for the newsletter itself** (observed 2026-11-22; TLDR, The Rundown, Superhuman AI, The AI Report and Ben's Bites re-read 2026-11-23). Their only published route in is advertising, mostly "book a call" with no price list.
- Free paths that are actually written down sit with smaller, specialist newsletters: **Console** (dev tools, by email, published criteria), **PyCoder's Weekly** (Google Form, no account), **Web Tools Weekly / Tech Productivity** (DM to the curator), **Changelog News** (form behind sign-in, commercial products excluded), **selfh.st** (self-hosted software, form), **Sidebar** (design links, login).
- Two newsletters fill slots from their own launch board rather than from pitches: **Uneed Weekly** (top 3 launches of the week plus 2 team picks) and **Launch Llama** (free feature in exchange for a badge on the product site, or "considered" after a free directory listing).
- Product Hunt's and Indie Hackers' newsletters and Hacker Newsletter are fed by what does well on their community sites; none has a separate newsletter submission form (observed / first-party 2026-11-22; Hacker Newsletter re-read 2026-11-23).
- curl with a browser User-Agent reads most of these. Cloudflare challenge (403 to curl and to WebFetch) on producthunt.com, indiehackers.com, newsletter.theresanaiforthat.com and advertise.tldr.tech; the 403s were seen again on 2026-11-23. A real browser loaded the last three without a CAPTCHA on 2026-11-22 (not repeated).
- Nothing was submitted for this route and no account was made. Tool directories are a separate task; see the route `free-ai-tool-directories`.

## Verify first
1. **Console takes tool suggestions by email and publishes its criteria**: `curl -sL -A "Mozilla/5.0" https://console.dev/selection-criteria`. Expect a "Submit a tool" heading with the hello@ address and the question list ("Is the primary user a developer?", "Is there a self-service signup?"). If not, re-explore Domains › console.dev.
2. **PyCoder's Weekly link form is an open Google Form**: `curl -sL -A "Mozilla/5.0" https://pycoders.com/submissions`. Expect "Submit Your Link" pointing at docs.google.com/forms. If not, re-explore Domains › pycoders.com.
3. **Changelog News excludes commercial products from free submissions**: `curl -sL -A "Mozilla/5.0" https://changelog.com/news/submit`. Expect "Please sign in / up to submit news" and "Commercial products/services. Sponsorship is your path." If not, re-explore Domains › changelog.com.
4. **The Rundown's free path is the directory, not the newsletter**: `curl -sL -A "Mozilla/5.0" https://www.therundown.ai/submit`. Expect "Recommend a Tool" by email for Supertools and "Newsletter Feature" pointing at Advertise. If a newsletter form appears, re-explore Domains › therundown.ai.
5. **Launch Llama's free newsletter feature needs a badge**: `curl -sL -A "Mozilla/5.0" https://launchllama.co/get-featured-for-free`. Expect "Get the badge code & add it to your website" and "feature you in 48 hours". If not, re-explore Domains › launchllama.co.

## Domains

### console.dev — free, by email, published selection criteria (developer tools only)
- **Access** (2026-11-23, observed): no account, no form, no CAPTCHA. curl works. Site also exposes `/llms.txt` and an API/MCP link in the footer (not explored).
- **Offers** (2026-11-23, first-party claim): weekly Thursday email, "30k+ subscribers". Reviews 2-3 developer tools per issue plus a list of beta releases.
- **How**: `/selection-criteria` ends with "Submit a tool" and asks for the details by email to the hello@ address shown there. `/about` says tools are found through reader suggestions, release announcements and communities. No required fields and no review time are stated.
- **Criteria** (first-party): primary user is a developer; self-service signup without talking to sales; fits the development cycle; power-user features (API/CLI, keyboard shortcuts, dark mode); quality, docs, maintenance, security/privacy. Betas section: pre-1.0 or labelled beta/preview only; GA releases are not eligible.
- **Paid alternative** (2026-11-23, observed `/advertise`): two text ad slots per issue (main ad, contents-only ad), enquiries to an advertise@ address. No price published. States "We don't accept payment for reviews" and that advertisers must also meet the selection criteria.

### pycoders.com — free Google Form, no account (Python only)
- **Access** (2026-11-23, observed): `/submissions` links to a Google Form. The first page of the form was fetched on 2026-11-22 (not re-opened 2026-11-23); Google sign-in is offered ("to save your progress") but not required on page 1. The form has a "Next" button; later pages were not seen.
- **How**: page-1 fields are URL (required, "No paywalled links"), Author (optional), Title / Headline (required), Description / Summary (required, 2-3 sentences that may be used in the newsletter). For a coding project the form says the description is not used, so the title has to carry what the project does.
- **Criteria** (first-party): "we cannot guarantee to feature every submitted link". No review time stated. The form sends advertising and job posts elsewhere.
- **Paid alternative**: `/advertise` exists; no price or audience number found on it by curl (2026-11-22, not re-checked). Audience size not confirmed.

### webtoolsweekly.com and techproductivity.co — free, by direct message to the curator
- **Access** (2026-11-23, observed): no form and no email path. `/submit` on both sites (techproductivity.co read 2026-11-22 only) says to suggest a tool via DM on X (open Mondays and Tuesdays) or chat on Bluesky; the handles are on the page. Needs a social account and a human sender.
- **Offers** (2026-11-23, first-party claim, `/sponsor`): Web Tools Weekly goes out Thursdays, 15,949 subscribers (15,947 on 2026-11-22), 31.0% average open rate. Tech Productivity is the same curator's second newsletter and takes productivity tools; its audience size was not checked.
- **Criteria** (first-party): libraries, frameworks, plugins, web/desktop/mobile apps, APIs, editors. "Please don't submit articles or tutorials."
- **Paid alternative** (2026-11-23, observed): see Observed prices. The cheapest slot is a $15 classified in a "Commercial Apps" section, which suggests commercial products often run as paid listings (inference from the section name, not a stated rule).

### changelog.com (Changelog News) — free form behind sign-in, commercial products excluded
- **Access** (2026-11-23, observed): `/news/submit` shows the form fields but says "Please sign in / up to submit news. Your profile is used for attribution and notification." curl works.
- **How**: fields are URL (required), Title (required), "What's interesting about it?" (Markdown). Submitting your own work is explicitly allowed. Notification by email "if and when" published; no review time.
- **Criteria** (first-party): not wanted: how-tos and tutorials, "Commercial products/services. Sponsorship is your path", reader-hostile sites. Realistic free fit is an open-source project.
- **Paid alternative** (2026-11-23, first-party `/sponsor/pricing`): Changelog News podcast + newsletter, one brand per week, $1,500 per week, no minimum; newsletter "22,000+ subscribers with a 51.35% open rate".

### launchllama.co — free newsletter feature in exchange for a badge; free directory listing is slower
- **Access** (2026-11-23, observed): curl works on both hosts. `tools.launchllama.co/submit` states an account is required ("Sign in (or create a free account) to submit a tool"); free accounts get 1 listing.
- **How, path A** (first-party claim, `/get-featured-for-free`): place an "As seen on Launch Llama" badge on the product site, submit details via a form, "We verify & feature you in 48 hours". The form itself was not opened.
- **How, path B** (first-party claim, `tools.launchllama.co/submit`): free directory listing, "typically reviewed in about 4 weeks", then "Considered for a free weekly newsletter feature". Paid Featured plans go live instantly; prices are on `/pricing` (not opened).
- **Offers**: weekly Tuesday newsletter for founders, AI and dev tools. Audience is a first-party claim that differs by page (2026-11-23): "55k+" and "55,000+" in the feature page body, "69K+" in the feature page title, "69,000+" on the directory submit page. A homepage card said "45,000+ founders" on 2026-11-22 (homepage not re-read).
- **Gotchas**: the newsletter and the directory are the same operator, so this is close to a directory with a mailing list. `/advertise` returned 404 to curl.

### uneed.best (Uneed Weekly) — no pitch form; slots come from the launch leaderboard
- **Access** (2026-11-23, observed): curl works. No newsletter submission form.
- **Offers** (2026-11-23, first-party claim, `/newsletter` and `/launch-guide`): Monday email, "30,000+ subscribers", containing "the top 3 launches of the week, two picks from our team". The free way in is to launch on Uneed and place in the weekly top 3 or be picked.
- **Free launch terms**: not re-checked in this run. The `free-ai-tool-directories` route recorded a free waiting line of at least 50 days and an account needed to save (2026-11-07).
- **Paid alternative** (2026-11-23, observed `/newsletter-sponsoring`): one sponsor per issue, $249 per issue, 10% off for 2 issues and 20% off for 3, self-serve booking behind login; 40% average open rate (first-party claim).

### selfh.st — free project submission form (self-hosted software only)
- **Access** (2026-11-23, observed for `/submit/`; `/contact/` read 2026-11-22): curl works for pages. `/contact/` says a button leads to "my submission form, where you can share the details of your project"; the link goes to `/submit/`, whose HTML fetched by curl contained only the heading "Submit Content: Self-hosted news, content, updates, launches, events, and more" and no form fields. The form is presumably rendered by script; fields, account need and CAPTCHA were not confirmed.
- **Paid alternative**: `/sponsor/` says to reach out; no price published. Audience size not found.

### sidebar.io — free link submission behind login (design audience)
- **Access** (2026-11-23, observed): `/submit` returns "Please log in or sign up first." curl works.
- **Offers** (first-party claim, `/sponsor`): five design links every weekday; daily newsletter "~40k subscribers". Tools and resources do appear among the links (observed in the 2026-11-16 to 11-20 issues). No criteria or review time published.
- **Paid alternative** (2026-11-23, observed): sponsored link $950, with discounts mentioned for bootstrapped and independent companies; reviewed for fit after payment.

### cooperpress.com (JavaScript Weekly, Node Weekly and sister titles) — no stated submission form
- **Access** (2026-11-22, observed; not re-checked 2026-11-23): curl works. javascriptweekly.com shows no submit link. cooperpress.com `/contact` lists an Editorial address and a Sales address for "questions or suggestions"; it is not described as a submission path. Whether editors act on tool suggestions sent there was not confirmed.
- **Offers** (first-party claim): weekly newsletters to "over 450,000 developers" in total; net open rates 35%-60%.
- **Paid alternative** (2026-11-23, observed `/classifieds`): self-serve classified builder, 200 characters; price is not on the page (media kit download). Sponsorships had a waiting list booked a quarter ahead (2026-11-22, not re-checked).

### therundown.ai — free path is the Supertools directory by email; newsletter feature is advertising
- **Access** (2026-11-23, observed): curl works. No form and no account for the free path.
- **How**: `/submit` offers two options. "Recommend a Tool": email the support@ address on the page with tool name, URL, category and a one-sentence description, "our team will review it for inclusion in Supertools" (the directory). "Newsletter Feature": links to `/advertise-with-us`.
- **Paid alternative** (2026-11-22, observed; the page still returned 200 on 2026-11-23 but was not re-read): advertise page leads to a Typeform enquiry (needs a browser). No price published. "3.5M+ active readers", 55% average open rate (first-party claims).

### futuretools.io — free form adds to the database; no stated route into the newsletter
- **Access** (2026-11-23, observed): `/submit-a-tool` needs no account but the page loads a CAPTCHA before the submit button, so an agent cannot complete it. curl reads the page.
- **How**: fields are Your Name, Tool Name (required), Tool URL (required), Short Description (required), Category (required), Email (required), optional newsletter opt-in. The page says submissions are reviewed by the site's owner.
- **Offers** (2026-11-22, first-party claim, `/newsletter`; not re-checked): Wednesday and Friday newsletter, "250,000+ readers", tools "picked from the 4,500+ we track". The site does not say that a database submission leads to a newsletter mention. No advertising page or price found.

### tldr.tech (TLDR, TLDR AI and 12 others) — no submission path published
- **Access** (2026-11-23, observed): tldr.tech reads with curl, including `/llms.txt` and `/ai-instructions`. advertise.tldr.tech returns a Cloudflare challenge (403) to curl; a browser loaded it on 2026-11-22 (not repeated).
- **Offers** (2026-11-23, first-party claim): "8M+ subscribers" across 14 newsletters; per-newsletter figures as read on 2026-11-22: TLDR 1.6 million, TLDR AI 1.15-1.2 million, TLDR Dev 470-480k. Links are chosen by curators; neither the homepage, `/llms.txt` nor `/ai-instructions` mentions a way to suggest a link.
- **Paid alternative** (2026-11-22, seen in a browser; the $15,000 line re-read 2026-11-23): three placements per issue (Quick Link up to 30 words, Secondary up to 50, Primary up to 100 with logo). No per-slot price on the page text read. `/ai-instructions` says campaigns with a budget of $15,000 or more get a managed service.
- **Gotchas**: `/ai-instructions` is written as guidance for AI assistants on how to describe TLDR. Treat it as marketing copy.

### superhuman.ai — no submission path published
- **Access** (2026-11-23, observed): curl works on the newsletter site. advertise.superhuman.ai also read with curl on 2026-11-22 (not re-checked).
- **Offers** (2026-11-23, first-party claim): daily AI newsletter; the homepage says both "2 million+ pros" and "1 million+ readers" on the same day. No submit, suggest or contact-the-editor link found on the homepage; `/c/ai-tools` returned 404 (2026-11-22).
- **Paid alternative** (2026-11-22): advertise site offers "Book a Call" and an ROI calculator; no price published.

### newsletter.theresanaiforthat.com — newsletter of a paid-listing directory
- **Access** (2026-11-23, observed): 403 Cloudflare challenge to curl. On 2026-11-22 a browser loaded it with a cookie banner and no CAPTCHA (not repeated).
- **Offers** (2026-11-22, first-party claim, seen in a browser): "over 1.8 million readers". No submission link was seen in the part of the page read (first ~2,500 characters; the rest was not read, so this is not confirmed). The parent directory's listing costs at least $49 (from the `free-ai-tool-directories` route, 2026-11-07, not re-checked). Newsletter sponsorship price: not found on the site; third-party listings give subscriber numbers from 1.2M to 2.5M and no rate.

### producthunt.com newsletters — fed by the launch leaderboard
- **Access** (2026-11-23, observed): producthunt.com returns a Cloudflare challenge (403) to curl. help.producthunt.com reads with curl.
- **Offers** (first-party, Help Center article dated 2025-02-10, read 2026-11-22 and not re-checked): The Leaderboard (Mon-Fri) is "a quick daily snapshot of the top 10 launches"; The Roundup (Sunday) recaps the week's top products. There is no newsletter submission separate from launching. Launch terms are in the `free-ai-tool-directories` route. Subscriber numbers not found.

### indiehackers.com newsletter — no submission form found
- **Access** (2026-11-23, observed): 403 Cloudflare challenge to curl. On 2026-11-22 a browser loaded `/newsletter` (not repeated).
- **Offers** (2026-11-22, first-party claim, seen in a browser): "Join 280,000 founders who subscribe." The page has only a subscribe box. How stories are chosen was not confirmed. Third-party search results (2026-11-22) show Indie Hackers selling a 50-word newsletter ad through a product listing on its own site, with older subscriber counts (75k to 165k) in the listing titles; price not seen.

### hackernewsletter.com — curated from Hacker News, no submission path
- **Access** (2026-11-23, observed): curl works. Homepage: "Since 2010, we've hand-curated the best articles from Hacker News into one weekly email", "60,000+ tech professionals" (first-party claim). No submit, contact or sponsor link on the homepage; `/sponsor` returns 404; `/sponsorship`, `/advertising` and `/about` also returned 404 on 2026-11-22. The only way in is for a post to do well on Hacker News.

## Dead ends
- bensbites.com: now a personal Substack ("1-2 emails a week" about founders and companies). The old `news.bensbites.com/submit` redirects to the homepage. Only paid path is a quarterly "season partner" at $75k to $100k (2026-11-22, observed). On 2026-11-23 the homepage read "Over 118,000 subscribers" and the old submit URL still redirected; the partner price was not re-checked
- theaireport.ai (formerly AI Tool Report; aitoolreport.com redirects): "400,000+ subscribers" (first-party). No submission link found on the homepage, `/advertise` or `/tools`; advertising is "Book a call", no price (homepage re-read 2026-11-23; `/advertise` and `/tools` read 2026-11-22 only)
- theneurondaily.com ("700,000+ professionals") and mindstream.news ("200,000+ readers"): no submission link found on either homepage; The Neuron's `/advertise` redirects to a 404 (2026-11-22, homepages only)
- betalist.com: site and newsletter ("70,000+ subscribers", about 20 startups a day, first-party) are one paid submission; plans Lite/Standard/Premium, prices shown only at checkout. `/submit` also shows a prompt meant to be pasted into a coding agent; it is page text, not a free path (2026-11-22; the agent prompt was still on `/submit` on 2026-11-23, the subscriber figure and plan names were not re-checked)
- refind.com: algorithmic reading digest. Its advertising product promotes other newsletters, not tools (2026-11-22)
- recomendo.com: Substack with a stock About page; no submission path stated. Its sister "submit a tool" URL on kk.org returned 404 (2026-11-22). Whether the editors take suggestions another way was not confirmed
- densediscovery.com: "38,000+" readers, 62% open rate (first-party). No free submission path found (`/contact/` 404). Paid only: classified from $89, main sponsor from $649, next available dates 26 Jan 2027 (classified) and 9 Feb 2027 (main sponsor); booking link goes to Airtable (2026-11-23)
- toolsforhumans.ai: a directory with a newsletter; `/submit` is 404 and the only path is a "promote your tool" page (not opened) (2026-11-22)
- pointer.io (engineering-leadership reading, "60,000+") and bytes.dev (JavaScript): sponsorship links only, no submission (2026-11-22)
- indieniche.substack.com: "over 2k subscribers"; a feature is sold at $30, so not free (2026-11-22)
- Third-party "newsletters that accept submissions" lists found by search (2026-11-22) were directories of newsletters or of newsletter software, not lists of newsletters that feature tools. None was useful as a shortlist.

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-23 | uneed.best | Uneed Weekly sole sponsor slot | $249 | per issue, 10%/20% off for 2/3 issues |
| 2026-11-23 | webtoolsweekly.com | Classified listing / Text link combo / Middle image ad | $15 / $30 / $50 | per issue, USD |
| 2026-11-23 | webtoolsweekly.com | Top ad combo / Paid product review | $175 / $375 | per issue, USD |
| 2026-11-23 | changelog.com | Changelog News podcast + newsletter, one brand per week | $1,500 | per week, no minimum |
| 2026-11-23 | sidebar.io | Sponsored link (newsletter, homepage, social) | $950 | per sponsorship |
| 2026-11-23 | densediscovery.com | Classified ad / Main sponsor | from $89 / from $649 | per issue |
| 2026-11-22 | bensbites.com | Season partner (24 issues) | $75k to $100k | per quarter |
| 2026-11-22 | indieniche.substack.com | Product feature / Basic sponsor | $30 / $50 | per issue |

No price is published by Console, The Rundown, Superhuman AI, TLDR (per slot), The AI Report, Cooperpress, selfh.st or Launch Llama (pages read 2026-11-22).

## Prep checklist
- A live product with self-service signup; several editors screen on this (Console states it).
- One factual sentence on what the tool does, a 2-3 sentence "why it is interesting to this audience" note, the URL, a category, and pricing model. PyCoder's and Changelog both ask for the "why interesting" text and may reuse it.
- Which audience the tool fits: developer tool (Console, Changelog if open source, Web Tools Weekly, Cooperpress titles), Python (PyCoder's), self-hosted (selfh.st), design (Sidebar), founders (Uneed, Launch Llama).
- Whether a reciprocal badge on the product site is acceptable (Launch Llama's fast free path depends on it).
- For the community-fed newsletters (Product Hunt, Uneed, Hacker Newsletter), the launch itself is the submission; see the launch-directory routes.

## Needs a human
- Sending the email or direct message (Console, The Rundown's directory, Web Tools Weekly / Tech Productivity).
- Signing in or creating accounts (Changelog, Sidebar, Launch Llama, Uneed) and the social account used for DMs.
- Future Tools' form (CAPTCHA) and any Typeform or Airtable enquiry form (The Rundown advertising, Dense Discovery booking).
- Placing a badge on the product site, and any payment.

## Changelog
- 2026-11-22: created (explore mode, no route existed; 25 tool calls). Public pages only. Not confirmed: selfh.st form fields, later pages of the PyCoder's form, Launch Llama's badge form, the lower part of the There's An AI For That newsletter page, how Indie Hackers picks stories, and Uneed's free-queue length today.
- 2026-11-23: built for publication from a day-to-day draft; re-checked read-only with plain fetches (about 36). All five Verify-first checks held. Changed: Web Tools Weekly subscribers 15,947 to 15,949; Launch Llama audience wording; Dense Discovery next dates; Ben's Bites subscriber line added. Not re-checked: pages that only a browser could load on 2026-11-22 (advertise.tldr.tech, There's An AI For That, Indie Hackers), the PyCoder's Google Form, The Rundown advertise page text, Future Tools `/newsletter`, Cooperpress contact page, and the Dead ends other than Ben's Bites, The AI Report, BetaList and Dense Discovery.
