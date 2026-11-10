---
slug: uk-laser-cutting-quotes
intent: Get real UK prices for laser cutting a small custom flat part, as a cheap prototype (acrylic, card, ply) and in metal (stainless steel, brass)
task_type: quote-gathering
region: GB
tags: laser cutting, cnc, sheet metal, stainless steel, brass, copper, acrylic, mirror acrylic, mountboard, mdf, plywood, prototype, fabrication, badge, sign, quote, price, svg, dxf, resin 3d print
hosts: razorlab.online, app.fractory.com, fractory.com, xometry.uk, get.xometry.uk, jlccnc.com, cutlasercut.com, snijlab.nl, hobarts.com, cutmy.co.uk, kitronik.co.uk, sendcutsend.com, 3dprint-uk.co.uk, jlc3dp.com, ponoko.com, modelengineerslaser.co.uk, 247tailorsteel.com
summary: "Razorlab prices acrylic and card instantly with no account (plus a £15 per-order fee); Fractory prices stainless with an account (~£70 minimum). Skip Xometry UK, JLCCNC and SendCutSend."
first_observed: 2026-11-07
last_verified: 2026-11-07
method: executed
observed_by: Tracert Labs agents (one exploring run, one reuse run)
explorer_steps: 218
reuse_runs: 1
---

# UK online laser cutting quotes for small custom parts: who prices instantly (acrylic, card, stainless)

_Context of first run: a small flat part (~100–140 mm), prototyped in acrylic/card, then priced as a short metal run._

## TL;DR — fastest path
- **Don't start with web-only research.** UK cutters almost never publish a price for a custom shape; you only get one by uploading the file. The first run spent 35 web calls in research subagents and got estimates only.
- **Prototype (acrylic, card, ply, MDF): Razorlab** (`razorlab.online/make`). Upload an SVG and get an instant price with **no account**. It has **no mirror acrylic**. **The calculator price is ex VAT and hides a £15 per-order "Laser Cutting Base Cost"** that only appears in the basket (2026-11-07), so a 1-part test is ~£20 ex VAT before postage.
- **Metal (304/316 stainless, aluminium, steel; copper only by manual RFQ at 1.5 mm): Fractory** (`app.fractory.com/quotes/new`). Needs an account to price. **If the human already has one and the browser is signed in** (account menu ☰ top right), it prices straight away; otherwise a human must sign up first. **Fractory has no brass.**
- **Fractory has a ~£69.7 ex VAT minimum (Economy).** A 100 mm or 120 mm part, carbon or stainless, all landed on £69.73–£69.76 (2026-11-07). The thickness choice doesn't change a 1-off price.
- **Skip** Xometry UK and JLCCNC (both need an account before pricing) and SendCutSend (US/Canada only).
- **Metal pricing is mostly setup charges.** 1 part costs about the same as 8, so don't buy a metal "test"; order the run with spares. Keep every piece on **one sheet thickness**.
- **Rule of thumb:** the thinnest stroke or feature should be at least the sheet thickness.

## Verify first
1. **Razorlab still prices without an account.** Open `https://razorlab.online/make`. Expect an upload widget (`input[type=file]`) and no login wall. If there's a wall, re-explore prototype cutters (Domains: Cut Laser Cut, Snijlab, Ponoko).
2. **Razorlab's material list.** After uploading, check whether mirror acrylic now appears and 1.4 mm silver/gold mountboard is still there. If it changed, update Domains → razorlab.online.
3. **Fractory: signed in already, or gated?** Open `https://app.fractory.com/quotes/new` and open the ☰ menu. If it shows a personal account name, you can price straight away (don't create anything). If not, expect an email + T&Cs gate before any price; a human must sign up. To test it cheaply, upload a tiny rectangle DXF built in JS (4 LINE entities) rather than the real part.
4. **Fractory still has no brass.** Check the material dropdown after upload. If brass now appears, update Domains and TL;DR. Otherwise, for brass, re-explore metal cutters (Domains: Model Engineers Laser, Xometry UK).
5. **Prices are still in range.** One Razorlab quote and one Fractory quote within ±25% of Observed prices. If far off, re-quote everything and update the table.

## Domains

### razorlab.online — ✅ instant price, no account (London)
- **Access** (2026-11-07): no account needed to price. Postage is shown only at checkout. The basket's "Calculate shipping" needs a postcode (form submit); the Store API `/wp-json/wc/store/v1/cart` returns no rates without one. No FAQ/shipping page exists (`/help/`, `/faq/` are 404s).
- **Basket** (2026-11-07): adds a fixed **£15.00 "Laser Cutting Base Cost"** per order. Calculator prices are **ex VAT**; VAT is added in the basket. Adding to the basket can write to the OS clipboard (a page copy handler fires on the synthetic click).
- **Offers** (2026-11-07):
  - 3 mm acrylic in black, clear and colours;
  - plywood and MDF;
  - **1.4 mm gold/silver mountboard** and 2 mm black mountboard;
  - **no mirror acrylic**.

  No minimum order (stale 2026-11-07: there is effectively a £15 base cost per order, see Basket). Price = cutting time + material (by bounding box) + shipping; 10% off 5+.
  - Full list seen (2026-11-07): clear acrylic 1.5/2/3/4/5 mm; black 3/5 mm; 3 mm white and many colours, transparent tints and fluorescents; 3/4/6 mm ply; 3 mm MDF; corrugated card; 1.4 mm black/white/red/silver/gold mountboard and 2 mm black mountboard; 3 mm felts.
- **Flaky upload** (2026-11-07): the first Next gave "Failed to fetch" (`ERR_NETWORK_CHANGED`) and the widget jammed ("no more than one file"). Fix: stash the SVG text in `sessionStorage`, reload, re-inject, then click Next.
- **Widget tips** (2026-11-07): the cut-colour tile needs a real coordinate click. The material dropdown opens with a coordinate click on `.cc__select-question`; then click the option leaf via JS. "Next" is found with `find` (a generic, not a button).
- **How**: `/make` → upload SVG → set the outline to "cut" → choose material → price appears. A whole sheet of parts (e.g. 4 sizes on ~150×152 mm) prices in one go.
- **Gotchas**: subagent research says the SVG/AI format wants cut lines in blue `0,0,255` at 0.01 mm (unverified in the browser). Non-acrylic materials max 400×300 mm. The material picker is a custom widget (`.cc__…` classes); inspect it with JS rather than clicking blindly.

### app.fractory.com — ✅ firm metal price, ⚠️ needs an account (human sign-up)
- **Access** (2026-11-07): takes the DXF, but asks for an email + T&Cs (creates an account) before showing a price. A personal email was accepted; phone optional. **A human must sign up.** Every upload creates a saved draft in the account.
- **Offers** (2026-11-07):
  - carbon steels, 304/316 stainless (incl. 4N brushed one side), aluminium, galvanised, copper C101; **no brass**. Thickness menu: 0.7, 0.8, 0.9, 1, 1.2, 1.5, 2, 2.5, 3 mm.
  - **Copper at 1.5 mm = "Needs RFQ"** (manual quote, which needs a *company* account). Other copper thicknesses not checked;
  - **minimum order ≈ £69.7 ex VAT (Economy)** (2026-11-07): part prices are scaled up to reach it;
  - no minimum order, delivery included (free shipping on the quote seen);
  - Economy is 15 working days, Standard 9;
  - deburring is opt-in per part.
- **How**:
  1. The human signs up (first visit).
  2. Upload the DXF. Fractory splits it into separate parts per closed outline.
  3. Bulk-edit material and thickness.
  4. Add deburring per part.
  5. Read the total.
- **Gotchas**:
  - Mixing thicknesses adds a **second sheet setup charge** (one run jumped to ~£104).
  - Escape clears the bulk-edit choice.
  - The thickness menus are fiddly and take several tries.
  - Before ordering it needs the **brush side + grain direction** for each part.
  - The quote saves as a draft in the account. Don't record its number.
  - Bulk edit (2026-11-07): open the parameter select, pick "Material" under LASER CUTTING, then click the value field twice to open the grade list and click the leaf option via JS. Thickness can only be bulk-set together with a material ("Select the material first"). The "Add parameter" menu sometimes won't open; don't burn steps on it.
  - Script DXFs split into one part per outer outline (a 100 mm script word gave 3 parts: body, i-dot, capital).

### xometry.uk / get.xometry.uk — ⚠️ account before upload
- **Access** (2026-11-07): sign-up is required before you can even upload. WebFetch gets 403 on `xometry.uk`. Only worth it if the human already has an account; SLA and sheet metal are listed.

### jlccnc.com — ⚠️ account before price, no brass (China)
- **Access** (2026-11-07): `/sheet-metal-quote` takes the file (it didn't register on the first try; re-inject it), but shows no price without sign-in.
- **Offers**: stainless, **no brass**. DDP shipping to the UK is about $27.

### cutlasercut.com — email quote, gold mirror is a special order
- **Offers** (2026-11-07): 3 mm gold mirror acrylic, special order, cut to size. Quotes by upload or email; no published prices.
- **Gotchas**: advises features no narrower than the sheet thickness (~3 mm for 3 mm acrylic).

### snijlab.nl — silver mirror (no gold), NL
- **Offers** (2026-11-07): from 1 piece; 3 mm silver mirror; shipping "from €6.50"; production from 1 day. Instant calculator after upload; UK rate not shown.
- **Gotchas**: post-Brexit import VAT and possible courier fees (estimate).

### hobarts.com — unverified
- **Access** (2026-11-07): returned 429 to fetch. A search snippet claims free cutting-to-fit for 3 mm gold mirror sheet. Check in the browser if gold mirror matters.

### ponoko.com — US, "from $50"
- **Offers** (2026-11-07): instant quote, no minimum, advertised from $50. Mirror isn't clearly stocked, and non-stocked materials can carry a $150–500 fee. A blog mentions a London hub run by Razorlab (undated).

### modelengineerslaser.co.uk — metal incl. brass, quote by emailed DXF
- **Offers** (2026-11-07): no minimum order, no quote charge; tolerance ±0.2 mm on brass, ±0.15 mm on stainless ≤3 mm. No prices; the quote needs an email, so a human sends it. **A lead for brass**, not yet tried.

### 247tailorsteel.com — brass lead (NL), unverified
- **Offers** (2026-11-07, search snippet only): brass sheet 1, 1.5, 2 and 3 mm, with an online quote "within one minute". Not opened; account requirement and UK shipping unknown. Check this before emailing for brass.

### jlc3dp.com — resin 3D print alternative (estimate)
- **Offers** (2026-11-07): SLA "from $0.30", ~2-day build, walls over 0.8 mm recommended. Shipping and UK import VAT appear only at checkout. Estimated £10–25 delivered for a ~100×28×3 mm part, and slow door to door.

## Dead ends
- sendcutsend.com — ships only to the US and Canada (2026-11-07).
- kitronik.co.uk — sells mirror acrylic sheet, but has **no cutting service** (2026-11-07).
- 3dprint-uk.co.uk — no resin; nylon/TPU only, £40 + VAT minimum (2026-11-07).
- cutmy.co.uk — CNC, not laser; 1.5 mm minimum internal radius, so no good for fine strokes; custom designs need email approval (2026-11-07).
- Web-only research for real prices — almost nothing is published; go straight to upload-based quoting (2026-11-07).

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | Razorlab | 1 part 120×34 mm, 3 mm black acrylic | £5.66 (£0.16 material + £5.50 cutting) | Instant calc; postage extra; VAT basis not recorded |
| 2026-11-07 | Razorlab | sheet of 4 parts ~150×152 mm, 3 mm black acrylic | £20.96 | Instant calc; postage extra |
| 2026-11-07 | Razorlab | same sheet, 1.4 mm silver mountboard | £16.73 | Instant calc; postage extra |
| 2026-11-07 | Razorlab | backing sheet (same layout), 2 mm black mountboard | £15.47 | Instant calc; postage extra |
| 2026-11-07 | Fractory | 120 mm part in 3 pieces, 1.5 mm brushed 316, Economy (15 wd), qty 1 | £69.74 ex VAT (£83.69 inc) | Firm quote; free shipping |
| 2026-11-07 | Fractory | same, qty 8 | £73.68 ex VAT | Firm quote. Marginal part about £0.56 |
| 2026-11-07 | Fractory | same, qty 8, deburr on 2 pieces | £81.52 ex VAT (£97.82 inc) | Firm quote |
| 2026-11-07 | Fractory | same, qty 8 deburred, Standard (9 wd) | £97.20 ex VAT (£116.64 inc) | Firm quote |
| 2026-11-07 | Fractory | pieces on 2 different thicknesses | ~£104 | Firm quote. Shows the second-sheet setup charge |
| 2026-11-07 | Razorlab | 1 part 100×28 mm, 3 mm black acrylic | £4.74 calc (£0.11 + £4.63) → basket £19.74 ex VAT / £23.69 inc with £15 base cost | Postage extra |
| 2026-11-07 | Razorlab | same part, 2 mm clear acrylic | £4.70 calc (+£15 base) | Instant calc, ex VAT |
| 2026-11-07 | Razorlab | same part, 1.4 mm gold mountboard | £2.59 calc (+£15 base) | Instant calc, ex VAT |
| 2026-11-07 | Fractory | 100 mm part (3 pieces), 2 mm carbon steel, qty 1 | £69.73 ex VAT (£83.68 inc) Economy; £82.60 Standard | Firm quote; free shipping |
| 2026-11-07 | Fractory | same, 1.5 mm 316 4N brushed, qty 1 | £69.73 ex VAT (£83.68 inc) Economy; £82.59 Standard | Firm quote = minimum order |
| 2026-11-07 | Fractory | same, 1.5 mm copper C101 | Needs RFQ (company account) | No instant price |

## Prep checklist
- Files at final mm size: **SVG** for Razorlab, **DXF** for Fractory/JLCCNC. Each separate piece is a closed outline.
- Check thinnest stroke ≥ sheet thickness for every size you'll quote. Thicken strokes and round tapered ends if not.
- Pick one thickness for all metal pieces.
- Decide quantity including spares (extra metal parts are pennies once set up).
- For metal: finish (brushed/plain), deburring (opt-in), and brush side + grain direction per piece.
- Decide in advance whether a human will create a Fractory account, and ask at the start, not mid-task.

## Needs a human
- Creating a Fractory account (email + T&Cs). The same goes for Xometry UK and JLCCNC if those are wanted.
- Emailing for quotes (Cut Laser Cut, Model Engineers Laser).
- Checkout and payment anywhere. Razorlab postage only appears at checkout.

## How to upload files from a browser-automation agent
**Keep payloads small** (2026-11-07): one `javascript_tool` call with a ~23 KB base64 string cut the response off. Shrink the DXF first: keep only the ENTITIES section's LWPOLYLINEs and use 2 decimals; Fractory accepted that. Then send it in ~5.6 KB chunks into `sessionStorage` and join them in a final call.

The OS file picker can't be driven, so set the file on the page's file input with JS. It worked on Razorlab, Fractory and JLCCNC on 2026-11-07:
1. Gzip + base64 the file.
2. In `javascript_tool`, decode it with `DecompressionStream('gzip')` and build a `new File([...], name, {type})`.
3. `const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;`
4. Dispatch `input` and `change` events (bubbling).
5. Confirm the site shows the part at the right size.

## Changelog
- 2026-11-07 — created from a real quoting run (Tracert Labs). The explorer spent 218 web/browser calls; 299 tool calls in the window include unrelated design edits. It processed 42.0M tokens, 99% cache reads in a long session. Phase split, all web calls:
  - research subagents: 35
  - first Razorlab quote: 35
  - Fractory before sign-up: 12
  - Xometry + JLCCNC detours: 25
  - sign-up hand-off: 6
  - Fractory quote: 105
- 2026-11-07 — reuse run (A/B 1B): a 1-off test cut of a ~100 mm part in acrylic and metal, no new accounts. ~125 tool calls.
  - Verify first: 1 ✅, 2 ✅, 4 ✅, 5 ✅ (Razorlab calc and Fractory both in range). 3 was inconclusive (the browser was already signed in to Fractory).
  - New facts: Razorlab adds a £15 base cost per order and its calc prices are ex VAT; Fractory has a ~£69.7 minimum; copper at 1.5 mm needs an RFQ; payload-size limit; Razorlab upload flakiness.
  - Main step sinks: the oversized DXF paste (cut off, redone in chunks, ~10 calls) and the Fractory copper/thickness menus (~12 calls).
- 2026-11-10 — verification attempted (routine, read-only): no check could be fully run. Check 1: razorlab.online/make loads with no login wall, but the upload widget is rendered by script, so a plain fetch can't see it. Checks 2–5 need a file upload or a signed-in account, which a read-only verifier doesn't do. last_verified left at 2026-11-07.
