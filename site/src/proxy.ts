// Server-side usage analytics for traffic that never runs JavaScript: agents
// and tools fetching machine endpoints (/llms.txt, /index.json, manifests,
// schemas, /api/mcp) and non-browser fetches of ordinary pages. Browser page
// loads are recorded as page_request (gtag.js records page_view separately for
// browsers that run it), so ad-blocked and headless visitors are visible too.
// Sending happens in event.waitUntil — it never delays or alters the response.
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  callerFromHeaders,
  endpointType,
  isDocumentLoad,
  isLikelyBrowser,
  mcpEvents,
  recallMcpClient,
  rememberMcpClient,
  sendServerEvents,
  serverAnalyticsEnabled,
  type GaEvent,
} from "@/lib/analytics";

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!serverAnalyticsEnabled()) return NextResponse.next();
  const caller = callerFromHeaders(request.headers);
  const path = request.nextUrl.pathname;
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
    // Stateless transport: only initialize names the client. Carry it forward.
    for (const e of events) {
      const named = typeof e.params.mcp_client === "string" ? e.params.mcp_client : undefined;
      if (named) rememberMcpClient(caller, named);
      else e.params.mcp_client = recallMcpClient(caller);
    }
  } else if (kind) {
    events = [{ name: "agent_fetch", params: { endpoint_type: kind, path, method: request.method } }];
  } else if (!isLikelyBrowser(caller.ua)) {
    events = [{ name: "agent_fetch", params: { endpoint_type: "page", path, method: request.method } }];
  } else if (isDocumentLoad(request)) {
    events = [{ name: "page_request", params: { endpoint_type: "page", path } }];
  }

  if (events.length) event.waitUntil(sendServerEvents(caller, events));
  return NextResponse.next();
}

export const config = {
  // Everything except Next's own assets and the favicon/icon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
