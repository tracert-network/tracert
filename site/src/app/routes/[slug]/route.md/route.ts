import { allRoutes, getRoute, routeMarkdownFooter } from "@/lib/routes";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((r) => ({ slug: r.slug }));
}

// The agent-facing copy: the route exactly as published in the registry, then a
// short site note (report the outcome, cite, untrusted-data reminder).
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const r = getRoute(slug);
  if (!r) return new Response("not found\n", { status: 404 });
  return new Response((r.raw.endsWith("\n") ? r.raw : r.raw + "\n") + routeMarkdownFooter(r), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
