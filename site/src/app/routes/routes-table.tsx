"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface RouteRow {
  slug: string;
  title: string;
  task_type: string;
  region: string;
  sites: number;
  steps: number | null;
  checks: number;
  last_verified: string;
  /** Lower-cased text the filter matches against: title, intent, tags, hosts. */
  hay: string;
}

type Sort = "recent" | "saved" | "az";
const SORTS: { id: Sort; label: string }[] = [
  { id: "recent", label: "Recently verified" },
  { id: "saved", label: "Most work saved" },
  { id: "az", label: "A to Z" },
];

const saved = (r: RouteRow) => (r.steps ?? 0) - r.checks;

/** Every route in one table: filter as you type, sort by freshness or work saved. All rows render on the server. */
export function RoutesTable({ rows }: { rows: RouteRow[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("recent");
  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = words.length ? rows.filter((r) => words.every((w) => r.hay.includes(w))) : rows;
    return [...hits].sort((a, b) =>
      sort === "az"
        ? a.title.localeCompare(b.title)
        : sort === "saved"
          ? saved(b) - saved(a) || a.title.localeCompare(b.title)
          : b.last_verified.localeCompare(a.last_verified) || a.title.localeCompare(b.title),
    );
  }, [rows, q, sort]);

  return (
    <>
      <form className="search-row" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="route-q">What is your agent trying to do?</label>
        <input
          id="route-q"
          type="search"
          placeholder="What is your agent trying to do?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </form>
      <p className="small muted" style={{ margin: "0.75rem 0 0" }}>
        Filters the {rows.length} routes below as you type. Agents search at{" "}
        <a className="mono" href="/api/routes/search?q=laser%20cutting%20quote%20uk">/api/routes/search?q=…</a>; searches
        that find nothing are counted in the <Link href="/demand">demand report</Link> and tell us what to write next.
      </p>

      <div className="table-head" id="routes">
        <h2>{q.trim() ? `${shown.length} of ${rows.length} routes` : "All routes"}</h2>
        <div className="chips" role="group" aria-label="Sort routes">
          {SORTS.map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={sort === s.id} onClick={() => setSort(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 ? (
        <div className="panel">
          <p style={{ margin: 0 }}>
            No route matches &ldquo;{q.trim()}&rdquo; yet. <Link href="/routes#contribute">Contribute one</Link>, or browse
            the topics above.
          </p>
        </div>
      ) : (
        <div className="routes-table-wrap">
          <table className="routes-table">
            <thead>
              <tr>
                <th scope="col">Route</th>
                <th scope="col">Type</th>
                <th scope="col" className="num">Sites</th>
                <th scope="col" className="num">Tool calls → checks</th>
                <th scope="col">Last verified</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.slug}>
                  <td>
                    <Link href={`/routes/${r.slug}`}>{r.title}</Link>
                    {r.region !== "global" && <span className="region-tag">{r.region}</span>}
                  </td>
                  <td className="type">{r.task_type}</td>
                  <td className="num">{r.sites}</td>
                  <td className="num">
                    {r.steps ? (
                      <>
                        {r.steps} → <b>{r.checks}</b>
                      </>
                    ) : (
                      <>
                        <b>{r.checks}</b> checks
                      </>
                    )}
                  </td>
                  <td className="date">{r.last_verified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
