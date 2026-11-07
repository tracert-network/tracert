// Server-side usage analytics for traffic that never runs JavaScript: agents
// and tools fetching machine endpoints (/llms.txt, /index.json, manifests,
// schemas, /api/mcp) and non-browser fetches of ordinary pages. Browsers are
// counted by the gtag.js tag instead, so they're skipped on pages here.
// Sending happens in event.waitUntil — it never delays or alters the response.
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  callerFromHeaders,
  endpointType,
  isLikelyBrowser,
  mcpEvents,
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
  } else if (kind) {
    events = [{ name: "agent_fetch", params: { endpoint_type: kind, path, method: request.method } }];
  } else if (!isLikelyBrowser(caller.ua)) {
    events = [{ name: "agent_fetch", params: { endpoint_type: "page", path, method: request.method } }];
  }

  if (events.length) event.waitUntil(sendServerEvents(caller, events));
  return NextResponse.next();
}

export const config = {
  // Everything except Next's own assets and the favicon/icon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
