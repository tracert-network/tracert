---
slug: uk-parcel-courier-prices
intent: Find the cheapest published price to send a small tracked parcel (about 1-2 kg, small box) within the UK, comparing direct carriers and parcel brokers.
summary: "InPost Small locker-to-locker £1.99 (8cm depth cap); Evri to-ParcelShop £2.62 up to 5kg; Evri 1-2kg Small to home £3.52; Royal Mail T48 small parcel online about £3.75 vs counter £4.70."
task_type: quote-gathering
region: GB
tags: cheapest parcel uk, send parcel 2kg, small parcel price, royal mail tracked 48, tracked 24, evri prices, dpd pickup shop, inpost locker, yodel, parcelforce express48, parcel2go, packlink, parcelmonkey, parcelhero, courier comparison, drop off, printerless, qr code label
hosts: community.ebay.co.uk, www.royalmail.com, www.parcelforce.com, www.parcelhero.com, www.evri.com, inpost.co.uk, www.inpostdirect.co.uk, www.yodeldirect.co.uk, send.dpd.co.uk, www.parcel2go.com, www.parcelmonkey.co.uk, www.packlink.com
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 34
---

# Cheapest way to send a small parcel (up to 2 kg) in the UK with tracking: Royal Mail vs Evri vs DPD vs InPost vs brokers

## TL;DR — fastest path
- **If the box is 8 cm deep or less and the recipient can collect from a locker:** InPost Small to a locker or shop is the lowest published price, £1.99. It costs £2.89 to a home address. InPost prices by size, not weight (up to 15 kg), and the label is a QR code, so no printer is needed. Source: inpost.co.uk/send/parcel-prices, observed 2026-11-07. The page does not state the VAT basis or the included cover.
- **For a box up to 45x35x16 cm and 2 kg:** Evri's own price page has the cheapest published direct-carrier prices, all including tax. Delivery to a ParcelShop costs £2.62 for anything up to 5 kg. Home delivery for "1-2kg Small" costs £3.52 if you drop it off, or £4.52 if Evri collects. £20 cover is included. Source: evri.com/our-services/our-prices, observed 2026-11-07.
- **Royal Mail Tracked 48 small parcel:** about £3.75 online versus £4.70 at a Post Office counter, under the price guide valid from 5 October 2026. These figures come only from search snippets because royalmail.com returns 403 to automated fetches. Earlier 2026 snippets show £3.65 online and £4.45 at the counter. Buy online, because counter prices are much higher.
- **Brokers are not automatically cheaper.** Parcel2Go and Packlink show prices **excluding VAT**. Parcel2Go's "DPD Drop Off Small" was from £5.60 exc VAT, while DPD's own site claims "from £2.99 inc VAT". Packlink's "up to 2kg" band is from £2.80 exc VAT and does not say which carrier.
- **Skip Parcelforce for this size.** express48 starts at roughly £11.95 to £13.60, but the weight band is unclear. It suits higher value or heavier items, with £150 standard cover.
- **Needs a human:** any exact quote from a broker quote form (ParcelMonkey, Parcel2Go, ParcelHero), or anything from royalmail.com, parcelforce.com, parcelhero.com and postoffice.co.uk, all of which blocked automated fetches.

## Verify first
1. **InPost locker prices are unchanged.** Fetch inpost.co.uk/send/parcel-prices. Expect Small 8x38x64 cm at £1.99 to a locker or shop and £2.89 to home, Medium at £2.59/£3.99, Large at £3.99/£5.99. If the prices differ, re-explore inpost.co.uk.
2. **Evri price table.** Fetch evri.com/our-services/our-prices. Expect "1-2kg Small" at £3.52 drop-off and £4.52 collection to home, and "Delivery to a ParcelShop" at £2.62 for 0-5 kg. If not, re-explore the Evri section.
3. **Royal Mail October 2026 tariff.** Open royalmail.com/sites/royalmail.com/files/2026-09/online-price-guide-october-2026-v1-ta.pdf in a real browser, since automated fetch returns 403. Expect a Tracked 48 small parcel (2 kg) at £3.75 online, Tracked 24 at £4.80 online, and compensation up to £75. If it differs, re-explore Royal Mail through the "our-prices-october-2026-v1.pdf" counter guide.
4. **DPD direct price.** Fetch send.dpd.co.uk. Expect "from £2.99 (£2.49 plus VAT)" and £50 cover included. If not, re-explore DPD. The products page only returned a banner.
5. **Packlink bands.** Fetch packlink.com/en-GB/. Expect up to 1 kg from £2.25, up to 2 kg from £2.80, up to 5 kg from £4.06 and up to 10 kg from £4.60, all exc VAT. If not, re-explore the packlink.com section.

## Domains

### www.royalmail.com — main benchmark, but blocked to automated fetch
- **Access** (2026-11-07, observed): HTTP 403 on /sending/uk/prices and /tracked-48. Prices below come only from search snippets of royalmail.com pages and PDFs.
- **Pricing** (first-party claim, search snippet, 2026-11-07):
  - The "Online price guide valid from 5 October 2026" (royalmail.com/sites/royalmail.com/files/2026-09/online-price-guide-october-2026-v1-ta.pdf) shows a 2 kg small parcel at **£3.75 for Tracked 48** and **£4.80 for Tracked 24** online.
  - Product-page snippets give counter prices of **£4.70 for Tracked 48** and **£6.05 for Tracked 24**.
  - A "valid from 1 July 2026" online guide also exists, so there appear to be four 2026 tariff points: 5 Jan, 7 Apr, 1 Jul and 5 Oct.
- **Earlier 2026** (first-party claim, undated snippets): Tracked 48 small parcel at £3.65 online and £4.45 at the counter, and Tracked 24 at £4.65 online, from the "online-parcel-price-reduction" and Tracked 48 pages. 1st Class small parcel (0-2 kg) was £5.15 online versus £5.45 at the counter. 2nd Class small parcel was £3.95 online versus £4.25 at the counter.
- **7 April 2026 change** (third-party, eBay UK announcement, observed 2026-11-07):
  - Tracked 48 small and medium parcels rose by up to £0.55 per item, and Tracked 24 by up to £0.65.
  - 2nd Class parcels rose by £0.45 to £1.20, and 1st Class parcels by £0.85 to £1.75.
  - Tracked 24 and 48 now cost less than the equivalent 1st and 2nd Class parcels.
- **Rules** (first-party claim, snippet): Tracked 24 and 48 compensation is up to £75 or the item's value, whichever is lower, and valuables are excluded. An older Royal Mail help page says Royal Mail 24/48 carries no compensation, which contradicts this. Small parcel means up to 2 kg, and 45x35x16 cm fits. A snippet also cites a rule of H+W+D no more than 90 cm with no side over 60 cm, which still needs checking in the PDF.
- **Gotchas:**
  - The counter price is about £1 or more above the online price.
  - royalmail.com/surcharges lists correction charges for wrong size or weight. It exists, but this run did not read it.
  - A third-party snippet says collection costs an extra 30p per item. This is unverified.
  - VAT basis was not verified this run.

### www.evri.com — cheapest published direct-carrier table for 1-2 kg
- **Access** (2026-11-07, observed): /prices returns a "can't find that page" body. The working page is /our-services/our-prices.
- **Pricing** (observed 2026-11-07; the page says "Standard prices include tax"; no effective date, footer © 2023):
  - Delivery to a home or work address, "pay online prices", Standard drop-off / Next Day drop-off / Standard collection:
    - Postable (<1 kg): £2.70 / £3.49 / not offered
    - 0-1kg Small: £3.04 / £3.90 / £4.04
    - 0-1kg Standard: £3.29 / £4.12 / £4.30
    - 1-2kg Small: £3.52 / £4.60 / £4.52
    - 1-2kg Standard: £4.79 / £5.48 / £5.78
    - 2-5kg: £6.59 / £7.55 / £7.58
  - Delivery to a ParcelShop, Standard / Next Day: £2.62 / £3.20 for every band up to 5 kg; 5-10 kg £5.87 / £6.82; 10-15 kg £9.01 / £10.61.
- **Rules:**
  - "Small" means up to 2 kg and up to 45x35x16 cm. The page does not define "Standard" dimensions.
  - £20 cover is included on most items, and cover can be upgraded up to £999 (upgrade price not shown).
  - Tracking and a 1-hour delivery window are included.
- **How:** Drop off at a ParcelShop or Locker. Labels can be printed at home or free in-store with Print in ParcelShop. A QR code option is not mentioned on this page.
- **Gotchas:**
  - A £2.75 location charge can apply to some Next Day postcodes.
  - A "Standard" 1-2 kg parcel costs £1.27 more than a "Small" one (£4.79 versus £3.52), so measure the box.
  - Frequent-seller discounts need 40 or more parcels a month.

### inpost.co.uk — lowest headline price if the parcel fits the locker
- **Access** (2026-11-07, observed): /prices returns 404. The working page is /send/parcel-prices.
- **Pricing** (observed 2026-11-07; VAT basis not stated; no effective date, © 2026):

  | Size (cm) | To locker or shop | To home |
  |---|---|---|
  | Small, 8x38x64 | £1.99 | £2.89 |
  | Medium, 19x38x64 | £2.59 | £3.99 |
  | Large, 41x38x64 | £3.99 | £5.99 |

  Every size has a maximum weight of 15 kg, and the page says "pricing is based on parcel size, not weight".
- **How:** Buy a digital QR label in the app or on the web, with no printing, and drop off at any InPost Locker or Shop. A recipient collecting from a locker has 3 days.
- **Gotchas:**
  - You cannot change size at the locker. If the parcel does not fit, tap "My parcel doesn't fit", then cancel and rebook in the app. Unused labels are refunded.
  - Labels can be cancelled only before sending.
  - Prohibited items have no claim.
  - Included cover is not stated on this page.

### www.yodeldirect.co.uk / www.inpostdirect.co.uk — Yodel consumer sending is now "InPost Direct"
- **Access** (2026-11-07, observed): yodeldirect.co.uk/send-a-parcel returns a 308 permanent redirect to inpostdirect.co.uk. The Door-to-Door link still points to yodeldirect.co.uk.
- **Offers** (observed 2026-11-07): Locker to Door, Shop to Door, Shop to Shop, and Door to Door collection. Weight bands are up to 1 kg, 1-2 kg, 2-5 kg and over 5 kg. Parcels over 1 m long need full dimensions.
- **Pricing:** Only "from £1.66 (exc VAT)" is published. Everything else needs the quote flow, which was not used.
- **Rules:** Locker to Door and Shop to Door include "£50 cover as standard". Locker services use a QR code, and shop labels can be printed in the shop for free. A rewards scheme offers up to 10% off.
- **Gotchas:** Older search snippets show Yodel Direct locker prices of £2.24, £3.32 and £4.99 exc VAT. These are stale, so do not reuse them.

### send.dpd.co.uk — DPD consumer site ("DPD Online")
- **Access** (2026-11-07, observed):
  - dpd.co.uk/content/products_services/send-a-parcel.jsp returns 404.
  - send.dpd.co.uk/products-and-services/ returned only a banner: "from just £2.99", full tracking included.
- **Pricing** (first-party claim, search snippets of send.dpd.co.uk, 2026-11-07):
  - "Send a parcel from £2.99 (£2.49 plus VAT)", which includes VAT.
  - Large parcels are "from £3.74 (£3.24 plus VAT)", up to 1 m long and 230 cm girth.
  - Drop-off at Pickup points is the no-collection option. Site counts differ: one page says 16,000 Pickup and drop-off points, another says 11,000 shops.
- **Rules** (first-party claim, snippet): Cover up to £50 is included. Maximum weight is 30 kg.
- **Gotchas:**
  - The size and weight that the £2.99 "from" price applies to is not published, so it needs a quote.
  - Parcel2Go notes that DPD cannot carry battery-containing items such as phones and laptops.
  - The Post Office also offers in-branch DPD (postoffice.co.uk/mail/in-branch-dpd, not fetched).

### www.parcelforce.com — overkill for 2 kg; blocked
- **Access** (2026-11-07, observed): HTTP 403. mailcoms.co.uk's 2026 Parcelforce page and postoffice.co.uk's express48 page also returned 403.
- **Pricing** (first-party claim, snippets):
  - The April 2026 UK and International guide (parcelforce.com/sites/parcelforce.com/files/2026-03/pfw-uk-and-international-services-and-prices-april-2026-v1-ta.pdf) says express48 is "from £13.60".
  - The "Our prices" page snippet says online prices are "From £11.95".
  - A Post Office snippet appears to tie £13.60 to 5 kg.
  - The weight band for 2 kg is **unclear**, so do not quote it.
- **Rules** (first-party claim, snippet): express48 includes £150 standard cover, and enhanced cover goes up to £2,500 per item. Parcelforce prices include VAT at 20% (Post Office snippet). Booking online and dropping off at a Post Office or depot is cheaper than the counter.

### www.parcel2go.com — broker; prices shown exc VAT
- **Access** (2026-11-07, observed): service and courier pages load.
- **Pricing** (observed 2026-11-07):
  - The site headline is "from £1.99 exc VAT", not tied to any service.
  - "DPD Drop Off Small" is from £5.60 exc VAT, with a 5 kg maximum and 0.53 m maximum length. It is drop-off only, with 1-2 day delivery and a 1-hour slot.
  - The Evri courier page showed no Evri prices in its extracted text.
- **Rules:** Tracking is included on all bookings. There is a price-match promise. "Parcel Protection up to the value of £10,000" is offered, but its cost was not stated. A "No Printer Required" filter shows label-free services, either a QR code at drop-off or the driver bringing the label.
- **Gotchas:**
  - Prices exclude VAT, so add VAT before comparing with Evri, DPD or Royal Mail direct prices that include it.
  - A third-party search snippet quoted the same DPD service at £4.89, or £3.91 discounted, plus a "DPD20P2G" code. Neither was seen on the page today, so they are stale or unverified.
  - The page shows two drop-off counts: 6,000 DPD locations and up to 2,500 shops.

### www.packlink.com — broker; Packlink's UK site is packlink.com/en-GB/
- **Access** (2026-11-07, observed): packlink.co.uk does **not resolve** (DNS failure). packlink.com/en-GB/ loads.
- **Pricing** (observed 2026-11-07, all exc VAT, carrier not named): up to 1 kg from £2.25, up to 2 kg from £2.80, up to 5 kg from £4.06, up to 10 kg from £4.60.
- **Rules:** The tool "is completely free; you only pay for the shipping service you choose". The page does not state cover, printerless options or drop-off versus collection.
- **Gotchas:** The carrier behind each "from" price is unknown without a quote. Prices exclude VAT.

### www.parcelmonkey.co.uk — broker; quote form only
- **Access** (2026-11-07, observed): the homepage loads but publishes no prices. Quotes need the weight and dimensions form (quotev3.php), which was not used.
- **Offers:** The homepage lists UPS, Parcelforce, DPD, FedEx, DHL, Evri, DX, CitySprint, InPost Direct and zippd. Royal Mail and Yodel were not listed on the homepage.

### www.parcelhero.com — blocked
- **Access** (2026-11-07, observed): HTTP 403 on /en-gb. No prices were collected.

## Dead ends
- royalmail.com/sending/uk/prices and /tracked-48 return 403. Use the PDF links in "Verify first" from a human browser.
- evri.com/prices is a "page not found" body. Use /our-services/our-prices.
- inpost.co.uk/prices returns 404. Use /send/parcel-prices.
- dpd.co.uk/content/products_services/send-a-parcel.jsp returns 404. The consumer site is send.dpd.co.uk.
- yodeldirect.co.uk/send-a-parcel redirects (308) to inpostdirect.co.uk, which publishes only a "from" price.
- packlink.co.uk does not resolve. Use packlink.com/en-GB/.
- mailcoms.co.uk, a third-party Royal Mail and Parcelforce rate reprint, returns 403.
- octolize.com hosts Royal Mail "Our prices January 2026", which is superseded by April, July and October 2026 tariffs.
- ShippyPro, Easyship and label-resizer blog figures (for example Royal Mail Tracked 48 at £3.61 "as of April 2026", or DPD shop-to-shop from £2.99/£3.99 ex VAT) are third-party and inconsistent. Do not use them.
- dpd.co.uk/pdf/dpd-tariff-guide.pdf is about 11 years old.

## Observed prices

| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | inpost.co.uk (observed) | Small 8x38x64 cm, to locker or shop | £1.99 | VAT basis not stated; size-priced up to 15 kg |
| 2026-11-07 | inpost.co.uk (observed) | Small 8x38x64 cm, to home | £2.89 | VAT basis not stated |
| 2026-11-07 | inpost.co.uk (observed) | Medium 19x38x64 cm, to locker or shop / to home | £2.59 / £3.99 | VAT basis not stated |
| 2026-11-07 | evri.com (observed) | Delivery to ParcelShop, Standard, 0-5 kg | £2.62 | incl. tax; undated page |
| 2026-11-07 | evri.com (observed) | 0-1kg Small, home delivery, drop-off / collection | £3.04 / £4.04 | incl. tax |
| 2026-11-07 | evri.com (observed) | 1-2kg Small (up to 45x35x16 cm), home delivery, drop-off / collection | £3.52 / £4.52 | incl. tax; £20 cover |
| 2026-11-07 | evri.com (observed) | 1-2kg Standard, home delivery, drop-off / collection | £4.79 / £5.78 | incl. tax |
| 2026-11-07 | inpostdirect.co.uk (observed) | Send a parcel, "from" | £1.66 | exc VAT; service not specified |
| 2026-11-07 | send.dpd.co.uk (first-party snippet) | Send a parcel, "from" | £2.99 (£2.49 + VAT) | inc VAT; size not specified |
| 2026-11-07 | royalmail.com PDF valid from 5 Oct 2026 (first-party snippet) | Tracked 48 small parcel 2 kg, online | £3.75 | VAT basis not verified |
| 2026-11-07 | royalmail.com (first-party snippet) | Tracked 48 small parcel, Post Office counter | £4.70 | VAT basis not verified |
| 2026-11-07 | royalmail.com (first-party snippet) | Tracked 24 small parcel, online / counter | £4.80 / £6.05 | VAT basis not verified |
| 2026-11-07 | packlink.com/en-GB (observed) | Up to 2 kg, "from", carrier not named | £2.80 | exc VAT |
| 2026-11-07 | parcel2go.com (observed) | DPD Drop Off Small, up to 5 kg, "from" | £5.60 | exc VAT |
| 2026-11-07 | parcelforce.com (first-party snippet) | express48, "from", weight band unclear | £11.95 (online) / £13.60 (April 2026 guide) | inc VAT at 20% per Post Office snippet |

## Prep checklist
- Weigh the parcel and measure the box in cm. Bands are size-based (InPost, the Evri Small/Standard split) as well as weight-based (Royal Mail, Evri, DPD).
- Check the depth: 8 cm or less qualifies for InPost Small, and 16 cm or less (within 45x35x16 cm) for Evri Small or a Royal Mail small parcel.
- Decide on delivery: recipient's home or a pickup locker or shop. Locker and shop delivery is the cheapest tier at both InPost and Evri.
- Know the item value. Included cover is Evri £20, DPD and InPost Direct £50, Royal Mail Tracked 24/48 up to £75 (snippet), and Parcelforce £150.
- Check the printer situation. InPost and InPost Direct lockers use a QR code. Evri and InPost Direct shops print free in store. Parcel2Go has a "No Printer Required" filter.
- When comparing brokers, add VAT. Parcel2Go and Packlink show prices excluding VAT.

## Needs a human
- Reading royalmail.com, parcelforce.com, postoffice.co.uk and parcelhero.com pages and PDFs, which return 403 to automated fetches.
- Getting exact broker and DPD quotes for a specific weight and size. These need quote forms (ParcelMonkey quotev3, Parcel2Go quick quote, DPD quotes, InPost Direct), which were not used under the read-only rules.
- Payment and account creation for any booking.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-07 — reviewed (independent): tariff-count wording fixed; Packlink verify step given a re-explore pointer; blocked hosts added to hosts; spot-checked InPost and Evri price tables (unchanged).
