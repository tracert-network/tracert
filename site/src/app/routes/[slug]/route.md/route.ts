import { allRoutes, getRoute } from "@/lib/routes";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((r) => ({ slug: r.slug }));
}

// The raw route, exactly as published in the registry — the agent-facing copy.
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const r = getRoute(slug);
  if (!r) return new Response("not found\n", { status: 404 });
  return new Response(r.raw, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
