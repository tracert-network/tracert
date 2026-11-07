import { SITE_ORIGIN } from "@/lib/registry";
import { allRoutes, freshness, routeUrls } from "@/lib/routes";

export const dynamic = "force-static";

// Machine index of every public route (no bodies — fetch markdown_url for those).
export function GET() {
  const routes = allRoutes().map((r) => ({
    slug: r.slug,
    title: r.title,
    intent: r.intent,
    task_type: r.task_type,
    region: r.region,
    tags: r.tags,
    hosts: r.hosts,
    method: r.method,
    first_observed: r.first_observed,
    last_verified: r.last_verified,
    freshness: freshness(r).label,
    first_explorer_steps: r.explorer_steps,
    reuse_runs: r.reuse_runs,
    sha256: r.sha256,
    ...routeUrls(r.slug),
  }));
  return Response.json(
    {
      schema: `${SITE_ORIGIN}/schemas/route/v0.1`,
      built_from: "tracert-registry/routes",
      search: `${SITE_ORIGIN}/api/routes/search?q=<keywords>`,
      route_count: routes.length,
      routes,
    },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } },
  );
}
