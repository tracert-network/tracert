// Server-side usage analytics for traffic that never runs JavaScript: agents
// and tools fetching machine endpoints (/llms.txt, /index.json, manifests,
// schemas, /api/mcp) and non-browser fetches of ordinary pages. Browser page
// loads are recorded as page_request (the first-party page ping records
// js_page_view separately for browsers that run it), so headless visitors and
// ones that block the ping are visible too.
// Sending happens in event.waitUntil — it never delays or alters the response.
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  callerFromHeaders,
  endpointType,
  isDocumentLoad,
  isLikelyBrowser,
  mcpEvents,
  realToolCalls,
  recallMcpClient,
  rememberMcpClient,
  sendServerEvents,
  serverAnalyticsEnabled,
  ZDR_HEADER,
  type GaEvent,
} from "@/lib/analytics";
import { TOOL_META } from "@/lib/gateway/tool-catalog";

const TOOL_NAMES = Object.keys(TOOL_META);

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const caller = callerFromHeaders(request.headers);
  const response = NextResponse.next();
  // Confirm a zero-retention request was seen (sendServerEvents does the scrubbing).
  if (caller.zdr) response.headers.set(ZDR_HEADER, "applied");
  if (!serverAnalyticsEnabled()) return response;
  const path = request.nextUrl.pathname;
  // The page ping records its own event (app/api/pv/route.ts).
  if (path === "/api/pv") return NextResponse.next();
  const kind = endpointType(path);

  let events: GaEvent[] = [];
  if (kind === "mcp") {
    if (request.method === "POST") {
      try {
        events = mcpEvents(JSON.parse(await request.clone().text()));
      } catch {
        events = [{ name: "mcp_request", params: { rpc_method: "unparseable" } }];
      }
    } else {
      events = [{ name: "mcp_request", params: { rpc_method: `http_${request.method.toLowerCase()}` } }];
    }
    // Stateless transport: only initialize names the client. Carry it forward
    // (not for zero-retention callers: nothing about them is remembered).
    for (const e of events) {
      const named = typeof e.params.mcp_client === "string" ? e.params.mcp_client : undefined;
      if (caller.zdr) continue;
      if (named) rememberMcpClient(caller, named);
      else e.params.mcp_client = recallMcpClient(caller);
    }
  } else if (kind) {
    // A keyless route search is demand evidence whether or not it matched, so
    // keep what was asked (hits used to record only that a search happened).
    // POST carries it in a JSON body, so it never appears in a URL.
    let query: string | undefined;
    if (kind === "routes_search") {
      if (request.method === "POST") {
        try {
          const body = JSON.parse(await request.clone().text()) as { q?: unknown; query?: unknown };
          const q = typeof body.q === "string" ? body.q : typeof body.query === "string" ? body.query : undefined;
          query = q?.trim() || undefined;
        } catch {
          query = undefined;
        }
      } else {
        query = request.nextUrl.searchParams.get("q")?.trim() || undefined;
      }
    }
    events = [{ name: "agent_fetch", params: { endpoint_type: kind, path, method: request.method, query } }];
  } else if (!isLikelyBrowser(caller.ua)) {
    events = [{ name: "agent_fetch", params: { endpoint_type: "page", path, method: request.method } }];
  } else if (isDocumentLoad(request)) {
    events = [{ name: "page_request", params: { endpoint_type: "page", path } }];
  }

  events.push(...realToolCalls(caller, events, TOOL_NAMES));
  if (events.length) event.waitUntil(sendServerEvents(caller, events));
  return response;
}

export const config = {
  // Everything except Next's own assets and the favicon/icon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
