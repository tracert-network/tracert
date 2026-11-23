import { SITE_ORIGIN } from "@/lib/registry";
import { CLASSIFIER_URL, DEMAND_SCHEMA, allEditions } from "@/lib/demand";

export const dynamic = "force-static";

// Every "What agents asked for" edition as data. Aggregates only: no caller is named.
export function GET() {
  return Response.json(
    {
      schema: DEMAND_SCHEMA,
      about: "Monthly aggregate counts of how tracert.site's routes were read and searched. Tracert's own traffic is excluded.",
      notes: {
        reads: "One fetch of a route page or its markdown copy.",
        callers: "Distinct user-agent strings; approximate.",
        readers: `Traffic classes from ${CLASSIFIER_URL}.`,
        min_callers: "A route or query is listed only when at least this many distinct callers read or asked it; the rest are summed in *_below_threshold.",
        largest_caller_share: "Share of route reads made by the single busiest caller.",
        page_views: "Browser-tag page views (people whose browsers ran JavaScript).",
      },
      html: `${SITE_ORIGIN}/demand`,
      editions: allEditions().map((e) => ({ ...e, url: `${SITE_ORIGIN}/demand/${e.id}` })),
    },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
