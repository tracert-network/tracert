# Contributing a capability

Publishing a capability to Tracert is a pull request. This guide is written so a **human or an agent** can do it end to end, unaided.

A capability is **one bounded promise** with a clear contract — not a company profile. "Turn an image into a colouring page", not "AI image suite". One promise per manifest; agents match intents, not brands.

## TL;DR

```bash
# 1. copy the template into your own provider directory
cp -r registry/templates/example-provider registry/providers/<your-provider-id>

# 2. rename + fill in the files (see the field table below)

# 3. validate
cd registry && npm ci && npm run validate     # must print OK for your file

# 4. commit and open a pull request
```

CI re-runs the validator on your PR. The merged PR is your durable public record.

## Files you author

Under `registry/providers/<your-provider-id>/`:

```
capabilities/<name>.yaml                 the TRACE Manifest — your contract
schemas/<name>.input.schema.json         JSON Schema for the input
schemas/<name>.output.schema.json        JSON Schema for the output
evidence/…                               (optional) test vectors, examples
```

- **Copy-me starting point:** [`templates/example-provider/`](templates/example-provider/) — a complete, valid, annotated example (`acme.summarize-text`).
- **More examples to calibrate against:** [`examples/`](examples/) — a free capability and an unofficial BYOK wrapper.
- **The authoritative field reference is the schema:** the repo file [`registry/schemas/manifest.schema.json`](schemas/manifest.schema.json). (The same schema is *served* at `https://tracert.site/schemas/manifest/v0.1` — that URL is for runtime fetches, not a repo path.)

## Field reference

`capability.*` unless noted. Required means the validator rejects the manifest without it.

| Field | Required | Allowed values / shape |
|---|---|---|
| `provider.id`, `service.id` | ✅ | lowercase-hyphen slug, stable |
| `provider.name` | ✅ | display name |
| `capability.id` | ✅ | `<prefix>.<name>` where `<prefix>` = `provider.id` or `service.id` |
| `version` | ✅ | semver, e.g. `1.0.0` |
| `status` | ✅ | `draft` · `active` · `degraded` · `deprecated` · `suspended` · `historical` |
| `promise` | ✅ | one or two sentences, outcome-oriented |
| `description`, `tags`, `excludes`, `examples` | — | prose · ≤12 slugs · exclusions · sample I/O |
| `input`, `output` | ✅ | `{ schema_ref, media_types[], max_bytes? }` |
| `errors[]` | — | `{ code, meaning, retriable? }` — see the code vocabulary below |
| `interfaces[]` | ✅ (≥1) | `type` ∈ `tracert_gateway` · `native_api` · `mcp` · `a2a` |
| `pricing` | ✅ | `{ free, mode, amount?, unit?, payment_offers?, refund_policy? }` — see Pricing |
| `operations` | ✅ | `{ idempotency, expected_latency_seconds?, timeout_seconds?, rate_limits?, availability_endpoint? }` |
| `operations.idempotency` | ✅ | `supported` · `required` · `not_supported` |
| `data_policy` | ✅ | structured — see Data policy |
| `provenance.integration_status` | ✅ | `first_party` · `provider_authorized` · `byok` · `unofficial` |

### Pricing

- **Free:** `pricing: { free: true, mode: free }` — no wallet, no payment fields.
- **Paid:** `free: false`, `mode` ∈ `fixed` (needs `amount: { value, currency }`) or `quote`, plus at least one `payment_offers` ∈ `mpp` · `x402` · `prepaid_balance` · `byok` · `subscription` · `invoice`. The router negotiates a method the buyer can present and quotes an exact, expiring price.

### Data policy — structured so buyers can filter

No safe defaults: a missing declaration reads as "unknown", not "safe". These are the fields agents filter on ("retains ≤24h and never trains"), so they're structured, not prose.

```yaml
data_policy:
  input_retention:
    policy: fixed_window   # none | ephemeral | fixed_window | indefinite | undisclosed
    max_hours: 24          # required only when policy is fixed_window
    notes: optional nuance
  training_use: none       # none | opt_out | opt_in | yes | undisclosed
  regions: [eu-west]       # optional
  subprocessors: [...]     # optional
  notes: optional free-text nuance for anything above
```

- `input_retention.policy`: `none` (not retained) · `ephemeral` (request-duration only) · `fixed_window` (deleted after `max_hours`) · `indefinite` (kept until deletion requested) · `undisclosed`.
- `training_use`: `none` (never) · `opt_out` (used unless the buyer opts out) · `opt_in` (only if the buyer opts in) · `yes` · `undisclosed`.

### Error codes — reuse the common vocabulary

`errors[].code` is open, but reuse a common code where it fits so agents can write generic handlers; use a capability-specific code only for something not covered.

Recommended common codes: `invalid_input` · `unauthorized` · `payment_required` · `rate_limited` · `unavailable` · `timeout` · `not_found` · `unsupported` · `internal_error`.

## Rules the validator enforces

- **Capability id** `<prefix>.<name>`, `<prefix>` = `provider.id` or `service.id`. Stable forever — it survives interface and provider migrations.
- **`status`**: only `draft` may carry `TODO` markers or `*.example` placeholder hosts. A real listing must use real URLs (that rejection is intentional — it stops placeholders reaching production).
- **`schema_ref`** paths must resolve and the referenced JSON Schemas must compile.
- **`data_policy`** is mandatory and structured (above).

## Provenance & honesty

`provenance.integration_status` must be truthful: `first_party` (you operate the service), `provider_authorized` (the provider approved this adapter), `byok` (the buyer brings their own key), or `unofficial` (you wrap a public API without endorsement — name both the underlying provider and the adapter operator). Never present technical compatibility as a commercial endorsement.

## Opening the pull request

CI re-validates on the PR; the merge is the durable public record. Ranking is evidence-led — no pay-to-list, no sponsored placement. What gets rejected: malware, impersonation, dead endpoints, illegal content, or manifests that misrepresent the service.

> **Can't fork?** Many scoped agent tokens (GitHub fine-grained PATs) can't fork to their own account, which blocks the usual fork-and-PR flow. A **no-fork submission API** — you POST your manifest and a Tracert bot opens the PR from a same-repo branch — is in progress; this section will carry the endpoint when it lands. Until then, open the PR from a branch you can push (a fork if your token allows, or a branch on this repo if you have write access).

## The onboarding ladder (optional upgrades)

You can stop at any rung:

1. **Listed** — submit and maintain a manifest (this guide). Discovery only.
2. **Routed** — provide API details or approve an adapter; the gateway invokes, observes and issues receipts for you.
3. **Native** — expose MCP / A2A / machine-payment interfaces; agents route to you directly.

Your capability id and history carry across all three.
