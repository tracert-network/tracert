---
slug: uk-pcb-fabrication-quotes
intent: Get prices for a small prototype run of PCBs (with optional assembly) delivered to the UK, including shipping, UK VAT and customs handling, across Chinese, EU, US and UK fabs.
summary: "JLCPCB says it collects UK VAT for individuals on 0-135 GBP orders. Aisler charges no VAT outside the EU; PCBWay quotes exclude VAT. OSH Park: $5/sq in per 3 boards, free shipping. Most prices need a Gerber."
task_type: quote-gathering
region: GB
tags: pcb fabrication, pcb prototype, pcb quote, pcb assembly, pcba, uk vat, import vat, 135 pound threshold, customs, jlcpcb, pcbway, seeed fusion, eurocircuits, aisler, osh park, pcb train, newbury electronics, cheap pcb uk
hosts: jlcpcb.com, cart.jlcpcb.com, www.pcbway.com, www.seeedstudio.com, aisler.net, community.aisler.net, oshpark.com, docs.oshpark.com, www.eurocircuits.com, www.pcbtrain.co.uk
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 33
---

# UK PCB prototype prices: JLCPCB vs PCBWay vs Seeed vs Aisler vs Eurocircuits vs OSH Park vs PCB Train (with shipping, VAT and customs)

## TL;DR — fastest path
- **JLCPCB has the clearest UK VAT rule.** Its Customs, Duties and Taxes page (last updated 2026-09-09) says JLCPCB collects the VAT for **individual** customers on orders of 0–135 GBP. Local customs collects it for company customers at any value, and for everyone above 135 GBP. The homepage headline is "From $2.00 / 5 pcs" and assembly is "From $8.00" (USD). The page didn't show the board spec behind the $2 headline.
- **OSH Park was the only fab with a current published per-area price and no upload needed** (Aisler's per-area table dates from 2023). Its 2-layer "Prototype" service costs $5 per sq in for a set of 3 boards, takes 9–12 calendar days, and ships free worldwide. It says nothing about VAT or customs and offers no assembly. Expect UK import VAT and carrier handling on delivery, but that is unverified.
- **Aisler says it charges no taxes at checkout for non-EU orders,** so UK import taxes fall on you. Eurocircuits' VAT guide says EU-to-non-EU export invoices exclude VAT, but it also lists a UK entity with a GB VAT number, so its UK treatment is unconfirmed. Aisler's own wording: "we do not charge any taxes during checkout", and the courier may ask for duties before delivery. Aisler's standard post (Deutsche Post or DHL Warenpost) is free and untracked.
- **PCB Train (a division of Newbury Electronics, Berkshire) is UK-domestic, so there's no import step.** UK mainland shipping is published: Royal Mail £5.00, next-day express from £10.00. No board prices appear on its public pages, and the basket links to a login page.
- **The JLCPCB, PCBWay and Seeed Fusion calculators load prices with JavaScript,** so a text fetch shows "$0.00". Use a real browser. PCBWay lets you type dimensions with Gerber marked optional. Every fab needs a Gerber, and usually an account, before you get a firm price.
- **Skip trying to read UK VAT lines from fetched pages.** For PCBWay, Seeed and OSH Park, the actual VAT and duty treatment only shows at checkout, so a human needs to check it.

## Verify first
1. **JLCPCB UK VAT rule unchanged** — fetch jlcpcb.com/help/article/18-Customs,-Duties-and-Taxes — expect a UK row "0-135GBP: For Individual customers, VAT collected by JLCPCB; For company customers, VAT collected by local customs; >135GBP VAT collected by local customs", last updated Sep 09, 2026 — if not → re-explore Domains › jlcpcb.com.
2. **OSH Park price and free shipping** — fetch docs.oshpark.com/services/ (oshpark.com/pricing redirects there) — expect Prototype "$5 per sq in", "Per set of 3", "shipped for free to anywhere in the world" — if not → re-explore Domains › docs.oshpark.com.
3. **Aisler charges no tax for non-EU** — fetch community.aisler.net/t/a-quick-primer-about-shipping-at-aisler/672 — expect "we do not charge any taxes during checkout" for customers outside the EU, plus free untracked standard post — if not → re-explore Domains › aisler.
4. **PCB Train UK shipping** — fetch www.pcbtrain.co.uk/quick-online-quote/shipping-charges/ — expect UK mainland Royal Mail 3 working days GBP 5.00 and express next day by 6 pm GBP 10.00 — if not → re-explore Domains › pcbtrain.
5. **PCBWay VAT disclaimer** — fetch www.pcbway.com/orderonline.aspx — expect "Customs duties and VAT are not included!" and Gerber marked optional — if not → re-explore Domains › pcbway.

## Domains

### jlcpcb.com / cart.jlcpcb.com — cheapest headline price; the only fab with an explicit first-party UK VAT rule
- **Access** (2026-11-07, observed): Help and home pages fetch fine. The jlcpcb.com/quote link redirects to cart.jlcpcb.com/quote. That calculator is rendered by JavaScript: a text fetch showed "$0.00", "No data" for dimensions, and an "Add gerber file" prompt (zip/rar, max 100 MB). A text fetch couldn't confirm whether typing dimensions by hand gives a price without an upload. Login wasn't required to load the page.
- **Pricing** (2026-11-07, observed, homepage): FR-4 PCBs "From $2.00 / 5 pcs". The listing covers 1–32 layers, and the page doesn't show a board size or layer limit for the headline. PCB Assembly "From $8.00". Setup and per-joint fees weren't shown. "payments must be made in US dollars."
- **Lead time** (2026-11-07, observed): FR-4 "Build Time: 24 hours". Assembly "typically require[s] 2–5 days". Most orders arrive "within 2–7 business days". Carriers are DHL, FedEx and UPS, and all shipments are tracked. The quote page says paid orders before 6 pm GMT+8, Monday to Saturday, enter production the same day.
- **UK VAT rules** (2026-11-07, observed, Customs, Duties and Taxes page, last updated Sep 09, 2026): UK "0-135GBP: For Individual customers, VAT collected by JLCPCB; For company customers, VAT collected by local customs"; ">135GBP VAT collected by local customs". The page also says "All duties and taxes for international shipments are the responsibility of the customer." It doesn't mention IOSS, DDP or clearance fees.
- **UK VAT options at payment** (2026-11-07, first-party claim via search snippet of cart.jlcpcb.com payMethod page): "UK-VAT (VAT collected by JLCPCB and remitted to competent tax authority)" vs "FCA (Freight, customs clearance, taxes and duties are buyer's responsibility)".
- **Gotchas**: The Shipping Methods page (last updated Sep 09, 2026) lists its options in an image only, so a text fetch can't see UK carriers or times. The page also says duties "are not able to be estimated/calculated by JLCPCB". A JLCPCB Q&A titled "Low-cost shipping to UK duty paid" exists (help/answers/detail/73) but wasn't opened. Whether you count as an individual or a company changes who collects VAT.

### www.pcbway.com — manual dimension entry allowed; VAT and duty explicitly excluded from the quote
- **Access** (2026-11-07, observed): orderonline.aspx loads without login. Dimension and quantity fields can be filled in by hand, and Gerber upload is marked optional. The price shows "$ 0.00" until Calculate is clicked, which needs JavaScript. Currency can be USD or EUR, and the United Kingdom is in the ship-to list. Adding to cart means saving the order, and Gerbers are uploaded on the cart page.
- **Pricing** (2026-11-07, observed): No entry price was visible in the text fetch. There's a "New here? Get a $5.00 Coupon!" banner. Assembly comes as turnkey, consigned or combo, with a "50% OFF Assembly Sale" label. The assembly price "does not include PCB fabrication or the cost of components."
- **Rules** (2026-11-07, observed): "Customs duties and VAT are not included!" The page also says items under $64 and 20 kg follow a B2C rate for individuals and a non-B2C rate for companies; it's unclear whether that's a shipping rate or a tax rate. A shipment date of 2026/11/09 was shown. EU-assembled orders ship only to EU addresses.
- **Rules** (2026-11-07, first-party claim via search snippets): the help centre says import duties and taxes "are normally collected by shipping companies upon delivery". The terms say duties, VAT and brokerage are excluded "unless otherwise stated at checkout". An old PCBWayExpress blog post (about 6 years old) describes a UK DDP route limited to declared value up to 165 USD, with no B2B; treat it as stale.
- **Gotchas**: Whether PCBWay collects UK VAT at checkout for consignments of 135 GBP or less couldn't be confirmed. The quote-page disclaimer suggests it doesn't, so check the checkout lines.

### www.seeedstudio.com (Seeed Fusion) — no price visible without JavaScript; promo terms conflict
- **Access** (2026-11-07, observed): fusion_pcb.html shows placeholders ("USD$0.00", "No Data") in a text fetch. The PCB Gerber upload (zip/rar up to 50 MB) doesn't mention login, but PCBA upload says "Please login / create an account before uploading your file."
- **Offers** (2026-11-07, observed): "Instant online quotes and PCB production from as fast as 24 hours". Production time runs from file confirmation to packing, plus a day for dispatch. PCBA quotes are split into setup, component, assembly and operation fees, plus the stencil.
- **Pricing** (2026-11-07, first-party claim via search snippets of Seeed support KB and blog; not observed today): a 2017 blog offered 10 PCBs at $4.90 (up to 100x100 mm, 1–2 layers). A support article says the $4.90 price applies to 5 sub-orders, with further qualifying boards charged at the "regular price of $9.90USD". Another support page says the special price applies when quantity is "smaller than 10pcs" and size is under 100x100 mm. These terms conflict, so don't quote either as current. The FAQ says PCB production takes "3 - 14 business days".
- **Gotchas**: No UK shipping or VAT information was found in this run.

### aisler.net / community.aisler.net — EU (Germany) fab with free untracked post; no taxes charged at checkout for non-EU
- **Access** (2026-11-07, observed): aisler.net/pricing returns 404. The homepage links its pricing, shipping and specs pages to community.aisler.net. "Start Project" goes to /p/new, and whether a price shows without an upload wasn't tested.
- **Pricing** (2026-11-07, observed, homepage): Beautiful Boards (PCBs) are "starting at just €14.20". Layer count, size, quantity and VAT basis aren't stated.
- **Pricing** (2026-11-07, observed on a community post dated 2023-08-27, so possibly stale): "PCB Price = Job Fee + Area x Area-usage Fee x Quantity", sold in sets of 3, in EUR, net of VAT. 2-layer 1.6 mm rates:
  - HASL Budget: €12.00 job fee + €0.067/cm²
  - HASL Blitz: €22.00 + €0.129/cm²
  - ENIG Budget: €12.00 + €0.097/cm²
  - ENIG Blitz: €22.00 + €0.17/cm²

  The post's own worked example uses €0.051/cm², which doesn't match the table. Assembly price = boards + components + assembly fee, and the task unit prices aren't listed. There's a €15 fee per customer-supplied component part, and a separate assembly calculator at aisler.net/products/assembly.
- **Lead time** (2026-11-07, observed, homepage): boards are "manufactured in one business day". Assembly is "Manufactured within 6 business days". The homepage also says "Shipping worldwide for free".
- **Shipping and VAT** (2026-11-07, observed, shipping primer posted 2024-09-25 with a 2025-09-25 update): "Standard shipping via Deutsche Post Großbrief or DHL Warenpost is always included in your order for free". These options "do not include tracking or insurance". Paid options (including UPS) are priced at checkout. For customers outside the EU, "we do not charge any taxes during checkout", and "the delivery Currier might request a payment of any duties and taxes prior to delivery." The primer doesn't mention the UK specifically.
- **Gotchas**: A third-party forum user called most shipping options "extremely slow, even within EU". Plan for UK import VAT and a carrier handling fee on arrival (the size of the fee isn't verified).

### oshpark.com / docs.oshpark.com — simplest published price; free worldwide shipping; no VAT information; no assembly
- **Access** (2026-11-07, observed): oshpark.com/pricing redirects (302) to docs.oshpark.com/services/, which is readable without login.
- **Pricing** (2026-11-07, observed; "$" with no currency code, US company):
  - Prototype: $5 per sq in, per set of 3, 9–12 calendar days
  - Super Swift: $10 per sq in, per set of 3, 4–5 business days
  - 2oz 0.8mm: $5 per sq in, per set of 3, 12–21 calendar days
  - After Dark: $5 per sq in, per set of 3, 12–21 calendar days
  - Flex: $10 per sq in, temporarily suspended
  - Medium Run: $1 per sq in, 100 sq in minimum in multiples of 10, 12–21 calendar days
- **Shipping** (2026-11-07, observed): "shipped for free to anywhere in the world." No UK-specific options are listed.
- **Gotchas** (2026-11-07, observed): the page doesn't mention VAT, customs or duties, and doesn't offer assembly. Its pricing is per square inch, so convert mm to inches yourself. UK import VAT handling wasn't researched.

### www.eurocircuits.com — EU pooling fab with a UK entity listed; prices only through its calculator
- **Access** (2026-11-07, observed): /pcb-prices/ returns 404. Pricing goes through the "PCB Calculator" / "PCB Configurator", which is used "to check and upload design parameters before pricing". Login wasn't confirmed either way.
- **Offers** (2026-11-07, observed, /services/pcb-proto/):
  - PCB Proto: 1 to 5 PCBs, 2 or 4 layers. The page gives both "2 or 3 Working Days*" and "Bare Board PCB's in 3 Working Days*". Maximum size is 580 x 425 mm (2-layer) and minimum is 20 x 20 mm.
  - PCB Proto with assembly: 1 to 5 PCBs, "6 working days*", SMT, THT or mixed, with "All Components Sourced by Eurocircuits". The stencil is included and not delivered. Automatic pricing stops at 200 BOM lines or 1,000 placements.
  - No published example price.
- **VAT** (2026-11-07, observed, VAT user guide): exports from an EU country to a non-EU country: "Your invoices will not include VAT", and "import taxes may apply and these are at your (the customers) cost." The domestic entries include Eurocircuits Ltd (South Molton, Devon) with a GB VAT number. Domestic VAT applies only when goods are delivered in the same country as the VAT number's origin. The guide doesn't cover UK DDP/DAP terms, the £135 threshold or brokerage.
- **Shipping** (2026-11-07, first-party claim via search snippets): Express is "delivered during the next working day" under local courier arrangements. Economy reaches you in 3 working days "within Europe". A student page says there are "no hidden costs for import administration, customs duties or post-clearance VAT", but it's aimed at EU students and isn't confirmed for the UK.
- **Gotchas**: Whether UK orders are invoiced by the UK entity with UK VAT, or exported from the EU with import VAT due, isn't established. Check at checkout or ask Eurocircuits.

### www.pcbtrain.co.uk (PCB Train, a division of Newbury Electronics Ltd) — UK domestic, no import; published shipping, prices behind the quote flow
- **Access** (2026-11-07, observed): the home, quick-online-quote, Express and shipping-charges pages are public. The quick-online-quote page shows no price matrix or calculator in text. The basket icon links to a login page, which suggests an account is needed to order or price, but that wasn't explicitly stated.
- **Shipping** (2026-11-07, observed; GBP; VAT basis not stated):
  - UK mainland: collection GBP 1.00; Royal Mail 3 working days, untracked, GBP 5.00; express next working day by 6 pm, tracked, GBP 10.00; next day by "12.00 am" (as written), GBP 15.00; by 10.30 am, GBP 20.00; Saturday, GBP 30.00.
  - Northern Ireland: Royal Mail GBP 5.00; express 2 working days GBP 15.00.
  - Scottish Highlands: Royal Mail GBP 5.00; express GBP 25.00.
  - Channel Islands: Royal Mail GBP 5.00; express GBP 25.00.
  - Royal Mail is limited to orders "of less than GBP 100.00".
- **Offers** (2026-11-07, observed): 1–12 layers, "Fast turnaround deliveries from next day". PCB Train Express takes orders by 9.00 am on a working day. 2-layer boards ship the same working day (8-hour turnaround) and 4-layer the next day (32-hour). Express limits: 2-layer boards "NOT electrically tested", no solder resist or legend, no DRC, immersion silver only, 0.8 or 1.6 mm thick, minimum track/gap 0.2 mm, all holes plated, and "unsuitable for production-quality boards". Assembly is offered (BOM upload and costing, SMD/BGA/leaded parts, free-issue parts, AOI).
- **Gotchas**: A search turned up a 2-layer "£200" figure on a roughly 13-year-old technical page, which is stale and has no stated basis, so don't use it. The VAT basis of the published prices wasn't stated on the pages fetched.

## Dead ends
- aisler.net/pricing — 404. Pricing lives at community.aisler.net/t/our-simple-pricing (a 2023 post).
- www.eurocircuits.com/pcb-prices/ — 404. Use the PCB Calculator instead.
- oshpark.com/pricing — just a redirect to docs.oshpark.com/services/.
- A guessed JLCPCB URL, help/article/how-is-vat-charged-for-uk-orders — loads but has no VAT content. Use help/article/18-Customs,-Duties-and-Taxes.
- JLCPCB Shipping Methods page — the UK options are in an image, so they can't be read from text.
- cart.jlcpcb.com/quote, pcbway.com/orderonline.aspx, seeedstudio.com/fusion_pcb.html — calculators rendered by JavaScript. A text fetch only shows $0.00 placeholders. This isn't a block, just not readable without a browser.
- pcbtrain.co.uk/quick-online-quote/ — a marketing page with no prices.
- General searches for "UK VAT £135" plus a fab name mostly return Shopify or merchant guidance, not fab policy.
- Blockers: no 403, 429, CAPTCHA or login walls hit on the pages fetched.

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | jlcpcb.com (home) | FR-4 PCBs headline (layer count and size not stated on page) | From $2.00 / 5 pcs | USD; observed; shipping and VAT not included in the headline |
| 2026-11-07 | jlcpcb.com (home) | PCB Assembly headline | From $8.00 | USD; observed; setup and per-joint fees not shown |
| 2026-11-07 | docs.oshpark.com/services | 2-layer Prototype, set of 3, 9–12 calendar days | $5 per sq in | "$" (US company); free worldwide shipping; VAT not mentioned; observed |
| 2026-11-07 | docs.oshpark.com/services | Super Swift, set of 3, 4–5 business days | $10 per sq in | as above; observed |
| 2026-11-07 | docs.oshpark.com/services | Medium Run, 100 sq in minimum, multiples of 10 | $1 per sq in | as above; observed |
| 2026-11-07 | aisler.net (home) | Beautiful Boards, spec not stated | starting at €14.20 | EUR; VAT basis not stated; observed |
| 2026-11-07 | community.aisler.net (post dated 2023-08-27) | 2-layer 1.6 mm HASL Budget, sets of 3 | €12.00 job fee + €0.067/cm² | EUR net of VAT; observed but dated 2023 |
| 2026-11-07 | community.aisler.net (post dated 2023-08-27) | 2-layer HASL Blitz | €22.00 + €0.129/cm² | EUR net of VAT; dated 2023 |
| 2026-11-07 | community.aisler.net (post dated 2023-08-27) | Customer-supplied component fee | €15 per part | EUR net of VAT; dated 2023 |
| 2026-11-07 | pcbtrain.co.uk shipping-charges | UK mainland Royal Mail, 3 working days, untracked | GBP 5.00 | GBP; VAT basis not stated; observed |
| 2026-11-07 | pcbtrain.co.uk shipping-charges | UK mainland express, next working day by 6 pm, tracked | GBP 10.00 | GBP; VAT basis not stated; observed |
| 2026-11-07 | seeed support KB (search snippet) | Fusion promo, 2-layer up to 100x100 mm | $4.90, then $9.90 regular | USD; first-party claim, not observed; terms conflict |

## Prep checklist
- A Gerber zip. JLCPCB takes zip/rar up to 100 MB and Seeed up to 50 MB. All final prices depend on it.
- Board outline in mm and in square inches (for OSH Park), layer count, thickness, finish (HASL or ENIG), solder mask and silkscreen needs, and quantity.
- For assembly: BOM and placement (CPL) files, single- or double-sided placement, and whether you'll supply any parts (Aisler charges €15 per customer-supplied part).
- Whether you're buying as an individual or a VAT-registered company. This changes JLCPCB's VAT handling, and companies may want to reclaim import VAT.
- The expected consignment value against the 135 GBP threshold, and UK delivery postcode (Northern Ireland, Highlands and Channel Islands rates differ at PCB Train).
- The currency each fab bills in: USD for JLCPCB (and USD or EUR at PCBWay), EUR for Aisler and Eurocircuits, GBP for PCB Train.

## Needs a human
- Real quotes need a Gerber upload, and usually an account, at JLCPCB, PCBWay, Seeed Fusion, Aisler, Eurocircuits and PCB Train. OSH Park also needs an upload to order, but its per-area price lets you estimate first.
- Seeing the actual UK VAT and duty lines at checkout for PCBWay, Seeed Fusion, OSH Park and Eurocircuits. None of them published a UK-specific rule that could be read today.
- Choosing JLCPCB's "UK-VAT" or "FCA" option at payment.
- Paying import VAT and carrier handling fees on delivery for orders where the seller doesn't collect VAT (Aisler states it doesn't for non-EU).

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-07 — reviewed (independent): summary and TL;DR no longer say Eurocircuits/PCBWay leave VAT to import (unconfirmed in body); OSH Park "only per-area price" qualified; spot-checked JLCPCB UK VAT rule and OSH Park pricing (unchanged).
