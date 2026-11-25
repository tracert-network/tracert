// GET /api/routes/search?q=<keywords>[&region=GB][&limit=3] — keyless route search
// for agents without MCP. Same results as the find_routes MCP tool.
// POST /api/routes/search {"q": "...", "region"?: "GB", "limit"?: 3} — the same
// search with the query in the body, so it never appears in a URL or request log.
// Send `x-tracert-zdr: 1` with either for zero data retention (src/lib/analytics.ts).
import { callerFromHeaders, ZDR_HEADER } from "@/lib/analytics";
import { findRoutes } from "@/lib/routes-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": `content-type, ${ZDR_HEADER}`,
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

function search(req: Request, args: { q: unknown; region: unknown; limit: unknown }) {
  const query = (typeof args.q === "string" ? args.q : "").slice(0, 300).trim();
  if (query.length < 2) {
    return Response.json(
      {
        error: {
          code: "missing_query",
          message: 'pass ?q=<what you are trying to do> (GET) or {"q": "..."} (POST), e.g. laser cutting quote uk',
        },
      },
      { status: 400, headers: CORS },
    );
  }
  const region = (typeof args.region === "string" ? args.region.slice(0, 6) : "") || undefined;
  const limit = Number(args.limit ?? "3") || 3;
  const caller = callerFromHeaders(req.headers);
  return Response.json(findRoutes({ query, region, limit }, caller), {
    headers: { ...CORS, "Cache-Control": "no-store", ...(caller.zdr ? { [ZDR_HEADER]: "applied" } : {}) },
  });
}

export function GET(req: Request) {
  const url = new URL(req.url);
  return search(req, { q: url.searchParams.get("q"), region: url.searchParams.get("region"), limit: url.searchParams.get("limit") });
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = await req.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) body = parsed as Record<string, unknown>;
  } catch {
    return Response.json(
      { error: { code: "invalid_json", message: 'send a JSON object, e.g. {"q": "laser cutting quote uk"}' } },
      { status: 400, headers: CORS },
    );
  }
  return search(req, { q: body.q ?? body.query, region: body.region, limit: body.limit });
}
