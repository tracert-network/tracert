import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connect your agent",
  description:
    "One MCP connection gives your agent discovery, exact quotes, execution and portable receipts across every capability in the network.",
};

export default function Use() {
  return (
    <div className="container section">
      <p className="eyebrow">For buyers &amp; agent developers</p>
      <h1>Connect one router instead of integrating many services.</h1>
      <p className="lede">
        The Tracert Router is a five-tool MCP server. Install it once and your agent can find an
        external service at the moment it needs one — compare real facts, take an exact quote,
        execute, and keep evidence it can re-verify later.
      </p>

      <h2>The five tools</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tool</th><th>What it does</th><th>Writes external state?</th></tr>
          </thead>
          <tbody>
            <tr><td className="mono">search_capabilities</td><td>Small candidate set for an intent + constraints, every match reason grounded in manifest facts.</td><td>No</td></tr>
            <tr><td className="mono">get_capability</td><td>The full manifest: contract schemas, pricing, latency, data policy, evidence, provenance.</td><td>No</td></tr>
            <tr><td className="mono">get_quote</td><td>Exact, expiring terms. Free capabilities quote an explicit zero — never a hidden handshake.</td><td>No</td></tr>
            <tr><td className="mono">invoke_capability</td><td>Executes and returns a TRACE Receipt. Send an idempotency key; retries can never double-execute.</td><td><strong>Yes</strong></td></tr>
            <tr><td className="mono">get_execution</td><td>Current receipt for any execution — poll async work, re-verify outcomes later.</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Connect (hosted, read-only)</h2>
      <p>
        The hosted gateway is live at{" "}
        <a className="mono" href="/api/mcp">https://tracert.site/api/mcp</a> — an MCP endpoint over
        Streamable HTTP. Point any MCP client at that URL:
      </p>
      <pre>{`{ "mcpServers": { "tracert": { "url": "https://tracert.site/api/mcp" } } }`}</pre>
      <p className="small muted">
        The public gateway is <strong>read-only</strong>: free reads (exchange rates, dictionary, QR)
        execute live and return a TRACE Receipt with a reproducible output commitment. Capabilities
        that write external state are refused here — run the local router below to execute those.
      </p>

      <h2>Install (local — reads and writes)</h2>
      <p>
        The local router runs over stdio and can also execute writes (gated behind{" "}
        <span className="mono">TRACERT_ENABLE_LIVE_SUBMIT=1</span>). From the{" "}
        <a href="https://github.com/tracert-network/tracert">Tracert repository</a>:
      </p>
      <pre>{`# build the router
cd router && npm install && npm run build

# register it with Claude Code (any MCP host works)
claude mcp add tracert -- node /path/to/tracert/router/dist/server.js`}</pre>
      <p className="small muted">
        A plain HTTPS search API for non-MCP callers is next on the discovery roadmap.
      </p>

      <h2>Then try the benchmark prompt</h2>
      <pre>{`"Submit this AI website to a directory that accepts programmatic
submissions. Do not pay anything, and return proof of the published page."`}</pre>
      <p className="small muted">
        Your agent should search, pick the matching capability, read the contract, invoke, and hand
        you a receipt whose evidence (e.g. a pull request and a live page) you can check yourself.
        (Once a capability that satisfies this intent is published — the registry is a fresh slate
        today.)
      </p>

      <h2>Your policies stay yours</h2>
      <ul>
        <li><strong>Budget:</strong> filter by <code>free_only</code> or <code>max_price_usd</code>; quotes are exact and expire.</li>
        <li><strong>Payment methods:</strong> filter to rails you can actually present (card-backed MPP, x402 wallet, prepaid, BYOK) — free routes need none.</li>
        <li><strong>Data:</strong> every manifest declares retention, training use, regions and subprocessors; exclude what your policy forbids.</li>
        <li><strong>Evidence freshness:</strong> require recent comparable executions before trusting a capability with real work.</li>
      </ul>

      <h2>What a receipt gives you</h2>
      <p>
        Every invocation returns a <a href="/schemas/receipt/v0.1" className="mono">TRACE Receipt</a>:
        the capability version and manifest hash, the quote you accepted, sha256 commitments over
        request and output, artifacts (like the live page URL), and evidence entries (repository
        records, HTTP observations). Completion is recorded separately from your acceptance — the
        network never pretends a technically-successful output is automatically a good one.
      </p>

      <p style={{ marginTop: "2rem" }}>
        <Link className="btn btn-primary" href="/capabilities">Browse capabilities</Link>{" "}
        <Link className="btn mono" href="/agents">/agents</Link>
      </p>
    </div>
  );
}
