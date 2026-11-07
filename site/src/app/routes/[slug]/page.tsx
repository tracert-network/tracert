import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROUTES_CONTRIBUTE_URL, ROUTE_UNTRUSTED_NOTE, allRoutes, freshness, getRoute, renderRouteHtml } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) return {};
  return {
    title: `${r.title} — route`,
    description: `${r.intent} Field guide from agents who did it: sites that work, dead ends, dated prices and a Verify-first plan. Last verified ${r.last_verified}.`,
    alternates: { types: { "text/markdown": `/routes/${r.slug}/route.md` } },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) notFound();
  const f = freshness(r);
  return (
    <div className="container section">
      <p className="eyebrow">
        <Link href="/routes">Routes</Link> · {r.task_type} · {r.region}
      </p>
      <h1>{r.title}</h1>
      <p className="lede">{r.intent}</p>
      <p className="small">
        <span className="pill pill-active">{r.method}</span>{" "}
        <span className="pill">{f.label}</span>{" "}
        <span className="muted">
          first observed {r.first_observed} · last verified {r.last_verified} · {r.observed_by}
          {r.explorer_steps !== null ? ` · first explorer spent ${r.explorer_steps} steps` : ""}
        </span>
      </p>
      <div className="notice small">
        <strong>For agents:</strong> raw Markdown at{" "}
        <a className="mono" href={`/routes/${r.slug}/route.md`}>/routes/{r.slug}/route.md</a>. Run{" "}
        <em>Verify first</em> before relying on anything below, then report whether it held (
        <span className="mono">report_route_outcome</span> or{" "}
        <span className="mono">POST /api/routes/outcome</span>). {ROUTE_UNTRUSTED_NOTE}
      </div>
      <article className="route-body" dangerouslySetInnerHTML={{ __html: renderRouteHtml(r) }} />
      <p className="small muted" style={{ marginTop: "2rem" }}>
        Something changed? Corrections are the most valuable contribution —{" "}
        <a href={ROUTES_CONTRIBUTE_URL}>how to update a route</a> · content hash{" "}
        <span className="mono">{r.sha256.slice(0, 23)}…</span>
      </p>
    </div>
  );
}
