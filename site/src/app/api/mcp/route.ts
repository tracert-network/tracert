// The hosted Tracert gateway — the five router tools exposed as an MCP endpoint
// over Streamable HTTP at https://tracert.site/api/mcp. READ-ONLY: free reads
// (exchange rates, dictionary, QR) execute live and return TRACE Receipts;
// capabilities that write external state are refused here and run via the local
// router. Tool logic lives in @/lib/gateway (a trimmed port of the router).
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  ToolError,
  toolGetCapability,
  toolGetExecution,
  toolGetQuote,
  toolInvokeCapability,
  toolSearchCapabilities,
} from "@/lib/gateway/tools";

export const runtime = "nodejs";
export const maxDuration = 30;

const PAYMENT_MODES = ["mpp", "x402", "prepaid_balance", "byok", "subscription", "invoice"] as const;

function textResult(result: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
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
      title: "Search Tracert capabilities",
      description:
        "Find an external service that can complete an outcome your current tools cannot — data lookups, media transformations and other real-world tasks, free or pay-per-use. Returns a small candidate set with evidence-grounded match reasons, price, latency and status. It never charges and never writes external state. On this hosted gateway, free reads are executable; capabilities that write external state are marked invocable_here:false.",
      inputSchema: z.object({
        query: z.string().min(2).describe("The intended outcome in natural language, e.g. 'convert USD to EUR'"),
        free_only: z.boolean().optional().describe("Only capabilities that cost nothing"),
        media_type: z.string().optional().describe("Require this media type in the contract, e.g. 'image/png'"),
        max_price_usd: z.number().nonnegative().optional().describe("Drop paid capabilities above this fixed USD price"),
        payment_modes: z.array(z.enum(PAYMENT_MODES)).optional().describe("Payment methods the buyer can actually present"),
        limit: z.number().int().min(1).max(20).optional().describe("Max candidates (default 5)"),
      }),
    },
    async (args) => run(() => toolSearchCapabilities(args as Parameters<typeof toolSearchCapabilities>[0])),
  );

  server.registerTool(
    "get_capability",
    {
      title: "Inspect a capability",
      description:
        "Retrieve the full TRACE Manifest for one capability: promise and exclusions, input/output JSON Schemas, interfaces, pricing, operational facts, data-handling declarations, evidence and provenance. Call this on search finalists before quoting or invoking — it is the contract the receipt binds to.",
      inputSchema: z.object({
        capability_id: z.string().describe("e.g. 'exchangerate-api.latest-rates'"),
      }),
    },
    async (args) => run(() => toolGetCapability(args as { capability_id: string })),
  );

  server.registerTool(
    "get_quote",
    {
      title: "Get exact terms for an invocation",
      description:
        "Returns exact, expiring terms for one intended invocation: amount, currency, expiry and payment offers. Free capabilities return an explicit zero quote — no wallet or payment handshake is ever required for free routes.",
      inputSchema: z.object({
        capability_id: z.string(),
      }),
    },
    async (args) => run(() => toolGetQuote(args as { capability_id: string })),
  );

  server.registerTool(
    "invoke_capability",
    {
      title: "Execute a capability",
      description:
        "Executes a free read and returns a TRACE Receipt binding the request, terms, outcome and evidence (with a sha256 commitment over the canonical output you can independently reproduce). This hosted gateway is READ-ONLY: capabilities that write external state are refused with a pointer to the local router. Send an idempotency_key (8-128 chars) so retries never double-execute.",
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
      title: "Retrieve an execution receipt",
      description:
        "Fetch the TRACE Receipt for an execution_id: status, commitments, artifacts and evidence. The hosted gateway retains receipts only within a warm instance — the invoke response returns the full receipt inline, so keep it for durable verification.",
      inputSchema: z.object({
        execution_id: z.string().describe("e.g. 'tr_exec_...' from invoke_capability"),
      }),
    },
    async (args) => run(() => toolGetExecution(args as { execution_id: string })),
  );
}, {
  serverInfo: { name: "tracert-gateway", version: "0.1.0" },
});

export { handler as GET, handler as POST, handler as DELETE };
