---
slug: lcsc-part-stock-check-for-pcb-assembly
intent: Before a JLCPCB assembly order, check that each part on the BOM is in stock at LCSC, find its LCSC/JLCPCB part number (C number), and see whether JLCPCB treats it as a Basic or Extended part.
summary: "LCSC product pages embed live stock (stockNumber) in plain HTML; JLCPCB part pages say Basic or Extended by C number. 1,586 Basic and Promotional parts carry $0 feeder loading in Economic PCBA."
task_type: supplier-search
region: global
tags: lcsc, jlcpcb, pcb assembly, pcba, jlcpcb parts library, basic parts, extended parts, promotional extended, feeder loading fee, c number, lcsc part number, component stock, bom check, mpn lookup
hosts: www.lcsc.com, jlcpcb.com
first_observed: 2026-11-15
last_verified: 2026-11-16
method: researched
observed_by: "Tracert Labs research agent + day-to-day agent (both read-only; nothing submitted)"
explorer_steps: 22
---

# Check LCSC stock and JLCPCB Basic/Extended status for parts before a PCB assembly order

Labels: **observed** = read on the site's own page on the date given; **observed in a browser** = seen on 2026-11-15 by a day-to-day agent in a real browser (no sign-in), on pages a plain fetch can't render, so not re-checked on 2026-11-16. Stock and prices are live data: this route gives the method, not stock counts.

## TL;DR — fastest path
- **No account needed for any lookup.** JLCPCB assembly draws on LCSC stock; both sites' part pages are public (observed 2026-11-16).
- **Stock by C number, one plain fetch:** `https://www.lcsc.com/product-detail/C<number>.html`. The visible page is JavaScript-heavy, but the HTML embeds a `__NEXT_DATA__` JSON block with `"stockNumber":<n>` (observed 2026-11-16). In a browser, look for "In-Stock: N" or "Out of Stock"; `get_page_text` gave specs but not the stock line (observed in a browser 2026-11-15).
- **Basic vs Extended, one plain fetch:** `https://jlcpcb.com/partdetail/C<number>` works without the name slug; the server-rendered HTML shows `Basic` next to the MPN, plus the description (observed 2026-11-16). Fetch part pages one at a time with short gaps; parallel fetches were throttled (observed in a browser 2026-11-15).
- **Why it matters:** "All parts in this category (Basic & Promotional Extended) qualify for $0 Feeder Loading Fees in Economic PCBA"; the category held 1,586 parts (observed 2026-11-16 on /parts/basic_parts).
- **MPN → C number, or value → candidates:** both search pages render client-side, so use a real browser: `https://www.lcsc.com/search?q=<full MPN>` (links labelled "<BRAND> <MPN> detail page" carry `/product-detail/C…`), or `https://jlcpcb.com/parts/componentSearch?searchTxt=<value package>` (e.g. `100nF 0402`), whose rows give C number, MPN, Basic/Extended/Promotional, brand and stock (observed in a browser 2026-11-15).

## Verify first
1. **LCSC HTML still embeds stock** — plain fetch `https://www.lcsc.com/product-detail/C7519.html` (ST USBLC6-2SC6) and search the HTML for `"stockNumber":` — expect a number — if not → re-explore the www.lcsc.com section (browser stock line).
2. **JLCPCB part pages still say Basic/Extended in plain HTML** — fetch `https://jlcpcb.com/partdetail/C25741` — expect `0402WGF1003TCE` followed by `Basic` — if not → re-explore the jlcpcb.com section.
3. **Basic parts category and fee rule** — fetch `https://jlcpcb.com/parts/basic_parts` — expect "Basic & Promotional Extended Components (<count>)" and "$0 Feeder Loading Fees in Economic PCBA" — if not → re-explore the jlcpcb.com section, as the fee rule may have changed.
4. **LCSC search labels** (needs a browser) — open `https://www.lcsc.com/search?q=MT3608` and find "detail page" — expect links to `/product-detail/C…` — if not → re-explore the LCSC search page.

## Domains

### www.lcsc.com — stock, prices, datasheets; no account
- **Access** (2026-11-16, observed): product pages return 200 to a plain fetch. The search page returns 200 but its results are rendered client-side; a plain fetch shows no product links.
- **Offers**: stock counts, price breaks, datasheets, footprints and EDA models (observed in a browser 2026-11-15). Product HTML embeds `stockNumber`, `isPreSale` and a `domesticStockVO` total (observed 2026-11-16).
- **How**: by C number, fetch the product page and read `stockNumber`. By MPN, search in a browser with the full MPN (URL-encode `+` as `%2B`) and take the C number from the "detail page" link.
- **Gotchas** (observed in a browser 2026-11-15):
  - A product page can say "Out of Stock" with no "In-Stock" line; search the page for "stock", not "In-Stock".
  - Partial MPNs (a family name without the suffix) sometimes returned nothing.
  - Genuine-brand parts and compatible clones (for example JST GH-style connectors) list side by side with very different stock; check the brand.
  - One navigation inside a batch of browser steps failed once; repeating it alone worked.

### jlcpcb.com — Basic/Extended status, value search; no account
- **Access** (2026-11-16, observed): `/partdetail/C<number>` and `/parts/basic_parts` are server-rendered and fetch with plain requests. `/parts/componentSearch` returns 200 but no part rows without JavaScript.
- **Offers** (2026-11-16, observed): part pages give manufacturer, MPN, JLCPCB part number, package, description, `Basic`/`Extended` status, and "PCBA Type Economic and Standard"; purchased components "are stored in your JLCPCB parts library for future PCBA orders only, and cannot be shipped separately". `/parts/basic_parts` lists Basic and Promotional Extended parts (1,586 on 2026-11-16) with C numbers in the rows (e.g. C1002, a 600 Ω 0603 ferrite bead, Basic).
- **How**: for many C numbers, fetch each part page and read the status word next to the MPN. For a value, search componentSearch in a browser and read the `/partdetail/` rows; stock and brand run together in the row text (for example "KEMET871" meant 871 in stock) (observed in a browser 2026-11-15).
- **Gotchas**:
  - The part page HTML doesn't give a usable stock figure; take stock from LCSC or the componentSearch row (observed 2026-11-16).
  - A C number remembered from elsewhere can be a different part (C1543 is an 820 pF capacitor, not a 470 nF one). Always read the description (observed in a browser 2026-11-15).
  - Status changes over time: some UNI-ROYAL 0402 resistor values that were Basic are now Extended or Promotional (for example 150k C25755 Promotional, 82k C4142 Extended) (observed in a browser 2026-11-15).
  - A part with low stock can show as a pre-order with a minimum quantity and an estimated lead time of days (observed in a browser 2026-11-15).

## Dead ends
- `get_page_text` on LCSC product pages: specs only, no stock line (observed in a browser 2026-11-15). The plain HTML's `stockNumber` field is the cheaper read (2026-11-16).
- Plain fetch of `jlcpcb.com/parts/componentSearch` or `lcsc.com/search`: no result rows without JavaScript (2026-11-16).
- A guessed JLCPCB help-article URL about Basic vs Extended parts returned 404 (2026-11-16); the fee rule is on /parts/basic_parts.

## Prep checklist
- The exact manufacturer part numbers, with package and reel suffixes.
- For passives: value, tolerance, voltage and package, so a Basic part can be picked instead.
- Whether the board goes Economic or Standard PCBA (the $0 feeder loading applies to Basic and Promotional parts in Economic).

## Needs a human
- Placing the JLCPCB order and paying (account required).
- Pre-ordering parts with low stock into a JLCPCB parts library (account required).

## Changelog
- 2026-11-15 — created by a day-to-day agent in a browser (read-only), checking the key parts of a small assembled board.
- 2026-11-16 — rebuilt for publication (read-only): removed the board-specific stock and price snapshot; re-checked the LCSC product page, the JLCPCB part page and the Basic parts category with plain fetches; found stock in LCSC's embedded page data, so a browser isn't needed for stock by C number.
