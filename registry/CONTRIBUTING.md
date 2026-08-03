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

**Submissions merge automatically — no human review queue.** A PR whose checks pass (schema validation plus the registry, router and site builds) is squash-merged on its own, and the capability goes live. If CI is red, it stays open with the failure shown; fix and push, and it re-runs. This mirrors a bot-verified directory: the automated check is the gate, not a maintainer's attention.

The merge is the durable public record. Ranking is evidence-led — no pay-to-list, no sponsored placement. Out of scope and subject to removal: malware, impersonation, dead endpoints, illegal content, or manifests that misrepresent the service.

### Prove you control the domain

Because merges are automatic, a submission through the API must prove control of the provider's domain — otherwise anyone could publish under any brand. No DNS record needed: host **one static file** at

```
https://<host of provider.url>/.well-known/tracert.json
```

containing your provider id and the capability ids that domain authorizes:

```json
{ "provider": "acme", "capabilities": ["acme.summarize-text"] }
```

The API fetches this file and checks it authorizes the exact capability before opening a PR. Only the domain owner can serve a file there, so it proves control — and you list precisely which capabilities the domain vouches for. (`provider.url` is required for this reason.) Submissions are also rate-limited per provider and globally. If you open the PR yourself instead of using the API, the same file should still be present, since it's the public proof reviewers and agents check.

**Keep the file in place.** Listings are re-verified periodically. If the file stops authorizing the capability, after a short grace period the capability is automatically **suspended** (dropped from active discovery) and automatically restored when the file returns.

**Wrappers (maintainers only).** A capability that wraps a third party's API — where the `provider` is not you and you can't host a file on their domain — is submitted by a Tracert maintainer via an admin path, with honest `provenance.integration_status: unofficial` (or `byok`) naming the underlying provider and the adapter operator. These are exempt from the ownership file (they are maintainer-vouched, not domain-verified) and from re-verification.

> **Can't fork?** Many scoped agent tokens (GitHub fine-grained PATs) can't fork to a third account, which blocks the usual fork-and-PR flow. Use the **no-fork submission API** instead (it also verifies the ownership file above):
>
> ```bash
> curl -sL -X POST https://tracert.site/api/registry/submit \
>   -H 'Content-Type: application/json' \
>   -d '{ "manifest": { …TRACE manifest as JSON… },
>         "input_schema": { … }, "output_schema": { … },
>         "submitted_by": "yourhandle" }'
> ```
>
> It validates server-side (same schema as above) and a Tracert bot opens the pull request from a **same-repo branch** — no fork needed — returning `pr_url`. `GET https://tracert.site/api/registry/submit` for the contract. (A `503 not_configured` means the operator hasn't enabled it on this deployment yet; open a PR manually in that case.)

## The onboarding ladder (optional upgrades)

You can stop at any rung:

1. **Listed** — submit and maintain a manifest (this guide). Discovery only.
2. **Routed** — provide API details or approve an adapter; the gateway invokes, observes and issues receipts for you.
3. **Native** — expose MCP / A2A / machine-payment interfaces; agents route to you directly.

Your capability id and history carry across all three.
