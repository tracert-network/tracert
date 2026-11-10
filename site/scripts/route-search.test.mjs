// Route search tests for src/lib/route-search.ts, run against the committed
// route snapshot (src/generated/routes.json). Run: npm test (Node strips the TS types).
// The "no match" cases are real lookups from Robin's agents (2026-11-09/10) that the
// old search answered with unrelated routes. If a route covering one of them is
// added later, move that case to the "finds its route" list.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { EXAMPLE_ROUTE_QUERIES, buildIndex, rankRoutes } from "../src/lib/route-search.ts";

const ROUTES = JSON.parse(readFileSync(new URL("../src/generated/routes.json", import.meta.url), "utf8"));
const INDEX = buildIndex(ROUTES);
const slugs = (query, opts) => rankRoutes(INDEX, query, opts).hits.map((h) => h.route.slug);
const has = (slug) => ROUTES.some((r) => r.slug === slug);

test("every route is the top hit for its own title and intent", () => {
  for (const r of ROUTES) {
    assert.equal(slugs(r.title)[0], r.slug, `title of ${r.slug}`);
    assert.equal(slugs(r.intent)[0], r.slug, `intent of ${r.slug}`);
  }
});

test("the example queries offered on a miss each return a route", () => {
  for (const q of EXAMPLE_ROUTE_QUERIES) assert.ok(slugs(q).length > 0, q);
});

test("queries that share only generic words with a route find no match", () => {
  const misses = [
    "used item sold price ebay uk", // matched the parcel and PCB routes on "price", "uk", "used"
    "open licence sheet music search", // matched site indexing on "search"
    "dentist prices uk",
    "hire a plumber quote uk",
    "free icon library svg",
    "cheap flights london paris",
  ];
  for (const q of misses) {
    const r = rankRoutes(INDEX, q);
    assert.deepEqual(r.hits.map((h) => h.route.slug), [], q);
    assert.ok(r.hits.length === 0 && r.dropped_weak >= 0, q);
  }
});

test("a no-match still offers the nearest routes as suggestions", () => {
  const r = rankRoutes(INDEX, "used item sold price ebay uk");
  assert.equal(r.hits.length, 0);
  if (has("uk-parcel-courier-prices")) assert.equal(r.weak[0]?.route.slug, "uk-parcel-courier-prices");
});

test("short and wordy queries find their route, and only the related ones", () => {
  const cases = {
    "laser cutting quote uk": "uk-laser-cutting-quotes",
    "compare options for laser cutting uk": "uk-laser-cutting-quotes",
    "I need to find the cheapest way to get a small acrylic part laser cut in the UK, around 100mm wide, with delivery": "uk-laser-cutting-quotes",
    "ebay postage service parcel drop off uk": "uk-parcel-courier-prices",
    "send a small 1.5kg box from London to Manchester with tracking, cheapest option": "uk-parcel-courier-prices",
    "list an mcp server in registries": "mcp-server-registries",
    "how do I get my new MCP server listed in the official registry and other directories so agents can find it": "mcp-server-registries",
    "what are the free tiers for LLM APIs like Gemini and Groq and do they train on my data": "llm-api-free-tiers",
    "my podcast is ready, where do I submit the RSS feed so people can find it on Apple and Spotify": "podcast-directory-submission",
    "which registrar has the cheapest renewal price for a .io domain": "domain-registrar-prices",
    "free hosting for my next.js app": "free-static-hosting-limits",
    "resend vs postmark": "transactional-email-free-tiers",
  };
  for (const [q, slug] of Object.entries(cases)) {
    if (!has(slug)) continue;
    assert.equal(slugs(q)[0], slug, q);
  }
  // Before 2026-11-10 these also returned 1–2 unrelated routes.
  assert.deepEqual(slugs("laser cutting quote uk"), ["uk-laser-cutting-quotes"]);
  assert.deepEqual(slugs("free hosting for my next.js app"), ["free-static-hosting-limits"]);
});

test("plurals match singulars", () => {
  if (has("mcp-server-registries")) assert.equal(slugs("mcp server registries")[0], "mcp-server-registries");
});

test("body-only words never make a match or raise coverage", () => {
  const routes = [
    { slug: "a", title: "Send a parcel", intent: "Cheapest parcel delivery", tags: ["parcel"], hosts: ["example.com"], task_type: "comparison", region: "GB", body: "Mentions laser cutting in passing." },
    { slug: "b", title: "Laser cutting quotes", intent: "Get laser cutting prices", tags: ["laser cutting"], hosts: ["laser.example"], task_type: "quote-gathering", region: "GB", body: "" },
  ];
  const idx = buildIndex(routes);
  assert.deepEqual(rankRoutes(idx, "laser cutting").hits.map((h) => h.route.slug), ["b"]);
  const a = rankRoutes(idx, "parcel laser").hits.find((h) => h.route.slug === "a");
  assert.ok(!a || a.coverage < 1, "a's coverage must not count the body hit");
});

test("region filter keeps global routes and drops other regions", () => {
  const r = rankRoutes(INDEX, "laser cutting quote", { region: "US" });
  assert.ok(r.hits.every((h) => h.route.region === "global" || h.route.region === "US"));
});
