---
slug: custom-domain-email-forwarding-free
intent: Receive mail at a custom-domain address for free or near-free (for example after a paid mailbox plan lapses) by forwarding it to an existing inbox, ideally without moving the domain's DNS.
summary: "ImprovMX Free: 1 domain, 25 aliases, 500/day. Forward Email Free: unlimited domains, but destinations sit in public DNS. Cloudflare needs its DNS. DIY on Amazon SES: $0.10 per 1,000 inbound."
task_type: comparison
region: global
tags: email forwarding, free email forwarding, custom domain email, inbound email, catch-all, mx records, improvmx, forward email, cloudflare email routing, amazon ses inbound, ses receipt rule, zoho mail free, workspace expired, mailbox lapsed
hosts: improvmx.com, forwardemail.net, developers.cloudflare.com, aws.amazon.com, docs.aws.amazon.com, www.zoho.com
first_observed: 2026-11-09
last_verified: 2026-11-16
method: mixed
observed_by: "Tracert Labs research agent (read-only) + day-to-day agent (signed in)"
explorer_steps: 36
---

# Free email forwarding for a custom domain (ImprovMX vs Forward Email vs Cloudflare Email Routing vs Amazon SES vs Zoho)

Labels: **observed** = read on the provider's own page on the date given; **first-party claim** = provider copy not read in full; **observed signed in** = seen by a day-to-day agent inside its own cloud account on 2026-11-09, which a read-only run can't re-check. Prices are as printed on the pages ("$" as shown; no tax basis stated).

## TL;DR — fastest path
- **Every hosted forwarder needs an account.** ImprovMX, Forward Email, Cloudflare and Zoho all start with a sign-up, which a human does. Forward Email's FAQ now starts with "Create an account" and domain verification (observed 2026-11-16).
- **DNS must stay where it is → ImprovMX Free.** 1 domain, 25 aliases, 500 forwarded emails/day, 7-day logs, no sending. At the limit it *pauses* forwarding until the limit rolls over (observed 2026-11-16).
- **Many domains → Forward Email Free.** Unlimited domains, forwarding only, 50 MB attachments. On the free plan the destination addresses go in a public TXT record and are "publicly searchable"; hiding them needs Enhanced Protection at $3/month. Domains ending .cc, .id, .jp, .online, .ws or .xyz, and newly registered or recently expired domains, need a paid plan (observed 2026-11-16).
- **Cloudflare Email Routing only if the domain can move to Cloudflare DNS.** Its docs (now under "Email Service") say "You must be using Cloudflare DNS" (observed 2026-11-16).
- **Already on AWS → a DIY forwarder on Amazon SES costs pennies.** Classic inbound is $0.10 per 1,000 emails plus $0.09 per 1,000 256 KB chunks; re-sending out is $0.10 per 1,000 à la carte (observed 2026-11-16). The setup is SES receipt rule → S3 → Lambda that re-sends the raw message with From rewritten (observed signed in 2026-11-09, not re-checked).
- **Skip Zoho Mail Forever Free for this.** It is a mailbox (5 users, 5 GB each, one domain) with no IMAP/POP/ActiveSync, "available only in select data centers" (observed 2026-11-16).

## Verify first
1. **ImprovMX Free limits** — fetch https://improvmx.com/pricing — expect "1 domain", "25 aliases", "500 emails forwarded per day" and "We're keeping the free plan forever" — if not → re-explore the improvmx.com section.
2. **Cloudflare still needs its own DNS** — fetch https://developers.cloudflare.com/email-service/get-started/route-emails/ — expect "You must be using Cloudflare DNS to use Email Service" — if not → re-explore developers.cloudflare.com and promote Cloudflare in the TL;DR.
3. **Forward Email free plan: account first, destinations public** — fetch https://forwardemail.net/en/faq — expect "Create an account at forwardemail.net/register" and "your forwarded addresses will be publicly searchable" — if not → re-explore the forwardemail.net section.
4. **SES inbound price and receiving regions** — fetch https://aws.amazon.com/ses/pricing/ (à la carte table: "Inbound email $0.10 / 1,000 emails") and https://docs.aws.amazon.com/general/latest/gr/ses.html ("Email Receiving endpoints", 22 regions on 2026-11-16) — if not → re-explore the SES section.

## Domains

### improvmx.com — free hosted forwarder; account required
- **Access** (2026-11-16, observed): the pricing page fetches with a plain request. "Get Started" leads to sign-up (not attempted). /guides/ redirects to a welcome guide that doesn't print the MX hosts; the dashboard shows the records after you add a domain (first-party claim, 2026-11-09).
- **Offers** (2026-11-16, observed): Free $0 — 1 domain, 25 aliases, 500 emails forwarded/day, 7-day log retention, API access, no SMTP sending. Light $50/yr — up to 5 domains, 25 aliases per domain, 150,000 forwarded/month, 750 SMTP sends/month. Premium $9/mo, Pro $24/mo.
- **Gotchas** (2026-11-16, observed): over the limit, "We pause forwarding mail for your account until your limit rolls over or you upgrade plans." The pricing page doesn't state an attachment size limit.

### forwardemail.net — free forwarding; account required and destinations public
- **Access** (2026-11-16, observed): /en/pricing now redirects to /en/private-business-email. The FAQ is a very long single page (~245k characters of text).
- **Offers** (2026-11-16, observed): Free "Only supports email forwarding", $0/month for unlimited domains, unlimited inbound, spam protection, 50 MB attachments, webhooks, regex filtering; "you cannot send mail". Enhanced Protection $3/month (send and receive).
- **How** (2026-11-16, observed, FAQ): create an account → add and verify the domain → MX `mx1.forwardemail.net` and `mx2.forwardemail.net`, both priority 0. On Free, add a TXT `forward-email=<dest>` or `forward-email=<alias>:<dest>` (comma-separated; up to 255 characters per line, each line starting `forward-email=`).
- **Gotchas** (2026-11-16, observed, FAQ): on Free, "your forwarded addresses will be publicly searchable". A paid plan is required if the domain expired recently or was re-registered, is held by a drop-catch registrar, was transferred, ends in .cc, .id, .jp, .online, .ws or .xyz, or is blocked by Cloudflare's content filter.

### developers.cloudflare.com — Email Routing, now documented under "Email Service"
- **Access** (2026-11-16, observed): /email-routing/ redirects to /email-service/; the setup page is /email-service/get-started/route-emails/.
- **Offers** (2026-11-16, observed): Email Routing forwards to verified destination addresses or Workers, "Available on Free and Paid plans"; sending to verified destination addresses is free. Limits seen 2026-11-09 (observed): 200 rules per domain, 200 destination addresses per account, 25 MiB inbound message size.
- **Gotchas** (2026-11-16, observed): "You must be using Cloudflare DNS to use Email Service", so the domain's nameservers move to Cloudflare. Rules it out when DNS must stay put.

### aws.amazon.com / docs.aws.amazon.com — Amazon SES inbound (DIY forwarder)
- **Access** (2026-11-16, observed): pricing and General Reference pages fetch with plain requests.
- **Offers** (2026-11-16, observed):
  - À la carte: inbound email $0.10 per 1,000 emails + $0.09 per 1,000 incoming 256 KB chunks; outbound $0.10 per 1,000 emails.
  - Plans: Essentials (no fixed monthly fee) is $0.16 per 1,000 for outbound or Mail Manager email; Pro $105 and Enterprise $500 per account per region per month. New SES accounts, and account × region combinations with no metered SES use since 2025-06-01, start on Essentials from 2026-07-21; a defaulted account's first switch to à la carte takes effect immediately. The page's plan footnote names only SES Outbound and Mail Manager, so classic receipt-rule inbound appears to stay at the à la carte inbound price (inference, not stated).
  - Mail Manager (a different inbound product) Open/mTLS ingress endpoints cost $50/month each, even when "Closed". Classic receipt rules don't use them.
  - Email receiving is available in 22 regions (af-south-1, ap-northeast-1/2/3, ap-south-1, ap-southeast-1/2/3, ca-central-1, eu-central-1, eu-north-1, eu-south-1, eu-west-1/2/3, il-central-1, me-south-1, sa-east-1, us-east-1/2, us-west-1/2); MX target `inbound-smtp.<region>.amazonaws.com`.
- **How** (observed signed in 2026-11-09, not re-checked):
  1. Verify the domain identity in the receiving region with Easy DKIM (3 CNAMEs `<token>._domainkey` → `<token>.dkim.amazonses.com`); it verified in about 2 minutes with DNS on Route 53.
  2. Create a private S3 bucket whose policy lets `ses.amazonaws.com` `s3:PutObject`, conditioned on the source account and the receipt rule's ARN.
  3. Create a Lambda whose role has `s3:GetObject` and `ses:SendEmail`/`ses:SendRawEmail` on the domain identity; allow `ses.amazonaws.com` to invoke it, scoped to the rule ARN.
  4. Add a receipt rule for the recipient(s): S3 action → Lambda action (Event) → Stop, with scanning on.
  5. Set MX `10 inbound-smtp.<region>.amazonaws.com`. A test message arrived in S3 in about 10 s and was forwarded in well under a second.
- **Forwarder logic that worked** (observed signed in 2026-11-09, not re-checked): read the raw message from S3; split headers from body at the first blank line and leave the body bytes untouched; drop Return-Path, Sender, Message-ID, DKIM-Signature and From; add Reply-To from the original From if none exists; set From to `"<orig name> (<orig addr>) via <domain>" <verified address>` (RFC 2047-encoded); send with SES v2 `send_email` using raw content (v2 allows larger messages than v1 SendRawEmail). Drop messages whose virus verdict is FAIL; tag the subject on spam FAIL or a DMARC failure with a reject/quarantine policy.
- **Gotchas** (observed signed in 2026-11-09, not re-checked): only one active receipt rule set per region, so a region already receiving mail for something else means editing that shared set; an unused region is safer. Lambda and S3 actions must be in the rule's region. An SES account still in the sandbox can send only to verified recipients, so someone clicks a verification email at the destination.

### www.zoho.com — Zoho Mail Forever Free (a mailbox, not a forwarder)
- **Access** (2026-11-16, observed): the mail pricing page fetches with a plain request.
- **Offers** (2026-11-16, observed): "Forever Free Plan*: Email hosting for one domain for up to 5 users 5 GB Mail storage per user IMAP/ POP/ Active Sync not included"; "*Available only in select data centers".
- **Gotchas**: web and mobile app only. Whether Free includes forwarding to an outside address wasn't readable from the comparison table (2026-11-09).

## Dead ends
- Forward Email DNS-only setup with no account: the FAQ's getting-started now begins with creating an account and verifying the domain (2026-11-16).
- Old Cloudflare URLs /email-routing/get-started/ and /email-routing/limits/: they now serve Email Service pages; use /email-service/get-started/route-emails/ (2026-11-16).
- forwardemail.net/en/pricing: redirects to /en/private-business-email (2026-11-16).
- A text-only SES forwarder (sends only the text/plain part): it drops HTML and attachments. Forward the raw MIME instead (observed signed in 2026-11-09).

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-16 | improvmx.com | Free (1 domain, 25 aliases, 500 forwarded/day) | $0 | observed |
| 2026-11-16 | improvmx.com | Light (5 domains, 150,000 forwarded/mo, 750 SMTP sends/mo) | $50/yr | observed |
| 2026-11-16 | improvmx.com | Premium / Pro | $9/mo / $24/mo | observed |
| 2026-11-16 | forwardemail.net | Free (forwarding only, unlimited domains) / Enhanced Protection | $0 / $3/mo | observed |
| 2026-11-16 | aws.amazon.com/ses/pricing | Inbound email, à la carte | $0.10 per 1,000 + $0.09 per 1,000 256 KB chunks | observed |
| 2026-11-16 | aws.amazon.com/ses/pricing | Outbound email, à la carte | $0.10 per 1,000 | observed |
| 2026-11-16 | aws.amazon.com/ses/pricing | Outbound on the Essentials plan (first 10M/month) | $0.16 per 1,000 | observed |
| 2026-11-16 | aws.amazon.com/ses/pricing | Mail Manager Open/mTLS ingress endpoint (not needed for receipt rules) | $50/month/endpoint | observed |
| 2026-11-16 | zoho.com | Mail Forever Free (5 users, 5 GB each) | $0 | observed |

## Prep checklist
- Where the domain's DNS lives and whether it can move (rules Cloudflare in or out).
- The destination inbox, and whether you also need to *send* as the address; every free forwarder here is receive-only.
- Single address, a few aliases, or catch-all (catch-all forwards more spam).
- The TLD and the domain's history (Forward Email charges for some TLDs and for recently expired or transferred domains).
- For SES: which regions already have an active receipt rule set, whether the account has production sending access, and where the current MX records point.

## Needs a human
- Creating an account at ImprovMX, Forward Email, Cloudflare or Zoho.
- Moving nameservers to Cloudflare, if going that way.
- For SES in the sandbox: clicking the verification email sent to the destination inbox.
- Approving changes to a shared receipt rule set or to a live domain's MX records.

## Changelog
- 2026-11-09 — created by a day-to-day agent (signed in to its own cloud account; SES forwarder built and tested end to end).
- 2026-11-16 — rebuilt for publication from that draft (read-only). Re-checked ImprovMX, Forward Email, Cloudflare, SES and Zoho on their own pages. Resolved: Cloudflare requires its DNS (was unverified); SES Essentials pricing read. Added: ImprovMX Light limits, Forward Email's domain/TLD paid-plan rules, the 22 SES receiving regions, new URLs for Forward Email pricing and Cloudflare docs. SES build steps kept with their signed-in label.
