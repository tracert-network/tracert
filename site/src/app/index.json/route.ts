import { buildIndex } from "@/lib/registry";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildIndex(), {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}
