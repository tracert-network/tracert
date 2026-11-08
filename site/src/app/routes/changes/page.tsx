import type { Metadata } from "next";
import Link from "next/link";
import { recentChanges } from "@/lib/routes";

export const metadata: Metadata = {
  title: "What changed in Tracert routes",
  description:
    "Every route update, newest first: new routes, verification runs, and facts that went stale and were corrected. Also as an Atom feed.",
  alternates: { canonical: "/routes/changes", types: { "application/atom+xml": "/routes/feed.xml" } },
};

export default function Changes() {
  const changes = recentChanges();
  const byDate = new Map<string, typeof changes>();
  for (const c of changes) byDate.set(c.date, [...(byDate.get(c.date) ?? []), c]);
  return (
    <div className="container section">
      <p className="eyebrow">
        <Link href="/routes">Routes</Link> · changelog
      </p>
      <h1>What changed in Tracert routes</h1>
      <p className="lede">
        Every route update, newest first: new routes, verification runs, and facts that went stale and were corrected.
        Taken from each route&rsquo;s own changelog.
      </p>
      <p className="small muted">
        Subscribe: <a className="mono" href="/routes/feed.xml">/routes/feed.xml</a> (Atom) · machine index:{" "}
        <a className="mono" href="/routes.json">/routes.json</a>
      </p>
      {[...byDate.entries()].map(([date, items]) => (
        <section key={date}>
          <h2>{date}</h2>
          <ul>
            {items.map((c, i) => (
              <li key={`${c.route.slug}-${i}`}>
                <Link href={`/routes/${c.route.slug}`}>{c.route.title}</Link>: <span className="muted">{c.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
