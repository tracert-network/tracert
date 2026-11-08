// Usage analytics → Google Analytics 4 (property "tracert.site", account "Tracert").
//
// Two paths:
//  - Browser: the gtag.js tag in app/layout.tsx (humans; production only).
//  - Server: GA4 Measurement Protocol, from src/proxy.ts and the MCP route. Most
//    of Tracert's real traffic is agents fetching /llms.txt, /index.json,
//    manifests and /api/mcp — none of which run JavaScript, so a browser tag
//    alone would show almost nothing. Server events cover them.
//
// Server events no-op unless GA4_API_SECRET is set (Vercel env, Production) and
// VERCEL_ENV === "production", so previews and local dev never send data.
// No raw IP is ever sent: client_id is a salted daily hash of IP + user agent
// (salt includes the secret, rotates daily), so visitors can't be re-identified
// from GA and can't be linked across days.
import { createHash } from "node:crypto";

export const GA_MEASUREMENT_ID = "G-PFBBZD6EWC";
// GA4_MP_ENDPOINT overrides the collector for local testing (or GA's /debug/mp/collect validator).
const MP_ENDPOINT = process.env.GA4_MP_ENDPOINT || "https://www.google-analytics.com/mp/collect";

type Params = Record<string, string | number | undefined>;
export interface GaEvent {
  name: string;
  params: Params;
}

export function serverAnalyticsEnabled(): boolean {
  return Boolean(process.env.GA4_API_SECRET) && process.env.VERCEL_ENV === "production";
}

// Family of the caller, from its user agent. Coarse on purpose: it answers
// "which agents/vendors use Tracert", not "who is this".
const FAMILIES: [RegExp, string][] = [
  [/claude|anthropic/i, "anthropic"],
  [/chatgpt|gptbot|oai-searchbot|openai/i, "openai"],
  [/perplexity/i, "perplexity"],
  [/google-extended|googleother|googlebot|google-cloudvertexbot|google-inspectiontool|gemini/i, "google"],
  [/bingbot|bingpreview|msnbot/i, "microsoft"],
  [/applebot/i, "apple"],
  [/meta-external|facebookexternalhit|facebookbot/i, "meta"],
  [/bytespider|tiktok/i, "bytedance"],
  [/amazonbot/i, "amazon"],
  [/ccbot/i, "commoncrawl"],
  [/duckassist|duckduckbot/i, "duckduckgo"],
  [/mistral/i, "mistral"],
  [/cohere/i, "cohere"],
  [/youbot/i, "you"],
  [/\bmcp\b|mcp-/i, "mcp-client"],
  [/^curl|wget|httpie/i, "cli"],
  [/python|httpx|aiohttp|requests\/|node|undici|axios|got\/|go-http|java\/|okhttp|ruby|php|reqwest|deno|bun\//i, "script"],
  [/bot|crawl|spider|slurp|fetch|preview|scan|monitor/i, "other-bot"],
];

export function agentFamily(ua: string): string {
  if (!ua) return "unknown";
  for (const [re, name] of FAMILIES) if (re.test(ua)) return name;
  return /mozilla\/.*(chrome|safari|firefox|edg)/i.test(ua) ? "browser" : "other";
}

/** A browser that will (probably) run gtag.js itself — don't double count it server-side. */
export function isLikelyBrowser(ua: string): boolean {
  return agentFamily(ua) === "browser";
}

function daily(ip: string, ua: string): { clientId: string; sessionId: string } {
  const day = new Date().toISOString().slice(0, 10);
  const salt = createHash("sha256").update(`${process.env.GA4_API_SECRET ?? ""}:${day}`).digest("hex");
  const h = createHash("sha256").update(`${salt}:${ip}:${ua}`).digest();
  const a = h.readUInt32BE(0);
  const b = h.readUInt32BE(4);
  return { clientId: `${a}.${b}`, sessionId: String(h.readUInt32BE(8)) };
}

const clip = (v: string | undefined, n = 100) => (v === undefined ? undefined : v.slice(0, n));

/** Send events via the GA4 Measurement Protocol. Never throws; never blocks longer than ~2s. */
export async function sendServerEvents(
  req: { ip: string; ua: string },
  events: GaEvent[],
): Promise<void> {
  if (!serverAnalyticsEnabled() || events.length === 0) return;
  const { clientId, sessionId } = daily(req.ip, req.ua);
  const family = agentFamily(req.ua);
  const body = {
    client_id: clientId,
    non_personalized_ads: true,
    user_properties: { visitor_type: { value: family === "browser" ? "human_browser" : "agent_or_tool" } },
    events: events.slice(0, 25).map((e) => {
      const params: Params = { session_id: sessionId, engagement_time_msec: 1, agent_family: family, user_agent: clip(req.ua) };
      for (const [k, v] of Object.entries(e.params)) {
        if (v !== undefined && v !== "") params[k] = typeof v === "string" ? clip(v) : v;
      }
      return { name: e.name, params };
    }),
  };
  const url = `${MP_ENDPOINT}?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${encodeURIComponent(process.env.GA4_API_SECRET ?? "")}`;
  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // analytics must never affect serving
  }
}

/** Caller identity for analytics, from request headers (Vercel sets x-forwarded-for / x-real-ip). */
export function callerFromHeaders(h: { get(name: string): string | null }): { ip: string; ua: string } {
  const ip = (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "").trim();
  return { ip, ua: h.get("user-agent") || "" };
}

/** Which kind of machine endpoint a path is, or undefined for ordinary pages. */
export function endpointType(path: string): string | undefined {
  if (path === "/llms.txt") return "llms_txt";
  if (path === "/index.json") return "index_json";
  if (path === "/robots.txt") return "robots_txt";
  if (path === "/sitemap.xml") return "sitemap";
  if (path.startsWith("/schemas/")) return "schema";
  if (/^\/capabilities\/[^/]+\/manifest\.json$/.test(path)) return "manifest_json";
  if (path.startsWith("/.well-known/")) return "well_known";
  if (path.startsWith("/api/registry/submit")) return "submit_api";
  if (path.startsWith("/api/mcp")) return "mcp";
  if (path === "/routes.json") return "routes_json";
  if (path === "/routes/feed.xml") return "routes_feed";
  if (/^\/routes\/[^/]+\/route\.md$/.test(path)) return "route_md";
  if (path.startsWith("/api/routes/search")) return "routes_search";
  if (path.startsWith("/api/routes/outcome")) return "route_outcome_api";
  if (path.startsWith("/skills/")) return "skill_md";
  return undefined;
}

/** Summarise MCP JSON-RPC message(s) into analytics events. Never sends tool inputs beyond the search query + capability id. */
export function mcpEvents(payload: unknown): GaEvent[] {
  const msgs = Array.isArray(payload) ? payload : [payload];
  const out: GaEvent[] = [];
  for (const m of msgs) {
    if (!m || typeof m !== "object") continue;
    const msg = m as { method?: string; params?: Record<string, unknown> };
    if (!msg.method || msg.method.startsWith("notifications/")) continue;
    const params = msg.params ?? {};
    const ev: GaEvent = { name: "mcp_request", params: { rpc_method: msg.method } };
    if (msg.method === "initialize") {
      const info = (params.clientInfo ?? {}) as { name?: string; version?: string };
      ev.params.mcp_client = info.name;
      ev.params.mcp_client_version = info.version;
    }
    if (msg.method === "tools/call") {
      const args = (params.arguments ?? {}) as Record<string, unknown>;
      ev.params.tool = typeof params.name === "string" ? params.name : undefined;
      ev.params.capability_id = typeof args.capability_id === "string" ? args.capability_id : undefined;
      ev.params.query = typeof args.query === "string" ? args.query : undefined;
      ev.params.route_slug = typeof args.slug === "string" ? args.slug : undefined;
      ev.params.outcome = typeof args.outcome === "string" ? args.outcome : undefined;
    }
    out.push(ev);
  }
  return out;
}
