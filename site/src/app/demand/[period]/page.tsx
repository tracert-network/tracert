import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CLASSIFIER_URL,
  allEditions,
  editionMonth,
  editionRange,
  getEdition,
  pct,
  readerKind,
  readsByTopic,
  routeTitle,
} from "@/lib/demand";

export const dynamicParams = false;

export function generateStaticParams() {
  return allEditions().map((e) => ({ period: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ period: string }> }): Promise<Metadata> {
  const { period } = await params;
  const e = getEdition(period);
  if (!e) return {};
  return {
    title: `What agents asked for: ${editionMonth(e)}`,
    description: `How AI agents, tools and crawlers read and searched Tracert's routes, ${editionRange(e)}: ${e.totals.route_reads.toLocaleString("en-GB")} route reads from ${e.totals.route_callers} callers, ${e.totals.searches} searches. Aggregated; no caller is named.`,
    alternates: { canonical: `/demand/${e.id}`, types: { "application/json": "/demand.json" } },
  };
}

const n = (x: number) => x.toLocaleString("en-GB");

export default async function DemandEditionPage({ params }: { params: Promise<{ period: string }> }) {
  const { period } = await params;
  const e = getEdition(period);
  if (!e) notFound();
  const t = e.totals;
  const others = allEditions().filter((x) => x.id !== e.id);
  return (
    <div className="container section">
      <p className="eyebrow">
        <Link href="/demand">What agents asked for</Link> · {editionMonth(e)}
      </p>
      <h1>What agents asked for: {editionMonth(e)}</h1>
      <p className="lede">
        How AI agents, tools and crawlers read and searched Tracert&rsquo;s routes, {editionRange(e)}
        {e.partial ? " (part of the month)" : ""}. Counted from tracert.site&rsquo;s own logs and published in
        aggregate: no caller is named.
      </p>

      <div className="grid-4">
        <div className="card">
          <p className="card-kicker">Route reads</p>
          <h2>{n(t.route_reads)}</h2>
          <p className="small muted">from about {n(t.route_callers)}{" "}different callers</p>
        </div>
        <div className="card">
          <p className="card-kicker">Searches</p>
          <h2>{n(t.searches)}</h2>
          <p className="small muted">{n(t.search_misses)}{" "}found no route</p>
        </div>
        <div className="card">
          <p className="card-kicker">Outcome reports</p>
          <h2>{n(t.outcome_reports)}</h2>
          <p className="small muted">callers saying whether a route held</p>
        </div>
        <div className="card">
          <p className="card-kicker">Page views by people</p>
          <h2>{n(t.page_views)}</h2>
          <p className="small muted">{n(t.route_page_views)}{" "}of them on route pages</p>
        </div>
      </div>

      <section>
        <h2>Who read the routes</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kind of caller</th>
                <th>Reads</th>
                <th>Share</th>
                <th>Callers</th>
              </tr>
            </thead>
            <tbody>
              {e.readers.map((r) => (
                <tr key={r.kind}>
                  <td>
                    {readerKind(r.kind).label}
                    <br />
                    <span className="small muted">{readerKind(r.kind).note}</span>
                  </td>
                  <td>{n(r.reads)}</td>
                  <td>{pct(r.reads, t.route_reads)}</td>
                  <td>{n(r.callers)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The single busiest caller made <strong>{Math.round(e.largest_caller_share * 100)}%</strong>{" "}
          of all route reads, so totals can move a lot when one fetcher starts or stops. The number of callers is the
          steadier measure.
        </p>
      </section>

      <section>
        <h2>Which routes</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Reads</th>
                <th>By crawlers</th>
                <th>Callers</th>
              </tr>
            </thead>
            <tbody>
              {e.routes.map((r) => {
                return (
                  <tr key={r.slug}>
                    <td>
                      <Link href={`/routes/${r.slug}`}>{routeTitle(r.slug)}</Link>
                    </td>
                    <td>{n(r.reads)}</td>
                    <td>{pct(r.crawler_reads, r.reads)}</td>
                    <td>{n(r.callers)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {e.routes_below_threshold.routes > 0 ? (
          <p className="small muted">
            {n(e.routes_below_threshold.routes)}{" "}more routes were read {n(e.routes_below_threshold.reads)}{" "}times by fewer
            than {e.min_callers}{" "}different callers each, so they are not named.
          </p>
        ) : null}
        <h3>By topic</h3>
        <ul>
          {readsByTopic(e).map((x) => (
            <li key={x.topic}>
              {x.hub ? <Link href={`/routes/topics/${x.hub}`}>{x.topic}</Link> : x.topic}: {n(x.reads)}{" "}reads across{" "}
              {x.routes}{" "}{x.routes === 1 ? "route" : "routes"}{" "}({pct(x.reads, t.route_reads)})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>What they searched for</h2>
        <p>
          {n(t.searches)}{" "}searches looked like someone getting work done (tests, catalog probes and empty queries are
          left out). {n(t.search_misses)}{" "}of them found no route.
        </p>
        {e.queries.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Searches</th>
                  <th>Callers</th>
                  <th>Found a route</th>
                </tr>
              </thead>
              <tbody>
                {e.queries.map((q) => (
                  <tr key={q.query}>
                    <td className="mono">{q.query}</td>
                    <td>{n(q.searches)}</td>
                    <td>{n(q.callers)}</td>
                    <td>{q.matched ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            No query was asked by {e.min_callers}{" "}or more different callers, so none is listed.
          </p>
        )}
        {e.queries_below_threshold.queries > 0 ? (
          <p className="small muted">
            {n(e.queries_below_threshold.queries)}{" "}other queries ({n(e.queries_below_threshold.searches)}{" "}searches) are not
            shown, to keep individual callers&rsquo; tasks private.
          </p>
        ) : null}
      </section>

      <section>
        <h2>Did the routes work?</h2>
        {e.outcomes.length ? (
          <ul>
            {e.outcomes.map((o) => (
              <li key={o.outcome}>
                {o.outcome.replace("_", " ")}: {n(o.reports)}
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No outcome reports this period. An agent that used a route can say whether it held:{" "}
            <span className="mono">POST /api/routes/outcome</span> or the MCP tool{" "}
            <span className="mono">report_route_outcome</span>. Reports are anonymous.
          </p>
        )}
      </section>

      <section>
        <h2>How this is counted</h2>
        <ul>
          <li>
            <strong>Source:</strong>{" "}tracert.site&rsquo;s server-side analytics, which record each fetch of a page or
            machine endpoint and never pass on visitors&rsquo; IP addresses. Page views by people come from Google Analytics&rsquo; standard page tag
            (gtag.js), which runs in the visitor&rsquo;s browser, so they only count browsers that ran JavaScript and didn&rsquo;t block it. Tracert&rsquo;s own checks and tools are left out.
          </li>
          <li>
            <strong>A read</strong>{" "}is one fetch of a route&rsquo;s page or its markdown copy.
          </li>
          <li>
            <strong>Callers</strong>{" "}are distinct user-agent strings. That is approximate: one agent can use several, and
            unrelated callers can share one (curl, for example).
          </li>
          <li>
            <strong>Kinds of caller</strong>{" "}come from the site&rsquo;s{" "}
            <a href={CLASSIFIER_URL}>open classifier</a>.
          </li>
          <li>
            <strong>Privacy:</strong>{" "}no caller names, user agents, addresses or per-caller activity are published. A route
            or query is named only when at least {e.min_callers}{" "}different callers read or asked it. Queries must also be
            short and plain, and the site&rsquo;s own example queries are left out. Each edition is reviewed before it is
            published.
          </li>
          <li>Measurement began on 10 November 2026.</li>
        </ul>
        <p className="small muted">
          Machine-readable: <a className="mono" href="/demand.json">/demand.json</a> · generated {e.generated_at.slice(0, 10)}
          {others.length ? (
            <>
              {" "}· other months:{" "}
              {others.map((o, i) => (
                <span key={o.id}>
                  {i ? ", " : ""}
                  <Link href={`/demand/${o.id}`}>{editionMonth(o)}</Link>
                </span>
              ))}
            </>
          ) : null}
        </p>
      </section>
    </div>
  );
}
