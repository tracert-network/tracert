---
slug: ai-agent-marketplaces
intent: Publish an AI agent, custom GPT or chatbot to a public agent marketplace or store so other people can find and use it.
summary: "GPT Store is being retired (GPTs move to ChatGPT plugins); agent.ai now redirects to HubSpot BuilderPack. Live public paths: ChatGPT/Codex plugin directory, Microsoft Marketplace, Google Cloud Marketplace, Poe."
task_type: research
region: global
tags: gpt store, custom gpt, publish gpt, chatgpt apps, chatgpt plugins, apps sdk, plugin directory, codex plugins, gemini gems, share gem, gemini enterprise, agentspace, agent gallery, google cloud marketplace, a2a, agent card, copilot studio, microsoft 365 agent store, partner center, microsoft marketplace, poe bots, poe creator monetization, agent.ai, agent directory, agntcy, list my ai agent, chatbot marketplace
hosts: developers.openai.com, help.openai.com, chatgpt.com, virtualizationreview.com, learn.microsoft.com, support.google.com, docs.cloud.google.com, poe.com, creator.poe.com, agent.ai, builderpack.com, docs.agntcy.org, dir.agntcy.org
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 34
---

# How to publish an AI agent, custom GPT or chatbot to public agent stores and marketplaces

## TL;DR — fastest path
- **Don't start a new custom GPT.** OpenAI is retiring custom GPTs and moving them to ChatGPT "plugins". Personal accounts can't publish new GPTs, and GPTs are scheduled to stop running on 2026-12-11 (first-party claim via search snippets of OpenAI help pages; OpenAI says the dates may change). For ChatGPT reach, build a **plugin** (MCP server and/or skills) and submit it at platform.openai.com/plugins. It lists in the universal directory shared by ChatGPT and Codex.
- **Microsoft:** public reach across organisations means a **Microsoft Marketplace** offer submitted through Partner Center (Microsoft 365 and Copilot program). Copilot Studio's own sharing only reaches your tenant: "Shared with you", plus an admin-approved "Built by your org" section of the Microsoft 365 Agent Store.
- **Google:** Gems can be shared by link or set to Public, but there is no Gem gallery. Enterprise reach means listing an **A2A agent on Google Cloud Marketplace** through Producer Portal. Customer admins then add it to Gemini Enterprise.
- **Poe** still has a creator monetization program (price-per-message set in bot code). Its main creator page returned 403, so payout terms are unverified.
- **Skip agent.ai.** It now permanently redirects (308) to builderpack.com, a set of HubSpot Agent Builder actions with no public agent marketplace.
- **Needs a human:** account creation, identity or business verification, Partner Center and Producer Portal enrolment, accepting publisher terms, and supplying reviewer demo credentials and walkthrough videos.

## Verify first
1. **agent.ai is gone as a marketplace.** One fetch of `https://agent.ai/`. Expect a 308 redirect to builderpack.com. If it serves an agent marketplace again, re-explore the agent.ai section.
2. **Custom GPT retirement date still holds.** help.openai.com blocks automated fetches, so run one web search for "custom GPT retirement and migration FAQ". Expect retirement on 2026-12-11 (the Enterprise deferral date of 2027-02-11 is third-party). If the date has passed, treat the GPT Store as closed. If it was extended, re-explore the OpenAI GPT Store section.
3. **OpenAI plugin submission flow unchanged.** One fetch of `https://developers.openai.com/plugins/deploy/submission.md`. Expect: portal at platform.openai.com/plugins, individual or business verification, ZIP upload, 5 positive and 3 negative test cases, and a video walkthrough. If not, re-explore the developers.openai.com section.
4. **Microsoft public path unchanged.** One fetch of `https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/publish-plugin-publicly`. Expect submission through a Partner Center offer type, enrolment in the Microsoft 365 and Copilot program, and the "Not every plugin package is eligible" warning (wording as of 2026-11-13; the page no longer lists the Partner Center click path). If not, re-explore the learn.microsoft.com section.
5. **Google A2A listing path unchanged.** One fetch of `https://docs.cloud.google.com/marketplace/docs/partners/ai-agents`. Expect an Agent Card JSON in Cloud Storage, Producer Portal, Google sign-in, and a gcloud command to go public. If not, re-explore the docs.cloud.google.com section.

## Domains

Overview (2026-11-07; labels in the sections below):

| Store | Who can publish | Review | Publisher cost | Discoverability | Status |
|---|---|---|---|---|---|
| OpenAI GPT Store | Not personal accounts (no new GPTs); managed workspaces depending on plan and admin settings | Automated policy check, appeal | Not stated | GPT directory (ending) | Retiring; GPTs stop 2026-12-11 |
| ChatGPT/Codex plugin directory | Verified individual or business (OpenAI Platform org) | Automated scans + human review | Not stated | Plugin directory in ChatGPT and Codex | Active; replaced the app directory 2026-07-09 |
| Microsoft Marketplace (M365 Copilot) | Publisher enrolled in Partner Center's Microsoft 365 and Copilot program | Certification | Not verified | Microsoft Marketplace / Agent Store | Active; not every package type eligible |
| Copilot Studio (in-tenant) | Makers with a Copilot Studio environment | Tenant admin approval for org-wide | Licensing, not verified | Your tenant's Agent Store only | Active; not public |
| Gemini Gems | Signed-in Gemini users | None | Not stated | Link or Public setting; no gallery | Active |
| Google Cloud Marketplace (A2A) | Onboarded Marketplace vendors | Listing review + validation | Not stated | Cloud Marketplace, then Gemini Enterprise | Active |
| Poe | Poe creators | Not verified | Not verified | Not verified today | Monetization program still documented |
| agent.ai | — | — | — | — | Redirects to builderpack.com |
| AGNTCY Agent Directory (A2A/OASF) | Not stated | Not stated | Not stated | Skill-based search over a federated network | Spec under development (IETF draft) |

### help.openai.com / chatgpt.com — OpenAI GPT Store: retiring, don't build new GPTs
- **Access** (2026-11-07, observed): help.openai.com returned **HTTP 403** to automated fetches (articles 8798878 and 20001519). chatgpt.com/gpts returned only a JS shell (the text "ChatGPT"), so the live store state could not be observed. The facts below come from search snippets of OpenAI help pages (first-party claim) and one trade article (third-party).
- **Rules** (2026-11-07, first-party claim via search snippets of the "Sharing GPTs" help article):
  - Personal ChatGPT accounts can't publish new GPTs.
  - Publishing to everyone may require a completed builder profile: name, a website link from a **verified domain**, and verified social profiles.
  - Each public action needs a valid Privacy Policy URL.
  - In managed workspaces, admins may need to set up or approve builder profile details.
  - GPTs are checked automatically against policy before publishing, with an appeal option where available.
- **Retirement** (2026-11-07, first-party claim via search snippets of the "Custom GPT retirement and migration FAQ"):
  - Planned end of new GPT creation: 2026-09-25. The FAQ lists this date in its Enterprise timeline (re-checked via search snippet 2026-11-08). The third-party article below gives 2026-10-26 for Enterprise, so the sources disagree.
  - Scheduled retirement, when GPTs stop running and leave the GPT directory: **2026-12-11**.
  - The FAQ says dates are subject to change.
- **Retirement** (third-party, virtualizationreview.com, article dated 2026-09-28, observed):
  - New creation ends 2026-10-26 for Enterprise workspaces.
  - Retirement is 2026-12-11.
  - Enterprise customers with approved deferrals can keep GPTs until 2027-02-11.
  - Migration runs from My GPTs: instructions become a skill, knowledge files become plugin reference files, and connected apps can carry over.
  - Conversations, the selected model, sharing settings and Custom Actions don't carry over automatically. Custom Actions may need rebuilding as an app or MCP server.
  - Migrated plugins start private.
- **Revenue sharing** (2026-11-07, third-party): OpenAI announced a builder revenue program for US builders (Q1 2024). WIRED and OpenAI community forum threads, seen via search, describe only an invite-only US pilot. I found no first-party confirmation of a broad or global payout program. SEO blogs claiming global payouts or typical earnings cite no OpenAI source; don't use them.
- **Gotchas**: A GPT published now would stop running on 2026-12-11 if the schedule holds. Domain verification method (e.g. DNS TXT) is only claimed by a third-party blog and is unconfirmed.

### developers.openai.com — ChatGPT/Codex plugin directory: the live OpenAI path
- **Access** (2026-11-07, observed): pages fetched without issue, including the `.md` variants.
- **Status** (2026-11-07, first-party claim via search snippets of the "Apps in ChatGPT" help article):
  - As of 2026-07-09 the app directory was migrated to the **Plugin directory**.
  - A plugin can bundle apps, skills and app templates.
  - The directory is visible across ChatGPT plans. Whether users can install a plugin depends on plan, workspace settings, role, surface and region.
- **Who can submit** (2026-11-07, observed, plugins/deploy/submission.md):
  - Organization owners can submit. Other members need Apps Management Write access.
  - Publishing under your own name or a company name requires **individual or business verification** in organization settings.
  - The guidelines page also requires verified identity and business affiliation in Platform Dashboard settings.
- **How** (2026-11-07, observed):
  - Go to platform.openai.com/plugins and choose "Upload new or existing plugin". Upload a ZIP and pick "Skills only" or "With MCP". With MCP needs a stable public HTTPS endpoint.
  - Automated checks cover metadata, skills and MCP tools.
  - For MCP plugins, review needs **5 positive and 3 negative test cases, a video walkthrough URL, release notes and reviewer credentials**, entered in the dashboard.
  - Submit for review and complete the policy attestations. Feedback comes by email. To appeal, reply to the rejection email.
  - Only one active review per plugin. You choose when to publish an approved version.
  - The optional `publication.countries` field sets an allowlist of country codes.
  - MCP server changes are scanned daily, and eligible tool updates go live without a new package.
- **Rules** (2026-11-07, observed, apps-sdk/app-submission-guidelines):
  - Required: a published privacy policy, a current support contact, accurate metadata, and explicit boolean tool annotations (readOnlyHint, destructiveHint, openWorldHint).
  - Authenticated servers need a demo account with sample data. Sign-up flows or 2FA the reviewer can't complete lead to rejection.
  - Iframe UIs need a written justification.
  - Banned: selling digital goods (subscriptions, credits, tokens, freemium upsells), ads, trial/demo plugins, scraping or unofficial connectors, and collecting card, health, government-ID or credential data.
  - Physical-goods checkout must be external, on your own domain. Instant Checkout is a limited beta.
- **Pricing**: no submission or listing fee is stated on the pages read. Don't assume it's free or paid.
- **Gotchas**:
  - (observed) `apps` / `.app.json` references can't currently be submitted in plugin ZIPs.
  - Review timelines aren't published.
  - This path overlaps with MCP routes. It's included here because it is now ChatGPT's only public store.

### learn.microsoft.com — Microsoft 365 Copilot: Marketplace for public reach; Copilot Studio is tenant-only
- **Access** (2026-11-07, observed): fetched without issue. Microsoft now calls Copilot extensibility packages "plugins" ("Publish or share your Microsoft 365 Copilot plugin", ms.date 2026-11-06).
- **Methods** (observed, ms.date 2026-11-06):
  - Customers in multiple organisations: Microsoft Marketplace.
  - Your organisation: an org publishing, admin-upload or tenant-sharing method.
  - Specific people: direct sharing, e.g. `wiqd plugin share` for alpha Work IQ Dev Tools packages.
  - Direct sharing isn't Marketplace publication.
- **Public path** (observed, publish-plugin-publicly, ms.date 2026-09-30, updated 2026-10-12):
  - Needs a publisher account enrolled in the **Microsoft 365 and Copilot program** in Partner Center.
  - In Partner Center: Marketplace offers > **Microsoft 365 and Copilot** tab > New offer > choose the offer type that supports the package > upload package or manifest > give reviewers testing instructions and access > submit for certification. (stale 2026-11-13: the page was rewritten, last updated 2026-11-11, and no longer spells out this click path; not re-checked inside Partner Center.)
  - **Rewritten page** (2026-11-13, observed, publish-plugin-publicly, last updated 2026-11-11): titled "Publish your plugin through Microsoft Marketplace". You "Submit the package through the supported Microsoft Partner Center offer type", complete the review, then make the approved offer available. Before you begin: the exact package version that passed validation and testing; confirmation that a supported Marketplace offer type accepts the package and its capabilities; a publisher account enrolled in the **Microsoft 365 and Copilot program**; permission to create and submit offers in Partner Center; listing details, privacy statement, terms of use and support information; customer setup instructions; and a named owner for updates, support, security response and retirement. It still warns "Not every plugin package is eligible" and says not to substitute a different offer type.
  - Applicable rules: Marketplace certification policies, Microsoft 365 store validation guidelines for agents, and an optional Microsoft 365 App Compliance certification.
  - The page warns: "Not every plugin package is eligible". Don't substitute package types.
  - Listing needs a privacy statement, terms of use, support info, regions and setup instructions.
  - Submission isn't publication. Customers still need admin install or consent.
- **Copilot Studio** (observed, publication-add-bot-to-microsoft-teams, ms.date 2026-10-29):
  - Makers can install an agent for themselves, share an install link, or show it to shared users in the **"Shared with you"** section of the Microsoft 365 Agent Store.
  - Org-wide reach means submitting for admin approval into "Built by your org" (Agent Store) or "Built for your org" (Teams app store).
  - The page describes no direct public-marketplace path. It notes that agents with user authentication can't explicitly sign out, which **fails Teams Marketplace certification**.
- **Gotchas**:
  - A localized copy of the publish page, seen via search, said Partner Center submission was limited to Copilot connectors packaged as Teams apps. The current English page is broader but still conditional, so check eligibility for your package type.
  - A third-party blog claims only custom engine agents from Copilot Studio can go to the store. Unverified.
  - Partner Center enrolment cost wasn't checked.

### support.google.com — Gemini Gems: share by link or Public; no gallery
- **Access** (2026-11-07, observed): help answer 16504957 fetched; no page date shown.
- **Rules** (observed):
  - You must be signed in to Gemini Apps. Share works like Drive: add people as Viewer or Editor, or copy a link.
  - General access options: Public (findable through Google search, opens without sign-in), Anyone with the link, Your organization, Private. Work or school users may not see Public or link options, and admins can turn off Gem sharing.
  - Gems with uploaded files can be shared only if the files are device or Drive files. NotebookLM notebooks can't be sources for shared Gems.
  - Viewers can see the Gem's instructions and files.
- **Discoverability**: no Gem gallery or directory is mentioned. The only discovery mechanism is the Public setting.
- **Gotchas**: shared Gems expose your instructions and uploaded files to every viewer.

### docs.cloud.google.com — Google Cloud Marketplace A2A agents: the enterprise Google path (Gemini Enterprise)
- **Access** (2026-11-07, observed): marketplace/docs/partners/ai-agents fetched; no page date.
- **Rules** (observed):
  - Vendors onboard through a sign-up link. Producer Portal access needs the Cloud Marketplace Project Info Form.
  - Accepted types: A2A agents ("AI Agents as a Service"), SaaS agents on other protocols, GKE apps, and professional services.
  - Each A2A agent needs an **Agent Card JSON in Cloud Storage** that follows the A2A spec, and must support A2A interoperability.
  - Agents must use Google or Model Garden models as the default configuration, and must let users create accounts, link them to Google accounts and sign in with Google credentials.
- **How** (observed):
  - In Producer Portal, add the product, Agent Card, details and pricing, then submit for review. Pricing review can take up to 4 business days.
  - After approval Google runs validation and testing, then gives you a gcloud command to make the listing public.
  - Customers acquire the agent on Marketplace and add it to Gemini Enterprise.
- **Pricing models** (observed): free (customer pays only for Google Cloud resources), subscription, usage-based (you report usage to Google), or a combination. Google's fee or revenue share isn't stated on this page.
- **Discovery** (first-party claim via search snippets of the Gemini Enterprise docs): admins choose which Marketplace agents appear to employees in the Gemini Enterprise **Agent Gallery**, and employees can request access there. The "Agentspace" name didn't appear in any page I opened.
- **Gotchas**: this is B2B. End users only see your agent after their company's admin adds it.

### poe.com / creator.poe.com — Poe bots: monetization still documented; main page blocked
- **Access** (2026-11-07, observed): poe.com/creators returned **HTTP 403**. creator.poe.com/docs/resources/creator-monetization fetched but is only a short overview.
- **Offers** (observed):
  - A creator monetization program "lets Poe bot creators get paid".
  - Price-per-message can be set from within bot code through the Bot Monetization API.
  - Developers can email Poe about custom arrangements.
- **Offers** (third-party, 2023–2024 coverage):
  - Subscription referral payouts of up to USD 20 per new subscriber a creator brings in, initially US-only.
  - Price-per-message launched 2024-04-09: users spend points and creators are paid in dollars.
  - Both prompt bots and server bots are covered.
- **Gotchas**:
  - Eligibility (countries, age), payout method, review rules and Explore discoverability weren't verified today.
  - A single third-party pricing site claims a 2026-07-28 cut to Premium points. Unverified, and it affects users rather than creators directly.

### agent.ai / builderpack.com — agent.ai: dead as a public agent marketplace
- **Access** (2026-11-07, observed): `https://agent.ai/` returns **308 Permanent Redirect** to builderpack.com.
- **What's there** (observed): BuilderPack, credited to HubSpot Labs, is 19 AI actions for **HubSpot Agent Builder**. It needs a HubSpot Professional or Enterprise portal and installs via HubSpot OAuth. There's no public agent listing or marketplace.
- **History** (third-party blog via search): web archive captures show agent.ai's own site until 2026-07-29, a permanent redirect from 2026-08-04, and BuilderPack as the target by 2026-08-27. There was no farewell or export page.

### docs.agntcy.org / dir.agntcy.org — AGNTCY Agent Directory (A2A/OASF): open, early-stage infrastructure, not a consumer store
- **Access** (2026-11-07, observed): docs.agntcy.org redirects to dir.agntcy.org/latest/dir/dir-overview/, which was fetched.
- **What it is** (observed):
  - The Agent Directory Service is a distributed directory of agent metadata. It uses the OASF data model, with records built from OASF skill taxonomies and routed over a DHT by skills, domains and locators.
  - It's run as "Agntcy, a Series of LF Projects, LLC".
  - The page points to an existing network at ads.outshift.io and a Federation Testbed. I didn't open either.
  - The spec is "under active development" as an IETF Internet Draft.
- **Gotchas**:
  - Who may publish, cost and signing details aren't stated on the overview page.
  - Other "public A2A registries" found via search (e.g. a pages.dev site claiming api.a2a-registry.org) are unverified, low-signal, third-party listings.
  - A2A discovery is fundamentally self-hosted: an Agent Card at the agent's own well-known URL (third-party description).

## Dead ends
- **agent.ai**: redirects to HubSpot BuilderPack (observed 2026-11-07). No marketplace.
- **New custom GPTs**: personal accounts can't publish, and all GPTs are scheduled to stop on 2026-12-11. Effort is better spent on a ChatGPT plugin.
- **GPT Store revenue share**: no first-party evidence of a broad program. SEO "payout guides" are unsourced.
- **Gemini Gem gallery**: none found. Sharing is link- or Drive-style only.
- **Copilot Studio "publish to store"**: Copilot Studio only reaches your own tenant. Public reach requires a Partner Center Marketplace offer, and package eligibility is conditional.
- **"Where to list your AI agent 2026" lists** (e.g. rnwy.com, fast.io), seen in search results only: aggregator SEO posts that mix unrelated marketplaces. Not opened, not relied on.
- **Unverified A2A registries** (zervice-portal.pages.dev / a2a-registry.org): seen only via search, no first-party substance checked.

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | developers.openai.com (observed) | Plugin submission/listing fee | Not stated | — |
| 2026-11-07 | docs.cloud.google.com (observed) | Marketplace listing fee / Google revenue share | Not stated; you choose free, subscription, usage-based or combined pricing | Seller-set |
| 2023 (via search, third-party) | Poe creator program coverage | Subscription referral payout to creator | Up to USD 20 per new subscriber | Initially US-only; current terms unverified |

No first-party publisher fees were found for any store in this route. Don't infer "free".

## Prep checklist
- Public privacy policy URL, terms of use, and a support contact (required by OpenAI, Microsoft and Google).
- Name, short and long description, icons, screenshots, example prompts.
- A reviewer demo account with sample data and no blocking 2FA (OpenAI). Testing instructions and access details (Microsoft).
- OpenAI: 5 positive and 3 negative test cases, a video walkthrough URL, release notes, a stable public HTTPS MCP endpoint, explicit tool annotations, and an optional country allowlist.
- Google: A2A Agent Card JSON in Cloud Storage, Sign in with Google support, default to Google or Model Garden models, and a chosen pricing model.
- Microsoft: a confirmed offer type that accepts your package type, and a support, security-response and retirement owner.
- No sales of digital goods inside ChatGPT. Remove upgrade prompts and checkout links.

## Needs a human
- Creating accounts and completing identity or business verification: OpenAI Platform org, Partner Center (Microsoft AI Cloud Partner Program / Microsoft 365 and Copilot program), Google Cloud Marketplace vendor onboarding and Project Info Form, Poe payouts.
- Accepting publisher agreements and policy attestations, setting tax and payout details, and choosing commercial pricing.
- Recording the walkthrough video and creating reviewer credentials.
- Tenant admin approval for Copilot Studio org-catalog listings, and customer admin enablement for Gemini Enterprise and Microsoft Marketplace installs.
- Deciding whether to migrate existing GPTs before 2026-12-11. Per the FAQ (first-party claim via search snippet, 2026-11-08), the original GPT becomes read-only after migration and its creator can't delete it.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-08 — reviewed (independent): re-confirmed the 2026-12-11 GPT retirement (OpenAI FAQ via search) and the agent.ai 308 redirect to HubSpot Labs' BuilderPack; softened "creation has ended for personal accounts" to "can't publish", flagged the conflicting Enterprise creation-end dates, labelled the read-only migration claim and the third-party deferral date, and replaced the "five weeks to live" estimate.
- 2026-11-13 — verification (routine): 4/5 checks held (agent.ai 308 to builderpack.com; custom GPT retirement still 2026-12-11 per a web search of the help article; OpenAI plugin submission requirements; Google A2A listing path). Check 4 failed in part: Microsoft rewrote publish-plugin-publicly on 2026-11-11. Partner Center and the Microsoft 365 and Copilot program still hold, but the click path is no longer documented, so it is marked stale, the new prerequisites are added and check 4 is reworded. last_verified left at 2026-11-07.
