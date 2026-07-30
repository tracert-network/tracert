# Tracert Router

The public MCP surface of [Tracert](../README.md): **five router tools, not five thousand capability tools.** An agent host connects once; the router turns an intent into candidates, exact terms, an execution and a portable TRACE Receipt.

| Tool | Purpose | Writes external state? |
|---|---|---|
| `search_capabilities` | Small candidate set for an intent + constraints, with evidence-grounded match reasons | No |
| `get_capability` | Full TRACE Manifest, inline input/output schemas, evidence refs | No |
| `get_quote` | Exact, expiring terms (free capabilities quote an explicit zero) | No |
| `invoke_capability` | Execute a free or quote-bound task → TRACE Receipt | **Yes** |
| `get_execution` | Current receipt for an execution_id | No |

Zero-result searches append to `data/search-gaps.jsonl` — the unmet-intent log that tells us which supply to recruit next.

## Run

```
npm install
npm run build
npm test          # builds, then runs the stdio smoke test end-to-end
npm start         # stdio MCP server
```

Claude Code registration (local dev):

```
claude mcp add tracert -- node /path/to/tracert/router/dist/server.js
```

## Execution modes (safety gate)

`invoke_capability` on `ai-directory.publish-listing` performs an outward-facing write (public PR + permanent public listing), so the adapter is opt-in per process:

| Mode | Env | Behavior |
|---|---|---|
| Disabled (default) | — | Rejects with `live_submission_disabled` + instructions |
| Simulated | `TRACERT_DEV_FAKE_EXECUTE=1` | Full receipt pipeline, fabricated artifacts, evidence marked `simulated_execution` |
| Live | `TRACERT_ENABLE_LIVE_SUBMIT=1` | Real submission per [docs/capabilities/ai-directory.publish-listing.md](../docs/capabilities/ai-directory.publish-listing.md) |

Other env: `TRACERT_REGISTRY_DIR` (defaults to `../registry`), `TRACERT_DATA_DIR` (defaults to `./data`; receipts + search gaps as append-only JSONL).

## Design notes

- Every emitted receipt validates against `../registry/schemas/receipt.schema.json` — the smoke test asserts this for succeeded, rejected and gated paths alike.
- Free routes never require a wallet, an account, or a quote; taking a quote anyway binds the receipt to explicit terms, and receipts synthesize a zero quote when the caller skips it.
- `idempotency_key` replays return the stored receipt verbatim; the same key with different input rejects (`idempotency_conflict`). No path re-executes a completed request.
- Quotes are in-memory (dev router); receipts are durable JSONL. Both move to real storage when the router grows an HTTP deployment.
- Bootstrap shortcuts, on purpose: the router reads registry YAML directly (no indexer yet) and the adapter dispatch is a hardcoded single entry — evidence before abstraction.
