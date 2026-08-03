import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Tracert exists: as creation gets cheap, the scarce layer moves to discovery, selection, execution and proof.",
};

export default function About() {
  return (
    <div className="container section">
      <p className="eyebrow">About</p>
      <h1>Why Tracert exists</h1>
      <p className="lede">
        Generative systems collapsed the cost of making software and media. That didn&rsquo;t remove
        scarcity — it moved it downstream. When thousands of adequate services exist, the scarce
        layer is being <em>found, selected, trusted and executed</em> at the exact moment an agent
        is trying to complete a task.
      </p>

      <h2>What Tracert is</h2>
      <p>
        An open, structured route between an agent&rsquo;s intent and an external service that can
        fulfil it. Suppliers publish machine-readable capabilities. Tracert makes them searchable,
        normalizes how they are invoked, supports free and paid calls, and records portable
        evidence of the interaction. The requesting agent stays responsible for deciding relevance,
        quality and buyer-specific risk — Tracert gives it current, inspectable facts to decide with.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Term</th><th>Role</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>TRACE Manifest</strong></td><td>A capability&rsquo;s contract: promise, input/output schemas, interfaces, pricing, operational facts, data handling, evidence, provenance. <a href="/schemas/manifest/v0.1" className="mono">schema</a></td></tr>
            <tr><td><strong>Registry</strong></td><td>The public, version-controlled source of providers, services and capability manifests. Forkable by design.</td></tr>
            <tr><td><strong>Router</strong></td><td>The five-tool MCP surface that turns an intent into candidates, terms and an invocation plan.</td></tr>
            <tr><td><strong>Gateway</strong></td><td>An optional adapter that invokes the underlying service, observes the result and issues the receipt. Replaceable; self-hostable.</td></tr>
            <tr><td><strong>TRACE Receipt</strong></td><td>A portable execution record binding the quoted promise, payment evidence and outcome evidence. <a href="/schemas/receipt/v0.1" className="mono">schema</a></td></tr>
          </tbody>
        </table>
      </div>

      <h2>The lifecycle</h2>
      <p className="mono small">
        publish → discover → evaluate → quote → invoke → pay (if priced) → prove → repeat
      </p>
      <p>
        A buying agent searches by outcome, inspects manifests and recent evidence, takes an exact
        expiring quote, invokes, and receives a receipt whose commitments (sha256 over canonical
        request/output) it can verify independently — along with public artifacts like a live page
        or a merged pull request.
      </p>

      <h2>What Tracert is not</h2>
      <ul>
        <li><strong>Not a universal quality oracle.</strong> It exposes evidence; your agent judges fit.</li>
        <li><strong>Not a risk score.</strong> It records risk-relevant facts (retention, training use, regions, subprocessors); buyer policy decides what&rsquo;s acceptable.</li>
        <li><strong>Not wallet-gated.</strong> Free listings and executions never touch payment infrastructure.</li>
        <li><strong>Not a compulsory gateway.</strong> Capabilities advertise multiple interfaces; agents may invoke native endpoints directly when policy allows.</li>
        <li><strong>Not fully trustless.</strong> Cryptography can bind payments and commitments; it cannot see whether an off-chain output is tasteful. Tracert is trust-<em>minimized</em>: prove what can be proved, preserve source evidence for the rest, state the remaining assumptions.</li>
      </ul>

      <h2>Standards posture: reuse, don&rsquo;t capture</h2>
      <p>
        Tracert composes with the emerging agent stack rather than replacing it: <strong>MCP</strong>{" "}
        for demand-side discovery, <strong>A2A</strong> agent cards as a mappable interface,{" "}
        <strong>MPP</strong> and <strong>x402</strong> as payment offers behind a method-agnostic
        adapter, <strong>AP2</strong>-style mandates as buyer-authorization evidence. Internal
        identifiers stay network- and processor-agnostic, so a capability&rsquo;s identity never
        changes when a new rail is added.
      </p>

      <h2>Where the project stands</h2>
      <ul>
        <li><strong>Done:</strong> TRACE Manifest &amp; Receipt v0.1 · public registry with the first active capability · five-tool MCP router with receipts, verified end-to-end.</li>
        <li><strong>Now:</strong> this public site · the first live routed execution with public evidence.</li>
        <li><strong>Next:</strong> hosted discovery endpoint · paid capabilities (image transformations) behind a method-agnostic payment adapter (MPP + x402 sandboxes first) · demand benchmarks across agent environments.</li>
      </ul>

      <hr className="route" />
      <h2>Listed on</h2>
      <p className="small muted">
        Tracert is listed on the PromptFrenzy AI Directory — added by using a capability from
        Tracert&rsquo;s own registry (<span className="mono">promptfrenzy.list-ai-tool</span>) to
        submit itself. Dogfooding the loop end to end.
      </p>
      <p>
        <a
          href="https://www.promptfrenzy.com/directory"
          rel="noopener"
          target="_blank"
          title="Featured on PromptFrenzy AI Directory"
        >
          <img
            src="https://www.promptfrenzy.com/badges/directory.svg"
            alt="Featured on PromptFrenzy AI Directory"
            width={220}
            height={44}
            loading="lazy"
          />
        </a>
      </p>

      <p style={{ marginTop: "2rem" }}>
        <Link className="btn btn-primary" href="/publish">Publish a capability</Link>{" "}
        <Link className="btn" href="/use">Connect your agent</Link>
      </p>
    </div>
  );
}
