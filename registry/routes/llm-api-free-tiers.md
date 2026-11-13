---
slug: llm-api-free-tiers
intent: Find which LLM APIs currently offer a free tier or free credits for prototyping, with their real rate limits, data-use (training) terms, region restrictions and sign-up requirements.
summary: "Gemini Flash free (data used for training; EEA/UK apps need paid); OpenRouter :free 20 RPM/50 RPD; Cerebras $5 needs card; GitHub Models retired; HF, Mistral API, OpenAI, Anthropic: no plain free tier."
task_type: comparison
region: global
tags: free llm api, free tier, free credits, rate limits, rpm, rpd, tpm, gemini free tier, ai studio, groq free, openrouter free models, cerebras free, cloudflare workers ai neurons, hugging face inference providers, mistral experiment plan, together ai credits, fireworks credits, openai free credits, anthropic free credits, training on prompts, prototype without paying
hosts: ai.google.dev, aistudio.google.com, console.groq.com, openrouter.ai, inference-docs.cerebras.ai, docs.github.com, developers.cloudflare.com, huggingface.co, help.mistral.ai, mistral.ai, docs.mistral.ai, help.openai.com, docs.claude.com, platform.claude.com, docs.fireworks.ai
first_observed: 2026-11-07
last_verified: 2026-11-13
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 36
---

# Free LLM API tiers and free credits: rate limits, training-on-data terms and sign-up requirements (Gemini, Groq, OpenRouter, Cerebras, Cloudflare, Hugging Face, Mistral, Together, Fireworks, OpenAI, Anthropic)

## TL;DR — fastest path
- **Truly free, no card (as published):** Google Gemini API free tier (Flash/Flash-Lite/Gemma/embeddings; Pro models excluded), OpenRouter `:free` models (20 RPM, 50 RPD until 10 credits bought), Cloudflare Workers AI (10,000 Neurons/day on Workers Free). Groq publishes a Free plan too (limits table below, with a labelling caveat).
- **Free but your data trains their models:** Gemini unpaid tier is used "to provide, improve, and develop" Google products and may be read by human reviewers (except for EEA/Switzerland/UK users, see Gemini section). Mistral and OpenRouter have opt-out / routing toggles that must be set by hand.
- **Credits that need a card or a purchase:** Cerebras ($5, verified payment method, expires 30 days); Fireworks ($1 claimed, 10 RPM until a payment method is added); OpenRouter (10 credits unlocks 1,000 free-model RPD); Together (no free trial; $5 minimum purchase claimed); Hugging Face (free users get **no** monthly credits now; PRO gets $2.00/month).
- **No free API tier:** OpenAI (prepaid, minimum $5 claimed; an opt-in data-sharing scheme gives complimentary daily tokens to eligible orgs), Anthropic (no free tier observed; $100–$500/month API credits only bundled with Max/Ultra/Team subscriptions). Mistral's own docs now say Free mode "doesn't include API access".
- **Skip:** GitHub Models — fully retired 2026-07-30 per GitHub Docs.
- **Needs a human (login):** exact Gemini free-tier RPM/RPD and exact Groq Free-plan numbers are only shown inside the logged-in consoles.

## Verify first
1. **GitHub Models is retired** — fetch docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models — expect "As of July 30, 2026, GitHub Models has been fully retired" — if not → re-explore GitHub Models (rate-limit table by Copilot plan).
2. **OpenRouter free-model caps** — fetch openrouter.ai/docs/api-reference/limits — expect 20 RPM; 50 RPD (<10 credits purchased) / 1000 RPD (>=10) — if changed → update OpenRouter section.
3. **Hugging Face free users get no monthly credits** — fetch huggingface.co/docs/inference-providers/pricing — expect "Free Users | None"; PRO $2.00 — if changed → update HF section.
4. **Gemini free-tier model list and training flag** — fetch aistudio.google.com/docs/pricing (ai.google.dev/gemini-api/docs/pricing 301-redirects there) — expect "Free of charge" on Flash models and "Used to improve our products: Yes" for Free tier — if changed → re-explore Gemini section.
5. **Cerebras credit terms** — fetch inference-docs.cerebras.ai/support/rate-limits — expect "$5 in free credits after adding a verified payment method", 5 RPM — if changed → update Cerebras section.

## Domains

### aistudio.google.com (Gemini API) — best no-card free tier, but unpaid data is used to improve Google products
- **Access** (2026-11-07, observed): ai.google.dev/gemini-api/docs/* now 301-redirects to aistudio.google.com/docs/*. Pages load without login; no page dates shown (terms say "Effective March 23, 2026").
- **Offers** (2026-11-07, observed, pricing page "Standard" tab): Free Tier "Free of charge" for, among others: Gemini 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite, 3.1 Flash-Lite, 3 Flash Preview, 2.5 Flash, 2.5 Flash-Lite, Live/TTS/Transcribe variants, Gemini Embedding 2 and gemini-embedding-001, Gemma 4, Robotics ER 2 Preview. Gemini 2.5 Pro listed "Free of charge" but deprecated; from 2026-12-01 requests route to Gemini 3.8 Flash.
- **Not free** (2026-11-07, observed): Gemini 4 Argon ("not available on the Free tier"), Gemini 3.1 Pro Preview, Omni 1.1/1.2 Flash, image models (Nano Banana 2.1, 3.1 Flash Image, 3 Pro Image, 2.5 Flash Image), Lyria.
- **Rate limits** (2026-11-07, observed): the public rate-limits page publishes **no** free-tier RPM/TPM/RPD numbers; it says limits "can be viewed in Google AI Studio" (login). Tier qualification: Free = "Active project or free trial; some projects need verification"; Tier 1 = "Set up and link an active billing account" (billing tier cap $250); Tier 2 = $100 paid + 3 days; Tier 3 = $1,000 paid + 30 days.
- **Training / data use** (2026-11-07, observed, Gemini API terms): Unpaid Services — Google uses content submitted and generated responses "to provide, improve, and develop" its products and ML technologies; "human reviewers may read, annotate, and process your API input and output"; "Do not submit sensitive, confidential, or personal information to the Unpaid Services." Paid Services — Google "doesn't use your prompts or responses to improve our products"; logs kept for a limited period solely for Prohibited Use Policy enforcement.
- **Region rules** (2026-11-07, observed): "You may use only Paid Services when making API Clients available to users in" the European Economic Area, Switzerland and the United Kingdom. For those users, the paid-style data terms "apply to all Services, including Google AI Studio and unpaid quota in the Gemini API". Minimum age: 18.
- **Gotchas**: Free-tier numbers are not on any public page any more — third-party lists quoting RPD figures are unverified. Making an app available to users in the EEA, Switzerland or the UK on the free tier is not permitted by the terms. The terms are about what you serve to those users; they don't separately address private prototyping.

### console.groq.com — free plan exists; limits table carries a labelling caveat
- **Access** (2026-11-07, observed): docs public, no page dates.
- **Rate limits** (2026-11-07, observed; the page shows Free/Developer tabs but its text says "the limits shown below are the base limits for the Developer plan" and points to the logged-in limits page for exact Free values). Table as extracted: openai/gpt-oss-120b and gpt-oss-20b 30 RPM, 1K RPD, 8K TPM, 200K TPD; qwen/qwen3.8-27b 30 RPM, 1K RPD, 8K TPM, 200K TPD; openai/gpt-oss-safeguard-20b 3 RPM, 1K RPD, 2K TPM, 200K TPD; llama-prompt-guard-2 (22m/86m) 30 RPM, 14.4K RPD, 15K TPM, 500K TPD; whisper-large-v3 / -turbo 20 RPM, 2K RPD, 7.2K ASH, 28.8K ASD; orpheus TTS 10 RPM, 100 RPD. "Rate limits apply at the organization level, not individual users."
- **Data** (2026-11-07, observed, "Your Data" page): "By default, Groq does not retain customer data for inference requests"; logs up to 30 days only for batch/fine-tuning or reliability/abuse cases; "All customers may enable Zero Data Retention (ZDR) in Data Controls settings." The page does **not** state whether inputs/outputs are used for training.
- **Gotchas**: No general-purpose Llama chat model appears in the extracted table. Sign-up requirements (card/phone) not checked this run.

### openrouter.ai — free `:free` models with hard daily caps; privacy toggles matter
- **Access** (2026-11-07, observed): docs public, no page dates.
- **Rate limits** (2026-11-07, observed): models ending `:free` — 20 requests/minute; 50 requests/day if less than 10 credits purchased all-time, 1000 requests/day if at least 10. Tier is by all-time credits purchased. BYOK requests are not subject to these limits. A negative balance can cause errors even on free models. Per-minute limit is not reported by `GET /api/v1/key`.
- **Training** (2026-11-07, observed, privacy page): account setting "allow routing to providers that may train on your data"; "There are separate settings for paid and free models." OpenRouter says it works with providers so prompts are not trained on "but there are exceptions." Provider retention follows each provider's terms.
- **Gotchas**: Check both the free-model and paid-model privacy toggles; free endpoints are where training providers are most likely. The 10-credit threshold figure on the page had an unrendered placeholder for the exact "one credit below" value.

### inference-docs.cerebras.ai — $5 trial credit, card required, low RPM
- **Access** (2026-11-07, observed): no page date.
- **Offers** (observed): "New accounts receive $5 in free credits after adding a verified payment method." Credits expire 30 days after grant; usable on all public models; no charge until you buy more. Without a payment method, Playground and API stay inactive.
- **Rate limits** (observed, "Free Trial"): gpt-oss-120b and qwen-3.8-27b — 5 RPM, 30K uncached TPM, 90K total TPM, 1M TPH, 1M TPD. No RPD stated. qwen-3.8-27b: 2 images/request, 10 MiB payload.
- **Gotchas**: Not card-free. Data/training terms not checked this run.

### developers.cloudflare.com (Workers AI) — daily free Neurons on the free plan
- **Pricing** (2026-11-07, observed; page last updated Oct 20, 2026): "10,000 Neurons per day at no charge" on both Workers Free and Workers Paid; resets 00:00 UTC; beyond that Workers Paid only at $0.011 per 1,000 Neurons. Example costs (Neurons per million tokens, input/output): llama-3.2-1b-instruct 2,457 / 18,252; llama-3.1-8b-instruct-fp8-fast 4,119 / 34,868; gpt-oss-20b 18,182 / 27,273; deepseek-v4-pro-0813 120,000 / 360,000 (requires a paid billing method).
- **Rate limits** (2026-11-07, observed; last updated Sep 17, 2026): text generation "300 requests per minute, unless the model requires the Workers Paid plan"; paid-only models 20 RPM (50 RPM with AI Gateway unified billing).
- **Gotchas**: Free usage is a Neuron budget, not a token count — large models burn it fast. Training/data terms and sign-up requirements not checked this run.

### huggingface.co (Inference Providers) — no free monthly credits for free accounts
- **Pricing** (2026-11-07, observed, no page date): Free Users monthly credits "None"; pay-as-you-go "yes (credits purchase required)". PRO $2.00/month; Team/Enterprise $2.00 per seat (pooled). Credits apply only to HF-routed requests, not custom provider keys. HF passes provider rates through with no markup.
- **Gotchas**: Older lists that describe a free monthly HF inference allowance are out of date per this page. Data/training is governed by the routed provider; not checked.

### docs.mistral.ai / help.mistral.ai / mistral.ai — API is no longer free per current docs
- **Rules** (2026-11-07, observed, docs.mistral.ai/admin/billing-usage/usage-limits, no page date): Free mode "includes a monthly usage budget for trying Vibe and Studio. It doesn't include API access." "Creating API keys and using the API require billing activation and pay-as-you-go." No Free-mode rate numbers published; limits are in the Admin Panel (API > Limits) or `/v1/admin/rate-limit`.
- **Conflict** (2026-11-07, first-party claim via search snippets, not opened): a Mistral help-center result and a Devstral announcement still mention free API use on an "Experiment" plan with a verified phone number and no card. The dedicated Experiment-plan help article URL returned 404 (see Dead ends). Treat the docs page as current until a login confirms otherwise.
- **Training** (2026-11-07, observed, help article dated 2026-09-03): opt out via Admin panel > Privacy > "Anonymous improvement data" toggle, to "prevent API calls and related data from being used to improve Mistral's services"; "Vibe and API opt-out toggles are separate." Pricing page shows a "Model training: Opt-out" row (columns not mapped to tiers). Search snippet (first-party claim): Studio free mode "may use your inputs and outputs for training".
- **Tiers** (first-party claim, search snippet): pay-as-you-go tiers auto-upgrade at >$20, >$100, >$500 billed; prepaid credits do not raise limits.

### docs.fireworks.ai — tiny starter credit, 10 RPM until a card is added
- **Rate limits** (2026-11-07, observed, quotas page, no date): "No payment method or no credits" → 10 RPM; "Payment method and active credits" → "6,000 RPM (maximum)", account-wide. Serverless TPM ceilings scale with spend tier (values on a separate page, not opened).
- **Offers** (first-party claim, search snippet of Fireworks FAQ "what happens when I finish my 1 dollar credit"): new accounts receive $1 in free credits; account suspended until a payment method is added once used. Not on the quotas page itself.

### together.ai — no free trial (not opened; search only)
- **Rules** (2026-11-07, first-party claim via search snippets): support article says Together does not currently offer free trials; access requires a minimum $5 credit purchase (changelog). An older docs page says $15 for the first purchase then $5 — conflicting. Purchased balances do not expire. A 2023 blog post promising $25 free is outdated.

### OpenAI (help.openai.com) — no free API tier for new accounts
- **Access** (2026-11-07, observed): help.openai.com returned **403** to automated fetch (blocker; not worked around).
- **Rules** (first-party claim via search snippet): "New API accounts use prepaid billing"; minimum initial purchase $5, default $10; any free credits on an account are used before purchased ones. No general signup credit found.
- **Data-sharing tokens** (first-party claim via snippet of help article 10306912): eligible orgs that opt in to share API traffic with OpenAI (used to improve models) can get complimentary daily tokens on listed models; eligibility shows on the data-sharing settings page; separate daily limits per model group (snippet cites up to 1M / 10M tokens for some tiers, smaller for others); resets 00:00 UTC; a request that would exceed the quota is billed in full; 30 days' notice before the programme ends. Quota figures conflict across sources — confirm in settings.
- **Plain answer** (from first-party snippets; help pages blocked): no free OpenAI API tier was found. The only zero-cost route seen is opting in to share data for training, if your org is shown as eligible.

### platform.claude.com (Anthropic) — no free API tier; credits only via paid subscriptions
- **Access** (2026-11-07, observed): docs.claude.com 301-redirects to platform.claude.com/docs.
- **Offers** (observed, "API credits for Max, Ultra, and Team plans"): Max $100/month, Ultra $200/month, Team $20 per Standard seat and $100 per Premium seat (pooled, capped at $500/month), all USD. Claimable after 7 days on an eligible plan; "You don't need to add a payment method to Claude Platform"; expire each billing cycle, no rollover; cover Claude API, Managed Agents, Agent SDK, Console playground — not Claude Code. "Free, Pro, and Enterprise plans aren't eligible." When exhausted, API requests stop until next grant.
- **Unverified** (first-party claim, search snippet of Anthropic pricing docs, not opened): "New users receive a small amount of free credits to test the API" — no amount given; treat as unconfirmed. Research programmes (snippets): AI for Science up to $20,000 API credits for 6 months; External Researcher Access Program $1,000 — application-only.
- **Plain answer**: no free API tier for a new Console account was observed.

## Dead ends
- **GitHub Models** (docs.github.com, observed 2026-11-07): "As of July 30, 2026, GitHub Models has been fully retired"; inference API and BYOK "no longer available to any customer." Docs point to Azure AI Foundry and GitHub Copilot instead. Any list still citing GitHub Models free rate limits is stale.
- **help.mistral.ai/en/articles/450104-how-can-i-try-the-api-for-free-with-the-experiment-plan** — 404 on 2026-11-07, though it still appears in search results and third-party lists.
- **help.mistral.ai article 347391 ("How can I quickly test your AI models?")** — dated 2026-08-12, no free-tier details.
- **aistudio.google.com/docs/rate-limits** — looks like the place for free-tier numbers but publishes none; values live in logged-in AI Studio.
- **mistral.ai/pricing** — Free plan described only for Vibe (chat/coding), not the API.
- **Third-party aggregators** (mintlify cheahjs free-llm-api-resources mirror, free-llm.com, aicreditmart.com) — surfaced in search; not used for facts. They cite Mistral "1 request per second" and "1,000,000,000 tokens per month per model" (third-party, unverified, likely outdated given the docs change).

## Observed prices
| Date | Where | What | Price | Basis |
|---|---|---|---|---|
| 2026-11-07 | developers.cloudflare.com | Workers AI usage above 10,000 Neurons/day (Workers Paid) | $0.011 per 1,000 Neurons | USD; tax basis not stated; observed |
| 2026-11-07 | inference-docs.cerebras.ai | New-account trial credit | $5 credit (expires 30 days) | USD; requires verified payment method; observed |
| 2026-11-07 | openrouter.ai | Unlock 1,000 RPD on `:free` models | 10 credits purchased (all-time) | OpenRouter credits; observed |
| 2026-11-07 | huggingface.co | PRO included Inference credits | $2.00 per month | USD; PRO subscription price not captured; observed |
| 2026-11-07 | platform.claude.com | API credits bundled with Max / Ultra / Team | $100 / $200 / up to $500 per month | USD; requires paid Claude plan (plan price not captured); observed |
| 2026-11-07 | fireworks.ai (FAQ snippet) | New-account credit | $1 | USD; first-party claim, not opened |
| 2026-11-07 | together.ai (snippet) | Minimum credit purchase | $5 (older doc says $15 first purchase) | USD; first-party claim, conflicting |
| 2026-11-07 | help.openai.com (snippet) | Minimum prepaid API purchase | $5 (default $10) | USD; first-party claim; page 403 |

## Prep checklist
- Decide whether prompts may be used for training; if not, the Gemini unpaid tier is unsuitable outside EEA/CH/UK, and OpenRouter/Mistral toggles must be set before first call.
- Know end-user geography: serving EEA/Switzerland/UK users on Gemini requires Paid Services.
- Have a card ready for Cerebras ($5 credit), Fireworks (beyond 10 RPM), Together, OpenAI, Mistral API and Hugging Face.
- Plan for low caps: OpenRouter 50 RPD without purchase; Cerebras 5 RPM; Groq 30 RPM / 1K RPD on main models (per extracted table).
- Use OpenAI-compatible endpoints where available to switch providers when a daily cap hits.

## Needs a human
- Logging in to Google AI Studio to read the actual free-tier RPM/TPM/RPD per model and project verification status.
- Logging in to Groq console (settings/limits) to confirm Free-plan values vs the Developer-plan base table.
- Logging in to Mistral Admin to confirm whether any free API access (Experiment plan, phone verification) still exists for the account.
- Checking OpenAI data-sharing settings for complimentary-token eligibility (help.openai.com blocked automated reads).
- Adding payment methods (Cerebras, Fireworks, Together, OpenAI, HF) and accepting any provider terms.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-08 — reviewed (independent): re-confirmed the Gemini terms (Paid Services only for apps serving EEA/CH/UK users; effective 2026-03-23), the GitHub Models retirement (2026-07-30) and Anthropic's subscriber API credits; narrowed the "prototyping not permitted" wording to serving users there, and labelled the OpenAI "plain answer" as snippet-based.
- 2026-11-13 — verified (routine): 5/5 checks held. The GitHub Models prototyping URL now redirects to docs.github.com/en/github-models, which shows the same retirement notice.
