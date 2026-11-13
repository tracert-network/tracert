---
slug: free-static-hosting-limits
intent: Choose a free host for a static site or small Next.js/SSR app by comparing each provider's real free-tier limits, commercial-use rules, custom-domain/TLS support, over-limit behaviour and recent pricing changes.
summary: "Vercel Hobby: non-commercial, pauses at limits. Netlify Free: 300 credits, then all sites pause. Cloudflare: static free/unlimited, Workers 100k req/day. Fly: no free tier. Deno Deploy shutting down."
task_type: comparison
region: global
tags: free hosting, static site hosting, free tier limits, next.js hosting, ssr hosting, vercel hobby, netlify free, cloudflare pages, cloudflare workers, github pages, render free, firebase hosting spark, deno deploy, fly.io free, commercial use, bandwidth limits, build minutes
hosts: vercel.com, www.netlify.com, docs.netlify.com, developers.cloudflare.com, docs.github.com, render.com, firebase.google.com, fly.io, docs.fly.io, deno.com
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 33
---

# Free hosting for a static site or small Next.js app: real free-tier limits and commercial-use rules (Vercel, Netlify, Cloudflare, GitHub Pages, Render, Firebase, Deno Deploy, Fly.io)

## TL;DR — fastest path
- **Commercial static site, zero cost:** Cloudflare (Workers static assets / Pages). Static asset requests are "free and unlimited". Pages Free allows 500 builds/month and 100 custom domains per project. None of the Cloudflare pages read today restrict commercial use (Cloudflare's ToS was not checked).
- **Next.js with SSR on a free tier:** Vercel Hobby has the best Next.js support, but it is **non-commercial personal use only**. Ads, affiliate-first sites, client work and any payment flow all count as commercial; donations do not. On Cloudflare, Next.js SSR runs on Workers Free (100,000 requests/day, 10 ms CPU per request). Cloudflare now recommends **vinext** (beta), with OpenNext as the fallback.
- **Over-limit behaviour is "pause", not "bill", on most free tiers.** Vercel Hobby makes you wait 30 days "in most cases". Netlify credit Free pauses **all** projects on the team until the next cycle. Firebase Spark disables sites until the next month. Render bills bandwidth overage when a card is on file and suspends the free services when none is.
- **Skip:** Fly.io (no free tier for new orgs since the October 2024 plan changes, only a $1 / 7-day trial). Deno Deploy (still lists a Free plan, but the platform is shutting down about six months after the Deno-joins-Cloudflare announcement). Firebase Spark for SSR (Cloud Functions and App Hosting both require Blaze).
- **GitHub Pages** is fine for docs, portfolio and open-source sites: 1 GB site, 100 GB/month soft bandwidth, free HTTPS via Let's Encrypt. It may not be used to run an online business, e-commerce site or commercial SaaS.
- **Needs a human:** deciding whether a project counts as "commercial" under Vercel's definition, and accepting any provider's ToS or adding a card (Render, Firebase Blaze, Fly).

## Verify first
1. **Vercel Hobby is still non-commercial and pauses for 30 days at limits.** Fetch https://vercel.com/docs/plans/hobby. Expect "non-commercial, personal use only", "wait until 30 days have passed", 100 GB Fast Data Transfer, 1,000,000 function invocations and 4 CPU-hrs Active CPU, with last_updated 2026-09-14 or later. If not, re-explore the vercel.com section.
2. **Netlify Free is 300 credits with a hard limit and pauses all projects.** Fetch https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/. Expect "300 credits/month", 15 credits per production deploy, 20 credits per GB of bandwidth and 2 credits per 10k requests. If not, re-explore the Netlify section.
3. **Cloudflare Workers Free is 100,000 requests/day and static assets are free.** Fetch https://developers.cloudflare.com/workers/platform/pricing/. Expect 100,000 requests/day, 10 ms CPU, "free and unlimited" static asset requests and Workers Paid at $5 USD/month. If not, re-explore the Cloudflare section.
4. **Deno Deploy shutdown date.** Fetch https://deno.com/blog/cloudflare. Expect Deno Deploy to keep running "for six months before shutting down". If an exact date has been published, record it.
5. **Firebase Spark Hosting transfer cap (unresolved discrepancy).** Fetch https://firebase.google.com/pricing and https://firebase.google.com/docs/hosting/usage-quotas-pricing. Today the pricing page says 360 MB/day and the docs page says 10 GB/month. Record whichever is current.

## Domains

### vercel.com — Best Next.js DX, but Hobby is non-commercial only
- **Access** (2026-11-07, observed): docs pages fetch cleanly as markdown. Both pages show last_updated 2026-09-14.
- **Pricing / Limits (Hobby, per month)** (2026-11-07, observed, https://vercel.com/docs/plans/hobby):
  - **Free.** Prices are in USD and "exclude value-added tax (VAT), goods and services tax (GST)".
  - **Bandwidth and requests:** Fast Data Transfer first 100 GB. Fast Origin Transfer first 10 GB. CDN Requests first 1,000,000.
  - **Functions:** Function Invocations first 1,000,000. Active CPU 4 CPU-hrs. Provisioned Memory 360 GB-hrs. Function maximum duration 300s.
  - **Images:** Image Transformations first 5,000. Image Cache Reads 300,000. Image Cache Writes 100,000.
  - **Analytics:** Web Analytics 50,000 events/month.
  - **Builds:** 2 vCPUs, 8 GB memory, 32 GB disk. No build-minute quota is listed.
  - **Deploys, projects and logs:** 100 deployments per day. 200 projects. 1 hour of runtime logs.
- **Custom domains and TLS** (observed): 50 domains per project on Hobby. TLS details were not fetched today.
- **Rules** (observed, https://vercel.com/docs/limits/fair-use-guidelines):
  - Hobby is restricted to "non-commercial personal use only". (Not re-confirmed 2026-11-13: neither the Hobby page nor the fair-use page, as served as markdown to a plain fetch, contains this wording or a commercial-usage section any more. Both still show last_updated 2026-09-14, so this may be a change to the export rather than to the policy. Unverified, not marked stale.)
  - Commercial use means financial gain for "anyone involved in any part of the production", including a paid employee or consultant writing the code.
  - Examples given: payment processing, advertising a product or service, being paid to build or host the site, affiliate linking as the primary purpose, and ads such as AdSense.
  - Donations do not count as commercial use.
- **Over limit** (observed): "In most cases, if you exceed your usage limits on the Hobby plan, you will have to wait until 30 days have passed before you can use the feature again." Web Analytics collection pauses and can resume after 7 days. Hobby is never billed. Spend Management is "N/A" on Hobby.
- **Recent changes** (2026-11-07, first-party claim, vercel.com changelog search snippets):
  - 2026-09-16: Hobby projects retain fewer deployments (3 most recent production plus 3 most recent of any type), with 10 GB of Deployment Storage.
  - 2026-09-09: Hobby builds run on "Basic" 2-vCPU build machines.
  - From 2026-04-29: Hobby retention is capped at 30 days.
  - Cron jobs on Hobby still run at most once per day.
  - Pro included usage is now credit-based.
- **Gotchas:** A personal account converted to a Hobby team has its usage and activity log reset (observed).

### www.netlify.com / docs.netlify.com — Credit-based Free plan; hitting the cap pauses every project on the team
- **Access** (2026-11-07, observed): the pricing page fetched fine but gave few numbers. The docs pages are the authoritative source.
- **Pricing / Limits (credit-based Free)** (observed; docs last updated 2026-10-30, https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/):
  - "$0 forever" (pricing page). 300 credits/month with a hard limit and no auto recharge.
  - **Credit costs:** production deploy 15 credits. Bandwidth 20 credits per GB. Compute 10 credits per GB-hour. Web requests 2 credits per 10,000. Form submissions free.
  - **Builds and projects:** 1 concurrent build, 500-project limit.
  - **Included features:** custom domains with SSL, functions, Blobs, and Database (3 databases).
  - **No fixed bandwidth or build-minute quota.** Everything draws on credits. As a simple division (not a published figure), 300 credits buys at most 15 GB of bandwidth if nothing else is used.
- **Legacy plans** (observed, docs last updated 2026-01-10):
  - Accounts created before 2025-09-04 stay on Legacy plans.
  - Legacy Free: 100 GB/month bandwidth, 300 build minutes/month, 125k serverless function invocations per site/month and 1M Edge Function invocations/month. Bandwidth and build minutes are hard limits.
  - Legacy Starter bills overage at $55 per additional 100 GB and $7 per additional 500 minutes.
  - Switching from Legacy to a credit plan is **irreversible**.
- **Over limit** (observed, billing FAQ last updated 2026-10-07):
  - If one project exceeds its limits, all projects on the account pause and visitors see "Site not available".
  - Paused projects get no new requests, traffic or form submissions, and new production deploys are blocked.
  - The ways out are to wait for the next billing cycle or upgrade. Free plans cannot buy extra credits.
  - Usage alerts go out at 50%, 75%, 90% and 100%.
- **Rules:**
  - No commercial-use ban appeared on the pricing or docs pages read today.
  - Netlify staff forum answers say commercial use of Free is allowed, but charging clients for hosting is not (third-party, staff forum posts of unknown age).
  - The Self-Serve Subscription Agreement (dated 2026-11-04 per search snippet) says Netlify may pause services that exceed Free capacity and may change or discontinue the Free tier (first-party claim, snippet only).
- **Recent changes:**
  - Credit-based plans for all new accounts started 2025-09-04 (observed).
  - Credit rates appear to have risen since the launch changelog. That post reportedly listed compute at 5 credits/GB-hr and bandwidth at 10 credits/GB; today's docs say 10 and 20 (first-party claim, from a search summary of the changelog, not opened).
- **Gotchas:** Many 2026 forum threads report Free teams still paused after credits reset to 300/300 (third-party user reports, no official confirmation seen).

### developers.cloudflare.com — Most generous for static sites; Workers Free for SSR within tight CPU limits
- **Access** (2026-11-07, observed): pages fetch cleanly. Last updated: Pages limits 2026-09-05, Workers pricing 2026-10-02, Workers limits 2026-10-29, Next.js guide 2026-11-05.
- **Pages Free** (observed, https://developers.cloudflare.com/pages/platform/limits/):
  - 500 builds/month, 1 concurrent build per account, 20-minute build timeout.
  - 20,000 files per site, 25 MiB maximum per asset.
  - 100 custom domains per project, 100 projects per account.
  - Pages Functions requests count toward the Workers quota.
- **Workers Free** (observed, https://developers.cloudflare.com/workers/platform/pricing/ and /workers/platform/limits/):
  - 100,000 requests/day, resetting at midnight UTC.
  - 10 ms CPU per invocation, 128 MB memory, 50 subrequests, 100 Workers per account.
  - Static asset requests are "free and unlimited".
  - Custom domains: 100 per zone (the table has no plan split).
  - The limits-page fetch reported a 64 MiB uncompressed Worker size, but did not confirm whether a separate, smaller Free-plan size applies. Check this before deploying a large Next.js bundle.
- **Over limit** (observed): requests return **Error 1027**. With "fail open" the Worker is bypassed; with "fail closed" the error page is shown. No billing on Free. The docs do not say whether static assets keep serving once the limit is hit.
- **Paid** (observed): Workers Paid is a minimum of $5 USD/month per account, including 10 million requests and 30 million CPU-ms per month, with no extra data-transfer charges.
- **Next.js** (observed, https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/):
  - "Cloudflare recommends vinext" (beta) on Workers. It supports App Router, RSC, Server Actions, streaming SSR and ISR.
  - OpenNext is the fallback.
  - Pages is mentioned only for static exports.
- **Rules:** no commercial-use restriction appeared on the four pages read (Cloudflare's ToS was not read today).
- **Recent changes:** the default Next.js path moved to vinext (doc updated 2026-11-05). Deno has joined Cloudflare (see deno.com).

### docs.github.com — Free static hosting, but not for e-commerce or commercial SaaS
- **Access** (2026-11-07, observed): pages fetch cleanly.
- **Limits** (observed, https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits):
  - Published site no larger than 1 GB (1 GB recommended repo limit).
  - *Soft* bandwidth limit of 100 GB/month.
  - *Soft* limit of 10 builds per hour, which does not apply to custom Actions workflows.
  - 10-minute deployment timeout. One user or organization site per account.
  - Static HTML, CSS and JS only.
- **Rules** (observed): Pages is "not intended for or allowed to be used as a free web-hosting service" for an online business, e-commerce site or commercial SaaS. No sensitive transactions such as passwords or card numbers.
- **Custom domains and TLS** (observed): custom domains are supported. github.io sites are HTTPS automatically. Custom domains get a Let's Encrypt certificate automatically after a DNS check, and "Enforce HTTPS" is available. The full domain must be under 64 characters.
- **Over limit** (observed): GitHub "may be unable to serve your site", or GitHub Support may email suggesting a CDN or moving hosts. No billing.
- **Gotchas:** Pages from private repos depend on the plan ("if your plan or organization allows it"). The exact plan list was not on the pages fetched today. Commonly cited: public repos on GitHub Free, private repos on paid plans (unverified today).

### render.com — Free web services sleep; Hobby workspace bandwidth is small
- **Access** (2026-11-07): https://render.com/docs/free fetched fine (observed, no last-updated date). **https://render.com/pricing returned only section headings with no figures** (blocker: client-rendered content), so the Hobby allowances below come from search snippets.
- **Limits:**
  - **Web services** (observed): 750 Free instance hours per workspace per month. Spins down after 15 minutes without traffic and takes about 1 minute to spin up. Filesystem is ephemeral, and services may restart at any time.
  - **Postgres** (observed): Free databases expire 30 days after creation, then a 14-day grace period before deletion. 1 GB storage, no backups.
  - **Hobby workspace** (first-party claim, render.com search snippets): 5 GB outbound bandwidth and 500 build pipeline minutes per month. Static sites are free but draw on these allowances.
- **Rules** (observed): "Do not use them for production applications." Free tiers are meant for testing, hobby use and previews.
- **Custom domains and TLS** (observed): Free web services support custom domains and managed TLS. This was not confirmed for static sites today.
- **Over limit** (observed):
  - Instance hours exhausted: free web services are suspended until next month.
  - Bandwidth: a supplementary charge is billed if a payment method is on file. Without one, **all** Free services are suspended for the rest of the month.
  - Build minutes: billed unless the spend limit is reached. Otherwise new builds are disabled, while existing builds keep running.
- **Overage rates** (first-party claim, snippet): $0.15/GB bandwidth and $5 per 1,000 build minutes.

### firebase.google.com — Spark is static-only; any SSR or functions need Blaze (billing account)
- **Access** (2026-11-07, observed): both pages fetched fine, with no last-updated date shown.
- **Limits (Spark)** (observed):
  - Hosting storage: 10 GB.
  - Hosting data transfer: **360 MB/day** per https://firebase.google.com/pricing, but **10 GB per month** per https://firebase.google.com/docs/hosting/usage-quotas-pricing. The two first-party pages conflict.
  - Custom domain & SSL, and multiple sites per project, are listed as rows on both plans; no values are shown.
- **SSR** (observed): Cloud Functions and App Hosting are "Not applicable" on Spark. App Hosting on Blaze includes 10 GiB/month of outgoing bandwidth at no cost, then $0.20/GiB uncached or $0.15/GiB cached.
- **Over limit (Spark)** (observed): exceeding data transfer disables sites "after a short grace period" until next month, or until you upgrade to Blaze. Exceeding storage blocks new deploys.
- **Blaze Hosting** (observed): $0.026/GB storage and $0.15/GB transfer beyond the free amounts. The currency is shown only as "$".
- **Rules:** no commercial-use restriction appeared on the pages read.

### deno.com — Free plan still listed, but the platform is being wound down
- **Access** (2026-11-07, observed): https://deno.com/deploy/pricing fetched fine.
- **Free plan** (observed): "$0/month", "For personal use and smaller projects".
  - 1M requests/month, 20 GiB egress, 10 hr Active CPU, 150 GiB-hr memory time.
  - 10 GiB revision storage. 1 concurrent build, 15 builds/hour.
  - 10 active deployments, 5 custom domains, no wildcard subdomains.
  - 1 GiB KV storage.
  - No overage prices are listed for Free, and over-limit behaviour is not stated.
- **Pro** (observed): "$20/month" (currency shown as "$"). Includes 5M requests, then $2/M, and 200 GiB egress, then $0.20/GiB.
- **Status:**
  - The pricing page carries the banner "Deno is joining Cloudflare!" (observed).
  - Deno's blog post says Deno Deploy "will continue operating for six months before shutting down", with migration support to Cloudflare Workers for paying customers (observed 2026-11-08, deno.com/blog/cloudflare).
  - The post is dated 2026-10-09 (observed 2026-11-08). Six months from that date is about April 2027; that is a calculation, not a date Deno has published.
  - Deno Deploy Classic had a separate sunset on 2026-07-20 (first-party claim, docs.deno.com snippet).
- **Verdict:** do not start new projects here.

### fly.io / docs.fly.io — No free tier for new organizations
- **Access** (2026-11-07, observed): https://fly.io/docs/about/pricing/ returns a 301 redirect to https://docs.fly.io/about/pricing, which fetched fine.
- **Offers** (observed):
  - "New organizations don't have a free tier or a monthly free usage allowance."
  - Free trial: $1 of credit lasting 7 days or until used up. No card is needed to start the trial, though a card is required for all organizations except Linked Organizations.
  - Orgs on plans discontinued in October 2024 keep those plans' free allowances.
  - Always free: first 10 single-hostname SSL certificates, inbound transfer, shared IPv4 and IPv6.
- **Pricing** (observed, USD):
  - shared-cpu-1x 256MB costs $2.19/month, billed per second.
  - Outbound transfer costs $0.02/GB in North America and Europe, $0.04/GB in Asia Pacific, Oceania and South America, and $0.12/GB in Africa and India.
  - Pay As You Go has no monthly platform fee.

## Dead ends
- **https://render.com/pricing**: figures are client-rendered, so the fetch returned headings only. Use https://render.com/docs/free plus the dashboard, or treat the Hobby numbers as first-party claims.
- **https://www.netlify.com/pricing/**: shows the 300-credit limit and per-unit credit costs, but not the pause behaviour or the rules. Use the docs.netlify.com billing FAQ instead.
- **GitHub "What is GitHub Pages" and "Securing with HTTPS"**: neither lists which plans allow Pages from private repos. That plan matrix lives on another page that was not opened today.
- **Third-party "free tier 2026" lists** (netli.fyi, supadrop, agentdeals, costbench, toolradar, freetier.co): they repeat or mix up old numbers. One lists Deno Free as 100K requests/day, the old beta figure. Not used as sources.

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | vercel.com/docs/plans/hobby | Hobby plan | Free | USD, excl. VAT/GST |
| 2026-11-07 | vercel.com/docs/plans/hobby | Pro developer seat | $20 per user / month | USD, excl. VAT/GST |
| 2026-11-07 | vercel.com/docs/limits/fair-use-guidelines | Pro function invocations beyond credit | $0.60 per 1,000,000 | USD, excl. VAT/GST |
| 2026-11-07 | www.netlify.com/pricing | Free plan | $0 forever (300 credits) | currency "$", tax not stated |
| 2026-11-07 | docs.netlify.com credit plans | Personal plan credit packs | 500 credits $5; 1,500 credits $10 | USD per page, tax not stated |
| 2026-11-07 | docs.netlify.com legacy plans | Legacy Starter overage | $55 per 100 GB; $7 per 500 build min | "$", tax not stated |
| 2026-11-07 | developers.cloudflare.com/workers/platform/pricing | Workers Paid minimum | $5 USD / month per account | USD, tax not stated |
| 2026-11-07 | firebase.google.com/pricing | Blaze Hosting storage / transfer over free | $0.026/GB; $0.15/GB | "$", currency not named |
| 2026-11-07 | firebase.google.com/pricing | Blaze App Hosting egress over 10 GiB | $0.20/GiB uncached; $0.15/GiB cached | "$", currency not named |
| 2026-11-07 | deno.com/deploy/pricing | Deno Deploy Pro | $20/month | "$", currency not named |
| 2026-11-07 | docs.fly.io/about/pricing | shared-cpu-1x 256MB Machine | $2.19/month | USD, tax not stated |
| 2026-11-07 | docs.fly.io/about/pricing | Outbound transfer, NA/Europe | $0.02/GB | USD, tax not stated |
| 2026-11-07 | render.com (search snippet, not observed) | Bandwidth / build-minute overage | $0.15/GB; $5 per 1,000 min | first-party claim, tax not stated |

## Prep checklist
- Decide whether the site is commercial under Vercel's definition. Ads, affiliate links, payments, and paid client or contractor work all count. If it is commercial, rule out Vercel Hobby and GitHub Pages.
- Decide static vs SSR. For SSR, rule out GitHub Pages and Firebase Spark. Check Cloudflare Workers' 10 ms CPU limit and Worker size limit against the app's bundle.
- Estimate monthly bandwidth and deploy count. On Netlify credit Free, each production deploy costs 15 credits and each GB costs 20 credits.
- Check whether the Netlify account predates 2025-09-04 (Legacy plan). If so, don't switch plans casually: the switch is irreversible.
- Note the over-limit behaviour (pause vs suspend vs bill) and whether a card on file changes it (Render, Firebase Blaze, Fly).

## Needs a human
- Judging whether a project is "commercial" for Vercel Hobby or "an online business" for GitHub Pages. If in doubt, ask the provider's support.
- Accepting ToS, creating accounts, adding a payment method (Render, Firebase Blaze, Fly.io), and configuring DNS for custom domains.
- Watching for Deno Deploy's exact shutdown date if anything already runs there.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-08 — reviewed (independent): re-confirmed Vercel Hobby's non-commercial rule and 30-day pause (added Vercel's "in most cases" qualifier), and Netlify Free's 300-credit hard limit and all-projects pause; Deno post date and six-month wording now observed first-party, with the April 2027 figure marked as a calculation.
- 2026-11-13 — verification (routine): 4/5 checks held (Netlify 300 credits, 15/deploy, 20/GB, 2/10k requests; Cloudflare Workers Free 100,000 requests/day and 10 ms CPU, static assets "free and unlimited", Paid $5/month; Deno Deploy "six months before shutting down", still no exact date; Firebase discrepancy unchanged: pricing page 360 MB/day, docs 10 GB/month). Check 1 partial: Vercel Hobby limits, the 30-day pause and last_updated 2026-09-14 held, but the "non-commercial personal use only" wording no longer appears in the markdown either Vercel page serves. Labelled unverified. last_verified left at 2026-11-07.
