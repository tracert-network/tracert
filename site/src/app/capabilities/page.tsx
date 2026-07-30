import type { Metadata } from "next";
import Link from "next/link";
import { allCapabilities } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "Every capability in the Tracert registry: promise, status, price and contract.",
};

export default function Capabilities() {
  const caps = allCapabilities();
  return (
    <div className="container section">
      <p className="eyebrow">Registry</p>
      <h1>Capabilities</h1>
      <p className="lede">
        {caps.length} in the registry. Each page is generated from the capability&rsquo;s TRACE
        Manifest — the same structured facts agents select on. Machine version:{" "}
        <a href="/index.json" className="mono">/index.json</a>.
      </p>

      {caps.length === 0 && (
        <div className="card" style={{ marginTop: "1.25rem" }}>
          <p className="card-kicker">Empty registry</p>
          <h2 style={{ margin: "0.3rem 0 0.5rem" }}>Nothing published yet.</h2>
          <p className="small muted" style={{ margin: 0 }}>
            The registry is a clean slate. The first capability is one pull request away —{" "}
            <Link href="/publish">publish a capability</Link>.
          </p>
        </div>
      )}

      {caps.map(({ manifest }) => {
        const c = manifest.capability;
        return (
          <div className="card" key={c.id} style={{ marginTop: "1.25rem" }}>
            <p className="card-kicker">
              {manifest.provider.name}
              {" · "}
              <span className={`pill pill-${c.status === "active" ? "active" : "draft"}`}>{c.status}</span>{" "}
              {c.pricing.free ? (
                <span className="pill pill-free">free</span>
              ) : (
                <span className="pill">{c.pricing.mode}</span>
              )}
            </p>
            <h2 style={{ margin: "0.3rem 0 0.5rem" }}>
              <Link href={`/capabilities/${c.id}`}>{c.promise}</Link>
            </h2>
            <p className="small mono muted" style={{ margin: 0 }}>
              {c.id} · v{c.version}
              {c.operations.expected_latency_seconds
                ? ` · ~${c.operations.expected_latency_seconds.p50}s typical`
                : ""}
              {" · "}
              {c.interfaces.map((i) => i.type).join(", ")}
            </p>
            {c.tags && (
              <p className="small muted" style={{ marginBottom: 0 }}>
                {c.tags.map((t) => `#${t}`).join("  ")}
              </p>
            )}
          </div>
        );
      })}

      <p className="small muted" style={{ marginTop: "2rem" }}>
        Want yours here? <Link href="/publish">Publish a capability</Link> — free listings are
        first-class and never need a wallet.
      </p>
    </div>
  );
}
