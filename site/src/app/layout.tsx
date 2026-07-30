import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tracert.site"),
  title: {
    default: "Tracert — the open route from agent intent to a provable outcome",
    template: "%s · Tracert",
  },
  description:
    "An open capability network where AI agents discover, evaluate and invoke free or pay-per-use services through one interface, with transparent evidence of what was promised, what was paid and what happened.",
  openGraph: {
    siteName: "Tracert",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="wordmark">
              tracert<span className="wordmark-dot" aria-hidden>●</span>
            </Link>
            <nav className="site-nav" aria-label="Main">
              <Link href="/capabilities">Capabilities</Link>
              <Link href="/publish">Publish</Link>
              <Link href="/use">Use</Link>
              <Link href="/agents" className="nav-agents">
                /agents
              </Link>
              <Link href="/about">About</Link>
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
                TRACE — Transparent Registry for Agent Capabilities and Execution. Every page on
                this site is generated from the public registry; nothing here is hand-maintained
                marketing.
              </p>
            </div>
            <div>
              <p className="footer-heading">For machines</p>
              <ul className="footer-list mono">
                <li><a href="/llms.txt">/llms.txt</a></li>
                <li><a href="/index.json">/index.json</a></li>
                <li><a href="/schemas/manifest/v0.1">/schemas/manifest/v0.1</a></li>
                <li><a href="/schemas/receipt/v0.1">/schemas/receipt/v0.1</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-heading">Routes</p>
              <ul className="footer-list">
                <li><Link href="/agents">Agent entry point</Link></li>
                <li><Link href="/publish">Publish a capability</Link></li>
                <li><Link href="/use">Connect an agent</Link></li>
                <li><Link href="/about">Why Tracert exists</Link></li>
              </ul>
            </div>
          </div>
          <div className="container footer-meta muted">
            <span>Trust-minimized, not trustless — evidence over verdicts.</span>
            <span>© 2026 Tracert</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
