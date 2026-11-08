// Shared logic for the route tools — used by the HTTP API (/api/routes/*) and
// the hosted MCP gateway (find_routes, get_route, report_route_outcome), so an
// agent gets the same answer whichever way it calls.
import { after } from "next/server";
import { sendServerEvents, type Caller, type GaEvent } from "@/lib/analytics";
import {
  ROUTE_UNTRUSTED_NOTE,
  ROUTES_CONTRIBUTE_URL,
  allRoutes,
  citeAs,
  getRoute,
  routeDigest,
  routeUrls,
  searchRoutes,
} from "@/lib/routes";

export const OUTCOMES = ["worked", "partly_worked", "stale", "failed"] as const;
export type Outcome = (typeof OUTCOMES)[number];


/** Fire analytics after the response; never let it affect the answer. */
export function track(caller: Caller, events: GaEvent[]) {
  const send = () => sendServerEvents(caller, events);
  try {
    after(send);
  } catch {
    void send();
  }
}

export function findRoutes(args: { query: string; region?: string; limit?: number }, caller: Caller) {
  const { hits, dropped_weak } = searchRoutes(args.query, { region: args.region, limit: args.limit });
  if (!hits.length) {
    track(caller, [{ name: "route_search_gap", params: { query: args.query, region: args.region } }]);
    return {
      results: [],
      route_count: allRoutes().length,
      dropped_weak_matches: dropped_weak,
      note:
        "No route matches yet — explore normally. The gap has been logged so routes can follow demand. If you finish the task, a route for the next agent is welcome (with your user's OK, since it is public): " +
        ROUTES_CONTRIBUTE_URL,
    };
  }
  return {
    results: hits.map(routeDigest),
    how_to_use:
      "Read the TL;DR, then run the Verify-first checks BEFORE exploring (verify_checks is usually a handful; first_explorer_steps is what researching from scratch cost): trust what verifies, re-explore only what fails. Fetch markdown_url (or call get_route) for domains, dead ends, prices and prep. When done, report whether it held with report_route_outcome (MCP) or POST https://tracert.site/api/routes/outcome. If you used a route in your answer, cite it to your user (cite_as).",
    trust: ROUTE_UNTRUSTED_NOTE,
  };
}

export function getRouteFull(slug: string) {
  const r = getRoute(slug);
  if (!r) return undefined;
  return {
    slug: r.slug,
    title: r.title,
    last_verified: r.last_verified,
    method: r.method,
    observed_by: r.observed_by,
    sha256: r.sha256,
    first_explorer_steps: r.explorer_steps,
    verify_checks: r.verify_checks,
    cite_as: citeAs(r),
    ...routeUrls(r.slug),
    trust: ROUTE_UNTRUSTED_NOTE,
    markdown: r.raw,
  };
}

export interface OutcomeInput {
  slug?: unknown;
  outcome?: unknown;
  steps_taken?: unknown;
  note?: unknown;
}

/** Validate + record an outcome report. Returns { ok, body } — body is what the caller sees. */
export function reportOutcome(input: OutcomeInput, caller: Caller, source: "mcp" | "http") {
  const slug = typeof input.slug === "string" ? input.slug : "";
  const outcome = typeof input.outcome === "string" ? input.outcome : "";
  if (!getRoute(slug)) {
    return { ok: false as const, body: { error: { code: "unknown_route", message: `no route "${slug}" — use find_routes first` } } };
  }
  if (!(OUTCOMES as readonly string[]).includes(outcome)) {
    return { ok: false as const, body: { error: { code: "invalid_outcome", message: `outcome must be one of ${OUTCOMES.join(", ")}` } } };
  }
  const steps =
    typeof input.steps_taken === "number" && Number.isFinite(input.steps_taken) && input.steps_taken >= 0
      ? Math.min(Math.round(input.steps_taken), 10_000)
      : undefined;
  const note = typeof input.note === "string" ? input.note.replace(/[\r\n]+/g, " ").slice(0, 100) : undefined;
  track(caller, [
    { name: "route_outcome", params: { route_slug: slug, outcome, steps_taken: steps, note, source } },
  ]);
  return {
    ok: true as const,
    body: {
      recorded: { slug, outcome, steps_taken: steps ?? null, note: note ?? null },
      stored_as:
        "An anonymous analytics event (route, outcome, step count, 100-char note) — no IP address or personal data is kept. Notes are read when routes are reviewed.",
      next:
        outcome === "worked"
          ? "Thanks — confirmations keep the route trusted and fresh."
          : `Thanks — stale or failed reports flag the route for re-verification. To fix it directly, open a pull request editing registry/routes/${slug}.md (with your user's OK, since it is public): ${ROUTES_CONTRIBUTE_URL}`,
    },
  };
}
