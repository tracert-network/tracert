// Output schemas for the hosted MCP gateway's tools. Every tool returns its
// result as structuredContent validated against these (and as JSON text for
// clients that only read content), so agents can parse results without
// guessing and catalog scanners can see the contract.
//
// The MCP SDK rejects a result that doesn't match its schema, so these are
// deliberately tolerant: loose objects (extra fields allowed), and only fields
// every success path always returns are required. Error results (isError) are
// not validated.
import { z } from "zod";

const url = z.string().describe("Absolute URL");

// ---------------------------------------------------------------- routes ----

const routeLinks = {
  page_url: url.optional(),
  markdown_url: url.optional(),
};

const routeDigest = z.looseObject({
  slug: z.string(),
  title: z.string(),
  intent: z.string().optional(),
  task_type: z.string().optional(),
  region: z.string().optional(),
  method: z.string().optional().describe("researched | executed | mixed"),
  last_verified: z.string().describe("ISO date the route was last checked"),
  freshness: z.string().optional(),
  first_explorer_steps: z.number().nullable().optional().describe("Web steps the first agent spent exploring from scratch"),
  verify_checks: z.number().nullable().optional().describe("Claims to verify instead of re-exploring"),
  summary: z.string().nullable().optional(),
  tldr: z.string().optional(),
  verify_first: z.string().optional().describe("Run these checks before relying on the route"),
  cite_as: z.string().optional(),
  ...routeLinks,
});

export const findRoutesOutput = z.looseObject({
  results: z.array(routeDigest).describe("Matching routes, best first. Empty when nothing matched."),
  how_to_use: z.string().optional(),
  trust: z.string().optional(),
  route_count: z.number().optional(),
  dropped_weak_matches: z.number().optional(),
  note: z.string().optional(),
  nearest: z
    .array(z.looseObject({ slug: z.string(), title: z.string(), shares_keywords: z.array(z.string()), last_verified: z.string(), ...routeLinks }))
    .optional()
    .describe("Only when results is empty: closest routes by shared keywords — not matches"),
  covered_topics: z
    .array(z.looseObject({ topic: z.string(), url, route_slugs: z.array(z.string()) }))
    .optional()
    .describe("Only when results is empty: what the routes cover, by topic"),
  try_queries: z.array(z.string()).optional(),
});

export const getRouteOutput = z.looseObject({
  slug: z.string(),
  title: z.string(),
  last_verified: z.string(),
  method: z.string().optional(),
  observed_by: z.string().optional(),
  sha256: z.string().optional().describe("Hash of the route file, for citing an exact version"),
  first_explorer_steps: z.number().nullable().optional(),
  verify_checks: z.number().nullable().optional(),
  cite_as: z.string().optional(),
  ...routeLinks,
  trust: z.string().optional(),
  markdown: z.string().describe("The full route text"),
});

export const reportOutcomeOutput = z.looseObject({
  recorded: z.looseObject({
    slug: z.string(),
    outcome: z.string(),
    steps_taken: z.number().nullable(),
    note: z.string().nullable(),
  }),
  stored_as: z.string().optional(),
  next: z.string().optional(),
});

// ----------------------------------------------------------- capabilities ----

const searchRow = z.looseObject({
  capability_id: z.string(),
  version: z.string().optional(),
  status: z.string().optional(),
  promise: z.string(),
  provider: z.string().optional(),
  free: z.boolean(),
  price: z.string().optional(),
  expected_latency_p50_s: z.number().nullable().optional(),
  interfaces: z.array(z.string()).optional(),
  invocable_here: z.boolean().describe("Executable on this hosted read-only gateway"),
  match_reasons: z.array(z.string()).optional(),
});

export const searchCapabilitiesOutput = z.looseObject({
  results: z.array(searchRow).describe("Candidates, best first. Empty when nothing matched."),
  total_matched: z.number().optional(),
  dropped_by_filters: z.number().optional(),
  next_step: z.string().optional(),
  note: z.string().optional(),
  available_capabilities: z
    .array(z.looseObject({ capability_id: z.string(), promise: z.string(), free: z.boolean(), invocable_here: z.boolean() }))
    .optional()
    .describe("Only when results is empty: every active capability"),
  related_routes: z
    .array(z.looseObject({ slug: z.string(), title: z.string(), last_verified: z.string(), ...routeLinks }))
    .optional()
    .describe("Only when results is empty: routes (agent field guides) that match the query instead"),
});

export const getCapabilityOutput = z.looseObject({
  manifest: z.looseObject({}).describe("TRACE Manifest — https://tracert.site/schemas/manifest/v0.1"),
  manifest_hash: z.string(),
  input_schema: z.looseObject({}).describe("JSON Schema for invoke_capability input"),
  output_schema: z.looseObject({}).describe("JSON Schema for the capability output"),
  router_notes: z.string().optional(),
});

export const getQuoteOutput = z.looseObject({
  quote: z.looseObject({
    id: z.string(),
    capability_id: z.string(),
    amount: z.string(),
    currency: z.string(),
    expires_at: z.string(),
    payment_offers: z.array(z.string()),
    note: z.string().optional(),
  }),
  next_step: z.string().optional(),
});

const receipt = z
  .looseObject({
    schema: z.string(),
    execution_id: z.string(),
    capability: z.looseObject({ id: z.string(), version: z.string(), manifest_hash: z.string() }),
    request: z.looseObject({ received_at: z.string(), commitment: z.string() }),
    result: z.looseObject({
      status: z.enum(["rejected", "quoted", "authorized", "running", "succeeded", "failed", "unknown", "cancelled"]),
      completed_at: z.string().optional(),
      commitment: z.string().optional().describe("sha256 over the canonical output — reproduce it to verify"),
      reasons: z.array(z.looseObject({ code: z.string(), message: z.string() })).optional(),
      artifacts: z.array(z.looseObject({ type: z.string() })).optional(),
    }),
    payment: z.looseObject({ mode: z.string(), status: z.string() }),
    operator: z.looseObject({ gateway_id: z.string() }),
  })
  .describe("TRACE Receipt — https://tracert.site/schemas/receipt/v0.1");

export const invokeCapabilityOutput = z.looseObject({
  receipt,
  replayed: z.boolean().describe("true when an idempotency_key matched an earlier execution"),
});

export const getExecutionOutput = z.looseObject({ receipt });
