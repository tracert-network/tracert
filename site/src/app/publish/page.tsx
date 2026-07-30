import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publish a capability",
  description:
    "Publish once, reach every agent: describe a bounded promise in a TRACE Manifest and open a pull request. No wallet required; free capabilities are first-class.",
};

export default function Publish() {
  return (
    <div className="container section">
      <p className="eyebrow">For suppliers</p>
      <h1>Publish once. Let any agent discover, invoke and inspect it.</h1>
      <p className="lede">
        A Tracert listing is not a company profile — it&rsquo;s a <strong>callable capability</strong>:
        one bounded promise with a clear contract and an inspectable execution trail. Agents select
        services on structured facts, not marketing pages.
      </p>

      <div className="notice">
        No wallet, no listing fee, no payment integration required. A free capability is published
        with nothing but a pull request. Monetization is an optional upgrade, never a gate.
      </div>

      <h2>The onboarding ladder</h2>
      <p className="muted">Take the smallest step that fits your service; each level is optional.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Level</th><th>Your work</th><th>What you get</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Listed</strong></td>
              <td>Submit and maintain a manifest.</td>
              <td>Discovery in the index, MCP router and capability pages; schema validation; a stable capability ID.</td>
            </tr>
            <tr>
              <td><strong>Routed</strong></td>
              <td>Provide API details or approve an adapter.</td>
              <td>The gateway normalizes invocation, observes outcomes and issues TRACE Receipts for you.</td>
            </tr>
            <tr>
              <td><strong>Native</strong></td>
              <td>Expose MCP / A2A / machine-payment interfaces.</td>
              <td>Agents route to you directly when their policy allows; your capability identity and history carry over.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What a strong capability looks like</h2>
      <ul>
        <li><strong>A bounded promise.</strong> &ldquo;Turn an image into a colouring page&rdquo;, not &ldquo;AI image suite&rdquo;. One promise per manifest — agents match intents, not brands.</li>
        <li><strong>A deterministic contract.</strong> JSON Schemas for input and output, media types, size limits, and error codes an agent can act on.</li>
        <li><strong>Declared data handling.</strong> Retention, training use, regions, subprocessors. Absence is never treated as a safe default — declaring honestly is a selection advantage.</li>
        <li><strong>Evidence.</strong> Public examples, test vectors, recent executions. Fresh evidence beats static claims in every agent&rsquo;s ranking.</li>
        <li><strong>Honest provenance.</strong> Who operates the service, who operates the adapter, and whether the integration is official.</li>
      </ul>

      <h2>How to publish today</h2>
      <ol>
        <li>
          Author a manifest against the{" "}
          <a href="/schemas/manifest/v0.1" className="mono">TRACE Manifest v0.1 schema</a>. The
          worked example: <a className="mono" href="/capabilities/ai-directory.publish-listing/manifest.json">ai-directory.publish-listing</a>.
        </li>
        <li>Validate locally — the registry ships an <code>npm run validate</code> that checks schema conformance, ID discipline, schema references and placeholder rules.</li>
        <li>Open a pull request to the public registry repository. Validation re-runs in CI; the merged PR is your durable public record.</li>
      </ol>
      <div className="notice">
        The public registry repository is going live imminently alongside this site. The manifest
        format is stable to author against today; this page will link the repository the moment it
        opens.
      </div>

      <h2>Pricing a capability (optional)</h2>
      <p>
        Declare <code>payment_offers</code> in the manifest — MPP, x402, prepaid balance, BYOK,
        subscription or invoice — and the router negotiates a method the buyer can actually present.
        Quotes are exact and expire; a service can never silently charge a different amount. Paid
        routing goes live with the payment adapter phase; free capabilities route already.
      </p>

      <h2>The rules that protect everyone</h2>
      <ul>
        <li>Stable IDs: your capability ID survives interface and provider migrations.</li>
        <li>Public by default: manifests, changes and removals are inspectable history.</li>
        <li>No pay-to-rank, no sponsored placement — ranking reasons stay inspectable.</li>
        <li>Wrapped services must label the underlying provider and adapter operator — technical compatibility is never presented as endorsement.</li>
      </ul>
    </div>
  );
}
