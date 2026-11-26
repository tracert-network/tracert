// "What agents asked for": monthly, aggregate reports on how tracert.site's
// routes are read and searched. The numbers come from the site's own server
// analytics (see analytics.ts), aggregated off-site and committed as
// src/data/agent-demand.json, one edition per month. Each edition arrives in a
// reviewed PR. Nothing here names a caller.
import data from "@/data/agent-demand.json";
import { REPO_URL } from "@/lib/registry";
import { getRoute, hubsForRoute } from "@/lib/routes";

export interface DemandEdition {
  id: string;
  from: string;
  to: string;
  partial: boolean;
  generated_at: string;
  min_callers: number;
  totals: {
    route_reads: number;
    route_callers: number;
    searches: number;
    search_misses: number;
    outcome_reports: number;
    page_views: number;
    route_page_views: number;
  };
  largest_caller_share: number;
  readers: { kind: string; reads: number; callers: number }[];
  routes: { slug: string; reads: number; crawler_reads: number; callers: number }[];
  routes_below_threshold: { routes: number; reads: number };
  queries: { query: string; searches: number; callers: number; matched: boolean }[];
  queries_below_threshold: { queries: number; searches: number };
  outcomes: { outcome: string; reports: number }[];
}

export const DEMAND_SCHEMA = (data as { schema: string }).schema;
const EDITIONS = (data as { editions: DemandEdition[] }).editions;

export const CLASSIFIER_URL = `${REPO_URL}/blob/main/site/src/lib/analytics.ts`;

/** Plain-language names for the analytics traffic classes. */
export const READER_KINDS: Record<string, { label: string; note: string }> = {
  crawler: { label: "Search and AI crawlers", note: "Indexing the page, not doing a task." },
  browser: {
    label: "Browser user agents",
    note: "People, or scripts that send a browser's headers. Real people are better counted by page views below.",
  },
  browser_like: { label: "Automated browsers", note: "A browser user agent without a browser's request headers." },
  tool: { label: "Scripts and agent tools", note: "Anything else that names itself: agent frameworks, curl, makers' own agents." },
  registry_probe: { label: "Catalogs and checkers", note: "Directories and monitors checking the site." },
  mcp_client: { label: "MCP clients", note: "Agents connected over the Model Context Protocol." },
  ai_assistant: { label: "AI assistants fetching for a person", note: "For example ChatGPT or Claude acting on a user's request." },
};

export function readerKind(kind: string) {
  return READER_KINDS[kind] ?? { label: "Unclassified", note: "" };
}

export function allEditions(): DemandEdition[] {
  return EDITIONS;
}

export function getEdition(id: string): DemandEdition | undefined {
  return EDITIONS.find((e) => e.id === id);
}

export function latestEdition(): DemandEdition | undefined {
  return EDITIONS[0];
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "November 2026" */
export function editionMonth(e: DemandEdition): string {
  const [y, m] = e.id.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "10–22 November 2026" */
export function editionRange(e: DemandEdition): string {
  const [fy, fm, fd] = e.from.split("-").map(Number);
  const [ty, tm, td] = e.to.split("-").map(Number);
  if (fy === ty && fm === tm) return `${fd}–${td} ${MONTHS[tm - 1]} ${ty}`;
  return `${fd} ${MONTHS[fm - 1]} ${fy} – ${td} ${MONTHS[tm - 1]} ${ty}`;
}

export function pct(n: number, of: number): string {
  if (!of) return "0%";
  const p = (100 * n) / of;
  return p > 0 && p < 1 ? "<1%" : `${Math.round(p)}%`;
}

/** Route reads grouped by each route's first topic hub, largest first. */
export function readsByTopic(e: DemandEdition): { topic: string; hub?: string; reads: number; routes: number }[] {
  const by = new Map<string, { topic: string; hub?: string; reads: number; routes: number }>();
  for (const r of e.routes) {
    const hub = hubsForRoute(r.slug)[0];
    const key = hub?.slug ?? "";
    const row = by.get(key) ?? { topic: hub?.title ?? "Other routes", hub: hub?.slug, reads: 0, routes: 0 };
    row.reads += r.reads;
    row.routes += 1;
    by.set(key, row);
  }
  return [...by.values()].sort((a, b) => b.reads - a.reads);
}

export function routeTitle(slug: string): string {
  return getRoute(slug)?.title ?? slug;
}
