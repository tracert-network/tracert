---
slug: saas-review-sites-free-listing
intent: Get a new SaaS product listed for free on the main software review and alternatives directories, and know which paid upsells, eligibility rules and pre-launch blockers apply on each.
summary: "G2 lists GA B2B software free (3-5 + 1-3 business days; no alpha/beta, no B2C). AlternativeTo rejects pre-release apps. SaaSHub free; featured $99/mo. Product Hunt free, personal accounts only."
task_type: research
region: global
tags: g2, capterra, getapp, software advice, gartner digital markets, trustradius, alternativeto, saashub, sourceforge, slashdot, product hunt, saas directory, software review site, free listing, claim profile, vendor portal, b2b software listing, launch directories, pre-launch
hosts: sell.g2.com, research.g2.com, documentation.g2.com, legal.g2.com, company.g2.com, saascity.io, alternativeto.net, www.saashub.com, sourceforge.net, www.producthunt.com
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 34
---

# How to list a new SaaS product for free on G2, Capterra, TrustRadius, AlternativeTo, SaaSHub, SourceForge and Product Hunt

## TL;DR — fastest path
- **Start with G2.** It is free. Submit at `g2.com/products/new`. The research team verifies the product (about 3–5 business days), then you claim the profile (1–3 business days). G2 rejects B2C, alpha and beta products, integrations or plug-ins of another product, and sites that are unreachable at review time.
- **Capterra, GetApp and Software Advice:** a free basic profile exists. G2 announced on 2026-01-29 that it had agreed to acquire all three (first-party, company.g2.com); completion is reported only by third parties. A third party reports that the "Get your product listed" button on `capterra.com/vendors` now opens G2's product form, so one G2 seller login may cover all four. All three sites return 403 to automated fetches, so a human must confirm this in a browser.
- **AlternativeTo and SaaSHub are free and fit tiny products.** AlternativeTo is community moderated, has a long queue and accepts released products only (no waitlist, closed beta or invite-only). Its only paid option is a priority review, which speeds up the queue but does not buy approval. SaaSHub is free to list and verify. Its only paid product is a "featured" slot at $99/month.
- **SourceForge (which also lists on Slashdot):** you can add a product at `sourceforge.net/software/vendors/new`. The pricing page shows only paid plans and no free tier. Paid plans "remove advertising from your profile", and placement is "determined by the price of your plan". Treat sales outreach from them as expected.
- **TrustRadius (owned by HG Insights since June 2025):** TrustRadius says claiming a profile is free. It asks for a LinkedIn company page and a product sold to businesses. The site blocks automated fetches, so a human must check it.
- **Product Hunt** is free, but company accounts are banned, so a maker submits from a personal account. It is a one-day launch event rather than a standing review listing. Do it after the product is publicly usable.

## Verify first
1. **G2 free listing and timings unchanged.** Fetch `https://sell.g2.com/create-a-profile`. Expect "You can claim your profile for free", about 3–5 business days for verification and 1–3 business days for the claim. If not, re-explore the G2 section.
2. **G2 still excludes B2C and alpha/beta products.** Fetch `https://documentation.g2.com/help/docs/finding-or-listing-a-product-on-g2`. Expect the B2C and alpha/beta exclusions and the form at `g2.com/products/new`. If not, re-explore the G2 rules.
3. **AlternativeTo released-only rule and paid priority review.** Fetch `https://alternativeto.net/faq/`. Expect "Coming Soon", closed beta, invite-only and Early Access to be refused, and priority review to be the only paid option. If not, re-explore the AlternativeTo section.
4. **SaaSHub featured price.** Fetch `https://www.saashub.com/featured-products`. Expect "$99 / Month · cancel anytime" and a flat fee with no pay-per-click. If not, update the Observed prices section.
5. **Capterra route now goes through G2 (needs a human browser).** Capterra returns 403 to automated fetches. Open `capterra.com/vendors` and click "Get your product listed". Expect a G2 product form or G2 seller login. If not, re-explore the Capterra/GetApp/Software Advice section.

## Domains

### g2.com (sell.g2.com, documentation.g2.com, research.g2.com, legal.g2.com) — free, the main front door; generally available B2B software only
- **Access** (2026-11-07, observed): all four subdomains fetched fine with no block.
- **Offers** (2026-11-07, observed, sell.g2.com/create-a-profile): "You can claim your profile for free." The steps are:
  1. Submit the request form; the product is "conditionally approved".
  2. The research team verifies it "in about 3-5 business days" and assigns a category.
  3. The profile goes live, unclaimed.
  4. You claim it; claims are reviewed "within 1-3 business days".
  5. A G2 team member contacts you.
- **Login** (observed): LinkedIn, Facebook, Google or a business email. No explicit company-domain rule is stated for claiming.
- **Rules** (2026-11-07, observed):
  - documentation.g2.com: G2 does not accept B2C products or products "in alpha or beta development".
  - research.g2.com FAQ:
    - One listing per product; duplicate submissions are rejected.
    - Integrations or plug-ins built on an existing product are usually not eligible.
    - A submission fails if the website is unreachable at review time.
    - The profile name must match the product name, with no marketing language or symbols.
    - G2 may decline listings to comply with US sanctions.
  - legal.g2.com free service description: eligible profiles are "current B2B software, service, or open-source project that is generally available in the market".
- **Free plan includes** (2026-11-07, observed, legal.g2.com): two profile admins, earned badges, product info, features, pricing and screenshots, and lead collection "up to four per month for software".
- **Reviews and visibility** (2026-11-07, first-party claim, search snippets of sell.g2.com and g2.com): a profile "can exist in a category with zero reviews". Grid placement needs at least 10 reviews attributed to that category, and segment Grids need 10 reviews from that company-size segment. The "All-in-One"/"Best-of-Breed" tag needs 25+ reviews (observed, research FAQ).
- **Paid** (2026-11-07, observed): Reviews, Buyer Intent, G2 Ads (on category and competitor pages), Market Intelligence, Content, Data Solutions and G2 Audiences. Prices are at `sell.g2.com/plans`, which was not fetched.
- **Gotchas and pressure:**
  - The "Get Started" link on the free-profile page points to an upgrade page (observed). Look for the plain submission form at `g2.com/products/new`.
  - Expect a sales follow-up call ("A G2 team member contacts you").
  - Review-solicitation rules are strict: no incentives tied to sentiment and no outreach only to likely-positive (NPS-segmented) users. Incentives must be disclosed (observed, legal.g2.com).
  - Badges can only be reused with a backlink and must not be altered.
  - G2 announced on 2026-01-29 that it would acquire Capterra, Software Advice and GetApp, and said it plans "pay-per-lead offerings" (observed, company.g2.com). Expect upsells across the four sites.

### capterra.com / getapp.com / softwareadvice.com — free basic profile; sale to G2 agreed (completion third-party reported); blocked to automated fetch
- **Access** (2026-11-07, observed): `capterra.com/vendors/sign-up`, `capterra.com/legal/listing-guidelines/`, `getapp.com/listing_guidelines/` and `softwareadvice.com/vendor-listing-faq/` all returned **HTTP 403**. The old Gartner vendor hosts (`digitalmarkets.gartner.com`, `digital-markets.gartner.com`) returned **DNS not found**.
- **Ownership** (third-party, news reports seen 2026-11-07): G2 announced the deal on 2026-01-29. Gartner's 10-K reportedly shows the sale completed on 2026-02-05 for about $110 million. G2's own announcement (observed 2026-11-07, dated 2026-01-29) still says only "has formally agreed to acquire" and gives no closing date. No first-party G2 or Gartner completion notice was found, so treat completion as unverified.
- **Offers** (first-party claim, search snippet of the capterra.com glossary): a basic listing is "free-of-charge" and "does not generate conversions, clicks, or leads". Capterra may create listings itself "from publicly available information", so your product may already exist unclaimed.
- **How** (third-party, saascity.io, last checked by them on 2026-10-07):
  - `capterra.com/vendors`, then "Get your product listed", which opens G2's product form.
  - The seller login validates through LinkedIn or a business email.
  - "Manage this product listing" on an existing profile opens a claim request on G2.
  - Approval time: "Not published".
- **Rules** (third-party, saascity.io, 2026-10-07):
  - Requires "Packaged software on public sale with a trial, demo or request-for-information offer".
  - Excludes marketplaces, database sites, personal apps, clones, custom builds and **waitlist-only** products.
  - Beta products qualify if they have a working website, an offer on public sale, and at least one review within their first calendar year.
  - Descriptions must not contain calls to action ("Click here for a free trial") or personal contact details (first-party claim, snippet of the Profile Guidelines).
- **Paid** (third-party): sponsored pay-per-click (PPC) profiles and pay-per-lead (PPL); "rates not published". One directory-review blog cites a $2/click minimum bid and a $500/month minimum budget in a second-price auction. These figures are unverified.
- **Gotchas:** a free profile "has no link to your website". The "Visit Website" button is a sponsored feature (third-party, saascity.io). Without PPC, a free listing will not rank near the top of busy categories (third-party).

### trustradius.com — free claim (first-party claim); blocked to automated fetch
- **Access** (2026-11-07, observed): `trustradius.com/vendors` and `/resources/claim-your-profile` returned **HTTP 403**. `solutions.trustradius.com/claim-your-profile` returned a 301 redirect to the blocked www page.
- **Offers** (first-party claim, search snippets of trustradius.com pages): claiming a profile is free and "only takes a few minutes". The vendor-portal FAQ says there is no cost. The free profile covers product info, pricing, interactive demos, security documentation and video. Premium items named are lead capture and review-generation campaigns.
- **Rules** (first-party claim, snippet of `trustradius.com/static/vendor-submission-requirements`): the company needs a LinkedIn company page and must sell a software or hardware product to businesses. The team reviews each access request. Approval time was not found.
- **Reviews and visibility** (first-party claim, snippet of the scoring FAQ): Top Rated or ranking criteria include 10+ reviews from the past year, a trScore of 7.5 or higher, and at least 0.5% of category traffic. Sorting also weighs profile completeness. No minimum review count to claim was found.
- **Ownership** (third-party plus first-party snippet): HG Insights acquired TrustRadius on 2025-06-19/20. The site now brands itself "TrustRadius: an HG Insights company" and has a product called "HG Customer Voice". Expect upsells for intent data and leads.

### alternativeto.net — free and community moderated; released products only; paid queue-skip
- **Access** (2026-11-07, observed): the FAQ fetched fine.
- **How** (observed): sign up and verify your email ("You need to verify your email address before you can submit a new app"). Then use the User icon, choose "Suggest new application", and fill in platforms, license, descriptions and tags.
- **Moderation** (observed): admins check every submission. The standard queue holds "several thousand apps" and has no promised timeframe. A paid **priority review** is usually done in 1–2 business days, or up to a week in busy periods. The FAQ says "Paying moves you up the queue — it does not buy approval." The fee is refundable until the review is complete, then non-refundable. The amount is shown only before payment and is not in the FAQ.
- **Rules** (observed):
  - The product must be released. Coming Soon, closed or private beta, invite-only and Early Access apps are not accepted. Open or public betas will "probably" be accepted.
  - The app must support English.
  - No hardware, no adult content, and nothing limited to a single city or country (all of Europe or the USA is fine).
  - Simple online tools, thin wrappers around AI models, clones and low-quality games are often declined.
  - Descriptions must not contain addresses, phone numbers, emails or links.
- **Ownership** (observed): developers can request developer access to their app page, after which their edits go live immediately. Changing an app's name or official website needs admin verification.
- **Paid** (observed): priority review only. It does not affect rank, likes, placement in alternatives lists or whether the link is followed. Long-time contributors may get a free priority review.
- **Gotchas:** the FAQ does not say whether apps with zero likes appear in alternatives lists. Ranking uses several factors, and users vote on suggested alternatives.

### saashub.com — free listing and verification; flat-fee featured upsell
- **Access** (2026-11-07, observed): `/submit` and `/featured-products` fetched fine.
- **How** (observed, /submit): "You need to submit and verify your product on SaaSHub". An account is needed (Register/Login). "SaaSHub Submit" is described as "Our free tool that helps you to promote your product" across directories.
- **Rules** (third-party, saascity.io, 2026-10-07): submit a URL and competitors, then wait for approval. Listing, verification and competitor tagging are free. Verification uses an email on the product's domain or an HTML meta tag, is renewed each quarter, and is what makes the main link followed. The site does not state whether pre-launch products are accepted (not found).
- **Paid** (2026-11-07, observed, /featured-products): featured listing "$99 / Month · cancel anytime", "month-to-month subscription with no contract". It covers placement on the homepage, alternatives, category and comparison pages and the newsletter. "As of now, we offer a flat fee monthly promo only", so there is no PPC. A featured listing goes live with "no review queue and no waiting". That contrast with the free queue is the main upsell lever.
- **Gotchas:** toolradar.com says SaaSHub has no free option. That contradicts SaaSHub's own wording and the more detailed sources, so treat toolradar as wrong.

### sourceforge.net (also lists on Slashdot) — listing path exists; only paid tiers shown; ads on non-paid profiles
- **Access** (2026-11-07, observed): `/software/vendors/` and `/software/vendors/pricing/` fetched fine.
- **How** (observed): business registration at `/user/registration_business`, then "Add a Commercial Product" at `/software/vendors/new`.
- **Free?** (observed): neither page says whether a basic listing is free. The pricing page lists no free tier (lowest is PLUS). Verify this at `/software/vendors/new` with a human.
- **Paid** (observed): plans are PLUS, PREMIUM, AMPLIFY, PRECISION ABM and ENTERPRISE, with no prices shown. Each plan has an inquiry form (`/software/vendors/inquire?package=...`).
  - PLUS includes promotion on competitors' pages, unlimited clicks to your website and "Remove advertising from your profile". This implies non-paid profiles show ads; that is an inference.
  - Bundled review credits are listed (see Observed prices).
  - "All product pages include a complimentary listing on Slashdot."
- **Pressure** (observed): "Your exact position is determined by the price of your plan". The pages also claim "over 20 million intent-driven viewers", repeat "Get started now" and offer a "free consultation", which is a sales contact.
- **Reviews** (observed): reviews are not stated as required to show a listing. Leader/Top Performer awards need "enough positive user reviews".

### producthunt.com — free launch event, not a standing review listing
- **Access** (2026-11-07, observed): `/launch` fetched fine.
- **How** (observed): "Log in, click the 'Submit' button in the top right, and then click 'New Product.'" The page says "It's 100% free to use", "Company accounts are prohibited" and makers are encouraged to hunt their own product. You can relaunch "as often as you have new significant product iterations".
- **Rules** (observed): "you cannot ask people directly to upvote your product". Products compete on a daily leaderboard (Product of the Day). The page does not say whether every launch is shown on the homepage.
- **Pre-launch** (third-party): playbooks suggest a "launching soon" waitlist on the PH page, or the separate Ship by Product Hunt landing-page tool. No official policy was found on publishing a product page without launching.
- **Paid** (observed): there is an "Advertise" link to `/sponsor`. No paid-launch details are on the launch page.

## Dead ends
- `digitalmarkets.gartner.com` and `digital-markets.gartner.com`: DNS not found (2026-11-07). The old Gartner vendor sign-up pages are gone, presumably because of the sale to G2 (inference). A third party says the Gartner page now redirects small businesses to G2 Digital Markets.
- `capterra.com/vendors/sign-up`, `capterra.com/legal/listing-guidelines/`, `getapp.com/listing_guidelines/` and `softwareadvice.com/vendor-listing-faq/`: HTTP 403 to automated fetch (2026-11-07). This is a blocker; there was no workaround attempt.
- `trustradius.com/vendors` and `trustradius.com/resources/claim-your-profile`: HTTP 403. `solutions.trustradius.com/claim-your-profile` 301-redirects to the blocked page.
- `research.g2.com` research FAQ: useful for rejection reasons, but its "1-2 business days" figure is for edits to existing profiles, not new listings.
- `saashub.com/submit`: describes the cross-directory "SaaSHub Submit" promo tool, not the listing rules.
- `sourceforge.net/software/vendors/pricing/`: shows no plan prices and no free tier.
- Product Hunt forum thread "Can I publish my product on PH without first launch?": the thread had no official reply.
- Directory-list blogs (spotsaas.com, dupple.com, toolradar.com, saascity.io for some figures): these are often vendors of rival listing services. Their timing, pricing and ownership claims conflict, so use them only as third-party leads.

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | saashub.com/featured-products | Featured listing | "$99 / Month" (only the $ symbol shown; currency not named) | Month-to-month, cancel anytime; tax/VAT basis not stated; observed |
| 2026-11-07 | sourceforge.net/software/vendors/pricing/ | PLUS plan: bundled review credit (plan price not shown) | "$600 in reviews" (annual billing) / "$300 in reviews" (semi-annual) | Credit included with the plan, not the plan price; observed |
| 2026-11-07 | sourceforge.net/software/vendors/pricing/ | PREMIUM plan: bundled review credit (plan price not shown) | "$1,000 in reviews" (annual) / "$500 in reviews" (semi-annual) | Credit included with the plan; observed |
| 2026-11-07 | sourceforge.net/software/vendors/pricing/ | AMPLIFY and PRECISION ABM: bundled review credit | "$1,000 in reviews" | Credit included with the plan; observed |
| 2026-11-07 | alternativeto.net/faq/ | Priority review | Amount not published in the FAQ; shown at checkout | One-time; non-refundable once review completes; observed |
| 2026-11-07 (seen) | third-party directory-review blog (via search snippet) | Capterra PPC | $2/click minimum bid; $500/month minimum budget | Third-party, unverified; Capterra "publishes no rates" |
| 2026-11-07 | G2, Capterra, TrustRadius, Product Hunt | Basic or free listing | Free (G2, TrustRadius and Product Hunt say so first-party; for Capterra, glossary snippet plus third-party) | Paid tier prices not published on the pages fetched |

## Prep checklist
- The product must be **publicly available**, with no waitlist, closed beta or invite-only access (this blocks AlternativeTo, G2 and likely Capterra). The website must be reachable when the reviewers look.
- The product must be clearly **B2B** for G2 and TrustRadius. B2C products are refused on G2.
- Use the exact product name with no taglines (G2). Search each site first for an existing auto-created or unclaimed listing, and claim it rather than duplicating it.
- Prepare a business-domain email (G2 login option; SaaSHub domain verification) and a **LinkedIn company page** (TrustRadius; also a G2/Capterra login option).
- Write a short description with no CTAs, links, emails or phone numbers (Capterra, AlternativeTo). Also prepare a logo, screenshots, a feature list, pricing (including free tier or trial details), platforms and license (AlternativeTo), a category and a competitor list (SaaSHub).
- Offer a trial, demo or request-for-information option and public pricing (Capterra's "public sale" rule, third-party).
- English UI (AlternativeTo). The product must not be limited to a single country.
- Plan for the first 10 genuine reviews. That count unlocks the G2 Grid and TrustRadius ranking. Do not gate incentives on sentiment (G2 terms).
- Product Hunt needs a personal maker account, not a company one. Launch only once the product is usable.

## Needs a human
- Every listing needs a human to sign up or sign in and submit a form. Logins: G2/Capterra via LinkedIn, Google, Facebook or business email; AlternativeTo via a verified email; a SaaSHub account; SourceForge business registration; a personal Product Hunt account. Email-verification and domain-verification clicks also need a human.
- Capterra, GetApp, Software Advice and TrustRadius block automated fetching. A human must open the vendor pages in a browser to confirm the current flow (Capterra possibly via G2) and the TrustRadius claim step.
- The SourceForge free/basic status is unconfirmed. A human should open `/software/vendors/new` and see whether it asks for payment.
- Decisions on paid upsells are the human's: AlternativeTo priority review, SaaSHub featured at $99/month, G2/Capterra PPC or pay-per-lead, SourceForge plans, TrustRadius premium. The human also handles the sales follow-up calls G2 and SourceForge invite.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-07 — reviewed (independent): G2 ownership of Capterra/GetApp/Software Advice removed from summary and TL;DR (first-party source confirms only the 2026-01-29 agreement; completion third-party); spot-checked G2 free-profile timings.
