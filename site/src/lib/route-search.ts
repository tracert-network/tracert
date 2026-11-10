// Keyword search over the public routes. Kept free of framework and "@/"
// imports so plain Node can unit-test it (scripts/route-search.test.mjs);
// src/lib/routes.ts wires it to the build-time route snapshot.

export interface SearchableRoute {
  slug: string;
  title: string;
  intent: string;
  tags: string[];
  hosts: string[];
  task_type: string;
  region: string;
  body: string;
}

export interface RouteHit<R extends SearchableRoute = SearchableRoute> {
  route: R;
  score: number;
  /** Share of the query's weight matched in intent/tags/hosts/title/type/region (0–1). */
  coverage: number;
  matched: string[];
}

const STOP = new Set(
  (
    "a an and are as at be by can do for from get how i in is it me my of on or the to with find need want some any this that we our you your best cheap cheapest where which " +
    // Query filler that says nothing about the task. Without this, a word no route
    // happens to use ("options", "compare") would count as a missing topic.
    "what who when should would could will there into about using use way ways compare comparing comparison options option online guide tips help steps good top " +
    "so do does did has have had like other around ready after set up"
  ).split(" "),
);

/** Plural to singular, so "registries" finds "registry" and "quotes" finds "quote". Hostnames are left alone. */
function stem(t: string): string {
  if (t.length <= 3 || t.includes(".")) return t;
  if (t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (/(ss|us|is)$/.test(t)) return t;
  return t.endsWith("s") ? t.slice(0, -1) : t;
}

export function tokens(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9][a-z0-9.-]*/g) ?? []).filter((t) => t.length > 1 && !STOP.has(t)).map(stem);
}

const FIELDS: [(r: SearchableRoute) => string, number][] = [
  [(r) => r.intent, 3],
  [(r) => r.tags.join(" "), 3],
  [(r) => r.hosts.join(" "), 3],
  [(r) => r.title, 2],
  [(r) => r.task_type, 1],
  [(r) => r.region, 2],
];

/** A query word hits a word set if it is one of the words, or (when longer than 3 letters) part of one: "ebay" in "community.ebay.co.uk", "price" in "prices". */
function hits(word: string, toks: Set<string>): boolean {
  if (toks.has(word)) return true;
  if (word.length <= 3) return false;
  for (const x of toks) if (x.includes(word)) return true;
  return false;
}

export interface RouteIndex<R extends SearchableRoute> {
  routes: R[];
  fields: Set<string>[][];
  body: Set<string>[];
  /** Per query word: its weight, and whether any route's fields use it at all. */
  weights: Map<string, { w: number; known: boolean }>;
}

export function buildIndex<R extends SearchableRoute>(routes: R[]): RouteIndex<R> {
  return {
    routes,
    fields: routes.map((r) => FIELDS.map(([get]) => new Set(tokens(get(r))))),
    body: routes.map((r) => new Set(tokens(r.body))),
    weights: new Map(),
  };
}

/**
 * How much a query word says about the task: ln((N+1)/(df+1)), where df is the
 * number of routes whose fields contain it. "free" or "uk" (in many routes)
 * weigh little; "laser" weighs a lot. A word no route uses ("dentist") weighs
 * most of all: it names something we don't cover, so routes that share only
 * the generic words with the query don't count as matches.
 */
function weight<R extends SearchableRoute>(index: RouteIndex<R>, word: string): { w: number; known: boolean } {
  const cached = index.weights.get(word);
  if (cached !== undefined) return cached;
  const n = index.routes.length;
  const df = index.fields.filter((fs) => fs.some((f) => hits(word, f))).length;
  const out = { w: Math.max(0.1, Math.log((n + 1) / (df + 1))), known: df > 0 };
  index.weights.set(word, out);
  return out;
}

/** Example queries that each return a route — offered when a search finds nothing (tested). */
export const EXAMPLE_ROUTE_QUERIES = [
  "laser cutting quote uk",
  "list an mcp server in registries",
  "free llm api tiers",
  "where to launch a developer tool",
];

/**
 * A route is a match only if it covers at least this share of the query's
 * weight in its own fields. Words no route uses count once in total, however
 * many there are: one of them ("dentist") is usually the missing topic, while
 * many of them ("100mm", "london", "delivery") usually mean a wordy query.
 */
export const MIN_COVERAGE = 0.5;

/**
 * Rank routes for a query. Score = field matches (weighted by field) plus up to
 * 5 for body matches. A route is dropped as weak when:
 * - it matches nothing in intent/tags/hosts/title/type/region (body-only hits are noise),
 * - its weighted coverage is under MIN_COVERAGE (it matched only the generic words), or
 * - it scores under 30% of the best match.
 * Body matches add to the score but never to coverage.
 */
export function rankRoutes<R extends SearchableRoute>(
  index: RouteIndex<R>,
  query: string,
  opts: { region?: string; limit?: number } = {},
): { hits: RouteHit<R>[]; dropped_weak: number; weak: RouteHit<R>[] } {
  const q = [...new Set(tokens(query))];
  if (!q.length) return { hits: [], dropped_weak: 0, weak: [] };
  const w = new Map(q.map((t) => [t, weight(index, t)]));
  const known = [...w.values()].filter((x) => x.known);
  const unknown = [...w.values()].filter((x) => !x.known);
  const total = known.reduce((a, x) => a + x.w, 0) + (unknown.length ? Math.max(...unknown.map((x) => x.w)) : 0);
  const scored: RouteHit<R>[] = [];
  const weak: RouteHit<R>[] = [];
  let droppedWeak = 0;
  index.routes.forEach((route, i) => {
    if (opts.region && route.region !== "global" && route.region.toUpperCase() !== opts.region.toUpperCase()) return;
    let fieldScore = 0;
    const inFields = new Set<string>();
    FIELDS.forEach(([, fw], j) => {
      const hit = q.filter((t) => hits(t, index.fields[i][j]));
      fieldScore += fw * hit.length;
      hit.forEach((h) => inFields.add(h));
    });
    const bodyHits = q.filter((t) => index.body[i].has(t));
    const score = fieldScore + Math.min(5, bodyHits.length);
    if (score === 0) return;
    const coverage = [...inFields].reduce((a, t) => a + (w.get(t)?.w ?? 0), 0) / total;
    const hit = { route, score, coverage, matched: [...new Set([...inFields, ...bodyHits])] };
    if (fieldScore === 0) {
      droppedWeak++; // body-only: noise even as a suggestion ("world" in a footnote)
      return;
    }
    if (coverage < MIN_COVERAGE) {
      droppedWeak++;
      weak.push(hit);
      return;
    }
    scored.push(hit);
  });
  scored.sort((a, b) => b.score - a.score || b.coverage - a.coverage);
  const top = scored[0]?.score ?? 0;
  const strong = scored.filter((h) => h.score >= 0.3 * top);
  droppedWeak += scored.length - strong.length;
  weak.push(...scored.filter((h) => h.score < 0.3 * top));
  weak.sort((a, b) => b.score - a.score || b.coverage - a.coverage);
  return { hits: strong.slice(0, Math.max(1, Math.min(opts.limit ?? 3, 10))), dropped_weak: droppedWeak, weak };
}
