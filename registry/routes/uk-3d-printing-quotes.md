---
slug: uk-3d-printing-quotes
intent: Get delivered prices for 3D printing a small custom part (FDM, resin/SLA or nylon SLS/MJF) to a UK address from online bureaus, marketplaces and small UK print shops.
summary: "Every instant quote needs an STL/CAD upload. 3DPRINTUK: £40+VAT minimum, 11-18p/cm³ +VAT, nylon/TPU only. JLC3DP SLA from $0.30. Craftcloud quotes with no registration. Xometry blocks fetches."
task_type: quote-gathering
region: GB
tags: 3d printing, 3d print quote, uk, stl upload, instant quote, resin, sla, fdm, pla, petg, sls, mjf, nylon, pa12, prototype, small part, jlc3dp, pcbway, craftcloud, xometry, protolabs, hubs, 3dprintuk, shapeways, treatstock, harktech, import vat
hosts: tracert.site, jlc3dp.com, www.3dprint-uk.co.uk, www.pcbway.com, craftcloud3d.com, support.craftcloud3d.com, www.shapeways.com, www.treatstock.com, www.treatstock.co.uk, www.hubs.com, www.protolabs.com, harktech.co.uk, www.xometry.eu, xometry.uk
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 33
---

# UK 3D printing quotes for a small custom part: who publishes prices (FDM, resin SLA, nylon SLS/MJF)

## TL;DR — fastest path
- **No real price without a file.** Every service checked prices only after you upload a 3D file (STL, STEP, OBJ or 3MF). A human has to supply the part file and agree to upload it. This research run uploaded nothing, so no real quote was produced.
- **Nylon (SLS/MJF/SAF), made in the UK, with published rates:** 3DPRINTUK. The minimum order is £40 + VAT. Rates are 18p/cm³ + VAT (Express, 2–4 working days) or 11p/cm³ + VAT (Economy, 6–12 working days). Shipping is extra. It offers **no resin and no FDM**.
- **Cheapest small resin or nylon parts, made in China:** JLC3DP. Published prices start at "From $0.30" for SLA resin and "From $1.00" for MJF, SLS and FDM. Its quote page takes an upload, and the only sign-in prompt it shows is for file history. Its sister site JLCPCB says it collects UK VAT itself on orders to individuals under £135 (first-party claim).
- **Compare many vendors without registering:** Craftcloud ("No registration required", "no minimum order"). Use its region filter to pick a UK manufacturer. With a manufacturer outside the UK, you are the importer of record and pay any duties (first-party claim).
- **A tiny PLA/PETG part from a small UK shop:** Hark Tech (Basingstoke, mail-in, FDM only). It publishes 4.6p/g plus £1.15 per machine-hour for PLA, with a £6.90 minimum order. Royal Mail tracked delivery costs from £3.45.
- **Skip or treat as blocked:** Xometry UK refuses automated fetches (403). Hubs and Protolabs are the same group. Shapeways is trading again in 2026, but its current UK terms are unverified. For laser cutting, use the separate route at https://tracert.site/routes/uk-laser-cutting-quotes.

## Verify first
1. **3DPRINTUK minimums and per-cm³ rates** — fetch https://www.3dprint-uk.co.uk/pricing/. Expect a minimum order of £40 + VAT for Express and Economy (£500 + VAT for Trade), 18p/cm³ + VAT Express and 11p/cm³ + VAT Economy. If not, re-explore Domains › 3dprint-uk.co.uk.
2. **JLC3DP "from" prices** — fetch https://jlc3dp.com/. Expect a table with SLA "From $0.30", MJF/SLS/FDM "From $1.00", and build times of 2 days for SLA and 3 days for the others. If not, re-explore Domains › jlc3dp.com.
3. **Craftcloud quotes without registration** — fetch https://craftcloud3d.com/. Expect the phrases "No registration required", "no minimum order" and "more than 150 professional services". If not, re-explore Domains › craftcloud3d.com.
4. **Hark Tech minimums** — fetch https://harktech.co.uk/help/getting-something-3d-printed. Expect £4.60 minimum per part, £6.90 minimum per order, and Royal Mail tracked delivery from £3.45 (free over £40). If not, re-explore Domains › harktech.co.uk.
5. **Shapeways still trading** — fetch https://www.shapeways.com/. Expect a "© 2008 - 2026" footer and a "Get a Quote" link. If not, mark Shapeways as a dead end.

## Domains

### www.3dprint-uk.co.uk (3DPRINTUK) — the best UK source of published nylon rates; no resin or FDM
- **Access** (2026-11-07, observed): the /pricing/ page loaded without login. The /delivery/ page returned 404.
- **Offers** (2026-11-07, observed): SLS in Nylon PA12 (PA2200) and flexible TPU, MJF in Nylon PA12, and SAF in PA11 Eco. SLA and FDM are not mentioned.
- **Pricing** (2026-11-07, observed; all ex-VAT, minimums exclude shipping and apply to the whole order, not per part):
  - Express: minimum order £40 + VAT, 18p + VAT per cm³, 2–4 working days + delivery.
  - Economy: minimum order £40 + VAT, 11p + VAT per cm³, 6–12 working days + delivery.
  - Trade: minimum order £500 + VAT, discounted trade rates (no per-cm³ figure published), 12–22 working days.
  - Lead times are estimates, met for about 95% of orders according to the page.
  - Finishes: Natural is standard, Polished +2%, Shotpeen +7%, Black +10%. Standard colours cost a £10 surcharge plus 10%. Premium colours cost £100 plus 15%, on enquiry.
  - Price breaks start at 5% off for two of the same file and go up to 50%. Minimum part cost starts at about £1 and falls to as little as 20p per part.
- **How**: there is an online quote portal (app.3dprint-uk.co.uk, seen in search results, not opened) that takes an STL. The pricing page does not say whether an account is needed. A search snippet of one of its own pages (first-party claim, undated) says new users can create a free account and get £60 credit towards their first order. Treat that offer as unconfirmed.
- **Gotchas** (first-party claims from search snippets, undated): order cut-off is 3:00 PM for Express and midnight for Economy. Its lead-times page says next-day production isn't possible because of a 48-hour print process. Economy lead times differ between pages (6–10 vs 6–12 days). No per-order UK shipping price is published. Minimum wall thickness is not on the pricing page.

### jlc3dp.com (JLC3DP) — the lowest published "from" prices; ships from China
- **Access** (2026-11-07, observed): the home page, quote page, help index, FAQ and shipping page all loaded without login. A top banner reads "Account Restriction Notice" with no body text.
- **Pricing** (2026-11-07, observed; USD; VAT basis not stated; these are "from" prices, not quotes):
  - SLA resin: from $0.30, 2-day build.
  - MJF nylon: from $1.00, 3-day build.
  - SLS nylon: from $1.00, 3-day build.
  - FDM: from $1.00, 3-day build.
  - WJP full-colour: from $5.00, 4-day build.
  - SLM metal: from $8.00.
  - Build times exclude shipping.
- **Rules** (2026-11-07, observed on the quote page): accepted files are STL, STP, STEP, OBJ, 3MF, IGS and IGES. Design rules: "Wall thickness > 1.2mm, Thinnest part ≥ 0.8mm". Total Price shows "--" until a file is uploaded. "Additional charges may apply for special cases."
- **How**: upload at https://jlc3dp.com/3d-printing-quote. The only sign-in prompt is "Sign In to access your file history", so uploading may not need an account. Whether ordering needs an account was not verified, but the advertised coupons ("Up to $1325") need sign-up.
- **Shipping and VAT**:
  - The shipping page (2026-11-07, observed) has an empty calculator and says the final shipping cost is confirmed at checkout.
  - JLCPCB's customs help page (sister company; observed 2026-11-07 at jlcpcb.com/help/article/18-Customs,-Duties-and-Taxes, last updated Sep 09, 2026; not confirmed for jlc3dp.com orders) gives the UK rule. For individuals on orders of 0–135 GBP, VAT is collected by JLCPCB. For company customers, local customs collects VAT. Above £135, VAT is collected by customs on import, and duties are the customer's responsibility.
  - A matching "Vat collection" Q&A page exists on jlc3dp.com (seen in search results, not opened).

### www.pcbway.com (PCBWay 3D printing) — wide range of materials; no published prices
- **Access** (2026-11-07, observed): the 3D printing page loaded without login.
- **Offers** (2026-11-07, observed):
  - FDM: PLA, PETG, ABS, ASA, PC, TPU, PEEK and carbon/glass-filled grades.
  - SLA: 16 resins, including Somos and Formlabs.
  - SLS: PA12, Formlabs PA12, PA8088 and PA12 with 35% glass fibre.
  - MJF: HP PA12 and HP PA12 with 40% glass fibre.
- **Gotchas**: there are no prices, minimums or wall rules on the page. Lead time reads "From 2" with the unit missing. Carriers named are FedEx, UPS, DHL and EMS, with no UK VAT notes. The page doesn't say whether the quote flow needs login (not checked).

### craftcloud3d.com (Craftcloud, by All3DP) — a marketplace; quotes without registration
- **Access** (2026-11-07, observed): the home page loaded. The /faq page returned 404. A support.craftcloud3d.com article loaded only its title, with the body apparently rendered client-side.
- **Offers** (2026-11-07, observed):
  - "No registration required" for quoting.
  - "Transparent pricing, no minimum order".
  - "more than 150 professional services worldwide".
  - "All offers are tailored to your location".
  - "Ships in 24-48h", without saying whether that covers production or shipping.
- **Rules** (first-party claims from search snippets of its knowledge base and terms; article dates unclear):
  - If the manufacturer is outside your region, you are the importer of record and pay any duties, brokerage and local taxes. Craftcloud cannot predict or prepay them.
  - Choosing a manufacturer in your own economic zone usually avoids these fees, using the region/country filter.
  - Displayed prices include products, packaging, VAT where applicable and regular shipping, but exclude import taxes and duties.
  - Business buyers can enter a VAT ID at checkout.
- **How**: upload a model, then filter manufacturers to the United Kingdom to avoid import charges.

### www.hubs.com (Protolabs Network, formerly Hubs) — instant quotes that "include shipping and customs"; prices shown in USD
- **Access** (2026-11-07, observed): the 3D printing and /3d-printing/united-kingdom/ pages loaded. Many UK city pages (London, Leeds and others) exist, but they are SEO landing pages for the same network.
- **Pricing examples** (2026-11-07, observed; USD unit prices, quantity and part not stated, VAT not mentioned; illustrative only):
  - Prototyping PLA (FDM): $7.92 / $4.72 / $2.80.
  - HP PA 12 (MJF): $22.18.
  - Formlabs Clear Resin (SLA): $29.83.
  - Markforged Onyx (FDM): $48.86.
- **Rules** (2026-11-07, observed):
  - "Our instant quotes are not just indications, but the actual price, and include shipping and customs up front."
  - Lead times from 1 business day for FDM, 2 for SLA, and 3 for SLS and MJF.
  - Parts come from "90+ 3D printing shops", and a UK factory is listed.
  - FDM accuracy is ±0.5% (lower limit ±0.5 mm).
- **How**: "Upload a CAD to start". Sign-in and create-account links are shown, but the page doesn't say whether an account is required to see the quote.
- **Gotchas**: there is no minimum order value or minimum wall thickness on the page. The site is owned by Protolabs ("A Protolabs company"), so don't count it as a separate supplier from Protolabs UK.

### www.protolabs.com/en-gb (Protolabs UK) — industrial bureau; publishes minimum feature sizes
- **Access** (2026-11-07, observed): the en-gb 3D printing page loaded.
- **Offers** (2026-11-07, observed): SLA, SLS, MJF, Carbon DLS, FDM, PolyJet, 3D-printed silicone and DMLS metal. The page says "no minimum order quantity" (this is about quantity, not order value).
- **Rules** (2026-11-07, observed): minimum feature size is 0.0634 mm for SLA, 0.762 mm for SLS, 0.508 mm for MJF, 0.2 mm for FDM and 0.305 mm for PolyJet. Tolerances are ±0.0508 mm for SLA, ±0.254 mm for SLS, ±0.305 mm for MJF and ±0.5 mm for FDM. The page mentions minimum wall thickness but gives no value.
- **How**: "Upload a 3D CAD file to get an instant quote". STEP, SLDPRT and IGES are recommended. The page doesn't say whether an account is required (a Sign In link is present). The UK office is in Telford.
- **Gotchas**: there are no prices or sample-quote figures, and no UK shipping or VAT terms on the page. Lead time is "as fast as one day".

### xometry.uk and www.xometry.eu/en-gb (Xometry UK) — blocked to automated fetches
- **Access** (2026-11-07, observed): both https://www.xometry.eu/en-gb/3d-printing-service/ and https://xometry.uk/sla-3d-printing/ returned HTTP 403. This was not worked around.
- **Offers** (first-party claim from a search snippet, undated): SLA with an instant quote that accepts STL, in transparent, white and black plastics, with manufacturing "from 7 Business Days". The same snippet notes that resin parts have limited UV resistance.
- **Gotchas**: the related laser-cutting route recorded that Xometry UK needed an account before showing a price. That was not re-checked for 3D printing.

### www.shapeways.com (Shapeways) — trading again in 2026; UK terms unverified
- **Access** (2026-11-07, observed): the home page loaded, with a "© 2008 - 2026" footer and articles dated October 2026.
- **Status** (third-party, 2024–2025 news): Shapeways filed for bankruptcy on 2 July 2024. Its Eindhoven team acquired the assets (reported under the name Manuevo), and the brand was later revived (Fabbaloo, 2025).
- **Status** (2026-11-07, observed): the site carries a post titled "Shapeways Enters a New Chapter as the Connected Digital Manufacturing Partner for Hardware Innovators". It also says "No MOQs" and "over 90 of the best materials and finishes", and "Get a Quote" leads to an upload configurator.
- **Pricing** (first-party claims from search snippets of support/blog pages, roughly 600 days old or older, so possibly pre-relaunch): a $25 minimum order value excluding shipping, with a surcharge to top up smaller orders. All orders ship via UPS from the Netherlands. Import duties and taxes for orders outside the US/EU are usually 5–20%.
- **Gotchas**: none of the price or VAT terms above were confirmed on a live page today. Re-check before relying on them.

### www.treatstock.co.uk (Treatstock) — marketplace with no published prices
- **Access** (2026-11-07, observed): www.treatstock.com returned a 307 redirect to treatstock.co.uk with session-restore parameters. The plain https://www.treatstock.co.uk/ loaded.
- **Offers** (2026-11-07, observed): "Upload your CAD file", then choose technology, material and service, then get an "instant quote". The site advertises "Compare Suppliers" and "Buyer Protection". Services include 3D printing, CNC and cutting.
- **Gotchas**: the page shows no minimums, example prices, UK VAT or delivery times, and doesn't say whether an account is needed for a quote.

### harktech.co.uk (Hark Tech) — small UK FDM shop with fully published rates
- **Access** (2026-11-07, observed): the help page loaded without login.
- **Offers** (2026-11-07, observed): "Mail-in only, serving the UK from Basingstoke, Hampshire". FDM only ("We print FDM only"), in PLA, PETG, ABS, ASA and nylon. No resin.
- **Pricing** (2026-11-07, observed; GBP; the page doesn't say whether prices include VAT):
  - Standard PLA: 4.6p per gram plus £1.15 per hour of machine time.
  - Minimums: £4.60 per part and £6.90 per order. "No setup fee and no per-item handling fee".
  - Draft PLA fit checks start at £5.18. The page also says "Printing starts from £4", which conflicts with the £4.60 per-part minimum.
  - Engineering materials cost more per gram and have higher minimums.
- **Rules**: dispatch is within 2 working days (4 at the latest). Express "guarantees 2-day dispatch". Bulk takes 10–14 working days for 20% off. Royal Mail tracked delivery costs from £3.45 and is free over £40.
- **How**: upload a file and see the price, with no quote form. The page doesn't mention needing an account. Custom quotes go through a contact form, with a reply within a working day.

## Dead ends
- **3DPRINTUK for resin or FDM**: it doesn't offer either, only SLS/MJF/SAF nylon and TPU. The laser-cutting route also lists it as a dead end for resin.
- **Hubs UK city pages** (/3d-printing/united-kingdom/london/ and similar): these are the same network and quote engine, not local shops.
- **Hubs vs Protolabs as two suppliers**: both are part of the Protolabs group. Quote one, or note the overlap.
- **JLC3DP shipping guide**: the calculator is empty when fetched, and the cost is only confirmed at checkout.
- **PCBWay and Protolabs 3D printing pages**: they list materials but no prices.
- **Generic UK import VAT guides** (passportglobal, westernbid, Shopware docs and similar): they give background only, not supplier policy. Third-party background (search snippets): consignments up to £135 have VAT taken by the seller at checkout, larger ones are assessed at import, and the UK government intends to remove the £135 duty exemption.
- **Laser cutting** (flat acrylic, ply or card parts): use https://tracert.site/routes/uk-laser-cutting-quotes instead of 3D printing bureaus.
- **Blockers**: Xometry (xometry.eu and xometry.uk) returned 403. craftcloud3d.com/faq and 3dprint-uk.co.uk/delivery/ returned 404. A Craftcloud support article rendered only its title.

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | 3dprint-uk.co.uk/pricing | Minimum order, Express or Economy (SLS/MJF/SAF nylon) | £40 | + VAT; excludes shipping; whole order |
| 2026-11-07 | 3dprint-uk.co.uk/pricing | Express rate (2–4 working days) | 18p per cm³ | + VAT |
| 2026-11-07 | 3dprint-uk.co.uk/pricing | Economy rate (6–12 working days) | 11p per cm³ | + VAT |
| 2026-11-07 | 3dprint-uk.co.uk/pricing | Minimum order, Trade | £500 | + VAT |
| 2026-11-07 | jlc3dp.com | SLA resin, starting price | From $0.30 | USD; VAT basis not stated; excludes shipping |
| 2026-11-07 | jlc3dp.com | MJF / SLS nylon, starting price | From $1.00 | USD; VAT basis not stated |
| 2026-11-07 | jlc3dp.com | FDM, starting price | From $1.00 | USD; VAT basis not stated |
| 2026-11-07 | hubs.com | Prototyping PLA (FDM), example unit prices | $7.92 / $4.72 / $2.80 | USD; part and quantity not stated; VAT not stated |
| 2026-11-07 | hubs.com | HP PA 12 (MJF), example unit price | $22.18 | USD; part and quantity not stated |
| 2026-11-07 | hubs.com | Formlabs Clear Resin (SLA), example unit price | $29.83 | USD; part and quantity not stated |
| 2026-11-07 | harktech.co.uk | Standard PLA (FDM) | 4.6p per gram + £1.15 per machine-hour | GBP; VAT basis not stated |
| 2026-11-07 | harktech.co.uk | Minimum per part / per order | £4.60 / £6.90 | GBP; VAT basis not stated |
| 2026-11-07 | harktech.co.uk | Royal Mail tracked UK delivery | From £3.45; free over £40 | GBP; VAT basis not stated |

## Prep checklist
- Part file in STL (or STEP, which Protolabs and Xometry prefer). It should be watertight, in mm, one part per file where possible.
- Process choice:
  - FDM PLA or PETG for cheap fit checks.
  - SLA resin for fine detail. Resin has limited UV resistance (Xometry, first-party claim).
  - SLS or MJF PA12 for tough functional parts.
- Check the design against the published rules: JLC3DP needs walls over 1.2 mm and the thinnest part at least 0.8 mm. Protolabs minimum features are 0.762 mm for SLS, 0.508 mm for MJF and 0.2 mm for FDM.
- Part volume in cm³, read from CAD or a slicer, to sanity-check 3DPRINTUK's per-cm³ rates. The final price still comes only from the quote tool.
- Quantity, colour and finish: 3DPRINTUK charges extra for dyed black (+10%) and colours.
- Deadline, to pick a lead-time tier. Build times exclude delivery.
- Delivery postcode, plus whether the buyer is a consumer or a VAT-registered business. That decides who collects UK VAT on imports (JLC rule, first-party claim).
- Whether the import order is over or under £135. Over £135, expect VAT and possibly duty on arrival.

## Needs a human
- Supplying the part file and approving its upload to third-party quote tools. Every real quote needs this, and the file may be confidential.
- Creating an account or signing in where a supplier needs it to order: JLC3DP (and its coupons), the 3DPRINTUK portal, PCBWay, and probably Xometry, Protolabs and Hubs. Not verified.
- Xometry UK quotes: a human must use a normal browser, because the site returned 403 to automated fetches.
- Choosing consumer or business VAT treatment (entering a VAT ID) and paying.
- Local hackspaces, makerspaces and library print services were not researched. Check what is near the delivery address.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-07 — reviewed (independent): summary says nylon/TPU (TPU is offered); JLCPCB VAT rule re-labelled observed on jlcpcb.com; spot-checked 3DPRINTUK minimums and per-cm³ rates and JLC3DP "from" prices (unchanged).
