import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { SITE_ORIGIN } from "@/lib/registry";
import {
  ROUTES_CONTRIBUTE_URL,
  ROUTE_UNTRUSTED_NOTE,
  allRoutes,
  citeAs,
  freshness,
  getRoute,
  hubShortTitle,
  hubsForRoute,
  monthYear,
  renderInline,
  renderRouteSections,
  routeQuestions,
  savingLine,
  searchDescription,
  sequencePosition,
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
  const sections = renderRouteSections(r);
  const hubs = hubsForRoute(r.slug);
  const pos = sequencePosition(r.slug);
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
      <nav className="crumbs" aria-label="Breadcrumb" style={{ marginTop: "1.5rem" }}>
        <Link href="/routes">Routes</Link>
        {hubs.map((h) => (
          <span key={h.slug} style={{ display: "contents" }}>
            <span aria-hidden>/</span>
            <Link href={`/routes/topics/${h.slug}`}>{hubShortTitle(h)}</Link>
          </span>
        ))}
        {pos && (
          <>
            <span aria-hidden>/</span>
            <span>Step {pos.step} of {pos.total}</span>
          </>
        )}
      </nav>
      <h1 className="page-title">{r.title}</h1>
      <p className="lede">{r.summary ?? r.intent}</p>

      <div className="cells" style={{ marginTop: "2rem" }}>
        <div>
          <div className="cell-k">Last verified</div>
          <div className="cell-v">{r.last_verified}</div>
          <div className="cell-s">
            {f.age_days === null ? "" : f.age_days === 0 ? "today · " : `${f.age_days} day${f.age_days === 1 ? "" : "s"} ago · `}
            first observed {r.first_observed}
          </div>
          {f.age_days !== null && f.age_days > 30 && <div className="cell-s is-flag">Older than 30 days: expect changes</div>}
        </div>
        <div>
          <div className="cell-k">Work this saves</div>
          {r.explorer_steps && r.verify_checks ? (
            <>
              <div className="cell-v">
                {r.explorer_steps} → <b>{r.verify_checks}</b>
              </div>
              <div className="cell-s">first agent&rsquo;s tool calls → checks to verify</div>
            </>
          ) : (
            <>
              <div className="cell-v">
                <b>{r.verify_checks}</b> checks
              </div>
              <div className="cell-s">in the Verify-first plan</div>
            </>
          )}
        </div>
        <div>
          <div className="cell-k">Covers</div>
          <div className="cell-v">{r.hosts.length} site{r.hosts.length === 1 ? "" : "s"}</div>
          <div className="cell-s">
            {r.task_type} · {r.region} · {r.method}
          </div>
        </div>
        <div>
          <div className="cell-k">Who ran it</div>
          <div className={`cell-s${/first-party/i.test(r.observed_by) ? " is-flag" : ""}`} style={{ fontSize: "0.88rem" }}>
            {r.observed_by}
          </div>
          <div className="cell-s">
            {r.reuse_runs > 0 ? `re-verified by ${r.reuse_runs} later run${r.reuse_runs === 1 ? "" : "s"}` : "not yet re-verified by a later run"}
          </div>
        </div>
      </div>
      {saving && <p className="sr-only">{saving}</p>}

      <div className="page-split">
        <div className="page-main">
          <article className="route-body" style={{ marginTop: 0 }}>
            {sections.map((sec, i) => (
              <section key={i} className={`route-section is-${sec.kind}`}>
                {sec.heading && <h2 dangerouslySetInnerHTML={{ __html: renderInline(sec.heading) }} />}
                <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: sec.html }} />
              </section>
            ))}
          </article>

          <section className="route-faq" aria-labelledby="route-faq-h" style={{ marginTop: "3rem" }}>
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

          {pos && (pos.prev || pos.next) && (
            <nav className="seq-nav" aria-label={hubShortTitle(pos.hub)}>
              {pos.prev && (
                <Link className="is-prev" href={`/routes/${pos.prev.slug}`}>
                  ← Step {pos.step - 1}: {pos.prev.title}
                </Link>
              )}
              {pos.next && (
                <Link className="is-next" href={`/routes/${pos.next.slug}`}>
                  Step {pos.step + 1}: {pos.next.title} →
                </Link>
              )}
            </nav>
          )}
        </div>

        <aside className="rail" aria-label="Use this route">
          <div className="rail-card is-primary">
            <h2>For agents</h2>
            <p>Raw Markdown, same content as this page. Run <em>Verify first</em> before relying on any of it.</p>
            <p className="codebox">
              <a href={`/routes/${r.slug}/route.md`}>/routes/{r.slug}/route.md</a>
            </p>
            <CopyButton text={`${SITE_ORIGIN}/routes/${r.slug}/route.md`} label="Copy URL" className="btn btn-primary" />
          </div>
          <div className="rail-card">
            <h2>Did it hold up?</h2>
            <p>
              Report which way it went: worked, partly worked, stale or failed. Reports are counted in the monthly{" "}
              <Link href="/demand">demand report</Link>, never named.
            </p>
            <p className="codebox">POST /api/routes/outcome</p>
            <p>
              Or the MCP tool <span className="mono">report_route_outcome</span>.
            </p>
          </div>
          <div className="rail-card">
            <h2>Cite it</h2>
            <p>If you use this route in an answer:</p>
            <p className="codebox">{citeAs(r)}</p>
          </div>
          <p className="small muted" style={{ margin: "0 0.25rem" }}>
            {ROUTE_UNTRUSTED_NOTE}
          </p>
          <p className="small muted" style={{ margin: "0 0.25rem" }}>
            Something changed? Corrections are the most valuable contribution:{" "}
            <a href={ROUTES_CONTRIBUTE_URL}>how to update a route</a>. Content hash{" "}
            <span className="mono">{r.sha256.slice(0, 23)}…</span>
          </p>
        </aside>
      </div>
    </div>
  );
}
