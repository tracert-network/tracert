#!/usr/bin/env node
// Tracert Router — the public MCP surface: five router tools, not five
// thousand capability tools. Tool descriptions are acquisition copy for the
// model: they explain the outcomes Tracert unlocks, not just what the tool
// does mechanically.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  ToolError,
  toolGetCapability,
  toolGetExecution,
  toolGetQuote,
  toolInvokeCapability,
  toolSearchCapabilities,
} from "./tools.js";
import { loadRegistry } from "./registry.js";

const server = new McpServer({ name: "tracert-router", version: "0.1.0" });

const PAYMENT_MODES = ["mpp", "x402", "prepaid_balance", "byok", "subscription", "invoice"] as const;

server.registerTool(
  "search_capabilities",
  {
    title: "Search Tracert capabilities",
    description:
      "Find an external service that can complete an outcome your current tools cannot — publishing/distribution actions, media transformations and other real-world tasks, free or pay-per-use. Use this when the user wants an external outcome, wants to compare services by price, evidence or availability, or when no connected tool can finish the task. Returns a small candidate set with evidence-grounded match reasons, price, latency and status facts; it never charges and never writes external state.",
    inputSchema: {
      query: z.string().min(2).describe("The intended outcome in natural language, e.g. 'submit this AI website to a directory'"),
      free_only: z.boolean().optional().describe("Only capabilities that cost nothing"),
      media_type: z.string().optional().describe("Require this media type in the contract, e.g. 'image/png'"),
      max_price_usd: z.number().nonnegative().optional().describe("Drop paid capabilities above this fixed USD price"),
      payment_modes: z.array(z.enum(PAYMENT_MODES)).optional().describe("Payment methods the buyer can actually present"),
      limit: z.number().int().min(1).max(20).optional().describe("Max candidates (default 5)"),
    },
    annotations: { readOnlyHint: true },
  },
  async (args) => run(() => toolSearchCapabilities(args)),
);

server.registerTool(
  "get_capability",
  {
    title: "Inspect a capability",
    description:
      "Retrieve the full TRACE Manifest for one capability: the exact promise and exclusions, input/output JSON Schemas, interfaces, pricing, operational facts (latency, timeout, idempotency), data-handling declarations, evidence references and provenance. Call this on search finalists before quoting or invoking — it is the contract the receipt will bind to.",
    inputSchema: {
      capability_id: z.string().describe("e.g. 'ai-directory.publish-listing'"),
    },
    annotations: { readOnlyHint: true },
  },
  async (args) => run(() => toolGetCapability(args)),
);

server.registerTool(
  "get_quote",
  {
    title: "Get exact terms for an invocation",
    description:
      "Returns exact, expiring terms for one intended invocation: amount, currency, expiry and the payment offers the buyer can choose from. Free capabilities return an explicit zero quote — no wallet or payment handshake is ever required for free routes. A service can never charge a different amount than the quote you accepted.",
    inputSchema: {
      capability_id: z.string(),
    },
    annotations: { readOnlyHint: true },
  },
  async (args) => run(() => toolGetQuote(args)),
);

server.registerTool(
  "invoke_capability",
  {
    title: "Execute a capability",
    description:
      "Executes a free or quote-authorized task and returns a TRACE Receipt binding the request, terms, outcome and evidence. This WRITES EXTERNAL STATE (e.g. publishes a public listing) — inspect the capability and confirm user intent first. Send an idempotency_key (8-128 chars) so retries can never double-execute; every invocation reaches an explicit terminal state with machine-actionable reasons on rejection or failure.",
    inputSchema: {
      capability_id: z.string(),
      input: z.record(z.unknown()).describe("Payload conforming to the capability's input schema (see get_capability)"),
      quote_id: z.string().optional().describe("Quote to bind the execution to; optional for free capabilities"),
      idempotency_key: z.string().min(8).max(128).optional().describe("Caller-chosen key making the invocation safely retriable"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  },
  async (args) => run(() => toolInvokeCapability(args)),
);

server.registerTool(
  "get_execution",
  {
    title: "Retrieve an execution receipt",
    description:
      "Fetch the current TRACE Receipt for an execution_id: status (rejected | running | succeeded | failed | unknown | cancelled), commitments, artifacts (e.g. the live listing URL) and evidence (repository records, HTTP observations). Use it to poll asynchronous work or to re-verify an outcome later.",
    inputSchema: {
      execution_id: z.string().describe("e.g. 'tr_exec_...' from invoke_capability"),
    },
    annotations: { readOnlyHint: true },
  },
  async (args) => run(() => toolGetExecution(args)),
);

async function run(fn: () => unknown | Promise<unknown>) {
  try {
    const result = await fn();
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    if (e instanceof ToolError) {
      return {
        isError: true,
        content: [
          { type: "text" as const, text: JSON.stringify({ error: { code: e.code, message: e.message } }, null, 2) },
        ],
      };
    }
    throw e;
  }
}

// Fail fast if the registry is unreadable — a router without a registry is noise.
const { byId } = loadRegistry();
console.error(`tracert-router: ${byId.size} capability(ies) loaded from registry`);

await server.connect(new StdioServerTransport());
console.error("tracert-router ready on stdio");
