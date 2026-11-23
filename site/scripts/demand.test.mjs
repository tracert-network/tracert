// Guards for src/data/agent-demand.json, the data behind /demand ("What agents
// asked for"). Every edition must keep the publishing rules the page promises:
// aggregates only, nothing named below the caller threshold, no fields that
// could carry a caller's identity, and totals that add up. Run: npm test.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { EXAMPLE_ROUTE_QUERIES } from "../src/lib/route-search.ts";

const DATA = JSON.parse(readFileSync(new URL("../src/data/agent-demand.json", import.meta.url), "utf8"));
const EDITION_KEYS = [
  "from", "generated_at", "id", "largest_caller_share", "min_callers", "outcomes", "partial", "queries",
  "queries_below_threshold", "readers", "routes", "routes_below_threshold", "to", "totals",
].sort();
const ROW_KEYS = {
  readers: ["callers", "kind", "reads"],
  routes: ["callers", "crawler_reads", "reads", "slug"],
  queries: ["callers", "matched", "query", "searches"],
  outcomes: ["outcome", "reports"],
};
const KINDS = new Set(["crawler", "browser", "browser_like", "tool", "registry_probe", "mcp_client", "ai_assistant", "(not set)"]);
const SAFE_QUERY = /^[a-z0-9][a-z0-9 .,'&+/-]{1,79}$/;
const UNSAFE = /\b(ignore|instructions?|prompt|system|assistant|disregard|you are|you must|http|www)\b/i;
const sum = (rows, k) => rows.reduce((a, r) => a + r[k], 0);

test("data file has a schema and editions, newest first, unique ids", () => {
  assert.equal(DATA.schema, "tracert-agent-demand/v0.1");
  assert.ok(Array.isArray(DATA.editions) && DATA.editions.length > 0);
  const ids = DATA.editions.map((e) => e.id);
  assert.deepEqual(ids, [...new Set(ids)].sort().reverse());
  for (const id of ids) assert.match(id, /^\d{4}-\d{2}$/);
});

for (const e of DATA.editions) {
  test(`${e.id}: only known fields, so nothing identifying slips in`, () => {
    assert.deepEqual(Object.keys(e).sort(), EDITION_KEYS);
    for (const [list, keys] of Object.entries(ROW_KEYS)) {
      for (const row of e[list]) assert.deepEqual(Object.keys(row).sort(), keys, `${list} row`);
    }
    for (const r of e.readers) assert.ok(KINDS.has(r.kind), `unknown reader kind ${r.kind}`);
  });

  test(`${e.id}: nothing named below the caller threshold`, () => {
    assert.ok(e.min_callers >= 3, "threshold must stay at 3 or more");
    for (const r of e.routes) assert.ok(r.callers >= e.min_callers, `route ${r.slug}`);
    for (const q of e.queries) assert.ok(q.callers >= e.min_callers, `query ${q.query}`);
  });

  test(`${e.id}: listed queries are short, plain and not our own examples`, () => {
    const examples = new Set(EXAMPLE_ROUTE_QUERIES.map((q) => q.toLowerCase()));
    for (const { query } of e.queries) {
      assert.match(query, SAFE_QUERY);
      assert.doesNotMatch(query, UNSAFE);
      assert.doesNotMatch(query, /\d{5,}|@/);
      assert.ok(query.split(" ").length <= 10);
      assert.ok(!examples.has(query), `example query ${query}`);
    }
  });

  test(`${e.id}: totals add up`, () => {
    const t = e.totals;
    assert.equal(sum(e.readers, "reads"), t.route_reads, "readers sum to route reads");
    assert.equal(sum(e.routes, "reads") + e.routes_below_threshold.reads, t.route_reads, "routes sum to route reads");
    assert.equal(sum(e.queries, "searches") + e.queries_below_threshold.searches, t.searches, "queries sum to searches");
    assert.equal(sum(e.outcomes, "reports"), t.outcome_reports);
    assert.ok(t.search_misses <= t.searches);
    assert.ok(t.route_page_views <= t.page_views);
    assert.ok(e.largest_caller_share >= 0 && e.largest_caller_share <= 1);
    for (const r of e.routes) assert.ok(r.crawler_reads <= r.reads);
    assert.ok(e.from <= e.to);
  });
}
