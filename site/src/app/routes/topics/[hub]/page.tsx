import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_ORIGIN } from "@/lib/registry";
import { allHubs, getHub, getRoute, hubLastVerified, monthYear, savingLine } from "@/lib/routes";

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
  let n = 0;
  const items = hub.sections.flatMap((s) => s.routes.map((r) => ({ ...r, route: getRoute(r.slug)! }))).filter((x) => x.route);
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
      <p className="eyebrow">
        <Link href="/routes">Routes</Link> · topic · verified {monthYear(verified)}
      </p>
      <h1>{hub.title}</h1>
      <p className="lede">{hub.summary}</p>
      <p>{hub.intro}</p>
      <p className="small muted">
        {items.length} routes · each is a dated field guide with a Verify-first plan · agents: raw Markdown at{" "}
        <span className="mono">/routes/&lt;slug&gt;/route.md</span> · updates:{" "}
        <a href="/routes/changes">what changed</a> · <a className="mono" href="/routes/feed.xml">feed.xml</a>
      </p>

      {hub.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.routes.map((r) => {
            const route = getRoute(r.slug);
            if (!route) return null;
            n += 1;
            const saving = savingLine(route);
            return (
              <div className="card" key={r.slug} style={{ marginTop: "1rem" }}>
                <p className="card-kicker">
                  {section.heading === "The launch sequence" || section.heading === "Make it" || section.heading === "The stack" ? `Step ${n} · ` : ""}
                  {route.task_type} · {route.region} · verified {route.last_verified}
                </p>
                <h3 style={{ margin: "0.3rem 0 0.4rem" }}>
                  <Link href={`/routes/${route.slug}`}>{route.title}</Link>
                </h3>
                <p className="small" style={{ margin: "0 0 0.4rem" }}>{r.why}</p>
                <p className="small muted" style={{ margin: 0 }}>
                  <strong>Now:</strong> {route.summary ?? route.intent}
                </p>
                {saving && <p className="small muted" style={{ margin: "0.4rem 0 0" }}>{saving}</p>}
              </div>
            );
          })}
        </section>
      ))}

      <p className="small muted" style={{ marginTop: "2rem" }}>
        Facts live in the routes, not on this page, so this page is only as fresh as the routes it links to. Each one shows
        its own verified date. Missing a step? <Link href="/routes#contribute">Contribute a route</Link>.
      </p>
    </div>
  );
}
