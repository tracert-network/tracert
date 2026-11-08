// The hosted Tracert gateway — the five router tools exposed as an MCP endpoint
// over Streamable HTTP at https://tracert.site/api/mcp. READ-ONLY: free reads
// (exchange rates, dictionary, QR) execute live and return TRACE Receipts;
// capabilities that write external state are refused here and run via the local
// router. Tool logic lives in @/lib/gateway (a trimmed port of the router).
import { AsyncLocalStorage } from "node:async_hooks";
import { after } from "next/server";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { callerFromHeaders, sendServerEvents, type Caller } from "@/lib/analytics";
import { OUTCOMES, findRoutes, getRouteFull, reportOutcome } from "@/lib/routes-api";
import {
  ToolError,
  toolGetCapability,
  toolGetExecution,
  toolGetQuote,
  toolInvokeCapability,
  toolSearchCapabilities,
} from "@/lib/gateway/tools";
import { GATEWAY_INSTRUCTIONS, GATEWAY_SERVER_INFO, TOOL_META } from "@/lib/gateway/tool-catalog";
import * as OUT from "@/lib/gateway/output-schemas";
import { routeUrls, searchRoutes } from "@/lib/routes";

export const runtime = "nodejs";
export const maxDuration = 30;

// Caller (IP + user agent) for analytics, carried into tool callbacks. Request
// counts and tool names are tracked in src/proxy.ts; here we add the one thing
// only the tool knows: a search that found nothing (demand evidence for supply).
const callerStore = new AsyncLocalStorage<Caller>();

function trackSearchGap(query: string, result: unknown) {
  const results = (result as { results?: unknown[] })?.results;
  if (!Array.isArray(results) || results.length > 0) return;
  const caller = callerStore.getStore() ?? { ip: "", ua: "" };
  const send = () => sendServerEvents(caller, [{ name: "search_gap", params: { query } }]);
  try {
    after(send);
  } catch {
    void send();
  }
}

const PAYMENT_MODES = ["mpp", "x402", "prepaid_balance", "byok", "subscription", "invoice"] as const;

// Every result goes out twice: as structuredContent (validated against the
// tool's outputSchema) and as JSON text for clients that only read content.
function textResult(result: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    structuredContent: result as Record<string, unknown>,
  };
}

// A capability search that found nothing may still be an open-web task a route
// covers ("laser cutting quote uk") — point there instead of a dead end.
function withRelatedRoutes(query: string, result: { results: unknown[] }) {
  if (result.results.length > 0) return result;
  const { hits } = searchRoutes(query, { limit: 3 });
  if (!hits.length) return result;
  return {
    ...result,
    related_routes: hits.map((h) => ({
      slug: h.route.slug,
      title: h.route.title,
      last_verified: h.route.last_verified,
      ...routeUrls(h.route.slug),
    })),
  };
}

async function run(fn: () => unknown | Promise<unknown>) {
  try {
    return textResult(await fn());
  } catch (e) {
    if (e instanceof ToolError) {
      return {
        isError: true,
        content: [{ type: "text" as const, text: JSON.stringify({ error: { code: e.code, message: e.message } }, null, 2) }],
      };
    }
    throw e;
  }
}

const handler = createMcpHandler((server) => {
  server.registerTool(
    "search_capabilities",
    {
      ...TOOL_META.search_capabilities,
      outputSchema: OUT.searchCapabilitiesOutput,
      inputSchema: z.object({
        query: z.string().min(2).describe("The intended outcome in natural language, e.g. 'convert USD to EUR'"),
        free_only: z.boolean().optional().describe("Only capabilities that cost nothing"),
        media_type: z.string().optional().describe("Require this media type in the contract, e.g. 'image/png'"),
        max_price_usd: z.number().nonnegative().optional().describe("Drop paid capabilities above this fixed USD price"),
        payment_modes: z.array(z.enum(PAYMENT_MODES)).optional().describe("Payment methods the buyer can actually present"),
        limit: z.number().int().min(1).max(20).optional().describe("Max candidates (default 5)"),
      }),
    },
    async (args) =>
      run(() => {
        const result = toolSearchCapabilities(args as Parameters<typeof toolSearchCapabilities>[0]);
        trackSearchGap((args as { query: string }).query, result);
        return withRelatedRoutes((args as { query: string }).query, result);
      }),
  );

  server.registerTool(
    "get_capability",
    {
      ...TOOL_META.get_capability,
      outputSchema: OUT.getCapabilityOutput,
      inputSchema: z.object({
        capability_id: z.string().describe("e.g. 'exchangerate-api.latest-rates'"),
      }),
    },
    async (args) => run(() => toolGetCapability(args as { capability_id: string })),
  );

  server.registerTool(
    "get_quote",
    {
      ...TOOL_META.get_quote,
      outputSchema: OUT.getQuoteOutput,
      inputSchema: z.object({
        capability_id: z.string(),
      }),
    },
    async (args) => run(() => toolGetQuote(args as { capability_id: string })),
  );

  server.registerTool(
    "invoke_capability",
    {
      ...TOOL_META.invoke_capability,
      outputSchema: OUT.invokeCapabilityOutput,
      inputSchema: z.object({
        capability_id: z.string(),
        input: z.record(z.string(), z.unknown()).describe("Payload conforming to the capability's input schema (see get_capability)"),
        quote_id: z.string().optional().describe("Quote to bind the execution to; optional for free capabilities"),
        idempotency_key: z.string().min(8).max(128).optional().describe("Caller-chosen key making the invocation safely retriable"),
      }),
    },
    async (args) => run(() => toolInvokeCapability(args as Parameters<typeof toolInvokeCapability>[0])),
  );

  server.registerTool(
    "get_execution",
    {
      ...TOOL_META.get_execution,
      outputSchema: OUT.getExecutionOutput,
      inputSchema: z.object({
        execution_id: z.string().describe("e.g. 'tr_exec_...' from invoke_capability"),
      }),
    },
    async (args) => run(() => toolGetExecution(args as { execution_id: string })),
  );

  // ---- Routes: dated field guides agents leave for the next agent (beta) ----

  server.registerTool(
    "find_routes",
    {
      ...TOOL_META.find_routes,
      outputSchema: OUT.findRoutesOutput,
      inputSchema: z.object({
        query: z.string().min(2).max(300).describe("What you are trying to do, in plain words, e.g. 'laser cutting quote uk' or 'list an mcp server in registries'"),
        region: z.string().max(6).optional().describe("ISO country code to prefer, e.g. 'GB'; global routes always included"),
        limit: z.number().int().min(1).max(10).optional().describe("Max routes (default 3)"),
      }),
    },
    async (args) => run(() => findRoutes(args as { query: string; region?: string; limit?: number }, callerStore.getStore() ?? { ip: "", ua: "" })),
  );

  server.registerTool(
    "get_route",
    {
      ...TOOL_META.get_route,
      outputSchema: OUT.getRouteOutput,
      inputSchema: z.object({ slug: z.string().max(80).describe("Route slug from find_routes, e.g. 'uk-laser-cutting-quotes'") }),
    },
    async (args) =>
      run(() => {
        const r = getRouteFull((args as { slug: string }).slug);
        if (!r) throw new ToolError("unknown_route", "no such route — use find_routes first");
        return r;
      }),
  );

  server.registerTool(
    "report_route_outcome",
    {
      ...TOOL_META.report_route_outcome,
      outputSchema: OUT.reportOutcomeOutput,
      inputSchema: z.object({
        slug: z.string().max(80),
        outcome: z.enum(OUTCOMES),
        steps_taken: z.number().int().min(0).max(10000).optional().describe("Tool calls you spent on the task"),
        note: z.string().max(100).optional().describe("What changed, e.g. 'Razorlab now stocks mirror acrylic'"),
      }),
    },
    async (args) =>
      run(() => {
        const res = reportOutcome(args as Record<string, unknown>, callerStore.getStore() ?? { ip: "", ua: "" }, "mcp");
        if (!res.ok) throw new ToolError(res.body.error.code, res.body.error.message);
        return res.body;
      }),
  );
}, {
  serverInfo: GATEWAY_SERVER_INFO,
  instructions: GATEWAY_INSTRUCTIONS,
});

function tracked(req: Request) {
  return callerStore.run(callerFromHeaders(req.headers), () => handler(req));
}

export { tracked as GET, tracked as POST, tracked as DELETE };
