import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { SITE_ORIGIN } from "@/lib/registry";
import { allHubs, getHub, getRoute, hubLastVerified, isSequence, monthYear, savingLine, type Route } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return allHubs().map((h) => ({ hub: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ hub: string }> }): Promise<Metadata> {
  const { hub: slug } = await params;
  const hub = getHub(slug);
  if (!hub) return {};
  const verified = monthYear(hubLastVerified(hub));
  return {
    title: { absolute: `${hub.title} (verified ${verified}) · Tracert` },
    description: `Verified ${verified}: ${hub.summary}`,
    alternates: { canonical: `/routes/topics/${hub.slug}`, types: { "application/atom+xml": "/routes/feed.xml" } },
    openGraph: { type: "article", title: hub.title, description: hub.summary, url: `${SITE_ORIGIN}/routes/topics/${hub.slug}` },
  };
}

export default async function HubPage({ params }: { params: Promise<{ hub: string }> }) {
  const { hub: slug } = await params;
  const hub = getHub(slug);
  if (!hub) notFound();
  const verified = hubLastVerified(hub);
  const items = hub.sections.flatMap((s) => s.routes.map((r) => ({ ...r, route: getRoute(r.slug)! }))).filter((x) => x.route);
  const oldest = items.map((x) => x.route.last_verified).sort()[0] ?? verified;
  const prompt = `I'm working on: [your task or product URL]. Read ${SITE_ORIGIN}/routes/topics/${hub.slug} and the route.md of each step that applies. Run each route's "Verify first" checks, then give me an ordered checklist with what I must do myself. Do not submit, sign up or pay for anything.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    description: hub.summary,
    dateModified: verified,
    url: `${SITE_ORIGIN}/routes/topics/${hub.slug}`,
    publisher: { "@type": "Organization", name: "Tracert", url: SITE_ORIGIN },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: items.length,
      itemListElement: items.map((x, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: x.route.title,
        url: `${SITE_ORIGIN}/routes/${x.slug}`,
      })),
    },
  };
  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="crumbs" aria-label="Breadcrumb" style={{ marginTop: "1.5rem" }}>
        <Link href="/routes">Routes</Link>
        <span aria-hidden>/</span>
        <Link href="/routes#topics">Topics</Link>
      </nav>
      <h1 className="page-title">{hub.title}</h1>
      <p className="lede">{hub.summary}</p>
      <p style={{ maxWidth: "51rem" }}>{hub.intro}</p>
      <p className="meta-row">
        <span>{items.length} routes</span>
        <span>newest check {verified}</span>
        <span>oldest {oldest}</span>
        <a href="/routes/changes">what changed</a>
        <a href="/routes/feed.xml">feed.xml</a>
      </p>

      <div className="page-split">
        <div className="page-main">
          {hub.sections.map((section, si) => {
            const rows = section.routes
              .map((r) => ({ ...r, route: getRoute(r.slug) }))
              .filter((x): x is { slug: string; why: string; route: Route } => !!x.route);
            return (
              <section key={section.heading} style={{ marginTop: si === 0 ? 0 : "3.5rem" }}>
                <h2 style={{ fontSize: "1.6rem", margin: "0 0 1.25rem" }}>{section.heading}</h2>
                {isSequence(section.heading) ? (
                  <ol className="hops hops-boxed">
                    {rows.map(({ slug: s, why, route }, i) => (
                      <li key={s}>
                        <span className="hop-n" aria-hidden>{i + 1}</span>
                        <div className="hop-main">
                          <Link className="hop-title" href={`/routes/${s}`}>{route.title}</Link>
                          <p>{why}</p>
                          <p className="small">
                            <strong style={{ color: "var(--fg)" }}>Now:</strong> {route.summary ?? route.intent}
                          </p>
                          <RouteMeta route={route} />
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="cards-grid">
                    {rows.map(({ slug: s, why, route }) => (
                      <Link className="panel" key={s} href={`/routes/${s}`}>
                        <span className="panel-title" style={{ fontSize: "1rem" }}>{route.title}</span>
                        <span className="panel-text" style={{ marginBottom: "0.6rem" }}>{why}</span>
                        <RouteMeta route={route} />
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
          <p className="small muted" style={{ marginTop: "1rem" }}>
            In the numbered steps, the first number is the tool calls the first agent spent; the second is the checks in
            the route&rsquo;s Verify-first plan.
          </p>
        </div>

        <aside className="rail" aria-label="Use this topic">
          <div className="rail-card is-primary">
            <h2>Hand the whole topic to your agent</h2>
            <p>Copy this prompt and fill in the brackets. Your agent plans in order and stops before acting.</p>
            <p className="codebox">{prompt}</p>
            <CopyButton text={prompt} label="Copy prompt" className="btn btn-primary" />
          </div>
          <div className="rail-card">
            <h2>Why trust the order?</h2>
            <p>
              The order is editorial judgement and says so. The facts live in the routes, each dated and re-checked, so
              this page is only as fresh as the routes it links to.
            </p>
            <p>
              Missing a step? <Link href="/routes#contribute">Contribute a route</Link>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RouteMeta({ route }: { route: Route }) {
  return (
    <span className="meta-row" title={savingLine(route) ?? undefined}>
      {route.explorer_steps && route.verify_checks ? (
        <span>
          {route.explorer_steps} → <b style={{ color: "var(--accent-ink)", fontWeight: 500 }}>{route.verify_checks}</b> checks
        </span>
      ) : null}
      <span>{route.hosts.length} sites</span>
      <span>verified {route.last_verified}</span>
    </span>
  );
}
