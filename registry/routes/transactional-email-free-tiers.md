---
slug: transactional-email-free-tiers
intent: Choose a free or very cheap transactional email API for a new app and set up sending (domain authentication, sandbox/approval) so mail reaches the inbox.
summary: "SendGrid's free plan is gone (60-day trial, 100/day). Free caps: Mailjet 6,000/mo, Resend 3,000/mo, Mailgun 100/day, MailerSend 500/mo (card + approval), Postmark 100/mo. SES: $200 credits + sandbox."
task_type: comparison
region: global
tags: transactional email, email API, free tier, cheapest email API, SMTP relay, Resend, Postmark, Amazon SES, SES sandbox, SendGrid free plan, Twilio SendGrid, Mailgun, Brevo, Mailjet, MailerSend, Loops, Plunk, SPF, DKIM, DMARC, return-path, deliverability, spam folder, Gmail bulk sender requirements, Yahoo sender requirements, one-click unsubscribe
hosts: resend.com, postmarkapp.com, aws.amazon.com, docs.aws.amazon.com, sendgrid.com, www.twilio.com, www.mailgun.com, www.brevo.com, help.brevo.com, www.mailersend.com, www.mailjet.com, loops.so, www.useplunk.com, support.google.com, senders.yahooinc.com
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 33
---

# Free transactional email API for a new app (Resend vs Postmark vs SES vs SendGrid vs Mailgun vs Brevo vs Mailjet vs MailerSend) and how to avoid spam

All figures dated 2026-11-07. Labels: **observed** = read on the provider's own page today; **first-party claim** = provider's own page seen only as a search snippet, or provider copy not opened in full; **third-party** = blogs/digests. Prices are as printed; "$" means the page showed a dollar sign (currency code stated only where noted). No VAT/tax basis is stated on any page except Mailjet.

## TL;DR — fastest path

- **Most free volume with no approval queue:** Mailjet Free (6,000/month, 200/day) or Resend Free (3,000/month, 100/day). Mailgun Free is 100/day with 1 custom domain and 1-day logs. All observed 2026-11-07.
- **Cheapest at scale:** Amazon SES at $0.10 per 1,000 emails à la carte. Every new account starts in a per-region sandbox (verified recipients only, 200 messages/24h, 1 message/second), and the production-access review takes up to 96 hours for a first response. New AWS customers get up to $200 in Free Tier credits instead of a per-message free quota.
- **Skip SendGrid if "free forever" matters:** Twilio retired the SendGrid free plans (Twilio changelog entries dated May 27 and May 28, 2025). New accounts get a 60-day trial at 100 emails/day; the cheapest paid tier is Essentials from $19.95/mo.
- **MailerSend Free is now small and gated:** 500 emails/month. You need account approval plus your organisation's address and a credit card, which isn't charged. **Postmark Free** gives 100 emails/month for testing, with manual account approval before you can send to outside domains.
- **Whatever you pick, set up a sending subdomain** with SPF and DKIM, a custom Return-Path/bounce domain (so SPF aligns), and DMARC at p=none or stricter with an rua report address. This meets the Gmail/Yahoo bulk-sender baseline (2024+), which Gmail has enforced with rejections since November 2025.
- **A human is needed for:** creating accounts, entering a card (MailerSend), filling the SES production-access form, waiting for Postmark/MailerSend approval, editing DNS, and checking Brevo prices in a real browser. Brevo's pricing page didn't render for the fetcher.

## Verify first

1. **SendGrid has no permanent free plan, only a 60-day / 100-per-day trial.** Fetch twilio.com/en-us/products/email-api/pricing (not sendgrid.com/pricing, which redirect-loops). Expect "100 emails/day for 60 days" and Essentials "starting at $19.95/mo". If not, re-explore the SendGrid section.
2. **Resend Free is 3,000/mo with a 100/day cap, and Pro is $20/mo for 50,000.** Fetch resend.com/pricing. If the numbers differ, re-explore Resend.
3. **MailerSend Free is 500/mo and needs approval plus a card.** Fetch www.mailersend.com/pricing. Expect "500 emails /month" and the approval/credit-card wording. If not, re-explore MailerSend.
4. **SES sandbox limits and the credit-based free tier.** Fetch docs.aws.amazon.com/ses/latest/dg/request-production-access.html (expect 200/24h, 1/sec, 96-hour response) and aws.amazon.com/ses/pricing/ (expect $0.10 per 1,000 à la carte and "up to $200 in AWS Free Tier credits"). If not, re-explore SES.
5. **Brevo Free is 300 emails/day.** This needs a real browser at www.brevo.com/pricing/, because the fetcher saw only the page title. If it can't be confirmed, keep Brevo labelled first-party claim only; if it differs, re-explore the Brevo section.

## Domains

### resend.com — best developer free tier among API-first providers; 3,000/mo, 100/day
- **Access** (2026-11-07, observed): The pricing page and docs fetched cleanly.
- **Pricing** (2026-11-07, observed, "$" without a currency code, billed monthly):
  - **Transactional Free, $0/mo:** 3,000 emails/month, 100 emails/day, 3 domains, 30-day data retention, 1 webhook endpoint. Also shows 3 inboxes, 10,000 automation runs/month and 5 AI credits/month. No dedicated IPs or SSO. Ticket support only.
  - **Pro, $20/mo:** 50,000 emails/month with no daily limit. Overage is $0.90 per 1,000, billed in 1,000-email buckets, and only once "Transactional Overages" is enabled in team settings.
  - **Marketing Free:** 1,000 contacts/month and 3 segments.
- **Rules** (2026-11-07, observed, docs): You must add and verify a domain you own; shared or public domains aren't used. Verification needs DKIM and SPF records, which are TXT plus MX or CNAME records generated per domain on the dashboard's Records tab (the docs don't print exact host names). Return-Path defaults to `send.<your-domain>`, and a custom subdomain can be set. The docs recommend sending from a subdomain (such as updates.example.com). DMARC isn't required for verification and is presented as the next step.
- **Gotchas:** Turn off Cloudflare-style proxying on the CNAME records, or verification won't complete (observed, docs). The free tier has a 100/day cap even though the monthly cap is 3,000.

### postmarkapp.com — strict, deliverability-focused; free tier is only for testing
- **Access** (2026-11-07, observed): The pricing page fetched cleanly. Support articles were seen only as search snippets.
- **Pricing** (2026-11-07, observed, USD per the page's structured data, monthly):
  - **Free developer plan, $0.00/mo:** 100 emails/month. No overages allowed. The plan doesn't expire, and unused emails don't roll over.
  - **Basic, $15.00/mo:** starts at 10,000 emails/month, with overage at $1.80 per 1,000.
  - A $75 credit is offered to bootstrapped companies that have launched, are charging, and have no outside investment. You request it from support.
- **Rules** (2026-11-07, first-party claim via search snippets of postmarkapp.com support articles):
  - Every new account is manually reviewed. Until approval you can only send to addresses at domains you've added and verified.
  - Review is "completed in less than 24 hours on weekdays", and a little longer at weekends. A blackhole test address is provided for testing in the meantime.
  - A custom Return-Path is available to all customers through a CNAME (for example `pmbounces.<your-domain>`). It makes SPF align for DMARC. Without it, DMARC passes only on DKIM.
- **Gotchas:** Postmark requires permission-based (opted-in) recipients (first-party claim). Plan for the approval wait before launch.

### aws.amazon.com / docs.aws.amazon.com (Amazon SES) — cheapest per email; sandbox and review required
- **Access** (2026-11-07, observed): The pricing page and SES developer guide fetched cleanly.
- **Pricing** (2026-11-07, observed, "$" without a currency code):
  - **Outbound à la carte:** $0.10 per 1,000 emails, plus $0.12 per GB of attachment data. EC2 data-transfer charges may also apply.
  - **SES plan tiers (0–10M emails/month):** Essentials $0.16, Pro $0.22 and Enterprise $0.23 per 1,000 emails. Each plan also has a fixed fee "per account per region per month"; the fee amounts weren't captured.
  - **Dedicated IPs:** standard $24.95/month per IP. Managed is $15/month per account plus $0.08 per 1,000 emails.
  - **Virtual Deliverability Manager:** $0.07 per 1,000 emails.
- **Free tier** (2026-11-07, observed): New AWS customers get "up to $200 in AWS Free Tier credits" usable on eligible services including SES. The free plan runs 6 months from account creation, and credits must be used within 12 months. The page shows no SES-specific per-message free quota.
- **Rules / sandbox** (2026-11-07, observed, developer guide "Request production access"):
  - **Sandbox limits:** Every new account is in the sandbox, separately per AWS Region. You can send only to verified addresses and domains (or the mailbox simulator), up to 200 messages per 24 hours and 1 message per second.
  - **Requesting production:** Use the console (Account dashboard, then Get set up, then Request production access) or `aws sesv2 put-account-details`. The form asks for the mail type (Transactional or Marketing), a website URL, up to 4 contact addresses and a language (EN/JA). You must also acknowledge that you send only to people who asked for mail and that you handle bounces and complaints.
  - **Timing:** The first response comes within 96 hours, longer if AWS needs more information. Verifying a domain first is described as speeding approval.
  - **After approval:** Every From/Source/Sender/Return-Path identity still has to be verified.
- **Gotchas:** The sandbox applies per region, so requesting production in one region doesn't lift it elsewhere. Sending from EC2 may also need the port-25 throttle removed (observed, same page). Older third-party articles describe a per-message SES free tier; today's pricing page shows only the credit-based AWS Free Tier.

### www.twilio.com (SendGrid) — free plan retired; 60-day trial only
- **Access** (2026-11-07, observed): sendgrid.com/en-us/pricing redirects (301) to www.twilio.com/en-us/sendgrid, which has no figures. www.twilio.com/en-us/sendgrid/pricing redirects back to sendgrid.com/pricing, which loops. The working pricing URL is www.twilio.com/en-us/products/email-api/pricing.
- **Pricing** (2026-11-07, observed, "$", monthly):
  - **Free Trial, $0/mo:** "100 emails/day for 60 days", no credit card required.
  - **Paid tiers:** Essentials from $19.95/mo, Pro from $89.95/mo, Premier custom.
  - Included volumes per tier and overage rates aren't printed on the page. It uses a volume selector, and overage rates are in a separate article.
- **Recent change** (2026-11-07, observed, two Twilio changelog entries, dated May 27, 2025 and May 28, 2025, each giving its own date as the start): Twilio began retiring the Free Email API and Free Marketing Campaigns plans. Free users kept full access for 60 days. After that, sending was paused for all free plans, and accounts with more than 100 contacts had them deleted with no restore. The page doesn't state the end date. Third-party articles cite July 26, 2025, which is May 27 plus 60 days and isn't a Twilio-stated date.
- **Gotchas:** The pricing page still calls the trial "our free plan" in places. Treat it as time-boxed.

### www.mailgun.com — permanent free tier at 100/day, with thin features
- **Access** (2026-11-07, observed): The pricing page fetched cleanly.
- **Pricing** (2026-11-07, observed, USD):
  - **Free, $0/mo:** 100 emails/day with no monthly cap listed, 1 custom sending domain and 1-day log retention.
  - **Basic:** from $15/mo for 10,000 emails/month, with overage from $1.80 per 1,000.
  - The FAQ mentions free 30-day trials on paid plans, but Basic shows none.
- **Rules** (2026-11-07, first-party claim via search snippets): A Mailgun comparison page says sign-up needs no credit card, and another Mailgun page says the free tier has no time limit. A sandbox domain exists for tests while your own domain is verified. Its recipient restrictions weren't confirmed.
- **Gotchas:** One-day log retention makes debugging delivery hard on the free plan.

### www.brevo.com / help.brevo.com — 300/day free per Brevo's own copy; not verified on the pricing page
- **Access** (2026-11-07, blocker): www.brevo.com/pricing/ and www.brevo.com/products/transactional-email/ returned only the page title to the fetcher (content renders client-side). help.brevo.com returned HTTP 403.
- **Pricing** (2026-11-07, first-party claim via search snippets of brevo.com pages, not opened):
  - **Free:** 300 emails/day, "forever free", no credit card required.
  - **Paid:** Starter from $9/mo for 5,000 emails/month. The transactional page snippet lists Starter from $9/month, Standard from $18/month, and Professional from $499/month for 150,000 emails.
  - One Brevo comparison table says "$9 for 500 contacts", which conflicts with the other snippets.
- **Third-party** (2026-11-07): Several review sites agree on 300/day and roughly 9,000/month on Free. Older articles show different Starter prices.
- **Gotchas:** Brevo prices change often and its marketing plans are contact-based, so confirm in a real browser before relying on them.

### www.mailjet.com — largest free monthly allowance found (6,000/mo), excluding VAT
- **Access** (2026-11-07, observed): The pricing page fetched cleanly.
- **Pricing** (2026-11-07, observed, USD shown; EUR/GBP selectable but not displayed):
  - **Free, $0/month:** 6,000 emails/month, 200 emails/day and 1,000 contacts. API, SMTP relay and webhooks are included. "No Mailjet logo" first appears at Essential, so Free likely carries the logo; that's inferred.
  - **Starter, $9/month:** 8,000 emails/month, no daily sending limit and 2,000 contacts. Annual billing gets a 10% discount, but the annual price isn't shown.
- **Tax basis** (observed): Prices exclude VAT and are subject to French VAT. EU companies with an intra-Community VAT number may be exempt.
- **Gotchas:** There's no API-only price list; the email API is part of the same plans.

### www.mailersend.com — free tier cut to 500/mo; approval and card required
- **Access** (2026-11-07, observed): The pricing page fetched cleanly. A help URL found in search (how-will-the-hobby-plan-update-affect-my-account) returned 404.
- **Pricing** (2026-11-07, observed; invoices are charged in USD, and EUR/GBP are shown for information only):
  - **Free:** 500 emails/month, reset every 30 days.
  - **Hobby:** $7.00/month (€6.44, £5.53) for 5,000 emails/month, with overage at $1.50 per 1,000. Yearly billing is $5.60/month or $67.20 a year.
  - The page says yearly saves 10%, but $5.60 against $7.00 is 20%. Re-check before quoting.
- **Free-plan limits** (2026-11-07):
  - The fetched pricing page said 100 daily API requests (observed). A search snippet of MailerSend's help page says a daily limit of 100 emails (first-party claim).
  - Other limits: 1 sending domain, 1 template, 1 webhook, 1 API token, 1 user and 1-day activity retention.
- **Rules** (2026-11-07, observed): "Once your account is approved, you can subscribe to a Free plan." You also have to enter your organisation's address and credit card details (not charged) to prevent abuse.
- **Recent change** (third-party, unconfirmed): One digest says Free was cut from 3,000 to 500/month and Hobby set at $7, effective 2025-10-22. No first-party date was found.

### loops.so — contact-based SaaS email platform; transactional included in the send cap
- **Access** (2026-11-07, observed): The pricing page fetched cleanly.
- **Pricing** (2026-11-07, observed, "$"):
  - **Free:** up to 1,000 subscribed contacts and 4,000 marketing plus transactional sends combined per rolling 30-day window. Includes a "Powered by Loops" footer and allows up to 10 emails/second.
  - **Growth, $49/month:** up to 5,000 contacts, unlimited marketing and transactional sends, no branding, up to 1,000 emails/second. Transactional sending is included at no extra charge on paid plans.
- **Verdict:** Relevant only if you also want marketing/lifecycle email. As a pure transactional API it's pricier than the others.

### www.useplunk.com — open-source option; pay-per-email or self-host
- **Access** (2026-11-07, observed): The pricing page fetched cleanly.
- **Pricing** (2026-11-07, observed, "$"):
  - **Free:** 1,000 emails/month, unlimited contacts, with Plunk branding.
  - **Paid:** "$0.001 / email" with no base charge. Includes a monthly spend cap and removes branding.
  - **Self-hosted:** free, AGPL-3.0, deployed with Docker Compose.
- **Gotchas:** Self-hosting still needs an underlying sending service and your own DNS authentication. This page doesn't detail that.

### support.google.com + senders.yahooinc.com — Gmail/Yahoo sender rules (2024+), brief
- **Label:** mailbox-provider rules, not an email-API vendor (observed 2026-11-07).
- **Gmail, all senders:**
  - SPF or DKIM.
  - Valid forward and reverse DNS (PTR) for sending IPs.
  - TLS.
  - Messages formatted per RFC 5322.
  - Spam rate in Postmaster Tools below 0.3%.
  - DKIM keys of at least 1024 bits, with 2048 recommended.
- **Gmail, bulk senders (5,000+ messages/day to Gmail accounts):**
  - SPF and DKIM and DMARC. Policy p=none is allowed, and the From: domain must align with SPF or DKIM.
  - One-click unsubscribe (RFC 8058 List-Unsubscribe-Post plus an HTTPS List-Unsubscribe header) and a visible unsubscribe link in marketing and subscribed mail.
  - Spam rate under 0.30%; under 0.10% is recommended.
- **Gmail timeline (FAQ):**
  - February 2024: requirements began.
  - June 2024: bulk senders with a spam rate above 0.3% lost mitigation eligibility.
  - June 1, 2024: deadline for one-click unsubscribe.
  - November 2025: "ramping up its enforcement" with temporary and permanent rejections.
  - Unsubscribe requests should be honoured within 48 hours.
- **Yahoo, all senders:** SPF or DKIM, spam rate below 0.3%, valid forward and reverse DNS, and RFC 5321/5322 compliance.
- **Yahoo, bulk senders:**
  - SPF and DKIM, plus a passing DMARC policy of at least p=none. Relaxed alignment is acceptable.
  - One-click List-Unsubscribe; RFC 8058 POST is highly recommended and mailto is accepted.
  - A visible unsubscribe link, with requests honoured within 2 days.
- **Yahoo timeline:** enforcement from February 2024, rolled out gradually through the first half of that year.
- **Practical reading (synthesis, not a provider rule):** A new app's password resets and receipts usually fall under the all-senders rules. Setting up SPF, DKIM, an aligned Return-Path and DMARC from day one costs nothing and avoids problems when volume grows.

## Dead ends
- **sendgrid.com/pricing and sendgrid.com/en-us/pricing:** they redirect to twilio.com/en-us/sendgrid, and twilio.com/en-us/sendgrid/pricing redirects back to sendgrid.com/pricing, a loop. Use twilio.com/en-us/products/email-api/pricing.
- **twilio.com/en-us/sendgrid:** a marketing page that mentions a "Free trial", but has no figures.
- **brevo.com/pricing/ and brevo.com/products/transactional-email/:** rendered client-side, so the fetch returned only the title.
- **help.brevo.com:** the free-plan limits FAQ returned 403.
- **mailersend.com/help/how-will-the-hobby-plan-update-affect-my-account:** 404, although the URL appeared in search results.
- **resend.com/docs domain pages:** they don't print exact DNS host names; values are generated per domain in the dashboard.
- **support.google.com/a/answer/81126:** the Gmail sender guidelines page has the requirements but not the enforcement timeline. The timeline is in the FAQ at support.google.com/a/answer/14229414.
- **"SendGrid free plan retired July 26, 2025" (third-party):** derived from May 27 plus 60 days. Twilio's changelog doesn't state that date.

## Observed prices

| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | resend.com/pricing | Transactional Free: 3,000/mo, 100/day | $0/mo | observed; "$", no code shown |
| 2026-11-07 | resend.com/pricing | Pro: 50,000/mo; overage | $20/mo; $0.90 per 1,000 | observed; monthly; tax not stated |
| 2026-11-07 | postmarkapp.com/pricing | Free developer: 100/mo, no overage | $0.00/mo | observed; USD |
| 2026-11-07 | postmarkapp.com/pricing | Basic: from 10,000/mo; overage | $15.00/mo; $1.80 per 1,000 | observed; USD; monthly |
| 2026-11-07 | aws.amazon.com/ses/pricing | Outbound à la carte | $0.10 per 1,000 emails | observed; "$"; plus $0.12/GB attachments |
| 2026-11-07 | aws.amazon.com/ses/pricing | Plan per-email rates (0–10M/mo): Essentials / Pro / Enterprise | $0.16 / $0.22 / $0.23 per 1,000 | observed; plus fixed fee per account per region (not captured) |
| 2026-11-07 | aws.amazon.com/ses/pricing | Dedicated IP (standard) | $24.95/month per IP | observed |
| 2026-11-07 | aws.amazon.com/ses/pricing | New-customer Free Tier credits | up to $200 | observed; 6-month free plan; credits used within 12 months |
| 2026-11-07 | twilio.com/en-us/products/email-api/pricing | SendGrid Free Trial: 100/day for 60 days | $0/mo | observed; no card |
| 2026-11-07 | twilio.com/en-us/products/email-api/pricing | SendGrid Essentials / Pro | from $19.95/mo / from $89.95/mo | observed; "$"; volumes not printed |
| 2026-11-07 | mailgun.com/pricing | Free: 100/day, 1 domain | $0/mo | observed; USD |
| 2026-11-07 | mailgun.com/pricing | Basic: 10,000/mo; overage | from $15/mo; from $1.80 per 1,000 | observed; USD |
| 2026-11-07 | mailjet.com/pricing | Free: 6,000/mo, 200/day | $0/month | observed; USD; excl. VAT |
| 2026-11-07 | mailjet.com/pricing | Starter: 8,000/mo, no daily limit | $9/month | observed; USD; excl. VAT (French VAT applies) |
| 2026-11-07 | mailersend.com/pricing | Free: 500/mo | $0 | observed; approval + card required |
| 2026-11-07 | mailersend.com/pricing | Hobby: 5,000/mo; overage | $7.00/month ($5.60/month yearly, $67.20/yr); $1.50 per 1,000 | observed; invoiced in USD; EUR/GBP shown for information only |
| 2026-11-07 | loops.so/pricing | Growth: 5,000 contacts, unlimited sends | $49/month | observed; "$" |
| 2026-11-07 | useplunk.com/pricing | Paid per email | $0.001 / email | observed; no base charge |
| 2026-11-07 | brevo.com (search snippets) | Free 300/day; Starter 5,000/mo | $0; from $9/mo | first-party claim, not opened |

## Prep checklist
- A domain with DNS access. Choose a sending subdomain (for example `mail.<domain>` or `updates.<domain>`), and keep transactional and marketing on separate subdomains or streams.
- DNS records to add: the provider's DKIM record(s), SPF include (TXT), a bounce/Return-Path record (MX or CNAME, provider-specific), and a DMARC TXT at `_dmarc` with at least p=none plus an rua reporting mailbox. Leave CNAMEs unproxied.
- A live website URL and a short description of what you'll send and how recipients opt in. SES and Postmark reviews look for these.
- A bounce and complaint handling plan, such as webhooks or suppression. SES requires you to acknowledge one.
- Organisation address and a payment card if you choose MailerSend Free; nothing is charged.
- If any mail is promotional: List-Unsubscribe plus List-Unsubscribe-Post headers, a visible unsubscribe link, and processing within 48 hours.
- Keep the spam complaint rate under 0.3% (under 0.1% recommended), and monitor it in Google Postmaster Tools.

## Needs a human
- Creating any provider account and accepting its terms.
- Entering card or organisation details (MailerSend Free; any paid plan).
- Submitting the SES production-access request, separately for each region, and answering follow-ups. Allow up to 96 hours for a first response.
- Waiting for Postmark's manual account review and MailerSend's account approval.
- Editing DNS at the registrar or DNS host.
- Confirming Brevo's live pricing in a real browser, which the fetcher couldn't render.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-07 — reviewed (independent): SendGrid retirement date noted as May 27/28, 2025 (two Twilio entries); Brevo verify step given a re-explore pointer; angle-bracket placeholders put in code spans; spot-checked SES sandbox limits (unchanged).
