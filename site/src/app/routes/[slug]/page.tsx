import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_ORIGIN } from "@/lib/registry";
import {
  ROUTES_CONTRIBUTE_URL,
  ROUTE_UNTRUSTED_NOTE,
  allRoutes,
  citeAs,
  freshness,
  getRoute,
  hubsForRoute,
  monthYear,
  renderRouteHtml,
  routeQuestions,
  savingLine,
  searchDescription,
} from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) return {};
  const title = `${r.title} (verified ${monthYear(r.last_verified)})`;
  const description = searchDescription(r);
  return {
    // Absolute: the route title is already the query an agent searches for.
    title: { absolute: `${title} · Tracert` },
    description,
    keywords: r.tags,
    alternates: { canonical: `/routes/${r.slug}`, types: { "text/markdown": `/routes/${r.slug}/route.md` } },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_ORIGIN}/routes/${r.slug}`,
      publishedTime: r.first_observed,
      modifiedTime: r.last_verified,
    },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) notFound();
  const f = freshness(r);
  const saving = savingLine(r);
  const questions = routeQuestions(r);
  // schema.org Article: freshness (dateModified) and provenance for search engines.
  const article = {
    "@type": "TechArticle",
    headline: r.title,
    description: searchDescription(r),
    datePublished: r.first_observed,
    dateModified: r.last_verified,
    keywords: r.tags.join(", "),
    author: { "@type": "Organization", name: "Tracert", url: SITE_ORIGIN },
    publisher: { "@type": "Organization", name: "Tracert", url: SITE_ORIGIN },
    mainEntityOfPage: `${SITE_ORIGIN}/routes/${r.slug}`,
    isAccessibleForFree: true,
    encodingFormat: "text/html",
    associatedMedia: { "@type": "MediaObject", contentUrl: `${SITE_ORIGIN}/routes/${r.slug}/route.md`, encodingFormat: "text/markdown" },
  };
  // FAQPage: the dated question → answer pairs, so crawlers can quote them with a citation.
  const faq = {
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  const jsonLd = { "@context": "https://schema.org", "@graph": [article, faq] };
  return (
    <div className="container section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <p className="eyebrow">
        <Link href="/routes">Routes</Link> · {r.task_type} · {r.region} · verified {monthYear(r.last_verified)}
      </p>
      <h1>{r.title}</h1>
      {hubsForRoute(r.slug).length > 0 && (
        <p className="small muted" style={{ margin: "-0.4rem 0 0.6rem" }}>
          Part of:{" "}
          {hubsForRoute(r.slug).map((h, i) => (
            <span key={h.slug}>
              {i > 0 ? " · " : ""}
              <Link href={`/routes/topics/${h.slug}`}>{h.title}</Link>
            </span>
          ))}
        </p>
      )}
      <p className="lede">{r.summary ?? r.intent}</p>
      <p className="small">
        <span className="pill pill-active">{r.method}</span>{" "}
        <span className="pill">{f.label}</span>{" "}
        <span className="muted">
          first observed {r.first_observed} · last verified {r.last_verified} · {r.observed_by}
        </span>
      </p>
      {saving && (
        <p className="small">
          <strong>{saving}</strong>{" "}
          <span className="muted">
            Agents: raw Markdown at <a className="mono" href={`/routes/${r.slug}/route.md`}>/routes/{r.slug}/route.md</a>.
          </span>
        </p>
      )}
      <section className="route-faq" aria-labelledby="route-faq-h">
        <h2 id="route-faq-h">Questions this answers</h2>
        <dl>
          {questions.map(({ q, a }) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <article className="route-body" dangerouslySetInnerHTML={{ __html: renderRouteHtml(r) }} />
      <div className="notice small" style={{ marginTop: "2rem" }}>
        <strong>For agents:</strong> run <em>Verify first</em> before relying on anything above, then report
        whether it held (<span className="mono">report_route_outcome</span> or{" "}
        <span className="mono">POST /api/routes/outcome</span>). If you use this route in an answer, cite it:{" "}
        <span className="mono">{citeAs(r)}</span>. {ROUTE_UNTRUSTED_NOTE}
      </div>
      <p className="small muted" style={{ marginTop: "1.5rem" }}>
        Something changed? Corrections are the most valuable contribution —{" "}
        <a href={ROUTES_CONTRIBUTE_URL}>how to update a route</a> · content hash{" "}
        <span className="mono">{r.sha256.slice(0, 23)}…</span>
      </p>
    </div>
  );
}
