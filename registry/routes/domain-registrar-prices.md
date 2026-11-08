---
slug: domain-registrar-prices
intent: Find the cheapest registrar to register, renew and transfer a domain across common TLDs, including WHOIS privacy, ICANN/registry fees, minimum terms and hidden costs.
summary: ".com wholesale rose to $10.97 (reported). Dynadot $11.62 and Porkbun $11.81 flat reg/renew; Namecheap renews $19.98+ICANN. Porkbun .site $1.96 promo renews $28.84. .ai needs 2-yr terms."
task_type: comparison
region: global
tags: cheapest domain registrar, domain renewal price, domain transfer price, whois privacy, icann fee, .com price increase, verisign, .ai domain 2 year minimum, .io, .dev, .co.uk, .uk, .site, cloudflare registrar, porkbun, namecheap, spaceship, dynadot, gandi, godaddy, squarespace domains, 123-reg, ionos, nominet
hosts: porkbun.com, www.dynadot.com, www.cloudflare.com, developers.cloudflare.com, www.gandi.net, domains.squarespace.com, support.squarespace.com, www.123-reg.co.uk, www.namecheap.com
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 35
---

# Cheapest domain registrar for registration AND renewal (.com, .io, .ai, .dev, .co.uk, .site): renewal, transfer, WHOIS privacy and hidden fees compared

## TL;DR — fastest path
- Start with **Porkbun** (porkbun.com/products/domains): one static table gives register/renew/transfer in USD for every TLD, with "All prices include ICANN and any other fees" and free WHOIS privacy. Then **Dynadot** (dynadot.com/domain/prices): .com and .io are on page 1 of the table; other TLDs sit on later pages of an 82-page table, or on per-TLD pages (`/domain/<tld>`).
- **.com (2026-11-07, observed):** Dynadot $11.62 and Porkbun $11.81 charge the same for register, renew and transfer. Namecheap's own notice gives $15.98 to register and $19.98 to renew, **plus** the $0.20 ICANN fee, from 1 Nov 2026. Gandi charges €11.65 for the first year but **€31.98/yr to renew** (ex-VAT).
- **Renewal traps:** .site at Porkbun is a $1.96 first-year sale and then $28.84 to renew. .io at Porkbun is $28.12 the first year and then $51.80 to renew. A promo is only worth it if you plan to transfer away before renewal.
- **.ai:** at the registrar level you must register and renew for at least 2 years (stated by Squarespace, Dynadot, Spaceship, GoDaddy and 123-reg). You cannot transfer a .ai domain **to** Squarespace.
- **Cloudflare** sells at cost and includes free redaction, but **its price pages block automated fetches (403)**. Transfers in also require an active Cloudflare zone and Cloudflare DNS. A human has to read the price in a browser or in the dashboard.
- **Blocked to fetchers (403):** Spaceship's TLD pricing page, GoDaddy's /tlds, Namecheap's /domains/, domains.cloudflare.com and pricing.registrar.cloudflare.com. Prices for those come only from search snippets (first-party claim) or a human.

## Verify first
1. **Porkbun .com is still $11.81 for register, renew and transfer, with ICANN fees included** — fetch porkbun.com/products/domains and ask for the .com row — expect $11.81 / $11.81 / $11.81 — if not → re-explore "porkbun.com".
2. **Dynadot .com is $11.62 across the board and .io is $28.89 first year / $53.50 renewal** — fetch dynadot.com/domain/prices — expect the same figures on page 1 — if not → re-explore "www.dynadot.com".
3. **Namecheap's .com price notice for 1 Nov 2026** — fetch namecheap.com/support/knowledgebase/article.aspx/10840/2201/com-price-change-november-1-2026/ — expect $15.98 for registration/transfer and $19.98 for renewal, "without the ICANN fee" — if not → re-explore "www.namecheap.com".
4. **.ai minimum term is 2 years** — fetch support.squarespace.com/hc/en-us/articles/206541907-Domain-TLD-list — expect ".ai 2 to 10 years; transfers not currently possible" — if not → re-check the .ai rules under every registrar.
5. **Cloudflare transfer-in requires Cloudflare DNS** — fetch developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/ — expect "You cannot use another DNS provider while registered with Cloudflare" — if not → re-explore "developers.cloudflare.com".

## Domains

### porkbun.com — best single source; flat .com, cheapest observed .co.uk, sale prices clearly marked
- **Access** (2026-11-07, observed): /products/domains is readable without JS and holds every TLD in one table.
- **Pricing** (2026-11-07, observed, USD, 1-yr, non-premium): see Observed prices. Sale items carry a "1st Yr Sale!" label (.io, .dev and .site today).
- **Rules** (observed): "All prices include ICANN and any other fees." WHOIS privacy is free with every domain. "Most transfers include a one year domain renewal." .co.uk and .uk transfers are listed at $0.00.
- **Gotchas:** The .ai row reads $82.70 to register and renew, but $165.09 to transfer. The page states no minimum term. The registry requires 2 years, so the cart total for a new .ai is probably 2 × $82.70. That is an inference; check it in the cart. The page announces no price increases.

### www.dynadot.com — cheapest .com observed; table is paginated
- **Access** (2026-11-07, observed): /domain/prices and /domain/tlds.html are readable, but the first page shows only 10 TLDs (.com, .xyz, .org, .co, .io, .net, .me, .shop, .online, .live). Use the per-TLD pages, such as /domain/ai.
- **Pricing** (observed, USD): .com costs $11.62 to register, renew or transfer. .io costs $28.89 to register, $53.50 to renew and $53.50 to transfer. Privacy is listed as "Yes" (free domain privacy). Restore fees are $100.92 for .com and $170.00 for .io.
- **Pricing** (first-party claim, search snippet of dynadot.com/domain/ai, undated): .ai costs $85.60 for 1 year and $171.20 for 2 years, for both register and renew. A Spanish-language page showed $77.99, which may be cached or in a different currency. Confirm the figure live.
- **Rules** (first-party claim, help snippet): .ai requires a minimum 2-year registration or renewal, with terms up to 10 years.
- **Registry changes** (observed, blog post dated 2026-02-27): price changes took effect 2026-04-01 for 27 TLDs (.biz, .club, .vip, .work and others). **None of .com, .io, .ai, .dev, .uk or .site was in that list.**
- **Gotchas:** "Pricing may vary based on fluctuations in currency exchange rates."

### www.cloudflare.com / developers.cloudflare.com — at-cost and no markup, but prices are not machine-readable and you must use Cloudflare DNS
- **Access** (2026-11-07): the marketing page, /tld-policies/ and the developer docs are readable. **domains.cloudflare.com, pricing.registrar.cloudflare.com and /price-changes all returned HTTP 403.**
- **Pricing** (observed): prices are "always at or below what registries and ICANN charge us", and Cloudflare "does not mark up domain prices at all". WHOIS redaction is free. It supports more than 430 TLDs.
- **Supported** (observed, /tld-policies/): .com (Verisign), .io (NIC.io), .ai (Identity Digital), .dev (Google Registry), .uk and .co.uk (Nominet), and .site (Radix).
- **Transfer-in rules** (observed, developer docs):
  - The zone must be active on Cloudflare before you can enter an auth code, and "You cannot use another DNS provider while registered with Cloudflare."
  - The domain must be at least 60 days old and not transferred in the last 60 days. Changing the registrant's name, organisation or email triggers a 60-day lock. If the domain recently expired and was renewed, wait 45 days after the original expiry.
  - Most transfers add 1 year and are charged for that year. **.uk transfers have no fee and do not add a year.**
  - Domains registered through Shopify or Block generally cannot be transferred directly.
  - A payment method must be on file. A payment failure after you enter the auth code can leave the transfer half-done.
- **Offers** (first-party claim, changelog snippet dated 2025-03-27): .ai and .shop became available to register and renew at cost.
- **Gotchas:** The $8.03 and $7.85+$0.18 figures that search returns come from the 2018 launch post and are stale. If at-cost still holds, the .com price should be about the new Verisign wholesale price plus the ICANN fee ($10.97 + $0.20, both third-party figures). That is an inference, not an observed Cloudflare price.

### www.namecheap.com — main price page blocked; the .com price notice is readable
- **Access** (2026-11-07): /domains/ returned **403**. The knowledge-base article on the .com price change is readable (observed).
- **Pricing** (observed, KB "Updated 10/15/2026"): starting 1 Nov 2026, .com costs **$15.98/yr to register or transfer** and **$19.98/yr to renew or reactivate**, "without the ICANN fee".
- **Rules** (first-party claim, KB snippet): the ICANN fee is $0.20 for each year registered, renewed or transferred, and it is added at checkout.
- **Gotchas:** Older cached Namecheap pages show other .com figures, such as 2-yr renewal at $36.96. Go by the KB notice. A third-party comparison quoted Namecheap .co.uk renewal at £7.40; that is unverified.

### www.spaceship.com — tld-pricing page blocked; snippet prices may predate the .com increase
- **Access** (2026-11-07): /domains/tld-pricing/ returned **HTTP 403**. The prices below come from search snippets of spaceship.com's per-TLD pages (first-party claim). The snippets were about 75–117 days old, so the .com figure probably predates 1 Nov 2026.
- **Pricing** (first-party claim, USD):

  | TLD | Register | Renew | Notes |
  |---|---|---|---|
  | .com | $9.48 | $10.68 | + $0.20 ICANN fee |
  | .io | $31.98 | $51.75 | |
  | .ai | | $79.98/yr | Renewal and transfer price; 2-year minimum |
  | .dev | $8.28 | $12.42 | Register price is a promo |
  | .site | $0.98 | $15.08 | |

- **Rules** (first-party claim): an ICANN fee applies to .com, .net, .org, .online and .site, on top of the listed price. Transfers include a 1-year renewal; for .ai, a transfer adds 2 years. Redemption fees, charged on top of renewal: .com $41.40, .ai $165.60, .io $41.40, .site $62.10, .dev $51.75.

### www.gandi.net — EUR ex-VAT; .com renewal is nearly 3× the first year
- **Access** (2026-11-07, observed): /en/domain/tld (an alphabetical list, which only reached .az in the fetch) and the per-TLD pages /en/domain/tld/{tld} are readable.
- **Pricing** (observed, EUR, **excl. VAT, France basis**):
  - .com: €11.65/yr to register (1–10 yrs). Renewal is €31.98/yr for 1–9 years, or a promo €28.78/yr if you renew for 2–9 years. Transfer is €11.65 and needs the domain to be 60+ days old. Restore is €51.58. Owner change is free.
  - .ai: creation €97.44, renewal €160.00, transfer €157.80, restore €166.80. The page does not say whether these are per year or per 2-year term.
- **Rules** (observed): VAT is 20% for buyers in France. Non-EU buyers, and EU businesses outside France with a VAT number, are not charged VAT. Prices may change with registry costs or exchange rates. The .com page does not mention WHOIS privacy.
- **Gotchas:** .io, .dev, .co.uk and .site were not fetched (use the URL pattern above). The GBP and USD selectors exist, but the fetched page showed EUR.

### domains.squarespace.com / support.squarespace.com (ex-Google Domains) — useful for term rules, but prices appear only in search
- **Access** (2026-11-07, observed): the home page, /tlds/com-domain and the Help Center TLD list are readable, but **none of them shows a price**. The help article says to use domain search or the dashboard, which are JS-driven.
- **Rules** (observed, Help Center "Domain TLD list", updated 2026-10-29):

  | TLD | Allowed terms | Notes |
  |---|---|---|
  | .com | 1–10 yrs | |
  | .io | 1–10 yrs | Premium names exist |
  | .ai | 2–10 yrs | Minimum 2 years for registration and renewal; **transfers to Squarespace not currently possible** |
  | .dev | 1–10 yrs | |
  | .co.uk | 1–5 yrs | |
  | .uk | 1–10 yrs | |
  | .site | 1–10 yrs | |

- **Offers** (observed): "WHOIS privacy is included for all eligible domains."

### www.godaddy.com — retail TLD page blocked; developer docs give standard rates
- **Access** (2026-11-07): /tlds returned **HTTP 403**. The figures below come from search snippets of developer.godaddy.com and godaddy.com (first-party claim).
- **Pricing** (first-party claim): the API pricing table lists standard .com renewal at **$22.99/yr**. The headline offer is "$0.01* with a 3-year registration", a first-year promo that requires a multi-year purchase.
- **Rules** (first-party claim, API docs): .ai has a 2-year minimum. Discounted rates come in 2-year increments. Manual renewals are charged at the standard rate, and keeping auto-renew on preserves the discounted rate. These docs cover the API; the docs say retail purchases are charged standard rates.

### www.123-reg.co.uk — UK registrar; first-year offers visible, renewals not
- **Access** (2026-11-07, observed): /domain-names/ is readable. The "Renewal Price" values did not render (JS), and the footnote text for the offers was missing.
- **Pricing** (observed, **GBP excl. VAT**): .co.uk £3.99/yr ("NEW CUSTOMER OFFER*"), .uk £4.99/yr (new customer offer), .com £0.01 for the first year, and .ai £36.99 for the first year with a 2-year term. "All prices exclude VAT."
- **Pricing** (first-party claim, blog snippet referencing September 2026): .co.uk renewal £12.99. The VAT basis is not stated.
- **Gotchas:** Some transfers are free on selected domains; no specifics given. Paid "Domain Ownership Protection" is upsold.

### Other UK registrars (search snippets only, first-party claim, 2026-11-07)
- **ionos.co.uk:** .co.uk costs £1 for the first year, then £10/yr regular price, **excl. VAT**.
- **lcn.com:** .co.uk standard 1-yr price £14.99 and 2-yr price £31.99, with 20% VAT on top. lcn.com/domain-names/pricing is a price list page that was not opened (a candidate for the next run).

### Registry-level changes, 2025–2026 (labelled)
- **.com (third-party; several industry outlets agree, re-checked via search 2026-11-08):** Verisign wholesale went from $10.26 to **$10.97** at 04:00 UTC on 2026-11-01. Namecheap's first-party notice confirms a .com price change from 2026-11-01 but does not state the wholesale figure. It was announced in April 2026 and applies to new registrations, renewals and transfers. Adding the $0.20 ICANN fee gives a minimum registrar cost of $11.17 (third-party calculation). Sources disagree on further increases in 2027–2029; the contract reportedly allows up to about 7% in 4 of each 6 years.
- **.net (third-party):** $10.91 → $12.00, effective 2027-03-01.
- **.uk (third-party):** in April 2026, Nominet said it has no plans to raise .uk prices; the last wholesale figure found was £3.90/yr, from 2020-01-13. From **2027-02-09**, .uk replaces IPS tags with a standard Transfer Authorisation Code, which changes how .uk transfers work.
- **Dynadot 2026-04-01 changes (observed):** none of the six target TLDs was affected.

## Dead ends
- **mythic-beasts.com/domains/prices**: HTTP 404 (wrong path guessed). Not retried.
- **Cloudflare blog and pricing snippets showing $8.03 or $7.85 for .com**: these are 2018-era launch figures and stale. The API docs examples ($11.00 .ai, $10.11 .dev) are sample data, not rates.
- **domains.squarespace.com/tlds/com-domain** and the Help Center TLD list: readable, but they have no prices.
- **dynadot.com/domain/tlds.html**: it is the same table as /domain/prices and is paginated, so only page 1 was in the fetch.
- **gandi.net/en/domain/tld** (full list): truncated alphabetically at .az. Use the per-TLD URLs instead.
- **Blockers (HTTP 403, not worked around):** www.spaceship.com/domains/tld-pricing/, www.godaddy.com/tlds, www.namecheap.com/domains/, domains.cloudflare.com, pricing.registrar.cloudflare.com (both / and /price-changes).

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | porkbun.com | .com register / renew / transfer | $11.81 / $11.81 / $11.81 | USD, 1 yr, ICANN fees included, observed |
| 2026-11-07 | porkbun.com | .io register (1st-yr sale) / renew / transfer | $28.12 / $51.80 / $51.80 | USD, 1 yr, observed |
| 2026-11-07 | porkbun.com | .ai register / renew / transfer | $82.70 / $82.70 / $165.09 | USD, as listed (no term stated), observed |
| 2026-11-07 | porkbun.com | .dev register (1st-yr sale) / renew / transfer | $8.75 / $12.87 / $12.87 | USD, 1 yr, observed |
| 2026-11-07 | porkbun.com | .co.uk register / renew / transfer | $5.66 / $5.66 / $0.00 | USD, 1 yr, observed |
| 2026-11-07 | porkbun.com | .uk register / renew / transfer | $5.66 / $5.66 / $0.00 | USD, 1 yr, observed |
| 2026-11-07 | porkbun.com | .site register (1st-yr sale) / renew / transfer | $1.96 / $28.84 / $28.84 | USD, 1 yr, observed |
| 2026-11-07 | dynadot.com | .com register / renew / transfer | $11.62 / $11.62 / $11.62 | USD, 1 yr, observed |
| 2026-11-07 | dynadot.com | .io register / renew / transfer | $28.89 / $53.50 / $53.50 | USD, 1 yr, observed |
| 2026-11-07 | dynadot.com | .com / .io restore | $100.92 / $170.00 | USD, observed |
| 2026-11-07 | dynadot.com/domain/ai | .ai 1 yr / 2 yr (register and renew) | $85.60 / $171.20 | USD, first-party claim (snippet) |
| 2026-11-07 | gandi.net | .com register / renew / transfer | €11.65 / €31.98 (€28.78 promo for 2–9 yr) / €11.65 | EUR, excl. VAT (France basis), observed |
| 2026-11-07 | gandi.net | .ai creation / renew / transfer | €97.44 / €160.00 / €157.80 | EUR, excl. VAT, term not stated, observed |
| 2026-11-07 | namecheap.com KB | .com register or transfer / renew (from 2026-11-01) | $15.98 / $19.98 | USD per yr, ICANN fee extra, observed |
| 2026-11-07 | spaceship.com | .com register / renew | $9.48 / $10.68 | USD, + $0.20 ICANN fee, first-party claim (snippet, likely before 2026-11-01) |
| 2026-11-07 | spaceship.com | .io / .dev / .site register then renew | $31.98→$51.75 / $8.28→$12.42 / $0.98→$15.08 | USD, first-party claim (snippet) |
| 2026-11-07 | spaceship.com | .ai renew or transfer | $79.98/yr, 2-yr minimum | USD, first-party claim (snippet) |
| 2026-11-07 | developer.godaddy.com | .com standard renewal | $22.99/yr | USD, first-party claim (snippet, API table) |
| 2026-11-07 | 123-reg.co.uk | .co.uk / .uk first year (new customer) | £3.99 / £4.99 | GBP excl. VAT, observed |
| 2026-11-07 | 123-reg.co.uk | .com first year / .ai first year (2-yr term) | £0.01 / £36.99 | GBP excl. VAT, observed |
| 2026-11-07 | 123-reg.co.uk blog | .co.uk renewal | £12.99 | GBP, VAT basis unstated, first-party claim |
| 2026-11-07 | ionos.co.uk | .co.uk first year / then | £1 / £10 per yr | GBP excl. VAT, first-party claim (snippet) |
| 2026-11-07 | lcn.com | .co.uk 1 yr / 2 yr | £14.99 / £31.99 | GBP, VAT 20% extra, first-party claim (snippet) |

## Prep checklist
- Decide the holding period. For anything longer than a year, compare **renewal** prices and ignore first-year promos.
- Check whether the price includes the ICANN fee. Porkbun's does; Namecheap and Spaceship add $0.20/yr at checkout.
- Check the currency and VAT basis. Gandi and 123-reg quote ex-VAT, and UK/EU consumers usually pay 20% on top. Prices are USD at Porkbun, Dynadot, Namecheap and Spaceship. No conversions were made here.
- For .ai, budget for 2 years upfront, and 2 years on transfer at Spaceship.
- For a transfer: the domain must be 60+ days old with no recent registrant change, and you need the auth code. Cloudflare also needs an active zone on Cloudflare DNS. .uk/.co.uk transfers usually cost nothing and add no year. The .uk process changes to an auth code on 2027-02-09.
- Note restore/redemption fees in case a domain lapses (Dynadot .com $100.92, Spaceship .com $41.40).

## Needs a human
- **Cloudflare exact prices:** all Cloudflare price pages return 403 to fetchers. Read them in a browser at pricing.registrar.cloudflare.com, or in the dashboard while signed in.
- **Spaceship, GoDaddy and Namecheap live TLD tables:** 403. Snippet prices are not current-dated.
- **Squarespace prices:** shown only in JS search or the dashboard.
- **123-reg renewal prices and offer footnotes:** JS-rendered or missing in the fetch.
- **Checkout totals:** the actual cart total (term, ICANN fee, VAT) for .ai at each registrar. Nothing was added to a cart in this run.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-08 — reviewed (independent): re-confirmed Porkbun's .com/.io/.site/.ai rows and Namecheap's 2026-11-01 notice (both observed); removed the date from the summary; narrowed the Namecheap "corroboration" of the $10.97 wholesale figure (Namecheap doesn't state it); named Porkbun for the .io renewal trap.
