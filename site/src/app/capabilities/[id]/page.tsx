import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allCapabilities, getCapability } from "@/lib/registry";

// Only capabilities in the registry exist as pages; every other id is a clean
// 404, never a runtime render (which, with an empty registry, would 500).
export const dynamicParams = false;

export function generateStaticParams() {
  return allCapabilities().map(({ manifest }) => ({ id: manifest.capability.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const cap = getCapability(id);
  if (!cap) return {};
  const c = cap.manifest.capability;
  return {
    title: `${c.id} — ${c.pricing.free ? "free" : "pay-per-use"} capability`,
    description: c.promise,
  };
}

export default async function CapabilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cap = getCapability(id);
  if (!cap) notFound();
  const { manifest, manifestHash, inputSchema, outputSchema } = cap;
  const c = manifest.capability;

  return (
    <div className="container section">
      <p className="eyebrow">
        {manifest.provider.name} · {manifest.service.name ?? manifest.service.id}
      </p>
      <h1>{c.promise}</h1>
      <p>
        <span className="pill mono">{c.id}</span>{" "}
        <span className="pill mono">v{c.version}</span>{" "}
        <span className={`pill pill-${c.status === "active" ? "active" : "draft"}`}>{c.status}</span>{" "}
        {c.pricing.free && <span className="pill pill-free">free — no wallet</span>}
      </p>
      {c.description && <p className="lede small">{c.description}</p>}

      <p className="small mono">
        machine contract: <a href={`/capabilities/${c.id}/manifest.json`}>manifest.json</a> ·
        manifest_hash <span className="muted">{manifestHash.slice(0, 23)}…</span>
      </p>

      {c.excludes && (
        <>
          <h2>Explicitly not promised</h2>
          <ul>{c.excludes.map((x) => <li key={x}>{x}</li>)}</ul>
        </>
      )}

      <h2>Price</h2>
      <p>
        {c.pricing.free
          ? "Free. No wallet, no account, no payment handshake — rejections cost nothing too."
          : c.pricing.mode === "fixed"
            ? `${c.pricing.amount?.value} ${c.pricing.amount?.currency} ${c.pricing.unit ?? "per invocation"} · offers: ${(c.pricing.payment_offers ?? []).join(", ")}`
            : `Quoted per invocation · offers: ${(c.pricing.payment_offers ?? []).join(", ")}`}
      </p>

      <h2>Contract</h2>
      <dl className="fact-list">
        <dt>Input</dt>
        <dd>
          {(c.input.media_types ?? []).join(", ")}
          {c.input.max_bytes ? ` · max ${c.input.max_bytes.toLocaleString()} bytes` : ""}
          {c.input.notes ? <span className="muted"> — {c.input.notes}</span> : null}
        </dd>
        <dt>Output</dt>
        <dd>
          {(c.output.media_types ?? []).join(", ")}
          {c.output.notes ? <span className="muted"> — {c.output.notes}</span> : null}
        </dd>
      </dl>
      {inputSchema && (
        <details>
          <summary>Input schema (JSON Schema)</summary>
          <pre>{JSON.stringify(inputSchema, null, 2)}</pre>
        </details>
      )}
      {outputSchema && (
        <details>
          <summary>Output schema (JSON Schema)</summary>
          <pre>{JSON.stringify(outputSchema, null, 2)}</pre>
        </details>
      )}

      {c.errors && (
        <>
          <h2>Failure semantics</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Code</th><th>Meaning</th><th>Retriable</th></tr>
              </thead>
              <tbody>
                {c.errors.map((e) => (
                  <tr key={e.code}>
                    <td className="mono">{e.code}</td>
                    <td>{e.meaning}</td>
                    <td>{e.retriable ? "yes" : "no"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2>Interfaces</h2>
      <ul>
        {c.interfaces.map((i, idx) => (
          <li key={idx}>
            <span className="mono">{i.type}</span>
            {i.endpoint && <> — <span className="mono small">{i.endpoint}</span></>}
            {i.docs_url && <> · <a href={i.docs_url}>docs</a></>}
            {i.openapi_url && <> · <a href={i.openapi_url}>OpenAPI</a></>}
            {i.agent_card && <> · <a href={i.agent_card}>Agent Card</a></>}
            {i.notes && <div className="small muted">{i.notes}</div>}
          </li>
        ))}
      </ul>

      <h2>Operational facts</h2>
      <dl className="fact-list">
        {c.operations.expected_latency_seconds && (
          <>
            <dt>Expected latency</dt>
            <dd>
              p50 {c.operations.expected_latency_seconds.p50}s
              {c.operations.expected_latency_seconds.p95 ? ` · p95 ${c.operations.expected_latency_seconds.p95}s` : ""}
            </dd>
          </>
        )}
        {c.operations.timeout_seconds && (
          <>
            <dt>Timeout</dt>
            <dd>{c.operations.timeout_seconds}s — every execution reaches a terminal state</dd>
          </>
        )}
        <dt>Idempotency</dt>
        <dd className="mono">{c.operations.idempotency}</dd>
        {c.operations.availability_endpoint && (
          <>
            <dt>Availability signal</dt>
            <dd><a className="mono small" href={c.operations.availability_endpoint}>{c.operations.availability_endpoint}</a></dd>
          </>
        )}
      </dl>

      <h2>Data handling (declared)</h2>
      <dl className="fact-list">
        <dt>Input retention</dt>
        <dd>{c.data_policy.input_retention}</dd>
        <dt>Training use</dt>
        <dd>{c.data_policy.training_use}</dd>
        {c.data_policy.subprocessors && (
          <>
            <dt>Subprocessors</dt>
            <dd><ul style={{ margin: 0 }}>{c.data_policy.subprocessors.map((s) => <li key={s}>{s}</li>)}</ul></dd>
          </>
        )}
        {c.data_policy.notes && (
          <>
            <dt>Notes</dt>
            <dd>{c.data_policy.notes}</dd>
          </>
        )}
      </dl>

      {c.evidence && (
        <>
          <h2>Evidence</h2>
          <ul>
            {c.evidence.public_examples && <li><a href={c.evidence.public_examples}>Public examples</a></li>}
            {c.evidence.recent_executions && <li><a href={c.evidence.recent_executions}>Recent executions</a></li>}
            {c.evidence.repository && <li><a href={c.evidence.repository}>Source repository</a></li>}
            {c.evidence.test_vectors && <li><span className="mono small">{c.evidence.test_vectors}</span> (test vectors, in-registry)</li>}
          </ul>
        </>
      )}

      <h2>Provenance</h2>
      <p>
        Integration: <strong>{c.provenance.integration_status.replace("_", " ")}</strong>
        {c.provenance.adapter_operator && (
          <> · adapter operated by <span className="mono">{c.provenance.adapter_operator}</span></>
        )}
      </p>
      {c.provenance.notes && <p className="small muted">{c.provenance.notes}</p>}

      <hr className="route" />
      <p className="small muted">
        This page is generated from the capability&rsquo;s TRACE Manifest — no hand-written
        marketing. Verify the contract yourself:{" "}
        <a className="mono" href={`/capabilities/${c.id}/manifest.json`}>manifest.json</a> ·{" "}
        <a className="mono" href="/schemas/manifest/v0.1">schema</a>
      </p>
    </div>
  );
}
