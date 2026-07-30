import Link from "next/link";
import { allCapabilities } from "@/lib/registry";

export default function Home() {
  const caps = allCapabilities();
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">TRACE — Transparent Registry for Agent Capabilities and Execution</p>
          <h1>The open route from agent intent to a provable outcome.</h1>
          <p className="lede">
            Tracert is an open capability network: AI agents discover, evaluate and invoke free or
            pay-per-use services through one interface — with transparent evidence of what was
            promised, what was paid and what happened.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Choose your route">
        <div className="container">
          <div className="fork-grid">
            <div className="card fork-card">
              <p className="card-kicker">You are a human</p>
              <h2>Read, publish, connect</h2>
              <p className="muted">
                Understand how the network works, list a capability you operate, or plug the router
                into your own agent and give it real-world reach.
              </p>
              <div className="actions">
                <Link className="btn btn-primary" href="/about">How Tracert works</Link>
                <Link className="btn" href="/publish">Publish a capability</Link>
                <Link className="btn" href="/use">Connect your agent</Link>
              </div>
            </div>
            <div className="card fork-card">
              <p className="card-kicker">You are an agent</p>
              <h2 className="mono">GET /agents</h2>
              <p className="muted">
                Machine-first entry points — no rendering required. The registry index, JSON
                Schemas for manifests and receipts, and per-capability contracts at stable URLs.
              </p>
              <pre>{`curl -sL https://tracert.site/index.json
curl -sL https://tracert.site/llms.txt`}</pre>
              <div className="actions">
                <Link className="btn btn-primary mono" href="/agents">/agents</Link>
                <a className="btn mono" href="/llms.txt">/llms.txt</a>
                <a className="btn mono" href="/index.json">/index.json</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Two sides of the network">
        <div className="container">
          <h2>Two sides, one loop</h2>
          <p className="muted">
            Suppliers publish machine-readable capabilities once; buying agents discover, quote,
            invoke and verify them everywhere. Every execution ends in a portable receipt.
          </p>
          <div className="grid-4">
            <div className="card">
              <h3>Suppliers · human</h3>
              <p className="small muted">
                Describe one bounded promise in a TRACE Manifest and open a pull request. No wallet,
                no fees for free capabilities. <Link href="/publish">Start publishing →</Link>
              </p>
            </div>
            <div className="card">
              <h3 className="mono small">suppliers · agent</h3>
              <p className="small muted">
                Fetch the <a href="/schemas/manifest/v0.1">manifest schema</a>, author YAML,
                validate, submit. The registry is version-controlled and public by default.
              </p>
            </div>
            <div className="card">
              <h3>Buyers · human</h3>
              <p className="small muted">
                Connect one MCP router to your agent instead of integrating services one by one.{" "}
                <Link href="/use">Set it up →</Link>
              </p>
            </div>
            <div className="card">
              <h3 className="mono small">buyers · agent</h3>
              <p className="small muted">
                Five router tools: search, inspect, quote, invoke, receipt. Exact expiring quotes;
                machine-actionable failures; evidence you can re-verify. <Link href="/agents">Spec →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Live capabilities">
        <div className="container">
          <h2>In the registry now</h2>
          {caps.map(({ manifest }) => {
            const c = manifest.capability;
            return (
              <div className="card" key={c.id} style={{ marginTop: "1rem" }}>
                <p className="card-kicker">
                  {manifest.provider.name} · <span className="mono">{c.id}</span>{" "}
                  <span className={`pill pill-${c.status === "active" ? "active" : "draft"}`}>{c.status}</span>{" "}
                  {c.pricing.free && <span className="pill pill-free">free</span>}
                </p>
                <h3 style={{ marginTop: "0.2rem" }}>{c.promise}</h3>
                <p className="small">
                  <Link href={`/capabilities/${c.id}`}>Capability page</Link>
                  {" · "}
                  <a className="mono" href={`/capabilities/${c.id}/manifest.json`}>manifest.json</a>
                </p>
              </div>
            );
          })}
          <p className="small muted" style={{ marginTop: "1rem" }}>
            Deliberately small: the network grows by proving the loop end-to-end, not by bulk
            listings. Next up: pay-per-call image transformations behind a method-agnostic payment
            adapter.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Principles">
        <div className="container">
          <hr className="route" />
          <h2>Built on evidence, not verdicts</h2>
          <div className="grid-2">
            <div>
              <h3>Evidence over verdicts</h3>
              <p className="small muted">
                Tracert exposes claims, timestamps, hashes and execution records — it does not issue
                a universal quality score. Your agent applies its own policy to inspectable facts.
              </p>
              <h3>No wallet for free value</h3>
              <p className="small muted">
                Free listings and free executions never require payment infrastructure. Payment is a
                capability property, negotiated per invocation across methods — never a gate.
              </p>
            </div>
            <div>
              <h3>Open control plane, replaceable data plane</h3>
              <p className="small muted">
                The registry and schemas are portable and forkable; gateways can compete or be
                self-hosted. Receipts stay verifiable wherever they were produced.
              </p>
              <h3>Terminal states only</h3>
              <p className="small muted">
                Every execution ends in an explicit state with machine-actionable reasons. No
                &ldquo;paid but unknown&rdquo;, ever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
