// GET /api/routes/search?q=<keywords>[&region=GB][&limit=3] — keyless route search
// for agents without MCP. Same results as the find_routes MCP tool.
import { callerFromHeaders } from "@/lib/analytics";
import { findRoutes } from "@/lib/routes-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" };

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export function GET(req: Request) {
  const url = new URL(req.url);
  const query = (url.searchParams.get("q") ?? "").slice(0, 300).trim();
  if (query.length < 2) {
    return Response.json(
      { error: { code: "missing_query", message: "pass ?q=<what you are trying to do>, e.g. ?q=laser cutting quote uk" } },
      { status: 400, headers: CORS },
    );
  }
  const region = url.searchParams.get("region")?.slice(0, 6) || undefined;
  const limit = Number(url.searchParams.get("limit") ?? "3") || 3;
  return Response.json(findRoutes({ query, region, limit }, callerFromHeaders(req.headers)), {
    headers: { ...CORS, "Cache-Control": "no-store" },
  });
}
