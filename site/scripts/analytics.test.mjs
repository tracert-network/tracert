// Classifier tests for src/lib/analytics.ts. The names and user agents are
// ones the site has really received: the heuristics exist to sort that traffic,
// so the cases are the evidence. Run: npm test (Node strips the TS types).
import assert from "node:assert/strict";
import { test } from "node:test";
import { browserLooksAutomated, mcpClientKind, realToolCalls, trafficClass } from "../src/lib/analytics.ts";

const TOOLS = ["search_capabilities", "get_capability", "get_quote", "invoke_capability", "get_execution", "find_routes", "get_route", "report_route_outcome"];
const NOV_2026 = Date.parse("2026-11-09");
const CHROME = (major) => `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36`;
const FIREFOX = (major) => `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${major}.0) Gecko/20100101 Firefox/${major}.0`;

test("catalogs, monitors and site crawlers are registry probes", () => {
  const probes = [
    "posthog-mcp-registry-probe", "glama", "mcpbeat", "alalanet-prober", "agentrank-probe",
    // Missed before 2026-11-10, when they were counted as real clients:
    "mcpcost", "mcpmon", "mcp-observatory", "agentrecord-census", "agent-almanac-snapshot", "warden-survey",
    "mcpqueen-grader", "mcp-discovery-measurement", "mcp-ad-measurement", "mcphub-snapshot", "EndpointAudit",
    "reliability-bureau-spike", "mcpyp-incremental", "agent-tools.cloud", "mcpwell.com", "sarnai-sales",
    // A probe word outranks a real-client word ("runtime"):
    "mcp-runtime-engine-auth-probe", "eda-claw-runtime-probe",
  ];
  for (const name of probes) assert.equal(mcpClientKind(name), "registry_probe", name);
});

test("apps, runtimes and generic SDK names stay MCP clients", () => {
  const clients = [
    "claude-ai", "Cursor", "claude.ai", "coda-agent-runtime", "rmcp", "mcp-client", "McpClient", "otter", "quire",
    "github-mcp-client", "retrieval-agent",
  ];
  for (const name of clients) assert.equal(mcpClientKind(name), "mcp_client", name);
});

test("traffic class by user agent", () => {
  const cls = (ua, extra = {}) => trafficClass({ ua, ...extra });
  assert.equal(cls("tracert-internal/1.0"), "internal");
  assert.equal(cls("curl/8.7.1", { internal: true }), "internal");
  assert.equal(cls("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot"), "ai_assistant");
  assert.equal(cls("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.4; +https://openai.com/gptbot)"), "crawler");
  assert.equal(cls("python-requests/2.33.0"), "tool");
  assert.equal(cls("curl/8.7.1"), "tool");
  // Self-declared probes used to be lumped in with scripts as "tool".
  assert.equal(cls("AgentRankProbe/0.1 (+https://example.test/developers)"), "registry_probe");
  assert.equal(cls("agent-evidence-scanner/1.0"), "registry_probe");
  assert.equal(cls("FACTANKER-robots-observatory/1.0"), "registry_probe");
  // An MCP client name, when known, decides.
  assert.equal(trafficClass({ ua: "python-requests/2.33.0" }, "glama"), "registry_probe");
  assert.equal(trafficClass({ ua: "node" }, "claude-ai"), "mcp_client");
});

test("browser user agents: stale, malformed or header-less ones are browser_like", () => {
  const automated = (ua, headers = true) => browserLooksAutomated(ua, headers, NOV_2026);
  // Current releases with browser headers are plausible people.
  assert.equal(automated(CHROME(155)), false);
  assert.equal(automated(CHROME(145)), false);
  assert.equal(automated(FIREFOX(156)), false);
  assert.equal(automated("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15"), false);
  assert.equal(automated("Mozilla/5.0 (iPhone; CPU iPhone OS 27_2_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/155.0.0.0 Mobile/15E148 Safari/604.1"), false);
  // No Sec-Fetch-* and no Accept-Language: a script wearing a browser UA.
  assert.equal(automated(CHROME(155), false), true);
  // Seen on tracert.site, none of them a person:
  assert.equal(automated(CHROME(138)), true);
  assert.equal(automated(CHROME(99)), true);
  assert.equal(automated(FIREFOX(123)), true);
  assert.equal(automated("Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"), true);
  assert.equal(automated("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5"), true);
  assert.equal(automated("User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"), true);
  // Unknown headers (a caller built without them) never flag on their own.
  assert.equal(browserLooksAutomated(CHROME(155), undefined, NOV_2026), false);
  // The estimate moves with the date: today's Chrome is stale two years on.
  assert.equal(browserLooksAutomated(CHROME(155), true, Date.parse("2028-11-09")), true);

  assert.equal(trafficClass({ ua: CHROME(47), browserHeaders: true }), "browser_like");
  assert.equal(trafficClass({ ua: CHROME(9999), browserHeaders: true }), "browser");
  assert.equal(trafficClass({ ua: CHROME(9999), browserHeaders: false }), "browser_like");
});

test("real_tool_call: use, not inspection", () => {
  const call = (params) => ({ name: "mcp_request", params: { rpc_method: "tools/call", ...params } });
  const real = (caller, events) => realToolCalls(caller, events, TOOLS);
  const script = { ip: "203.0.113.7", ua: "python-requests/2.33.0" };

  // A script or a known client calling a real tool with a real query counts.
  const hit = real(script, [call({ tool: "find_routes", query: "uk laser cutting quote" })]);
  assert.equal(hit.length, 1);
  assert.deepEqual(
    { name: hit[0].name, tool: hit[0].params.tool, source: hit[0].params.source, query: hit[0].params.query },
    { name: "real_tool_call", tool: "find_routes", source: "mcp", query: "uk laser cutting quote" },
  );
  assert.equal(real(script, [call({ tool: "get_capability", mcp_client: "claude-ai", capability_id: "qr-server.create-qr-code" })]).length, 1);

  // What the first three days actually contained: none of it counts.
  assert.equal(real(script, [call({ tool: "__mcp_index_nonexistent__", mcp_client: "mcp-index" })]).length, 0);
  assert.equal(real(script, [call({ tool: "get_route", mcp_client: "BrickBlueBot", route_slug: "uk-laser-cutting-quotes" })]).length, 0);
  assert.equal(real(script, [call({ tool: "search_capabilities", mcp_client: "mcpyp-incremental", query: "exchange rates" })]).length, 0);
  assert.equal(real(script, [call({ tool: "find_routes", query: "hello world" })]).length, 0);
  assert.equal(real(script, [call({ tool: "find_routes", query: " test " })]).length, 0);
  assert.equal(real({ ...script, internal: true }, [call({ tool: "find_routes", query: "uk laser cutting quote" })]).length, 0);
  assert.equal(real(script, [call({ tool: "find_routes", mcp_client: "tracert-verify", query: "uk laser cutting quote" })]).length, 0);
  // Listing tools is not a call.
  assert.equal(real(script, [{ name: "mcp_request", params: { rpc_method: "tools/list" } }]).length, 0);

  // The keyless HTTP equivalents.
  const fetch = (params) => ({ name: "agent_fetch", params });
  const search = fetch({ endpoint_type: "routes_search", path: "/api/routes/search", method: "GET", query: "llm api free tiers" });
  const http = real({ ip: "203.0.113.7", ua: "curl/8.7.1" }, [search]);
  assert.equal(http.length, 1);
  assert.deepEqual([http[0].params.tool, http[0].params.source, http[0].params.query], ["find_routes", "http", "llm api free tiers"]);
  assert.equal(real({ ip: "", ua: "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)" }, [search]).length, 0);
  assert.equal(real(script, [fetch({ endpoint_type: "routes_search", path: "/api/routes/search", method: "GET" })]).length, 0);
  assert.equal(real(script, [fetch({ endpoint_type: "route_outcome_api", path: "/api/routes/outcome", method: "POST" })]).length, 1);
  assert.equal(real(script, [fetch({ endpoint_type: "route_outcome_api", path: "/api/routes/outcome", method: "GET" })]).length, 0);
  assert.equal(real(script, [fetch({ endpoint_type: "llms_txt", path: "/llms.txt", method: "GET" })]).length, 0);
});
