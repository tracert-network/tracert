import type { Metadata } from "next";
import Link from "next/link";
import { allEditions, editionMonth, editionRange, latestEdition } from "@/lib/demand";

export const metadata: Metadata = {
  title: "What agents asked for",
  description:
    "Monthly, aggregate reports on how AI agents, tools and crawlers read and search Tracert's routes: which routes, which kinds of caller, what searches found nothing. No caller is named.",
  alternates: { canonical: "/demand", types: { "application/json": "/demand.json" } },
};

export default function DemandIndex() {
  const editions = allEditions();
  const latest = latestEdition();
  return (
    <div className="container section">
      <p className="eyebrow">
        <Link href="/routes">Routes</Link> · demand
      </p>
      <h1>What agents asked for</h1>
      <p className="lede">
        A monthly report on how AI agents, tools and crawlers use Tracert&rsquo;s routes: which routes they read, what
        kinds of caller they are, and what they searched for that we don&rsquo;t cover yet. It is counted from
        tracert.site&rsquo;s own logs and published in aggregate. No caller is named.
      </p>
      {latest ? (
        <p>
          <Link className="btn btn-primary" href={`/demand/${latest.id}`}>
            Latest: {editionMonth(latest)}
          </Link>
        </p>
      ) : null}
      <ul>
        {editions.map((e) => (
          <li key={e.id}>
            <Link href={`/demand/${e.id}`}>{editionMonth(e)}</Link>{" "}
            <span className="muted">
              ({editionRange(e)}
              {e.partial ? ", part of the month" : ""}): {e.totals.route_reads.toLocaleString("en-GB")}{" "}route reads,{" "}
              {e.totals.searches}{" "}searches, {e.totals.outcome_reports}{" "}outcome reports
            </span>
          </li>
        ))}
      </ul>
      <p className="small muted">
        Machine-readable: <a className="mono" href="/demand.json">/demand.json</a>. Each edition explains how it is counted.
      </p>
    </div>
  );
}
