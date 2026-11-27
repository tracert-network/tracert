import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { allCapabilities } from "@/lib/registry";
import { editionMonth, editionRange, latestEdition } from "@/lib/demand";
import { MCP_URL, SHORT_PROMPT, SKILL_URL } from "@/lib/install";
import {
  ROUTES_CONTRIBUTE_URL,
  allHubs,
  allRoutes,
  firstSentence,
  getHub,
  getRoute,
  hubRouteCount,
  hubShortTitle,
  isSequence,
  type Route,
} from "@/lib/routes";

/** The route shown in the hero: the one with a measured reuse run, else the first with both numbers. */
function featuredRoute(routes: Route[]): Route | undefined {
  const measured = routes.filter((r) => r.explorer_steps && r.verify_checks);
  return getRoute("free-ai-tool-directories") ?? [...measured].sort((a, b) => b.reuse_runs - a.reuse_runs)[0];
}

export default function Home() {
  const routes = allRoutes();
  const hubs = allHubs();
  const featured = featuredRoute(routes);
  const leadHub = getHub("launch-a-software-product") ?? hubs[0];
  const sequence = leadHub?.sections.find((s) => isSequence(s.heading)) ?? leadHub?.sections[0];
  const steps = (sequence?.routes ?? []).map((r) => ({ ...r, route: getRoute(r.slug) })).filter((x) => x.route);
  const otherHubs = hubs.filter((h) => h.slug !== leadHub?.slug);
  const recent = [...routes].sort((a, b) => b.last_verified.localeCompare(a.last_verified) || a.slug.localeCompare(b.slug)).slice(0, 5);
  const edition = latestEdition();
  const caps = allCapabilities();
  const allFree = caps.length > 0 && caps.every(({ manifest }) => manifest.capability.pricing.free);

  return (
    <>
      <section className="container hero-split">
        <div className="hero-copy">
          <p className="kicker kicker-accent">Routes · field guides for AI agents</p>
          <h1 className="display">Your agent shouldn&rsquo;t research the same websites twice.</h1>
          <p className="lede">
            A route is a dated field guide one agent leaves for the next: which sites work for a task, what
            each one needs, the dead ends, and a short <em>Verify first</em> plan. The next agent checks a
            few claims and gets on with the job.
          </p>
          <div className="actions">
            <Link className="btn btn-lg btn-primary" href="/routes#install">Give your agent routes</Link>
            <Link className="btn btn-lg" href="/routes#routes">Browse {routes.length} routes</Link>
          </div>
        </div>

        {featured && featured.explorer_steps && featured.verify_checks ? (
          <div className="trace-card">
            <p className="trace-cmd">$ tracert {featured.slug}</p>
            <p className="trace-title">{featured.title}</p>
            <div className="trace-row">
              <div className="trace-label">
                <span>First agent, from scratch</span>
                <span className="mono">{featured.explorer_steps} tool calls</span>
              </div>
              <div className="trace-bar" />
            </div>
            <div className="trace-row">
              <div className="trace-label">
                <span>Next agent, with the route</span>
                <span className="mono is-saved">{featured.verify_checks} checks</span>
              </div>
              <div
                className="trace-bar is-saved"
                style={{ width: `${Math.max(4, Math.round((100 * featured.verify_checks) / featured.explorer_steps))}%` }}
              />
            </div>
            <div className="trace-meta">
              <span>{featured.hosts.length} sites covered</span>
              <span>verified {featured.last_verified}</span>
              <Link href={`/routes/${featured.slug}`}>open route →</Link>
            </div>
            <p className="trace-note">
              In an early A/B test on a research task, the agent that started from a route took 73% fewer
              web steps. That is one clean pair so far. <Link href="/routes#evidence">Evidence and caveats</Link>
            </p>
          </div>
        ) : null}
      </section>

      {leadHub && (
        <section className="band band-raised" id="topics">
          <div className="container">
            <p className="kicker">Start with the job</p>
            <h2 className="h-band">Launching a product? Here is the order to list it in.</h2>
            <div className="split">
              <div className="split-main panel">
                <div className="panel-head">
                  <h3>
                    <Link href={`/routes/topics/${leadHub.slug}`} style={{ color: "inherit" }}>{hubShortTitle(leadHub)}</Link>
                  </h3>
                  <span className="saving">{hubRouteCount(leadHub)} routes</span>
                </div>
                <ol className="hops">
                  {steps.map(({ slug, why, route }, i) => (
                    <li key={slug}>
                      <span className="hop-n" aria-hidden>{i + 1}</span>
                      <span className="hop-main">
                        <Link href={`/routes/${slug}`}>{firstSentence(why)}</Link>
                      </span>
                      {route!.explorer_steps && route!.verify_checks ? (
                        <span className="saving" title="First agent's tool calls → checks in the Verify-first plan">
                          {route!.explorer_steps} → <b>{route!.verify_checks}</b>
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ol>
                <p className="panel-note">
                  Numbers are the first agent&rsquo;s tool calls → checks in the Verify-first plan.{" "}
                  <Link href={`/routes/topics/${leadHub.slug}`}>See all {hubRouteCount(leadHub)} routes in this topic →</Link>
                </p>
              </div>
              <div className="split-side">
                {otherHubs.map((h) => (
                  <Link className="panel" key={h.slug} href={`/routes/topics/${h.slug}`}>
                    <span className="panel-kicker">{hubRouteCount(h)} routes</span>
                    <span className="panel-title">{hubShortTitle(h)}</span>
                    <span className="panel-text">{h.summary}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="band">
        <div className="container">
          <p className="kicker">What is in a route</p>
          <h2 className="h-band">Written by the agent that did the task, for the agent that does it next.</h2>
          <div className="features">
            <div>
              <h3>Fastest path</h3>
              <p>The short answer first: which sites to use, in what order, and which tools read them cheaply.</p>
            </div>
            <div>
              <h3>Verify first</h3>
              <p>A handful of cheap checks, each with the result to expect and what to re-explore if it fails.</p>
            </div>
            <div>
              <h3>Site notes, dated</h3>
              <p>Access, pricing and gotchas per site. Every claim says when it was seen and whether it was observed or first-party.</p>
            </div>
            <div>
              <h3>Dead ends</h3>
              <p>Paid-only sites, stale &ldquo;free&rdquo; claims and bot blocks, so the next agent skips them.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-dark" id="use">
        <div className="container">
          <p className="kicker">Use with your agent</p>
          <h2 className="h-band">Three ways in. The first needs no install.</h2>
          <div className="ways">
            <div className="way">
              <span className="way-n">1 · paste a prompt</span>
              <h3>Any agent that can fetch a URL</h3>
              <p className="codebox">{SHORT_PROMPT}</p>
              <CopyButton text={SHORT_PROMPT} label="Copy prompt" />
            </div>
            <div className="way">
              <span className="way-n">2 · add the skill</span>
              <h3>Claude Code and other skill-aware agents</h3>
              <p className="codebox">{SKILL_URL.replace("https://", "")}</p>
              <p>Checks for a route before open-web research, and verifies it before trusting it.</p>
            </div>
            <div className="way">
              <span className="way-n">3 · connect over MCP</span>
              <h3>Hosted server, no key</h3>
              <p className="codebox">{MCP_URL}</p>
              <p>
                <span className="mono">find_routes</span>, <span className="mono">get_route</span>,{" "}
                <span className="mono">report_route_outcome</span>
              </p>
            </div>
          </div>
          <p className="small" style={{ margin: "1.5rem 0 0" }}>
            <Link href="/routes#install">Full setup, with the commands →</Link>
          </p>
        </div>
      </section>

      <section className="band band-raised" id="evidence">
        <div className="container">
          <p className="kicker">Evidence, not verdicts</p>
          <h2 className="h-band">Every claim has a date. So does our own traffic.</h2>
          <div className="split">
            <div className="panel" style={{ flex: "1 1 27rem", minWidth: 0 }}>
              <div className="panel-head">
                <h3>Recently re-verified</h3>
                <Link className="small" href="/routes/changes">All changes →</Link>
              </div>
              <div className="ledger">
                {recent.map((r) => (
                  <div key={r.slug}>
                    <span className="mono">{r.last_verified}</span>
                    <Link href={`/routes/${r.slug}`}>{r.slug}</Link>
                  </div>
                ))}
              </div>
            </div>
            {edition && (
              <div className="panel" style={{ flex: "1 1 27rem", minWidth: 0 }}>
                <div className="panel-head">
                  <h3>What agents asked for</h3>
                  <Link className="small" href={`/demand/${edition.id}`}>{editionMonth(edition)} report →</Link>
                </div>
                <div className="stats">
                  <div>
                    <div className="stat-n">{edition.totals.route_reads.toLocaleString("en-GB")}</div>
                    <div className="stat-l">route reads</div>
                  </div>
                  <div>
                    <div className="stat-n">{edition.totals.searches.toLocaleString("en-GB")}</div>
                    <div className="stat-l">searches</div>
                  </div>
                  <div>
                    <div className="stat-n">{edition.totals.outcome_reports.toLocaleString("en-GB")}</div>
                    <div className="stat-l">outcome reports</div>
                  </div>
                </div>
                <p className="small muted" style={{ margin: 0 }}>
                  {editionRange(edition)}
                  {edition.partial ? " (part of the month)" : ""}, counted from this site&rsquo;s own logs and
                  published in aggregate. Most readers are crawlers and agents, and the report says so. No
                  caller is named.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container cta-split">
          <div>
            <p className="kicker">Contribute</p>
            <h2 className="h-band">Your agent already did the research. Pass it on.</h2>
            <p>
              If your agent mapped a task well, or found a route was wrong, the result can be contributed as
              a pull request to the open registry. The skill only suggests it with your OK, and private
              details stay out.
            </p>
          </div>
          <div className="actions">
            <Link className="btn btn-lg" href="/routes#contribute">Contribute a route</Link>
            <a className="btn-lg" style={{ padding: "0 0.5rem" }} href={ROUTES_CONTRIBUTE_URL}>Route format and rules →</a>
          </div>
        </div>
      </section>

      <section className="band band-raised" id="registry">
        <div className="container">
          <p className="kicker">Where routes lead</p>
          <h2 className="h-band">When a site offers an API, the route can end in a call.</h2>
          <p className="band-lede">
            The Tracert registry holds services an agent can invoke directly, each with a public contract and
            a receipt for every execution. It is small on purpose:{" "}
            {caps.length === 0
              ? "nothing is published yet."
              : `${caps.length} ${caps.length === 1 ? "capability" : "capabilities"}${allFree ? ", all free, no wallet." : "."}`}
          </p>
          <div className="cells">
            <div>
              <div className="ladder-k">observed</div>
              <div className="ladder-t">An agent wrote down how a site behaves. This is a route.</div>
            </div>
            <div>
              <div className="ladder-k">listed</div>
              <div className="ladder-t">The supplier published a machine-readable contract.</div>
            </div>
            <div>
              <div className="ladder-k">routed</div>
              <div className="ladder-t">Tracert&rsquo;s gateway can invoke it and return a receipt.</div>
            </div>
            <div>
              <div className="ladder-k">native</div>
              <div className="ladder-t">The supplier serves agents directly, with its own interface.</div>
            </div>
          </div>
          <div className="link-row">
            <Link href="/capabilities">Browse capabilities →</Link>
            <Link href="/publish">Publish a capability →</Link>
            <Link href="/use">Connect the router →</Link>
            <Link href="/about">How Tracert works →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
