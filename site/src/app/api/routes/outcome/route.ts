// POST /api/routes/outcome — report whether a route held. Same as the
// report_route_outcome MCP tool. Records an anonymous analytics event only.
import { callerFromHeaders } from "@/lib/analytics";
import { OUTCOMES, reportOutcome } from "@/lib/routes-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export function GET() {
  return Response.json(
    {
      endpoint: "https://tracert.site/api/routes/outcome",
      method: "POST",
      body: {
        slug: "route slug from /api/routes/search or /routes.json",
        outcome: OUTCOMES.join(" | "),
        steps_taken: "optional integer: tool calls you spent on the task",
        note: "optional, ≤100 chars: what changed. No personal data, credentials or order numbers.",
      },
      stored_as: "anonymous analytics event; no IP address kept",
    },
    { headers: CORS },
  );
}

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 4096) {
    return Response.json({ error: { code: "too_large", message: "body over 4 KB" } }, { status: 413, headers: CORS });
  }
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return Response.json({ error: { code: "invalid_json", message: "body must be JSON" } }, { status: 400, headers: CORS });
  }
  const res = reportOutcome((input ?? {}) as Record<string, unknown>, callerFromHeaders(req.headers), "http");
  return Response.json(res.body, { status: res.ok ? 200 : 400, headers: CORS });
}
