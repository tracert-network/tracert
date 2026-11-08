---
slug: chrome-web-store-publishing
intent: Publish a browser extension to the Chrome Web Store for the first time, and optionally to Microsoft Edge Add-ons and Firefox Add-ons (AMO), covering accounts, fees, listing assets, privacy disclosures, review and update automation.
summary: "Chrome: $5 one-time fee (reported), MV3 only, new publishers get 2 extension slots, review days to weeks, API v2. Edge: free, up to 7 business days. Firefox: no fee stated; new extensions must declare data collection."
task_type: how-to
region: global
tags: chrome web store, publish chrome extension, chrome developer dashboard, developer registration fee, manifest v3, mv2 deprecation, privacy practices, permission justification, remote hosted code, single purpose, rejection reasons, chrome web store api, edge add-ons, partner center, firefox add-ons, amo, addons.mozilla.org, extension signing, web-ext, data_collection_permissions, trader declaration
hosts: developer.chrome.com, learn.microsoft.com, extensionworkshop.com, blog.mozilla.org
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 34
---

# How to publish a browser extension to the Chrome Web Store (plus Edge Add-ons and Firefox AMO) for the first time

## TL;DR — fastest path
- **Chrome first.** Register at the Chrome Developer Dashboard (chrome.google.com/webstore/devconsole) with a dedicated email you can never change. Pay the one-time fee (widely reported as USD 5; the official page does not state the amount, so check at checkout). Turn on 2-Step Verification. Make the EU trader or non-trader declaration.
- **Build Manifest V3 only.** The Chrome Web Store removed all remaining MV2 items on 2026-08-31, and remotely hosted code is not allowed in MV3. Edge is reportedly retiring MV2 now (third-party reports; not confirmed on a Microsoft page). Firefox still accepts MV2 (Mozilla, 2024; not re-confirmed for 2026), but it can take the same MV3 build plus Firefox-specific manifest keys.
- **The Privacy tab is where most rejections start.** Write a narrow single-purpose statement, give one justification per permission (remove any permission you don't use), answer the remote-code question, tick data-use checkboxes that match your privacy policy URL, and add test credentials if the extension needs a login.
- **New Chrome publishers get 2 extension slots by default** (since 2026-08-20). You can ask for more in the dashboard.
- **Automate updates only after the first manual publish.** Chrome API v2 (`chromewebstore.googleapis.com/v2`), Edge Add-ons REST API v1.1 (API key plus Client ID) and Firefox `web-ext sign` v8+ or AMO API v5 all update existing items. Chrome and Edge both need the first listing created in their dashboards.
- **Steps that need a human:** paying, sign-in and 2FA, the trader SMS check, Edge company verification, accepting the agreements, creating API credentials, and asking for a higher publishing limit.

## Verify first
1. **Chrome still gives new publishers 2 slots by default** — fetch developer.chrome.com/blog/cws-review-updates-2026 — expect "default of two extension slots" (published 2026-08-20) — if changed, re-explore the Chrome Web Store section.
2. **Chrome Web Store API is v2 only** — fetch developer.chrome.com/docs/webstore/using-api — expect `chromewebstore.googleapis.com/v2/publishers/...` endpoints. V1 support was planned to end on 2026-10-15; if the docs show V1 again or an extension of that date, re-explore the API notes.
3. **Scope of Firefox's data-collection requirement** — fetch extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/ — expect "mandatory for new extensions since 2025-11-03; existing add-ons later, no date". If it now covers all add-ons or updates, update the Firefox section.
4. **Mozilla's revised Add-on Policies take effect 2026-12-01** — fetch extensionworkshop.com/documentation/publish/add-on-policies-preview-2026-12/ — expect a preview page with that effective date. After 2026-12-01, read the live policies page instead.
5. **Edge certification time** — fetch learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension — expect "up to seven business days" — if different, update the Edge section.

## Domains

### developer.chrome.com — the authoritative source for Chrome Web Store (CWS) registration, listing, policy and API
- **Access** (2026-11-07, observed): Every docs page and blog post fetched without blocks. One dead URL (see Dead ends).
- **Registration** (2026-11-07, observed on /docs/webstore/register):
  - You pay a "one-time registration fee" in the Developer Dashboard after accepting the developer agreement and policies. **The page does not state the amount.**
  - The developer email cannot be changed after the account is created. The page recommends a dedicated publishing inbox. The email of a deleted developer account can't be reused.
  - Registration is open only in a listed set of countries and regions.
  - To change the email you create a new account and transfer the items through a support form.
- **Fee amount** (first-party claim + third-party): USD 5.00, one-time, per account rather than per extension. Sources: a 2020 Chromium Blog announcement (search snippet), and 2026 third-party guides (flaviocopes.com, extensionbooster.net) that still say USD 5 with no renewal. The Developer Agreement snippet says the amount is set at Google's discretion. Tax and VAT basis is not stated anywhere seen. The amount shown at checkout is authoritative.
- **Account setup** (2026-11-07, observed on /docs/webstore/set-up-account):
  - A publisher name is required and appears publicly under "Offered by".
  - A contact email is required and must be verified through an emailed link.
  - A physical address is required only for items that offer purchases, extra features or subscriptions.
  - Trusted testers are individual emails only; group addresses are not supported.
- **Trader declaration** (first-party claim, search snippets of /docs/webstore/program-policies/trader-disclosure and its trader FAQ):
  - Every publisher must declare Trader or Non-Trader to meet the EU Digital Services Act.
  - Traders give a legal name, address and phone number. The phone is verified by SMS.
  - Trader details are shown publicly at the bottom of the listing.
- **2-Step Verification** (2026-11-07, observed on /docs/webstore/using-api): "2-step verification is required on the Google Account to publish or update an existing extension."
- **Publishing flow** (2026-11-07, observed on /docs/webstore/publish):
  1. Dashboard → Add new item → upload the ZIP (2 GB maximum).
  2. Fill in the tabs: Package, Store Listing, Privacy, Distribution (paid or free, countries, visibility), and Test instructions (only if needed).
  3. Submit for review. You can untick auto-publish to defer publishing.
  4. After approval you have up to 30 days to publish. After that the submission reverts to draft and needs another review.
  - New publishers can publish 2 extensions by default. Themes don't count toward the limit.
- **Publication limits** (2026-11-07, observed on blog post "cws-review-updates-2026", published 2026-08-20):
  - The default is 2 extension slots per publisher. Limits are set per publisher based on the quality and usage of its extensions.
  - Existing publishers keep at least their current published count.
  - Increases are requested in the dashboard, and the post says responses are usually immediate.
  - The same post: automated pre-submission install testing now runs when you upload a draft. The "Featured" badge is being discontinued and self-nominations closed on 2026-08-20. Ratings now weight recent reviews more heavily.
  - Third-party (techstoriesindia.com, deepakness.com snippets): limits reportedly step up over time, for example from 2 to 4. This is anecdotal.
- **Listing images** (2026-11-07, observed on /docs/webstore/images):

  | Asset | Status | Size and format |
  |---|---|---|
  | Icon (inside the ZIP) | Required | PNG, 128x128 canvas with 96x96 artwork and 16 px transparent padding |
  | Screenshots | At least 1 required, up to 5 recommended | 1280x800 (preferred) or 640x400; square corners, full bleed |
  | Small promo tile | Optional | 440x280. Items without one are ranked after items that have one. |
  | Marquee tile | Optional | 1400x560. Needed to be featured in the marquee. |

  Promo images are reviewed separately, within about a week.
- **Privacy practices tab** (2026-11-07, observed on /docs/webstore/cws-dashboard-privacy):
  - **Single purpose description:** narrow and easy to understand.
  - **Permissions justification:** one box for each manifest permission. The page says to remove unused permissions and re-upload.
  - **Remote code:** answer yes or no. Undeclared remote code means rejection. MV3 forbids executing remotely hosted files.
  - **Data usage:** checkboxes for the data types collected, plus certification checkboxes for limited use. These must match the privacy policy URL.
  - **Privacy policy:** required if the extension handles any user data. It must cover collection, use and sharing, and every party that receives the data (observed on /docs/webstore/program-policies/privacy).
- **Review times** (2026-11-07, observed on /docs/webstore/review-process; the timing is Google's own claim):
  - "most extensions" are reviewed "within a few days", but review "can take up to a few weeks". Contact support if an item has been pending more than 3 weeks.
  - Reviews take longer for new developers and new extensions, broad host permissions (`<all_urls>`, `*://*/*`, `https://*/*`), powerful permissions such as `cookies` or `webRequest` combined with host permissions, and large or minified code.
  - Obfuscation is banned. Minification is allowed.
- **Enforcement** (2026-11-07, observed on the same page):
  - A rejection emails you the policy cited and how to appeal. The live listing is not affected.
  - For minor issues in a published item you usually get 7–30 days to fix before takedown. Serious violations can mean immediate takedown. Malware skips rejection and goes straight to enforcement.
  - Appeals are made from the item page or account page in the dashboard. Replies can take up to 3 days, or more than 7 days if escalated.
- **Common rejection codes** (2026-11-07, observed on /docs/webstore/troubleshooting):

  | Code | Problem |
  |---|---|
  | Blue Argon | Remote hosted code |
  | Purple Potassium | Excessive permissions |
  | Red Magnesium, Red Copper, Red Lithium, Red Argon | Single purpose |
  | Yellow Zinc | Missing or misleading metadata (icon, title, screenshots, description) |
  | Purple Lithium | Privacy policy missing or inaccessible |
  | Purple Nickel | Prominent disclosure or consent missing |
  | Purple Copper | Insecure data transmission |
  | Yellow Argon | Keyword stuffing |
  | Red Titanium | Obfuscation |
  | Yellow Magnesium | Functionality not working |
  | Yellow Potassium | Minimum functionality |
  | Yellow Nickel | Spam, duplicates |
  | Grey Copper | Gambling or prediction markets |

- **Recent policy changes** (2026-11-07, observed on blog "cws-policy-updates-2026", published 2026-07-01; enforced from 2026-08-01):
  - Prediction markets are now a prohibited product.
  - Data collection must be strictly necessary to the disclosed single purpose.
  - All data collection must be prominently disclosed, and users must be told proactively when data practices change after install.
  - A new ban covers extensions designed to circumvent the safety guardrails of AI services.
- **MV2 timeline** (2026-11-07, observed on /docs/extensions/develop/migrate/mv2-deprecation-timeline):
  - New public and unlisted MV2 items have been refused since January 2022, and private ones since June 2022.
  - Chrome 138 (2025-07-24) disabled MV2 for all users. The enterprise policy was removed in Chrome 139.
  - All remaining MV2 items were removed from the store on **2026-08-31**.
- **Chrome Web Store API** (2026-11-07, observed on /docs/webstore/using-api and blog "cws-api-v2", published 2025-10-15):
  - Base URL `https://chromewebstore.googleapis.com`; OAuth scope `https://www.googleapis.com/auth/chromewebstore`. Service accounts are supported once you add their emails in the dashboard.
  - Endpoints:
    - `GET /v2/publishers/PUBLISHER_ID/items/EXTENSION_ID:fetchStatus`
    - `POST /upload/v2/publishers/PUBLISHER_ID/items/EXTENSION_ID:upload`
    - `POST /v2/publishers/PUBLISHER_ID/items/EXTENSION_ID:publish` (accepts `publishType` `STAGED_PUBLISH`)
    - `POST ...:setPublishedDeployPercentage`
    - `POST ...:cancelSubmission`
  - Every upload needs a higher manifest `version`, or it fails.
  - A new item's Store listing and Privacy tabs must be completed in the dashboard first.
  - Percentage rollout is available only to items with more than 10,000 seven-day active users.
  - V1 was to be supported "until 15th October 2026". The page has no note on whether that was extended.
- **Gotchas:**
  - The fee amount is not on the official registration page.
  - A visibility change made by hand in the dashboard must be published manually once before the API can publish again.
  - Group emails can't be trusted testers; use Private visibility with "trusted testers from the current publisher settings" instead.

### learn.microsoft.com — official Microsoft Edge Add-ons docs (Partner Center). Free, stricter on the description, slower company verification.
- **Access** (2026-11-07, observed): Fetched cleanly. The pages carry `updated_at` 2026-09-02.
- **Account** (2026-11-07, observed on /microsoft-edge/extensions/publish/create-dev-account):
  - "There is no registration fee."
  - You need a personal Microsoft account (MSA); signing in with GitHub creates one. Work or school accounts can't be used to register.
  - Country or region and account type (Individual or Company) can't be changed after enrollment.
  - Individual accounts get a shorter check that the publisher name is available.
  - Company accounts can take "a few days to a few weeks". Microsoft contacts a named company approver and may phone the company. Documents such as utility bills, a DUNS ID or government records may be requested.
  - The publisher display name can be at most 50 characters.
- **Listing** (2026-11-07, observed on /microsoft-edge/extensions/publish/publish-extension):
  - **Flow:** Create new extension → upload the .zip → Availability (Public or Hidden, markets) → Properties (category is required) → Privacy → Store listings for each language → Notes for certification → Publish.
  - **Privacy page:** the same five sections as Chrome (single purpose, permission justification, remote code, data usage certification, privacy policy URL). The policy URL is required if the extension collects any personal information.
  - **Description:** required for every language, **250 to 10,000 characters**.
  - **Logo:** required for every language, 1:1, 300x300 recommended, 128x128 minimum.
  - **Screenshots:** optional, at most 6, 640x480 or 1280x800.
  - **Tiles:** small promo 440x280 and large promo 1400x560, both optional.
  - **Search terms:** at most 7 terms and 21 words, 30 characters per term.
  - An optional "Generate with AI" button writes a description, up to 10 times an hour.
- **Review** (2026-11-07, observed; Microsoft's own claim): "can take up to seven business days". Status then changes to "In the Store".
- **Update API** (2026-11-07, observed on /microsoft-edge/extensions/update/api/using-addons-api):
  - Enable "Publish API" in Partner Center to get a Client ID and an API key; each key shows an expiry date.
  - Root `https://api.addons.microsoftedge.microsoft.com`. Send headers `Authorization: ApiKey ...` and `X-ClientID: ...`.
  - Endpoints:
    - `POST /v1/products/$productID/submissions/draft/package`
    - `GET .../draft/package/operations/$operationID`
    - `POST /v1/products/$productID/submissions` (certification notes in a JSON body)
    - `GET .../submissions/operations/$operationID`
  - There is no endpoint to create a product or edit metadata.
  - The old v1 access-token method was due to end on 2024-12-31.
- **MV2** (third-party: malwarebytes.com and cybersecuritynews.com snippets, plus a mc.merill.net mirror of Microsoft message MC1467356, dated 2026-09-04):
  - Edge began retiring MV2 for consumers in autumn 2026, with consumers targeted for the end of 2026. Enterprise retirement is planned for January to April 2027.
  - Partner Center reportedly no longer accepts MV2 updates, apart from conversions to MV3.
  - This was not confirmed on a Microsoft-owned page today.
- **Gotchas:**
  - The manifest `name` and `description` can't be edited in Partner Center; change them in the package and re-upload.
  - If only one locale appears, the manifest needs `__MSG_*__` placeholders and a `default_locale`.
  - Generic "correlationId: undefined" errors are fixed by clearing cache or switching browser.

### extensionworkshop.com — official Mozilla developer docs for AMO submission, signing and data consent
- **Access** (2026-11-07, observed): Fetched cleanly. The data-consent page is about 100K characters long.
- **Submission** (2026-11-07, observed on /documentation/publish/submitting-an-add-on/, last updated 2026-05-10):
  - You need a Mozilla Account. The page mentions no fee.
  - Choose "On this site" (listed on AMO) or "On your own" (self-distributed). Self-distribution needs `update_url` for automatic updates.
  - Upload source code if the code is minified or obfuscated.
  - The maximum file size is 200 MB.
  - Listing fields: name, URL, summary, description, up to 2 Firefox categories and 2 Android categories, support email or site, license, a privacy-policy checkbox (required if data leaves the device), and notes for reviewers.
- **2FA** (first-party claim, snippet of a blog.mozilla.org post from 2021-03-11): developers must use two-factor authentication, enforced from 2021-03-15. API-key uploads don't prompt for the second factor.
- **Signing** (2026-11-07, observed on /documentation/publish/signing-and-distribution-overview/, last updated 2024-08-21):
  - Extensions must be signed by Mozilla to install in release and beta Firefox.
  - Unsigned installs are possible only in Developer Edition, Nightly and ESR, by setting `xpinstall.signatures.required`.
  - Every submission gets automated validation. Any add-on can get a manual review at any time, which can lead to rejection or blocking.
  - Signing and publishing take "up to 24 hours"; manual reviews take longer.
  - `web-ext sign` v8+ and the AMO Add-on Create/Version Create API (v5) handle initial listed or unlisted submissions as well as updates.
- **API keys** (first-party claim, snippet of extensionworkshop "getting started with web-ext"): generate the keys in the AMO Developer Hub, then pass the JWT issuer as `--api-key` and the JWT secret as `--api-secret`.
- **Data collection consent** (2026-11-07, observed on /documentation/develop/firefox-builtin-data-consent/, last updated 2026-10-18):
  - `browser_specific_settings.gecko.data_collection_permissions` with `required` and `optional` arrays. Extensions that collect nothing declare `"required": ["none"]`.
  - Categories: `personallyIdentifyingInfo`, `healthInfo`, `financialAndPaymentInfo`, `authenticationInfo`, `personalCommunications`, `locationInfo`, `browsingActivity`, `websiteContent`, `websiteActivity`, `searchTerms`, `bookmarksInfo`, and `technicalAndInteraction` (optional only).
  - **Mandatory for all new extensions since 2025-11-03.** Existing add-ons will be required "at a later date", with no date given.
  - Supported in Firefox desktop 140+ and Android 142+. The page recommends `strict_min_version` 140 (gecko) and 142 (gecko_android).
- **Upcoming policy change** (first-party claim, snippets of extensionworkshop preview pages and blog.mozilla.org, 2026-10-28):
  - Revised Add-on Policies and Distribution Agreement take effect **2026-12-01**. One visible change: listings must say when payment is needed to unlock any functionality.
  - An enterprise add-ons channel opens on AMO on 2026-12-01.
- **MV2 in Firefox** (first-party claim, blog.mozilla.org posts of 2024-03-13 and 2024-06): Mozilla has "no plans to deprecate" MV2 and promised at least 12 months' notice of any change. Not re-confirmed for 2026.
- **Gotchas:**
  - Third-party snippets say a missing `data_collection_permissions` key gets a new submission rejected.
  - A snippet implies AMO generates an ID only for MV2 extensions without one. Setting `browser_specific_settings.gecko.id` explicitly is the safer choice; not verified today.
  - Not verified in this run: differences between Firefox's and Chrome's MV3 background script support. Check the Firefox MV3 migration docs before reusing a Chrome service-worker build.

### blog.mozilla.org — Mozilla's add-ons blog, the changelog source for AMO
- **Access** (2026-11-07, observed): The index page fetched. Excerpts only.
- **Recent posts:**
  - 2026-10-28: enterprise add-on policies, launching on AMO 2026-12-01.
  - 2026-09-29: the Firefox 157 "Nova" redesign, with theme impact.
  - 2026-07-23 and 2026-08-06: Firefox 153 API changes, including a local-file access permission change and the new publicSuffix API.
  - No post on the index extends the data-consent requirement to existing add-ons.

## Dead ends
- **developer.chrome.com/docs/webstore/program-policies/policy-updates** — HTTP 404 (2026-11-07). Policy changes are announced as blog posts instead (/blog/cws-policy-updates-2026 and /blog/cws-review-updates-2026).
- **developer.chrome.com/docs/webstore/register** — the obvious place for the fee, but it doesn't state the amount (2026-11-07).
- **developer.chrome.com/docs/webstore/set-up-account** — doesn't cover the trader declaration, 2SV or group publishers. The trader-disclosure pages and the using-api page cover those.
- **extensionworkshop signing overview** — dated 2024-08-21 and silent on API credentials. Use the web-ext getting-started page instead.
- **Search results for CWS pages** — mostly localized or `authuser=` duplicates of the same doc; they add nothing.
- **Blockers:** none (no 403, 429, CAPTCHA or login walls on any docs page).

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | developer.chrome.com/docs/webstore/register | CWS developer registration | Amount not shown on the page; called a "one-time registration fee" | observed |
| 2020 (snippet) / 2026 (third-party) | Chromium Blog snippet; flaviocopes.com and extensionbooster.net snippets | CWS developer registration | USD 5.00, one-time, per account | first-party claim (2020) + third-party (2026). Tax/VAT basis not stated; Google may change the amount. |
| 2026-11-07 | learn.microsoft.com create-dev-account | Edge Add-ons (Partner Center) registration | No registration fee | observed |
| 2026-11-07 | extensionworkshop.com submitting-an-add-on | AMO listing or signing | No fee mentioned on the page | observed (absence of a fee statement, not an explicit "free") |

## Prep checklist
- [ ] A dedicated publisher email (it can't be changed later in CWS), a Google Account with 2-Step Verification, and a verified contact email.
- [ ] Trader or non-trader decision. Traders need a legal name, address and an SMS-capable phone, all shown publicly.
- [ ] A physical address, if the extension sells anything or has subscriptions.
- [ ] `manifest_version: 3`, with no remotely hosted or eval'd code and no obfuscation (minified is fine). Bump `version` for every upload.
- [ ] The smallest possible permission set. Avoid `<all_urls>` and broad host patterns unless they're essential. Write one sentence of justification per permission.
- [ ] A single-purpose statement of one or two sentences. Make sure the listing description doesn't stuff keywords or list sites.
- [ ] A privacy policy URL that is live and accessible, if any user data is handled. Data-use checkboxes that match it. In-product disclosure and consent before any collection starts.
- [ ] Icon: 128x128 PNG with 96x96 artwork. At least 1 screenshot at 1280x800 (or 640x400). Optional 440x280 small tile and 1400x560 marquee.
- [ ] Reviewer test instructions and test-account credentials, if the extension has a login.
- [ ] Edge extras: a 300x300 logo, a description of at least 250 characters for each language, up to 6 screenshots at 640x480 or 1280x800, a category, and certification notes.
- [ ] Firefox extras: a Mozilla Account with 2FA, `browser_specific_settings.gecko.id`, `data_collection_permissions` (`"required": ["none"]` if nothing is collected), `strict_min_version` 140 and 142, a source-code archive if the code is bundled or minified, a license choice, and up to 2 categories.
- [ ] For CI after the first publish:
  - Chrome: a Google Cloud project with the Chrome Web Store API enabled, an OAuth client or service account, plus the publisher ID and item ID.
  - Edge: Client ID and API key from Partner Center → Publish API, and the product ID.
  - Firefox: AMO JWT issuer and secret for `web-ext sign`.

## Needs a human
- Signing in, paying the Chrome registration fee, and accepting the CWS developer agreement, the Microsoft Store App Developer Agreement and the Firefox Add-on Distribution Agreement.
- Turning on 2-Step Verification (Google) and 2FA (Mozilla), and keeping the recovery codes.
- The trader declaration with SMS phone verification. Edge company verification: approver contact, document uploads and possible phone calls.
- Writing and hosting the privacy policy, and deciding the trader status, which is a legal judgment.
- Creating API credentials: an OAuth consent screen and client, an Edge API key, AMO keys.
- Asking for a higher Chrome publishing limit beyond 2, and filing appeals after a rejection.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-08 — reviewed (independent): re-confirmed the 2-slot default (blog dated 2026-08-20) and MV2 removal from the store on 2026-08-31; labelled the Edge and Firefox MV2 statements in the TL;DR, and limited the Firefox data-collection rule in the summary to new extensions.
