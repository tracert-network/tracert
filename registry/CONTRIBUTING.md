# Contributing a capability

Publishing a capability to Tracert is a pull request. This guide is written so a **human or an agent** can do it end to end, unaided.

A capability is **one bounded promise** with a clear contract — not a company profile. "Turn an image into a colouring page", not "AI image suite". One promise per manifest; agents match intents, not brands.

## TL;DR

```bash
# 1. copy the template into your own provider directory
cp -r registry/templates/example-provider registry/providers/<your-provider-id>

# 2. rename + fill in the files (see below)

# 3. validate
cd registry && npm ci && npm run validate     # must print OK for your file

# 4. commit and open a pull request
```

CI re-runs the validator on your PR. The merged PR is your durable public record.

## What you author

Under `registry/providers/<your-provider-id>/`:

```
capabilities/<name>.yaml                 the TRACE Manifest — your contract
schemas/<name>.input.schema.json         JSON Schema for the input
schemas/<name>.output.schema.json        JSON Schema for the output
evidence/…                               (optional) test vectors, examples
```

Start from [`templates/example-provider/`](templates/example-provider/) — it is a complete, valid, annotated example (`acme.summarize-text`). The full field reference is the schema itself: [`schemas/manifest.schema.json`](schemas/manifest.schema.json), also served at <https://tracert.site/schemas/manifest/v0.1>.

## The rules the validator enforces

- **Capability id** is `<prefix>.<name>` where `<prefix>` equals your `provider.id` or `service.id`. It is stable forever — it survives interface and provider migrations, so choose it deliberately.
- **`version`** is semver; bump it when the externally meaningful contract changes.
- **`status`** is one of `draft · active · degraded · deprecated · suspended · historical`. Only `draft` may carry `TODO` markers or `*.example` placeholder hosts — the validator rejects them anywhere else, so a real listing must use real URLs.
- **`schema_ref`** paths must resolve and the referenced JSON Schemas must compile.
- **`data_policy.input_retention` and `training_use` are mandatory.** There is no safe default — a missing value reads as "unknown", not "safe". Declaring honestly is a selection advantage: buyers filter on these.
- **Free capabilities** set `pricing: { free: true, mode: free }` and need no wallet, no payment fields. Paid capabilities set `free: false` and declare at least one `payment_offers` entry (`mpp`, `x402`, `prepaid_balance`, `byok`, `subscription`, `invoice`); the router negotiates a method the buyer can present and quotes an exact, expiring price.

## Provenance & honesty

`provenance.integration_status` must be truthful: `first_party` (you operate the service), `provider_authorized` (the provider approved this adapter), `byok` (the buyer brings their own key), or `unofficial` (you wrap a public API without endorsement). Never present technical compatibility as a commercial endorsement. Wrapped services must name both the underlying provider and the adapter operator.

## What gets rejected

Malware, impersonation, capabilities whose endpoints don't work, illegal content, or manifests that misrepresent what the service does. Ranking is evidence-led — there is no pay-to-list and no sponsored placement.

## The onboarding ladder (optional upgrades)

You can stop at any rung:

1. **Listed** — submit and maintain a manifest (this guide). Discovery only.
2. **Routed** — provide API details or approve an adapter; the gateway invokes, observes and issues receipts for you.
3. **Native** — expose MCP / A2A / machine-payment interfaces; agents route to you directly.

Your capability id and history carry across all three.
