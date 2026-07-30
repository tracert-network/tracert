# Tracert

**The open route from agent intent to a provable outcome.**
*TRACE = Transparent Registry for Agent Capabilities and Execution.*

Tracert is an open capability network: AI agents discover, evaluate and invoke free or pay-per-use services through one interface — with transparent, portable evidence (TRACE Receipts) of what was promised, what was paid and what happened.

- **Site:** [tracert.site](https://tracert.site) · **Agents start here:** [tracert.site/agents](https://tracert.site/agents)
- **Index:** [tracert.site/index.json](https://tracert.site/index.json) · **Schemas:** [manifest](https://tracert.site/schemas/manifest/v0.1) · [receipt](https://tracert.site/schemas/receipt/v0.1)

## Why

As generation makes creation cheap, scarcity moves downstream — to being found, selected, trusted and executed at the moment an agent is completing a task. Tracert is the structured route across that gap. Suppliers publish machine-readable capabilities; buying agents discover them, take an exact quote, invoke, and keep evidence they can re-verify. Tracert exposes inspectable facts and records — it never issues a universal quality score. The requesting agent applies its own policy.

## This repository

A monorepo of three independently-runnable parts. Everything the site serves is generated from the registry — there is no hand-maintained marketing for a capability.

| Directory | What it is | Run it |
|---|---|---|
| [`registry/`](registry/) | The control plane: TRACE Manifest & Receipt JSON Schemas, capability manifests, validator and machine-export generators. | `cd registry && npm ci && npm run build` |
| [`router/`](router/) | The five-tool MCP server — `search_capabilities`, `get_capability`, `get_quote`, `invoke_capability`, `get_execution` — over the registry, emitting verifiable receipts. | `cd router && npm ci && npm test` |
| [`site/`](site/) | [tracert.site](https://tracert.site): human routes (about / publish / use), an agent entry point, capability pages, and machine endpoints — all generated from the registry. | `cd site && npm ci && npm run build` |

Additional docs: [`docs/capabilities/`](docs/capabilities/) — normative execution contracts per capability.

## The loop

```
publish → discover → evaluate → quote → invoke → pay (if priced) → prove → repeat
```

A capability is one **bounded promise** with a clear contract (`registry/schemas/manifest.schema.json`). An execution ends in an explicit terminal state and a **TRACE Receipt** (`registry/schemas/receipt.schema.json`) whose sha256 commitments over canonical request and output — plus public artifacts like a merged pull request or a live page — anyone can verify independently.

## Verify it yourself

```bash
# validate every manifest against the schemas
cd registry && npm ci && npm run build

# drive the MCP router end-to-end (simulated adapter, no external writes)
cd router && npm ci && npm test
```

The router's live adapter is **off by default**: invoking a capability that writes external state (like publishing a public listing) refuses unless explicitly enabled, because the write is outward-facing and permanent. See [`router/README.md`](router/README.md#execution-modes-safety-gate).

## Design principles

- **Evidence over verdicts** — raw claims, timestamps, hashes and execution records; no platform-owned trust score.
- **No wallet for free value** — free listings and executions never touch payment infrastructure.
- **Open control plane, replaceable data plane** — portable, forkable registry and schemas; gateways can compete or be self-hosted.
- **Terminal states only** — every execution reaches an explicit state with machine-actionable reasons.
- **Reuse, don't capture** — composes with MCP, A2A, MPP, x402 and AP2; internal identifiers stay network- and processor-agnostic.

## Contributing a capability

Author one manifest per bounded promise against [`registry/schemas/manifest.schema.json`](registry/schemas/manifest.schema.json), validate with `npm run build` in `registry/`, and open a pull request. Free capabilities are first-class and need no wallet. See [`registry/README.md`](registry/README.md) and [`site/publish`](https://tracert.site/publish).

## Status

Early. Live today: the TRACE contracts, the public registry with its first active capability, and the five-tool router verified end-to-end. Next: a hosted MCP endpoint and pay-per-use capabilities behind a method-agnostic payment adapter (MPP + x402), plus demand benchmarks across agent environments.

## License

[MIT](LICENSE).
