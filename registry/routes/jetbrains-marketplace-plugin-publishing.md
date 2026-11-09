---
slug: jetbrains-marketplace-plugin-publishing
intent: Publish an IntelliJ Platform plugin to JetBrains Marketplace for the first time, then automate later releases (signing, verification, tokens, channels, CI).
summary: "The first JetBrains Marketplace upload is manual (vendor profile + trader declaration); CI publishes later releases. Sign with signPlugin; names exclude Plugin/IntelliJ/JetBrains; no review SLA."
task_type: how-to
region: global
tags: jetbrains marketplace, intellij plugin, publish plugin, intellij platform gradle plugin, signPlugin, publishPlugin, verifyPlugin, plugin verifier, plugin signing, publishing token, release channels, approval guidelines, plugin review, trader status, paid plugins, freemium, unified intellij idea, github actions
hosts: plugins.jetbrains.com, github.com, raw.githubusercontent.com, platform.jetbrains.com, blog.jetbrains.com
first_observed: 2026-11-09
last_verified: 2026-11-09
method: researched
observed_by: "Tracert Labs research agent (read-only; nothing submitted)"
explorer_steps: 29
---

# How to publish a plugin to the JetBrains Marketplace for the first time (signing, review, Gradle publishPlugin, GitHub Actions)

## TL;DR — fastest path
- **The first upload is always manual, through the web UI.** Sign in to plugins.jetbrains.com, open the account menu, choose **Upload plugin**, accept the Developer Agreement and create a vendor profile, then fill in the plugin details. Those details include your own EULA, a source link if the plugin is open source, tags, an optional custom channel and the Ads/Hidden flags. Gradle `publishPlugin`, the upload API and the template's CI only update a plugin that already exists.
- **Build with IntelliJ Platform Gradle Plugin 2.x.** The docs show `org.jetbrains.intellij.platform` 2.20.0, which needs Gradle 9.0.0+ and Java 17+. 1.x "is no longer under active development". To target 2025.3 or later, use `intellijIdea(...)`, not `intellijIdeaCommunity(...)`: the Community types exist only for builds earlier than 253. Run `verifyPlugin` locally first. Marketplace runs the same Plugin Verifier on every upload.
- **Sign the plugin.** Generate an RSA 4096 key and a self-signed `chain.crt` with openssl, and give `signPlugin` the certificate chain, private key and password. `signPlugin` then runs automatically before `publishPlugin`. Marketplace re-signs the plugin with its own key.
- **Automate later releases with the template.** The template's `release.yml` runs on GitHub release `prereleased`/`released` events and calls `./gradlew publishPlugin` with the secrets `PUBLISH_TOKEN`, `CERTIFICATE_CHAIN`, `PRIVATE_KEY` and `PRIVATE_KEY_PASSWORD`. Create the token on the Marketplace profile's **My Tokens** tab.
- **Know the approval rules before submitting.** The name must be 30 characters or fewer and must not contain "Plugin", "IntelliJ", "JetBrains" or any JetBrains product name. The description must be in English, and the logo must be a 40×40 SVG that is not the template logo. Since 31 Mar 2026, a plugin must not interfere with licensing, trials or upgrades. JetBrains gives no review timeframe; its guidance is to email marketplace@jetbrains.com after 3–4 working days without an answer.
- **A human has to do:** the JetBrains Account sign-in, accepting the Developer Agreement, the vendor profile (its Vendor ID is permanent) and EEA trader/non-trader declaration, the first upload, creating the token, the signing key passphrase, CI secrets, and any paid-plugin agreement with JetBrains.

## Verify first
1. **First upload still manual** — fetch plugins.jetbrains.com/docs/intellij/publishing-plugin.html — expect "The first plugin publication must always be uploaded manually." and the `ORG_GRADLE_PROJECT_intellijPlatformPublishingToken` env var — if not, re-explore *plugins.jetbrains.com — IntelliJ SDK docs (publishing)*.
2. **Naming and review-time rules unchanged** — fetch plugins.jetbrains.com/docs/marketplace/jetbrains-marketplace-approval-guidelines.html — expect version 1.3 effective 31 March 2026, a 30-character name limit, the "Plugin"/"IntelliJ"/"JetBrains" ban, a 40×40 SVG logo, and the "3–4 working days" contact advice — if not, re-explore *plugins.jetbrains.com — Marketplace docs (approval guidelines)* and its changelog.
3. **Gradle plugin version and Community types** — fetch plugins.jetbrains.com/docs/intellij/tools-intellij-platform-gradle-plugin-types.html — expect "IntellijIdeaCommunity (IC) and PyCharmCommunity (PC) are available only for versions earlier than 2025.3 (build 253)" — if not, re-explore *IntelliJ Platform Gradle Plugin 2.x*.
4. **Template CI secrets** — fetch raw.githubusercontent.com/JetBrains/intellij-platform-plugin-template/main/.github/workflows/release.yml — expect triggers `prereleased`/`released`, `./gradlew publishPlugin`, and the four secrets — if not, re-explore *github.com/JetBrains/intellij-platform-plugin-template*.

## Domains

### plugins.jetbrains.com — IntelliJ SDK docs (publishing, signing, plugin.xml)
- **Access** (2026-11-09, observed): public pages, fetched without a block. The Marketplace docs sometimes serve a JS redirect page instead of content: `paid-plugins-marketplace.html` redirects to `discover-jetbrains-marketplace.html`, and `vendor-profile.html` redirects to `organizations.html`.
- **Publishing** (2026-11-09, observed, publishing-plugin.html):
  - "The first plugin publication must always be uploaded manually."
  - "Before publishing a plugin, make sure it is signed."
  - Pass the token with the env var `ORG_GRADLE_PROJECT_intellijPlatformPublishingToken` or the Gradle parameter `-PintellijPlatformPublishingToken`. The page notes that default values must still exist in Gradle properties, even if empty.
  - The version has to be bumped for each publish because Marketplace rejects duplicate versions.
  - Channels are set with `intellijPlatform.publishing.channels` or `publishPlugin.channels`. An empty value publishes to the default (Stable) repository. Named channels (alpha, beta, eap, canary, …) are separate repositories, and users have to add a custom repository URL to install from them.
- **Signing** (2026-11-09, observed, plugin-signing.html, page dated 08 Apr 2025):
  - Signing was introduced in the 2021.2 cycle. Users see a warning dialog when they install an unsigned plugin.
  - Each plugin is signed twice: by the author, then by Marketplace. Marketplace uses a CA-based chain with AWS KMS as the signature provider.
  - Key generation: an RSA 4096 key with `openssl genpkey`, converted with `openssl rsa` to `private.pem`, then `openssl req -key private.pem -new -x509 -days 365` to make `chain.crt`. The page warns "Never commit your credentials to the Version Control System!"
  - `signPlugin` takes `certificateChain`/`certificateChainFile`, `privateKey`/`privateKeyFile` and `password`. It runs before `publishPlugin` when a chain and key are set, and is skipped otherwise.
  - Env vars shown: `CERTIFICATE_CHAIN`, `PRIVATE_KEY`, `PRIVATE_KEY_PASSWORD` and `PUBLISH_TOKEN`. Multi-line values must be Base64-encoded when entered in a Run/Debug configuration.
  - `verifyPluginSignature` checks the signed archive. Projects without the Gradle plugin, such as themes, use the Marketplace ZIP Signer CLI instead.
  - Uploading your own public key to Marketplace is "not available yet".
- **plugin.xml** (2026-11-09, observed, plugin-configuration-file.html, page shows 30 Oct 2026):
  - `<id>` uses letters, digits, `.`, `-` and `_`, and "the value cannot be changed later after public release". It defaults to `<name>` if omitted.
  - `<name>` is required and in Title Case. `<vendor>` is required, with optional url and email attributes.
  - `<description>` is required. Simple HTML is allowed inside CDATA.
  - `<idea-version since-build>` is required. For `until-build`, the page says "It's highly recommended not to set this attribute." `strict-until-build` exists since 2025.3.
  - `<product-descriptor>` is only for paid or freemium plugins: "Do not add `<product-descriptor>` element in a free plugin." Its `code` is agreed with JetBrains in advance. It also takes `release-date` (YYYYMMDD), `release-version`, `optional` (true for freemium) and `eap`.

### plugins.jetbrains.com — IntelliJ Platform Gradle Plugin 2.x reference
- **Version and requirements** (2026-11-09, observed, tools-intellij-platform-gradle-plugin.html, page dated 21 Jul 2026):
  - The setup snippet shows `id("org.jetbrains.intellij.platform") version "2.20.0"`.
  - Minimums: IntelliJ Platform 2023.3, Gradle 9.0.0 and Java 17.
  - 1.x "is no longer under active development."
- **Tasks** (2026-11-09, observed, ...-tasks.html):
  - `verifyPlugin` runs the IntelliJ Plugin Verifier against `intellijPlatform.pluginVerification.ides`. It honours `failureLevel` and fails if no verdict is written for any target IDE.
  - `publishPlugin` takes `token` (required), `channels`, `hidden`, `host` and `ideServices`. It uploads `signPlugin.signedArchiveFile` when signing is configured.
  - The docs do **not** say that `publishPlugin` depends on `verifyPlugin`, so run verification yourself (the template's build workflow does).
  - `verifyPluginProjectConfiguration` flags a `since-build` lower than the target platform, the `until-build` setting on 2024.3+, a `.intellijPlatform` cache entry missing from `.gitignore`, and Kotlin stdlib issues.
  - `patchPluginXml` writes id, name, version, since/until-build, vendor and the product-descriptor code from `intellijPlatform.pluginConfiguration`.
- **Unified IntelliJ IDEA** (2026-11-09, observed, ...-types.html, page shows 14 Sep 2026):
  - "IntellijIdeaCommunity (IC) and PyCharmCommunity (PC) are available only for versions earlier than 2025.3 (build 253)."
  - IntellijIdeaUltimate and PyCharmProfessional are legacy types. For 2025.3 and later, use IntellijIdea (IU) and PyCharm (PY).
- **Migration** (third-party/first-party via search snippets, 2026-11-09):
  - A JetBrains forum announcement says existing plugins keep working on 2025.3. Targeting 2025.3 needs Gradle plugin 2.10.4+ and `intellijIdea()`.
  - GitHub issue #2021 tracked the deprecation of `intellijIdeaCommunity()`. Swapping `intellijIdea()` in for pre-2025.3 versions reportedly breaks builds, so keep the IC helper for older targets.
  - Third-party coverage says a plugin that was incompatible with Ultimate will not install in the free tier of the unified distribution.
  - None of this was read first-hand this run.

### plugins.jetbrains.com — Marketplace docs (upload, vendor, approval, API, security, changelog)
- **First upload flow** (2026-11-09, observed, uploading-a-new-plugin.html, dated 20 Mar 2026):
  1. Sign in, open the account menu and choose **Upload plugin**.
  2. Pick a vendor profile. On a first upload, accept the Developer Agreement and create the vendor profile.
  3. Submit the plugin details:
     - **License:** your own EULA, plus a source code link for open-source licenses.
     - **Tags:** these are the search filters.
     - **Channel:** add a Custom Release Channel if the plugin is not generally available.
     - **Ads:** declare whether the plugin contains ads.
     - **Hidden:** this flag keeps the plugin hidden after approval.
  - The maximum file size is 400 MB. Upload problems go to marketplace@jetbrains.com.
- **Vendor profile** (2026-11-09, observed, organizations.html, dated 30 Jul 2026):
  - "Every plugin must be associated with a vendor profile." It can belong to an individual or an organization, and the easiest time to create it is during the first upload.
  - The Vendor ID cannot be edited later. Name, email and website can be changed.
  - Creating a profile requires declaring trader or non-trader status under the EU definition.
  - A Verified Vendor Badge exists; its criteria were not read this run.
- **Trader status** (first-party claim via search snippets, 2026-11-09): the requirement is based on the Omnibus Directive 2019/2161, and the DSA added verification steps for traders. A JetBrains blog post from May 2025 says unverified traders are "subject to suspension". A free plugin from a private individual "may be qualified as a non-trader", but JetBrains gives no individual advice. A staff forum answer says moving from trader to non-trader needs an email request.
- **Approval guidelines** (2026-11-09, observed, v1.3 effective 31 Mar 2026):
  - **Name:** unique, 30 characters or fewer. It "Must not contain the word "Plugin" or "IntelliJ", or include "JetBrains" or the name of any JetBrains product". No third-party trademarks without authorization, and no pricing in the name without approval. Since 23 Apr 2025 the changelog also advises against using "Support" and "Integration" in names and descriptions.
  - **Description:** English as the primary language, with the English version first if you add translations. Correct spelling and formatting, and media that loads.
  - **Logo:** "one size: 40 px by 40 px", in SVG format. It must differ from the template logo and must not resemble a JetBrains logo.
  - **Legal:** accept the Developer Agreement, provide a Developer EULA, link the source for open-source plugins, provide a privacy policy if the plugin collects personal data, and make the trader/non-trader declaration.
  - **Technical:** works with at least one JetBrains product, passes the Plugin Verifier on every upload, adds no security or privacy issues, and collects telemetry only with explicit consent and never while the plugin is not in use.
  - **Since 31 Mar 2026 (clause 2.2(c)):** a plugin must not modify, hide, intercept or interfere with JetBrains product functionality, including licensing, subscriptions, trials and upgrade flows.
  - **Vendor:** the website and email must work. No impersonation.
  - **Review time:** "JetBrains doesn't guarantee the time frame for the review". If there is no answer within 3–4 working days of the upload, contact marketplace@jetbrains.com.
- **Changelog** (2026-11-09, observed, marketplace changelog.html):
  - 17 Nov 2025: approval guidance on plugin-implemented features was revised. Ratings, reviews and download numbers now count, and "new plugins with no platform history may be declined". This was read only through a summary and its exact scope is **not confirmed this run**.
  - 12 Mar 2025: some keyword, tone and media criteria were removed.
  - There are no 2025–2026 entries on signing, tokens or the unified IntelliJ IDEA distribution.
- **Review pipeline** (2026-11-09, observed, understanding-plugin-security.html, dated 17 Jun 2025):
  - Uploads get real-time automatic checks. A plugin "may be automatically rejected or flagged" for invalid parameters, incorrect archive structure, dependency issues or suspicious activity.
  - Every new plugin and update then gets manual review, Plugin Verifier runs and UI integration tests.
  - A plugin can be removed later if it is found to break the guidelines.
- **Upload API** (2026-11-09, observed, plugin-upload.html):
  - `POST https://plugins.jetbrains.com/api/updates/upload` with the header `Authorization: Bearer <permanentToken>`. The token comes from **My Tokens**.
  - Form fields: `file`, `pluginId` (numeric) or `xmlId`, and optional `channel`, `isHidden` and `containsAds`.
  - The API addresses an existing plugin. The page does not show it creating a new one, which fits the manual-first-upload rule.
- **Paid and freemium** (first-party claim via search snippets, 2026-11-09):
  - Standard commission is 15% of the sale price. It can change with one month's notice and is capped at 25%.
  - Payouts are in USD or EUR once the balance reaches $200/€200, plus on 31 December each year.
  - Licensing can be one-time or a monthly or annual subscription.
  - The paid-plugin requirements page redirected this run. Onboarding steps, eligibility and the licensing-API integration were **not confirmed this run**, beyond the product-descriptor rules in plugin.xml.

### github.com / raw.githubusercontent.com — JetBrains/intellij-platform-plugin-template
- **Access** (2026-11-09, observed): public.
- **Workflows** (2026-11-09, observed):
  - `build.yml` runs on push and PR. It runs `buildPlugin`, a `check` job and a `verifyPlugin` job, then makes or refreshes a draft GitHub release from `version` in `gradle.properties` (2.6.0 at time of reading).
  - `release.yml` runs on `types: [ prereleased, released ]`. It sets up Java 21 (Zulu), runs `./gradlew publishPlugin` with the secrets `PUBLISH_TOKEN`, `CERTIFICATE_CHAIN`, `PRIVATE_KEY` and `PRIVATE_KEY_PASSWORD`, patches CHANGELOG.md from the release body and opens a PR with the change.
  - Publishing the draft release is what triggers the publish.
- **Gotchas** (2026-11-09, observed):
  - The README says to create the plugin manually in Marketplace first, to set options like the license and repository URL.
  - Replace the placeholder ID `org.jetbrains.plugins.template` before the first upload, because the ID is permanent.
  - The template's `build.gradle.kts` now has no explicit signing, publishing or verification blocks. It only declares `intellijIdea("2026.2.3")`, and `settings.gradle.kts` pins `org.jetbrains.intellij.platform.settings` 2.19.0, one minor version behind the docs' 2.20.0.
  - How the template maps the env vars to `signPlugin`/`publishPlugin` without an explicit block, presumably defaults inside the plugin, was **not confirmed this run**.

### platform.jetbrains.com — JetBrains developer forum
- **Access** (2026-11-09, observed): public threads.
- **Review timing anecdotes** (third-party, 2026-11-09):
  - A Dec 2025 thread reports a plugin "in review for over two weeks". Staff asked for a re-evaluation, and the cause turned out to be a pending action on the developer's side.
  - A Jan 2026 thread asked about first approval; staff said the plugin "seems to be approved, but hidden" (the Hidden flag).
  - None of this is a service level.

### blog.jetbrains.com — JetBrains Platform blog
- **Access** (2026-11-09, observed): WebFetch got HTTP 403 on the 2025.3 plugin-developer post, so this run used only search snippets.
- **Snippets** (first-party claim via search, 2026-11-09):
  - The Q1 2026 "Busy Plugin Developers" newsletter announced the clause 2.2 licensing and trial ban.
  - The Q4 2025 newsletter added integration-test results to plugin pages and said JetBrains will restrict incompatible versions. Integration tests are not yet available for paid or Android Studio plugins.
  - The Q2 2026 newsletter: Marketplace auto-notifies authors who use internal APIs.
  - The Q3 2026 newsletter: Marketplace collects UI-freeze reports for plugins.

## Dead ends
- plugins.jetbrains.com/docs/marketplace/paid-plugins-marketplace.html now redirects to `discover-jetbrains-marketplace.html`. Paid-plugin onboarding was not found at that URL (2026-11-09).
- plugins.jetbrains.com/docs/marketplace/vendor-profile.html redirects to `organizations.html`, which has the content (2026-11-09).
- plugins.jetbrains.com/docs/intellij/unified-distribution.html returns 404. The unified-distribution facts are on the Gradle plugin Types and Dependencies Extension pages (2026-11-09).
- Using `intellijIdea()` for pre-2025.3 targets to silence the deprecation warning reportedly breaks the build (third-party forum, via search snippet, 2026-11-09).
- No official source gives a typical first-review duration. Only the "no guarantee" line and the 3–4 working-day contact advice exist (2026-11-09).

## Blockers
- blog.jetbrains.com returned HTTP 403 to WebFetch (2025.3 "what plugin developers should know" post). Blog facts here come from search snippets only (2026-11-09).
- The Marketplace upload UI, the My Tokens page and vendor settings are sign-in gated. They were not attempted (2026-11-09).

## Prep checklist
- plugin.xml:
  - A permanent reverse-DNS `<id>` that is not the template placeholder.
  - A `<name>` of 30 characters or fewer, without "Plugin", "IntelliJ", "JetBrains" or any JetBrains product name, and preferably without "Support" or "Integration".
  - `<vendor>` with a working url and email.
  - An English `<description>` in CDATA.
  - `since-build` set, and no `until-build`.
  - No `<product-descriptor>` unless the plugin is paid or freemium.
- `META-INF/pluginIcon.svg`: 40×40 SVG, not the template logo.
- Gradle: IntelliJ Platform Gradle Plugin 2.x (2.20.0 in the docs), Gradle 9+, JDK 17+ (the template CI uses 21), `intellijIdea(<version>)` for 2025.3+ targets, and `.intellijPlatform` in `.gitignore`.
- Run `./gradlew verifyPlugin` and `verifyPluginProjectConfiguration` locally before uploading.
- Signing: generate `private.pem` and `chain.crt` with a passphrase. Keep them out of git, and Base64-encode them for env vars where needed.
- Your own EULA text, a public source repo link for open-source plugins, a privacy policy if the plugin collects data, and telemetry only with opt-in.
- Decide the trader or non-trader status before creating the vendor profile, and choose the Vendor ID carefully because it is permanent.
- After the manual first upload: create a My Tokens token, store `PUBLISH_TOKEN`, `CERTIFICATE_CHAIN`, `PRIVATE_KEY` and `PRIVATE_KEY_PASSWORD` as GitHub secrets, and publish later versions by publishing the draft GitHub release. Bump the version every time.
- Pre-releases: use a named channel (beta, eap, …). Users must add that channel's repository URL to install from it.

## Needs a human
- The JetBrains Account sign-in, accepting the Marketplace Developer Agreement, creating the vendor profile (permanent Vendor ID) and the EEA trader declaration, plus trader verification if the vendor is a trader.
- The first manual upload: EULA, license, tags, channel, Ads and Hidden flags.
- Creating the permanent publishing token and choosing the signing key passphrase.
- Adding the repository secrets in GitHub.
- For paid or freemium plugins: agreeing a product code and terms with JetBrains, and payout and tax details.
- Answering moderator requests. One forum report's delay was caused by a pending action on the developer's side.

## Changelog
- 2026-11-09 — created (research run, nothing submitted).
