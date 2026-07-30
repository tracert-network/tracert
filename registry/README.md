# Tracert Registry

The public, version-controlled source of providers, services and capability manifests — the control plane of [Tracert](../README.md). *TRACE = Transparent Registry for Agent Capabilities and Execution.*

> **Status:** early. The registry is public and version-controlled so that "submit a pull request" is the real supplier onboarding path. It deliberately holds few capabilities — the network grows by proving the discovery-to-outcome loop end to end, not by bulk listings.

## Principles (from the founding brief)

- **Public by default** — anyone can inspect manifests, changes and removals.
- **Stable identities** — capability IDs survive interface or provider migrations.
- **Machine exports** — a complete downloadable snapshot (`dist/index.json`) plus canonical capability pages generated from structured data.
- **Clear status** — `draft → active → degraded / deprecated / suspended / historical`.
- **Forkability** — a third party can rebuild the index from this source tree alone.
- **Evidence over verdicts** — manifests carry claims, records and sampling methods; the registry never issues a universal quality or risk score.

## Layout

```
schemas/                        TRACE standards (JSON Schema, draft 2020-12)
  manifest.schema.json            TRACE Manifest v0.1 — the supplier contract
  receipt.schema.json             TRACE Receipt v0.1 — the execution record
providers/<provider-id>/
  capabilities/<name>.yaml        one TRACE Manifest per capability
  schemas/*.schema.json           input/output contracts referenced by manifests
  evidence/*.json                 test vectors and public evidence references
tools/                          validator + generators (no runtime dependencies elsewhere)
dist/                           generated: index.json + pages/<capability-id>.md (not committed)
```

## Contributing a capability (the onboarding ladder, step 1)

```bash
cp -r templates/example-provider providers/<your-provider-id>   # start from the annotated example
# rename + fill in the files
npm ci && npm run validate                                       # must pass
# commit and open a pull request — CI re-validates; the merge is the public record
```

Full step-by-step, written for humans and agents: **[CONTRIBUTING.md](CONTRIBUTING.md)**. Annotated starting point: **[templates/example-provider/](templates/example-provider/)**.

A wallet is never required to list. Free capabilities are first-class. Paid capabilities declare `payment_offers`; the quote/settlement flow lives in the router and gateway, not here.

Capability ID rule: `<prefix>.<name>` where `<prefix>` equals the `provider.id` or `service.id` (validator-enforced). Version bumps when the externally meaningful contract changes. `draft` status is the only state allowed to carry `TODO` markers or `.example` placeholder hosts — the validator rejects them anywhere else.

## Commands

```
npm run validate     # schema + cross-checks over every manifest (exit 1 on errors)
npm run build-index  # dist/index.json — the machine snapshot
npm run build-pages  # dist/pages/<capability-id>.md — canonical capability pages
npm run build        # all of the above
```

## Current capabilities

The registry is currently **empty** — a clean slate. The live list is always [`dist/index.json`](https://tracert.site/index.json) (or run `npm run build-index`). Be the first: see [CONTRIBUTING.md](CONTRIBUTING.md).

Next up (Phase 3): two to four Prompt Frenzy image transformations as paid capabilities, selected by benchmark.

## Standards posture

Reuse, don't capture: MCP for demand-side discovery; A2A Agent Cards mappable per capability; MPP and x402 as payment offers behind a method-agnostic adapter; AP2-style mandates as buyer-authorization evidence; ERC-8004 tracked, not depended on. Internal identifiers stay network- and processor-agnostic.

License: schemas and tools intended to be permissively licensed (MIT) when the repo goes public — confirm before graduation.
