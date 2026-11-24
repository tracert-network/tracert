// Usage analytics → Google Analytics 4 (property "tracert.site", account "Tracert").
//
// Two paths:
//  - Browser: a first-party page ping (app/page-beacon.tsx → /api/pv), sent on
//    through the same server path, so browsers get no cookies and no third-party
//    script. Its event is js_page_view (production only).
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
//
// Zero data retention: a caller that sends `x-tracert-zdr: 1` is still counted,
// but sendServerEvents keeps nothing the call contained (no query, path, route,
// capability, note or user agent) and gives it a random, single-use client id.
// See ZDR_KEEP below for the full list of what survives.
import { createHash, randomBytes } from "node:crypto";

export const GA_MEASUREMENT_ID = "G-PFBBZD6EWC";
// GA4_MP_ENDPOINT overrides the collector for local testing (or GA's /debug/mp/collect validator).
const MP_ENDPOINT = process.env.GA4_MP_ENDPOINT || "https://www.google-analytics.com/mp/collect";

type Params = Record<string, string | number | undefined>;

/** Who is calling, for analytics. host + internal come from request headers. */
export interface Caller {
  ip: string;
  ua: string;
  /** Request host; events are only sent for the canonical site (not *.vercel.app deploy URLs). */
  host?: string;
  /** Our own traffic: UA tracert-internal/-verify/-e2e or header x-tracert-internal: 1. */
  internal?: boolean;
  /**
   * Whether the request carried a header every real browser sends (Sec-Fetch-*
   * or Accept-Language). False on a browser user agent means a script wearing
   * one. Undefined when the headers were not available.
   */
  browserHeaders?: boolean;
  /**
   * The client's TLS fingerprint (JA4) from Vercel's x-vercel-ja4-digest
   * header. It says which TLS library made the connection, which a script
   * can't change by editing its user agent. Used only to classify; never sent
   * to GA. Undefined off Vercel.
   */
  ja4?: string;
  /**
   * The caller asked for zero data retention (header `x-tracert-zdr: 1`). The
   * call is counted, but none of its content is kept: see zdrEvent.
   */
  zdr?: boolean;
}

/** Request header a caller sends to ask for zero data retention; echoed as `applied` on the response. */
export const ZDR_HEADER = "x-tracert-zdr";

const CANONICAL_HOSTS = new Set(["tracert.site", "www.tracert.site"]);
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

/** A browser that will (probably) run the page ping itself — don't double count it server-side. */
export function isLikelyBrowser(ua: string): boolean {
  return agentFamily(ua) === "browser";
}

// The specific agent behind a request, finer than agentFamily: it separates a
// vendor's training crawler (GPTBot) from its search indexer (OAI-SearchBot)
// and from a fetch a person triggered in a chat (ChatGPT-User). Known names
// first, then the "compatible; Name/x" token, then the leading product token.
const NAMED_AGENTS: [RegExp, string][] = [
  [/ChatGPT-User/i, "ChatGPT-User"],
  [/ChatGPT[- ]Agent/i, "ChatGPT-Agent"],
  [/OAI-SearchBot/i, "OAI-SearchBot"],
  [/GPTBot/i, "GPTBot"],
  [/Claude-User/i, "Claude-User"],
  [/Claude-SearchBot/i, "Claude-SearchBot"],
  [/ClaudeBot/i, "ClaudeBot"],
  [/Claude-Web/i, "Claude-Web"],
  [/anthropic-ai/i, "anthropic-ai"],
  [/Perplexity-User/i, "Perplexity-User"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/MistralAI-User/i, "MistralAI-User"],
  [/DuckAssistBot/i, "DuckAssistBot"],
  [/Google-CloudVertexBot/i, "Google-CloudVertexBot"],
  [/GoogleOther/i, "GoogleOther"],
  [/Googlebot/i, "Googlebot"],
  [/bingbot/i, "bingbot"],
  [/Applebot/i, "Applebot"],
  [/Bytespider/i, "Bytespider"],
  [/Amazonbot/i, "Amazonbot"],
  [/CCBot/i, "CCBot"],
  [/meta-externalfetcher/i, "meta-externalfetcher"],
  [/meta-externalagent/i, "meta-externalagent"],
  [/tracert-(internal|verify|e2e)[\w-]*/i, "tracert-internal"],
];

export function agentName(ua: string): string {
  if (!ua) return "unknown";
  for (const [re, name] of NAMED_AGENTS) if (re.test(ua)) return name;
  const compatible = ua.match(/compatible;\s*([A-Za-z][\w.-]{1,39})/i);
  if (compatible) return compatible[1];
  const lead = ua.match(/^([A-Za-z][\w.-]{0,39})\//);
  if (lead && lead[1].toLowerCase() !== "mozilla") return lead[1];
  return agentFamily(ua) === "browser" ? "browser" : ua.slice(0, 40);
}

// Fetched because a person asked an assistant something (the most valuable
// signal): the assistant came to read this page for its user.
const AI_ASSISTANT_UA = /ChatGPT-User|ChatGPT[- ]Agent|Claude-User|Perplexity-User|MistralAI-User|DuckAssistBot|meta-externalfetcher/i;
// Indexers and training crawlers: they build a vendor's index, nobody is waiting.
const CRAWLER_UA =
  /GPTBot|OAI-SearchBot|ClaudeBot|Claude-SearchBot|Claude-Web|anthropic-ai|PerplexityBot|Googlebot|GoogleOther|Google-CloudVertexBot|bingbot|Applebot|Bytespider|Amazonbot|CCBot|meta-externalagent|facebookexternalhit|bot\b|bot\/|crawl|spider|slurp/i;
const INTERNAL_UA = /tracert-(internal|verify|e2e)/i;

// MCP clientInfo names. Catalogs, registries and uptime/health checkers connect,
// list tools and leave; real clients are hosts a person or an agent runtime uses.
// The lists grow from what GA shows: every name here was seen probing the site.
const PROBE_STRONG =
  /probe|prober|health|check|scan|verif|conformance|sonda|audit|census|survey|snapshot|grad(er|ing)|measur|observatory|uptime|mcp-?mon\b/i;
const REAL_MCP_CLIENT =
  /claude|cursor|vscode|visual studio|windsurf|codeium|cline|roo-?code|continue|zed|goose|chatgpt|openai|gemini|copilot|mcp-remote|inspector|raycast|librechat|n8n|langchain|langgraph|llamaindex|mastra|ai-sdk|cherry|5ire|witsy|msty|lm ?studio|warp|kiro|opencode|codex|runtime|agent-sdk|smolagents|crewai|autogen|pydantic/i;
// The last alternative is a client named after a website ("mcpwell.com",
// "agent-tools.cloud"): that is the site's crawler, not an app someone uses.
const PROBE_WEAK =
  /index|registry|catalog|monitor|introspect|crawl|bot|beat|scout|collector|enrich|watch|inventory|harbor|test|glama|posthog|directory|lookup|vet|rank|bench|marketplace|atlas|wellknown|pulse|station|keeper|cost\b|reliab|sales|mcpyp|yellow|sniff|scrape|ingest|stats?\b|\bevals?\b|\.(com|io|ai|dev|cloud|net|org|app|sh|st|xyz)\b/i;

export function mcpClientKind(name: string): "registry_probe" | "mcp_client" {
  if (PROBE_STRONG.test(name)) return "registry_probe";
  if (REAL_MCP_CLIENT.test(name)) return "mcp_client";
  return PROBE_WEAK.test(name) ? "registry_probe" : "mcp_client";
}

// Browser user agents are the easiest thing to fake, and scanners mostly paste
// an old one. Chrome and Firefox both ship a major roughly every 31 and 29 days
// (anchors: Chrome 131 on 2024-11-12, Firefox 133 on 2024-11-26), so the
// current major can be estimated from the date without a lookup table to maintain.
const DAY_MS = 86_400_000;
const currentMajor = (anchor: number, shipped: string, daysPerMajor: number, now: number) =>
  anchor + Math.floor((now - Date.parse(shipped)) / (daysPerMajor * DAY_MS));

/**
 * A browser user agent that is probably not a person's browser: a malformed
 * UA, a release about a year or more out of date, or a request without the
 * headers every real browser sends. Evidence, not proof: old devices exist.
 */
export function browserLooksAutomated(ua: string, browserHeaders?: boolean, now = Date.now()): boolean {
  if (browserHeaders === false) return true;
  if (/^user-agent:/i.test(ua)) return true;
  const chrome = ua.match(/(?:Chrome|Chromium|CriOS)\/(\d+)/);
  if (chrome) return Number(chrome[1]) < currentMajor(131, "2024-11-12", 31, now) - 10;
  const firefox = ua.match(/(?:Firefox|FxiOS)\/(\d+)/);
  // A wider window: Firefox ESR stays on one major for about a year.
  if (firefox) return Number(firefox[1]) < currentMajor(133, "2024-11-26", 29, now) - 16;
  const ios = ua.match(/\bOS (\d+)[_ ]/);
  if (/iPhone|iPad|iPod/.test(ua) && ios) return Number(ios[1]) < 16;
  const safari = ua.match(/Version\/(\d+)/);
  if (safari) return Number(safari[1]) < 15;
  return false;
}

// JA4 = <protocol, TLS version, SNI, cipher count, extension count, ALPN>_<cipher hash>_<extension hash>.
const JA4 = /^[tqd][0-9a-z]{2}[di]\d{4}[0-9a-z]{2}_([0-9a-f]{12})_[0-9a-f]{12}$/i;
// The cipher hash of Chromium's TLS stack (BoringSSL), shared by Chrome, Edge,
// Brave, Opera, Android Chrome and WebView. Seen on real Chrome visits to
// tracert.site in November 2026 (t13d1516h2_8daaf6152771_…, t13d1517h2_8daaf6152771_…).
// If Chrome ever changes its cipher list, add the new hash here (Vercel →
// Firewall → Traffic → Top JA4 Digests shows what current Chrome sends).
const CHROMIUM_CIPHER_HASHES = new Set(["8daaf6152771"]);

/**
 * The user agent claims Chromium but the TLS handshake didn't come from
 * Chromium: a script wearing a Chrome user agent. Chromium only for now;
 * Firefox and Safari claims are left alone until there's evidence for them.
 * iOS Chrome (CriOS) uses Apple's TLS stack, so it is never checked. A missing
 * or malformed fingerprint never flags.
 */
export function tlsContradictsUa(ua: string, ja4?: string): boolean {
  if (!ja4 || !/\b(?:Chrome|Chromium)\/\d+/.test(ua)) return false;
  const m = ja4.trim().match(JA4);
  return Boolean(m && !CHROMIUM_CIPHER_HASHES.has(m[1].toLowerCase()));
}

/**
 * One label to filter on when asking "who is actually here":
 * internal | ai_assistant | registry_probe | mcp_client | crawler | browser |
 * browser_like | tool.
 * Best-effort heuristics over the UA and (for MCP) the clientInfo name.
 *  - registry_probe: a catalog, registry or health checker, by its MCP client
 *    name or, when there is none, by the product name in its user agent.
 *  - browser_like: a browser user agent that browserLooksAutomated flags, or
 *    one whose TLS fingerprint contradicts it (tlsContradictsUa). Plausible
 *    people are `browser`. Caveat: a person behind a corporate proxy that
 *    re-terminates TLS shows the proxy's fingerprint and lands here too.
 */
export function trafficClass(caller: Pick<Caller, "ua" | "internal" | "browserHeaders" | "ja4">, mcpClient?: string): string {
  const ua = caller.ua || "";
  if (caller.internal || INTERNAL_UA.test(ua) || (mcpClient && INTERNAL_UA.test(mcpClient))) return "internal";
  if (AI_ASSISTANT_UA.test(ua)) return "ai_assistant";
  if (mcpClient) {
    const kind = mcpClientKind(mcpClient);
    // A generic or unknown client name ("stork-relay", "mcp") doesn't clear a
    // caller whose user agent names a catalog ("StorkMCPDirectory/1.0").
    if (kind === "mcp_client" && !REAL_MCP_CLIENT.test(mcpClient) && probeProduct(ua)) return "registry_probe";
    return kind;
  }
  if (CRAWLER_UA.test(ua)) return "crawler";
  if (agentFamily(ua) === "browser") {
    return browserLooksAutomated(ua, caller.browserHeaders) || tlsContradictsUa(ua, caller.ja4) ? "browser_like" : "browser";
  }
  return PROBE_STRONG.test(agentName(ua)) ? "registry_probe" : "tool";
}

/** The product name at the head of a non-browser UA reads as a catalog or checker. */
function probeProduct(ua: string): boolean {
  if (!ua || agentFamily(ua) === "browser") return false;
  const name = agentName(ua);
  return PROBE_STRONG.test(name) || PROBE_WEAK.test(name);
}

// The argument each tool cannot run without (the MCP handlers reject a call
// that lacks it). A call without it is someone poking at the schema.
const REQUIRED_ARG: Record<string, string> = {
  search_capabilities: "query",
  find_routes: "query",
  get_capability: "capability_id",
  get_quote: "capability_id",
  invoke_capability: "capability_id",
  get_execution: "execution_id",
  get_route: "slug",
  report_route_outcome: "slug",
};

// Callers whose tool call could be someone getting work done. Probes, crawlers,
// our own checks and fake browsers call tools too, but only to look at them.
const REAL_CALLER_CLASSES = new Set(["ai_assistant", "mcp_client", "tool", "browser"]);
// What tool testers type into a search box.
const TEST_QUERY = /^(test(ing)?|hello( world)?|hi|foo|bar|ping|example|sample|asdf|x+)$/i;

/**
 * The north-star proxy: one `real_tool_call` event for each call that looks
 * like use rather than inspection. That means a tool that exists, called by
 * a caller that is not internal, a probe, a crawler or a fake browser, with a
 * query that is not a tester's placeholder, and with the argument the tool
 * needs (a call without it fails validation: schema poking, not use). Covers MCP tools/call and the
 * keyless HTTP equivalents (/api/routes/search, POST /api/routes/outcome).
 * Every call is still in mcp_request / agent_fetch; this event only saves the
 * reader from re-deriving the filter, so its count can be read directly.
 */
export function realToolCalls(caller: Caller, events: GaEvent[], knownTools: readonly string[]): GaEvent[] {
  const out: GaEvent[] = [];
  for (const e of events) {
    const p = e.params;
    const str = (v: string | number | undefined) => (typeof v === "string" ? v : undefined);
    let tool: string | undefined;
    let source: "mcp" | "http" | undefined;
    if (e.name === "mcp_request" && p.rpc_method === "tools/call") {
      tool = str(p.tool);
      source = "mcp";
    } else if (e.name === "agent_fetch" && p.endpoint_type === "routes_search" && (p.method === "GET" || p.method === "POST")) {
      tool = (str(p.query) ?? "").length >= 2 ? "find_routes" : undefined;
      source = "http";
    } else if (e.name === "agent_fetch" && p.endpoint_type === "route_outcome_api" && p.method === "POST") {
      tool = "report_route_outcome";
      source = "http";
    }
    if (!tool || !source || !knownTools.includes(tool)) continue;
    if (p.missing_arg) continue;
    const mcpClient = str(p.mcp_client);
    if (!REAL_CALLER_CLASSES.has(trafficClass(caller, mcpClient))) continue;
    const query = str(p.query);
    if (query !== undefined && TEST_QUERY.test(query.trim())) continue;
    out.push({
      name: "real_tool_call",
      params: {
        tool,
        source,
        mcp_client: mcpClient,
        query,
        capability_id: p.capability_id,
        route_slug: p.route_slug,
        outcome: p.outcome,
      },
    });
  }
  return out;
}

// The hosted MCP endpoint is stateless, so only `initialize` carries clientInfo.
// Remember the name per caller (IP + UA) for an hour in this warm instance, so
// later tools/list and tools/call events can be attributed. Best-effort only:
// another instance won't know it. In memory only; nothing raw is sent anywhere.
const MCP_CLIENT_TTL_MS = 60 * 60 * 1000;
const mcpClients = new Map<string, { name: string; at: number }>();
const callerKey = (c: Caller) => createHash("sha256").update(`${c.ip}|${c.ua}`).digest("base64url").slice(0, 22);

export function rememberMcpClient(caller: Caller, name: string): void {
  if (mcpClients.size > 5000) mcpClients.clear();
  mcpClients.set(callerKey(caller), { name, at: Date.now() });
}

export function recallMcpClient(caller: Caller): string | undefined {
  const hit = mcpClients.get(callerKey(caller));
  if (!hit) return undefined;
  if (Date.now() - hit.at > MCP_CLIENT_TTL_MS) {
    mcpClients.delete(callerKey(caller));
    return undefined;
  }
  return hit.name;
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

/** A random client/session id for a zero-retention call: links to nothing, not even the caller's other calls. */
function singleUse(): { clientId: string; sessionId: string } {
  const r = randomBytes(12);
  return { clientId: `${r.readUInt32BE(0)}.${r.readUInt32BE(4)}`, sessionId: String(r.readUInt32BE(8)) };
}

// What a zero-retention call keeps: that it happened, which endpoint or tool,
// and what kind of software called (class and product name, not the full user
// agent). Nothing the caller asked or read: no query, region, path, route,
// capability or note. The name of a missing argument is kept (never its value).
const ZDR_KEEP = new Set(["endpoint_type", "method", "rpc_method", "tool", "source", "missing_arg", "mcp_client", "mcp_client_version"]);
// An outcome report is something the caller chose to send us for keeping, so
// its route and verdict stay; its free-text note does not.
const ZDR_KEEP_OUTCOME = new Set(["route_slug", "outcome", "steps_taken"]);

/** The event a zero-retention call is recorded as. */
export function zdrEvent(e: GaEvent): GaEvent {
  const isOutcome = e.name === "route_outcome" || (e.name === "real_tool_call" && e.params.tool === "report_route_outcome");
  const params: Params = {};
  for (const [k, v] of Object.entries(e.params)) {
    if (ZDR_KEEP.has(k) || (isOutcome && ZDR_KEEP_OUTCOME.has(k))) params[k] = v;
  }
  return { name: e.name, params };
}

/** The Measurement Protocol body for a caller's events (exported for tests). */
export function serverEventBody(req: Caller, events: GaEvent[]) {
  const { clientId, sessionId } = req.zdr ? singleUse() : daily(req.ip, req.ua);
  const family = agentFamily(req.ua);
  return {
    client_id: clientId,
    non_personalized_ads: true,
    user_properties: { visitor_type: { value: trafficClass(req) === "browser" ? "human_browser" : "agent_or_tool" } },
    events: events.slice(0, 25).map((raw) => {
      const e = req.zdr ? zdrEvent(raw) : raw;
      const mcpClient = typeof raw.params.mcp_client === "string" ? raw.params.mcp_client : undefined;
      const params: Params = {
        session_id: sessionId,
        engagement_time_msec: 1,
        agent_family: family,
        agent_name: clip(agentName(req.ua), 40),
        traffic_class: trafficClass(req, mcpClient),
        user_agent: req.zdr ? undefined : clip(req.ua),
        zdr: req.zdr ? 1 : undefined,
      };
      for (const [k, v] of Object.entries(e.params)) {
        if (v !== undefined && v !== "") params[k] = typeof v === "string" ? clip(v) : v;
      }
      for (const k of Object.keys(params)) if (params[k] === undefined) delete params[k];
      return { name: e.name, params };
    }),
  };
}

/** Send events via the GA4 Measurement Protocol. Never throws; never blocks longer than ~2s. */
export async function sendServerEvents(req: Caller, events: GaEvent[]): Promise<void> {
  if (!serverAnalyticsEnabled() || events.length === 0) return;
  // Deploy URLs (tracert-<hash>-robinblocks.vercel.app) are our own checks, not visitors.
  if (req.host && !CANONICAL_HOSTS.has(req.host)) return;
  const body = serverEventBody(req, events);
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
export function callerFromHeaders(h: { get(name: string): string | null }): Caller {
  const ip = (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "").trim();
  const host = (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim().replace(/:\d+$/, "").toLowerCase();
  return {
    ip,
    ua: h.get("user-agent") || "",
    host: host || undefined,
    internal: h.get("x-tracert-internal") === "1" || undefined,
    browserHeaders: Boolean(h.get("sec-fetch-mode") || h.get("sec-fetch-dest") || h.get("accept-language")),
    ja4: h.get("x-vercel-ja4-digest") || undefined,
    zdr: (h.get(ZDR_HEADER) ?? "").trim() === "1" || undefined,
  };
}

/**
 * A real top-level page load by a browser-like client — not a Next.js
 * prefetch or client-side RSC navigation. Counted server-side as page_request
 * so visitors who block the page ping (or headless browsers) still show up; it is a
 * separate event from the ping's js_page_view, so nothing is double counted.
 */
export function isDocumentLoad(req: { method: string; headers: { get(name: string): string | null } }): boolean {
  const h = req.headers;
  if (req.method !== "GET") return false;
  if (h.get("rsc") || h.get("next-router-prefetch") || h.get("next-router-state-tree")) return false;
  if (/prefetch|prerender/i.test(`${h.get("purpose") ?? ""} ${h.get("sec-purpose") ?? ""}`)) return false;
  const dest = h.get("sec-fetch-dest");
  if (dest) return dest === "document";
  return (h.get("accept") ?? "").includes("text/html");
}

/**
 * The page path a /api/pv ping reports, or undefined unless it is a plain
 * same-site path. Only the path is kept; anything else in the body is ignored.
 */
export function beaconPath(body: string): string | undefined {
  let path: unknown;
  try {
    path = (JSON.parse(body) as { path?: unknown } | null)?.path;
  } catch {
    return undefined;
  }
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//") || path.length > 200) return undefined;
  if (/[\s<>"'`\\]/.test(path)) return undefined;
  return path;
}

/** Which kind of machine endpoint a path is, or undefined for ordinary pages. */
export function endpointType(path: string): string | undefined {
  if (path === "/llms.txt") return "llms_txt";
  if (path === "/llms-full.txt") return "llms_full_txt";
  if (path === "/openapi.json") return "openapi";
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
      // Only the name of a missing required argument is recorded, never its value.
      const need = ev.params.tool ? REQUIRED_ARG[ev.params.tool as string] : undefined;
      const val = need ? args[need] : undefined;
      if (need && !(typeof val === "string" && val.trim().length > 0)) ev.params.missing_arg = need;
    }
    out.push(ev);
  }
  return out;
}
