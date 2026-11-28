import type { Metadata } from "next";
import { REPO_URL } from "@/lib/registry";
import { PRIVACY } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What tracert.site records when people and agents use it, why, who else sees it, how long it is kept, and what you can ask us to do. No cookies.",
  alternates: { canonical: "/privacy" },
};

const PAGE_HISTORY = `${REPO_URL}/commits/main/site/src/app/privacy/page.tsx`;

export default function Privacy() {
  return (
    <div className="container section">
      <p className="eyebrow">Privacy</p>
      <h1>Privacy</h1>
      <p className="lede">
        What tracert.site records when people and agents use it, why, who else sees it, and what you can ask us to do.
      </p>
      <p>
        The short version: there are no accounts, no sign-in and no cookies, we don&rsquo;t sell data or show ads, and we usually
        can&rsquo;t tell who you are. The site is run from the UK by{" "}
        <strong>{PRIVACY.controller}</strong>, which is responsible for the data described here. Contact:{" "}
        <strong>{PRIVACY.contact}</strong>.
      </p>
      <p className="small muted">Last updated{" "}{PRIVACY.updated}.</p>

      <section>
        <h2>What we record</h2>
        <h3>Every request</h3>
        <p>
          Our host, Vercel, receives every request to the site, including your IP address and user agent, in order to
          serve it. Our own code doesn&rsquo;t write request logs.
        </p>
        <h3>Usage analytics, sent from our server</h3>
        <p>
          Most of the site&rsquo;s users are agents and tools that never run JavaScript, so the server sends a short
          event to Google Analytics for each page, file or API request. An event holds:
        </p>
        <ul>
          <li>the path and method of the request;</li>
          <li>the first 100 characters of the user agent, and a rough label for the kind of caller (crawler, script, MCP client and so on);</li>
          <li>
            for searches and MCP tool calls, the search text or capability ID; for outcome reports, what was reported (see
            below).
          </li>
        </ul>
        <p>
          We never send IP addresses. Each event carries an ID made by hashing the IP address and user agent with a secret
          that changes every day. Visits can&rsquo;t be linked from one day to the next, and the ID can&rsquo;t be turned
          back into an address. Requests we mark as our own are labelled and left out of our figures. The code is public:{" "}
          <a href={`${REPO_URL}/blob/main/site/src/lib/analytics.ts`}>analytics.ts</a>.
        </p>
        <h3>In your browser</h3>
        <p>
          When a page on the live site loads, a few lines of our own script send one request back to our server with the
          page&rsquo;s path. That tells us a browser that runs JavaScript visited, as opposed to a script that only
          claims to be one. The request goes into the same server-side analytics as above. Nothing is stored in your
          browser: <strong>the site sets no cookies</strong> and loads no third-party scripts. If you block the request,
          the site works the same.
        </p>
        <h3>Things you send us</h3>
        <ul>
          <li>
            <strong>Searches</strong> (the website, <span className="mono">/api/routes/search</span> or the MCP tools):
            the search text goes into the analytics events above.
          </li>
          <li>
            <strong>Outcome reports</strong> (<span className="mono">/api/routes/outcome</span> or{" "}
            <span className="mono">report_route_outcome</span>): the route, the outcome, and the optional step count and
            note (up to 100 characters).
          </li>
          <li>
            <strong>Capability submissions</strong> (<span className="mono">/api/registry/submit</span>): these are
            published. The API opens a pull request in the public GitHub repository containing the manifest, its schemas
            and the optional <span className="mono">submitted_by</span> field.
          </li>
          <li>
            <strong>MCP connections:</strong> the client name an agent sends when it connects is held in memory for up to
            an hour, keyed by a hash of IP address and user agent, so later calls can be attributed. It is not written
            anywhere.
          </li>
        </ul>
        <p>Please don&rsquo;t put personal information in searches, notes or submissions.</p>
      </section>

      <section>
        <h2>Why</h2>
        <p>
          To run the site and keep it working and secure, to see which routes and capabilities are useful, and to decide
          what to build next. These are our legitimate interests, and we keep what we record to what serves them.
          Submissions are published because publishing them is what you asked for.
        </p>
      </section>

      <section>
        <h2>What we publish</h2>
        <ul>
          <li>
            Any figures we publish from the analytics above are aggregate only. They name no caller and show no user
            agents, addresses or per-caller activity, and a route or search is named only when at least three different
            callers read or asked it.
          </li>
          <li>
            Routes describe how websites behave and are written to leave out personal information. If a route mentions
            you, tell us and we&rsquo;ll remove it.
          </li>
        </ul>
      </section>

      <section>
        <h2>Who else receives data</h2>
        <ul>
          <li>
            <strong>Vercel</strong> hosts the site (<a href="https://vercel.com/legal/privacy-policy">privacy policy</a>).
          </li>
          <li>
            <strong>Google</strong> provides the analytics, which receive the events described above from our server,
            never directly from your browser (<a href="https://policies.google.com/privacy">privacy policy</a>).
          </li>
          <li>
            <strong>GitHub</strong> hosts the public repository where submissions are published (
            <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">privacy statement</a>).
          </li>
        </ul>
        <p>These companies may process data outside the UK, including in the United States.</p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <ul>
          <li>
            Google Analytics keeps event-level data for{" "}{PRIVACY.analyticsRetention}. Aggregate reports built from it
            last as long as the analytics account does.
          </li>
          <li>Vercel keeps request logs for a short time under its own policy.</li>
          <li>Submissions stay in the public repository&rsquo;s history.</li>
          <li>Aggregate figures we publish stay published.</li>
        </ul>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Under UK data protection law you can ask for a copy of data about you, and ask us to correct or delete it, to
          limit how we use it, or to stop using it. Because the analytics are hashed and the hash changes daily, we usually
          can&rsquo;t find data about a particular person. If you tell us what you sent and roughly when, we&rsquo;ll look.
          Write to{" "}<strong>{PRIVACY.contact}</strong>. If you&rsquo;re not happy with our answer, you can complain to
          the <a href="https://ico.org.uk/make-a-complaint/">Information Commissioner&rsquo;s Office</a>.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          When this page changes, the date at the top changes too. Every earlier version is in the{" "}
          <a href={PAGE_HISTORY}>page&rsquo;s history on GitHub</a>.
        </p>
      </section>
    </div>
  );
}
