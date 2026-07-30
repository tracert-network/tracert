#!/usr/bin/env node
// End-to-end smoke test: spawns the built stdio server as a real MCP client
// and exercises all five tools, asserting that every receipt the router emits
// validates against the registry's TRACE Receipt schema.
//
// Server A runs with TRACERT_DEV_FAKE_EXECUTE=1 (simulated adapter).
// Server B runs with defaults (live submission disabled) to prove the safety gate.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const routerRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryRoot = resolve(routerRoot, "..", "registry");
const tmpData = join(routerRoot, "test-tmp");
rmSync(tmpData, { recursive: true, force: true });

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats.default(ajv);
const validateReceipt = ajv.compile(
  JSON.parse(readFileSync(join(registryRoot, "schemas", "receipt.schema.json"), "utf8")),
);

let failures = 0;
let steps = 0;
function check(name, ok, detail) {
  steps++;
  if (ok) {
    console.log(`PASS ${name}`);
  } else {
    failures++;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function assertReceiptValid(name, receipt) {
  const ok = validateReceipt(receipt);
  check(`${name} receipt validates against TRACE Receipt v0.1`, ok,
    ok ? undefined : JSON.stringify(validateReceipt.errors, null, 2));
}

function cleanEnv(extra) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (v !== undefined) env[k] = v;
  delete env.TRACERT_DEV_FAKE_EXECUTE;
  delete env.TRACERT_ENABLE_LIVE_SUBMIT;
  return { ...env, TRACERT_DATA_DIR: tmpData, ...extra };
}

async function connect(extraEnv) {
  const client = new Client({ name: "tracert-smoke", version: "0.1.0" });
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [join(routerRoot, "dist", "server.js")],
      env: cleanEnv(extraEnv),
      stderr: "pipe",
    }),
  );
  return client;
}

const parse = (res) => JSON.parse(res.content[0].text);

const VALID_INPUT = {
  name: "Example AI Tool",
  url: "https://example-ai-tool.com",
  description: "Generates example outputs from example inputs with configurable style presets.",
  category: "image-generation",
  pricing: "freemium",
  badge_url: "https://example-ai-tool.com",
};

// ---------- Server A: simulated adapter ----------
const a = await connect({ TRACERT_DEV_FAKE_EXECUTE: "1" });

const tools = (await a.listTools()).tools.map((t) => t.name).sort();
check(
  "exactly the five router tools are exposed",
  JSON.stringify(tools) ===
    JSON.stringify(["get_capability", "get_execution", "get_quote", "invoke_capability", "search_capabilities"]),
  tools.join(","),
);

const search = parse(await a.callTool({
  name: "search_capabilities",
  arguments: { query: "submit this AI website to a directory that accepts programmatic submissions, do not pay anything" },
}));
check(
  "benchmark intent finds ai-directory.publish-listing",
  search.results?.[0]?.capability_id === "ai-directory.publish-listing",
  JSON.stringify(search.results?.map((r) => r.capability_id)),
);
check("search result cites match reasons", (search.results?.[0]?.match_reasons?.length ?? 0) > 0);

const gapQuery = "translate ancient sumerian tax records";
const gap = parse(await a.callTool({ name: "search_capabilities", arguments: { query: gapQuery } }));
check("unmatchable intent returns zero results with a note", gap.results.length === 0 && !!gap.note);

const capRes = parse(await a.callTool({
  name: "get_capability",
  arguments: { capability_id: "ai-directory.publish-listing" },
}));
check(
  "get_capability returns manifest + inline input schema",
  capRes.manifest?.capability?.id === "ai-directory.publish-listing" &&
    Array.isArray(capRes.input_schema?.required) &&
    capRes.input_schema.required.includes("badge_url"),
);

const unknownCap = parse(await a.callTool({ name: "get_capability", arguments: { capability_id: "nope.nothing" } }));
check("unknown capability returns structured error", unknownCap.error?.code === "unknown_capability");

const quoteRes = parse(await a.callTool({
  name: "get_quote",
  arguments: { capability_id: "ai-directory.publish-listing" },
}));
check(
  "free capability quotes an exact zero with expiry",
  quoteRes.quote?.amount === "0" && !!quoteRes.quote?.expires_at && quoteRes.quote.id.startsWith("tr_quote_"),
);

const invoke = parse(await a.callTool({
  name: "invoke_capability",
  arguments: {
    capability_id: "ai-directory.publish-listing",
    input: VALID_INPUT,
    quote_id: quoteRes.quote.id,
    idempotency_key: "smoke-key-0001",
  },
}));
check("simulated invocation succeeds", invoke.receipt?.result?.status === "succeeded",
  JSON.stringify(invoke.receipt?.result));
check("succeeded receipt carries artifacts + commitments",
  invoke.receipt?.result?.artifacts?.[0]?.url?.includes("promptfrenzy.com/directory/") &&
  invoke.receipt?.request?.commitment?.startsWith("sha256:") &&
  invoke.receipt?.result?.commitment?.startsWith("sha256:"));
check("simulation is unmistakably marked in evidence",
  invoke.receipt?.evidence?.some((e) => e.type === "simulated_execution"));
assertReceiptValid("succeeded", invoke.receipt);

const exec = parse(await a.callTool({
  name: "get_execution",
  arguments: { execution_id: invoke.receipt.execution_id },
}));
check("get_execution returns the same receipt", exec.receipt?.execution_id === invoke.receipt.execution_id);

const replay = parse(await a.callTool({
  name: "invoke_capability",
  arguments: {
    capability_id: "ai-directory.publish-listing",
    input: VALID_INPUT,
    quote_id: quoteRes.quote.id,
    idempotency_key: "smoke-key-0001",
  },
}));
check("idempotent replay returns the same execution without re-running",
  replay.replayed === true && replay.receipt?.execution_id === invoke.receipt.execution_id);

const conflict = parse(await a.callTool({
  name: "invoke_capability",
  arguments: {
    capability_id: "ai-directory.publish-listing",
    input: { ...VALID_INPUT, name: "Different Tool" },
    idempotency_key: "smoke-key-0001",
  },
}));
check("same key + different input is rejected as idempotency_conflict",
  conflict.receipt?.result?.status === "rejected" &&
  conflict.receipt?.result?.reasons?.[0]?.code === "idempotency_conflict");
assertReceiptValid("idempotency_conflict", conflict.receipt);

const badInput = parse(await a.callTool({
  name: "invoke_capability",
  arguments: {
    capability_id: "ai-directory.publish-listing",
    input: { ...VALID_INPUT, url: "http://example-ai-tool.com", description: "too short" },
  },
}));
const codes = (badInput.receipt?.result?.reasons ?? []).map((r) => r.code);
check("invalid input rejects with machine-actionable reasons",
  badInput.receipt?.result?.status === "rejected" && codes.includes("invalid_url") && codes.includes("invalid_input"),
  JSON.stringify(badInput.receipt?.result?.reasons));
assertReceiptValid("rejected-invalid-input", badInput.receipt);

const staleQuote = parse(await a.callTool({
  name: "invoke_capability",
  arguments: { capability_id: "ai-directory.publish-listing", input: VALID_INPUT, quote_id: "tr_quote_doesnotexist" },
}));
check("unknown quote_id rejects as quote_invalid",
  staleQuote.receipt?.result?.reasons?.[0]?.code === "quote_invalid");

const gapLog = join(tmpData, "search-gaps.jsonl");
check("zero-result search was logged as a demand gap",
  existsSync(gapLog) && readFileSync(gapLog, "utf8").includes(gapQuery));

await a.close();

// ---------- Server B: default safety gate (no live, no simulation) ----------
const b = await connect({});
const gated = parse(await b.callTool({
  name: "invoke_capability",
  arguments: { capability_id: "ai-directory.publish-listing", input: VALID_INPUT },
}));
check("default build refuses live submission with instructions",
  gated.receipt?.result?.status === "rejected" &&
  gated.receipt?.result?.reasons?.[0]?.code === "live_submission_disabled");
assertReceiptValid("gated", gated.receipt);
await b.close();

rmSync(tmpData, { recursive: true, force: true });
console.log(`\n${steps - failures}/${steps} checks passed`);
process.exit(failures ? 1 : 0);
