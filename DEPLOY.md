# Deploying tracert.site

The website is the Next.js app in [`site/`](site/). It builds fully static from the registry, so any static/Node host works; these notes cover Vercel + the `tracert.site` domain.

## 1. Vercel project

Import `tracert-network/tracert` into Vercel (account: `robin-blocks`) and set:

| Setting | Value |
|---|---|
| **Root Directory** | `site` |
| Framework Preset | Next.js (auto-detected) |
| Build Command | *(default)* `next build` |
| Install Command | *(default)* `npm install` |

The build reads `../registry`; the registry-directory resolver in `site/src/lib/registry.ts` finds it from either the `site` root or the repo root, so no environment variable is required. (Optional override: `TRACERT_REGISTRY_DIR`.)

A preview deployment is produced on every push; `main` promotes to production once the domain is attached.

## 2. Domain — recommendation: Cloudflare DNS, "DNS only"

Since Cloudflare already holds DNS for another project, keep `tracert.site` there too — **one DNS dashboard** — but point it at Vercel with the Cloudflare proxy **disabled** (grey cloud), letting Vercel own TLS and the edge.

**Why DNS-only and not Cloudflare's proxy (orange cloud):** stacking Cloudflare's proxy in front of Vercel's edge means two CDNs and two TLS layers — a recurring source of redirect loops, cache confusion, and cert-issuance failures — for little gain, since Vercel already provides global edge caching, automatic TLS, DDoS mitigation and a WAF. It also matters specifically here: this site serves schema documents and manifests at fixed URLs with `application/schema+json` content-types (the `$id`s embedded in every manifest and receipt). Keeping Vercel in sole charge of the edge means no Cloudflare cache or transform rule can silently alter those responses.

### Steps

1. In Vercel → Project → **Domains**, add `tracert.site` (and `www.tracert.site` if you want it). Vercel shows the exact records — typically:
   - apex `tracert.site` → **A** `76.76.21.21`
   - `www` → **CNAME** `cname.vercel-dns.com`
   *(use whatever Vercel displays; it can differ per project.)*
2. In Cloudflare → DNS, add those records with **Proxy status: DNS only** (grey cloud, not orange).
3. If Cloudflare's SSL/TLS mode is a factor elsewhere, DNS-only records bypass it — Vercel issues and serves the certificate directly. Vercel verifies and provisions the cert within minutes.

### Alternative — Vercel nameservers

If you'd rather not touch records by hand, delegate the domain's nameservers to Vercel and it manages everything. Simplest possible setup; the tradeoff is that `tracert.site`'s DNS then lives apart from your other project's. Given you already run Cloudflare, DNS-only there is the better fit — you keep one pane of glass without the double-proxy risk.

## 3. Verify after deploy

```bash
# schemas resolve at their own $id URLs, correct content-type
curl -sI https://tracert.site/schemas/manifest/v0.1 | grep -i content-type   # application/schema+json
curl -s  https://tracert.site/index.json | head
curl -s  https://tracert.site/llms.txt   | head
```

Those `$id` URLs are the identifiers embedded in every manifest and receipt, so confirming they serve the right bytes with the right content-type is the deploy's real acceptance test.
