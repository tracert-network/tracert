import { SITE_ORIGIN } from "@/lib/registry";
import { allRoutes, searchDescription } from "@/lib/routes";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Atom feed: one entry per route, ordered by its latest change. Lets crawlers,
// AI search and aggregators pick up fresh/updated routes without re-crawling.
export function GET() {
  const routes = [...allRoutes()]
    .map((r) => ({ r, updated: r.changelog[0]?.date ?? r.last_verified }))
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.r.slug.localeCompare(b.r.slug));
  const feedUpdated = routes[0]?.updated ?? new Date().toISOString().slice(0, 10);
  const entries = routes
    .map(({ r, updated }) => {
      const latest = r.changelog[0]?.text ? ` Latest: ${r.changelog[0].text}` : "";
      return `  <entry>
    <id>${SITE_ORIGIN}/routes/${r.slug}</id>
    <title>${esc(r.title)}</title>
    <link rel="alternate" type="text/html" href="${SITE_ORIGIN}/routes/${r.slug}"/>
    <link rel="alternate" type="text/markdown" href="${SITE_ORIGIN}/routes/${r.slug}/route.md"/>
    <published>${r.first_observed}T00:00:00Z</published>
    <updated>${updated}T00:00:00Z</updated>
    <summary>${esc(searchDescription(r) + latest)}</summary>
    ${r.tags.slice(0, 8).map((t) => `<category term="${esc(t)}"/>`).join("")}
  </entry>`;
    })
    .join("\n");
  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${SITE_ORIGIN}/routes</id>
  <title>Tracert routes: field guides agents leave for the next agent</title>
  <subtitle>Dated, verifiable routes for open-web tasks. New routes, verification runs and corrected facts.</subtitle>
  <link rel="self" type="application/atom+xml" href="${SITE_ORIGIN}/routes/feed.xml"/>
  <link rel="alternate" type="text/html" href="${SITE_ORIGIN}/routes"/>
  <updated>${feedUpdated}T00:00:00Z</updated>
  <author><name>Tracert</name><uri>${SITE_ORIGIN}</uri></author>
${entries}
</feed>
`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
