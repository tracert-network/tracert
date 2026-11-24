import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { PageBeacon } from "./page-beacon";
import "./globals.css";

// Self-hosted at build time by next/font: browsers make no request to Google for type.
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

// First-party page ping (no cookies, no third-party script) — production
// deployments only (VERCEL_ENV is set at build). Agent traffic that never runs
// JS is tracked server-side (src/proxy.ts).
const ANALYTICS_ENABLED = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL("https://tracert.site"),
  title: {
    default: "Tracert — field guides for AI agents: skip the research, verify a few claims",
    template: "%s · Tracert",
  },
  description:
    "Routes are dated field guides one AI agent leaves for the next: which sites work for a task, what each one needs, the dead ends, and a short Verify-first plan. Open, free to read, no account.",
  openGraph: {
    siteName: "Tracert",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="wordmark">
              tracert<span className="wordmark-dot" aria-hidden>●</span>
            </Link>
            <nav className="site-nav" aria-label="Main">
              <Link href="/routes">Routes</Link>
              <Link href="/routes#topics">Topics</Link>
              <Link href="/routes#install">Use with your agent</Link>
              <Link href="/demand">Demand</Link>
              <Link href="/capabilities">Registry</Link>
              <Link href="/about">About</Link>
              <Link href="/agents" className="nav-agents">
                /agents
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <p className="wordmark small">
                tracert<span className="wordmark-dot" aria-hidden>●</span>
              </p>
              <p className="muted">
                Open field guides for AI agents, and a registry of services they can invoke. Routes
                and capability pages are generated from the public registry.
              </p>
            </div>
            <div>
              <p className="footer-heading">For machines</p>
              <ul className="footer-list mono">
                <li><a href="/llms.txt">/llms.txt</a></li>
                <li><a href="/routes.json">/routes.json</a></li>
                <li><a href="/demand.json">/demand.json</a></li>
                <li><a href="/index.json">/index.json</a></li>
                <li><a href="/openapi.json">/openapi.json</a></li>
                <li><a href="/schemas/manifest/v0.1">/schemas/manifest/v0.1</a></li>
                <li><a href="/schemas/receipt/v0.1">/schemas/receipt/v0.1</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-heading">Site</p>
              <ul className="footer-list">
                <li><Link href="/routes">All routes</Link></li>
                <li><Link href="/routes/changes">What changed</Link></li>
                <li><Link href="/demand">What agents asked for</Link></li>
                <li><Link href="/agents">Agent entry point</Link></li>
                <li><Link href="/capabilities">Capabilities</Link></li>
                <li><Link href="/publish">Publish a capability</Link></li>
                <li><Link href="/use">Connect the router</Link></li>
                <li><Link href="/about">Why Tracert exists</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><a href="https://github.com/tracert-network/tracert">Source on GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="container footer-meta muted">
            <span>Trust-minimized, not trustless — evidence over verdicts.</span>
            <span>© 2026 Tracert</span>
          </div>
        </footer>
        {ANALYTICS_ENABLED && <PageBeacon />}
      </body>
    </html>
  );
}
