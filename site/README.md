# tracert.site

The public face of [Tracert](../README.md) — human routes, an agent entry point, capability pages and machine exports, **all generated from the [registry](../registry/) at build time.** No hand-maintained marketing for a capability: every fact on a capability page comes from its TRACE Manifest.

Next.js (App Router), fully static. Zero UI dependencies; a small hand-rolled design system that adapts to light and dark.

## Develop

```bash
npm ci
npm run dev     # http://localhost:3000
npm run build   # static export of every route
```

The site reads the registry from a sibling `../registry` by default. Point elsewhere with `TRACERT_REGISTRY_DIR`. After changing manifests, rebuild — pages are baked at build time.

## Routes

**Human:** `/` (routes fork for humans vs agents) · `/about` · `/publish` · `/use` · `/capabilities` · `/capabilities/<id>`

**Machine:**

| URL | Serves |
|---|---|
| `/llms.txt` | This site, summarized for language models |
| `/index.json` | The registry snapshot — every capability with status, pricing, media types, manifest URL |
| `/schemas/manifest/v0.1` | TRACE Manifest JSON Schema (served at its own `$id`) |
| `/schemas/receipt/v0.1` | TRACE Receipt JSON Schema (served at its own `$id`) |
| `/capabilities/<id>/manifest.json` | One capability's canonical manifest, with an `X-Tracert-Manifest-Hash` header |

## Deploy (Vercel)

The app lives in this `site/` subdirectory of the monorepo. In the Vercel project, set **Root Directory = `site`**; the framework preset is Next.js. The build reads `../registry`, which the registry-directory resolver locates from either the `site` root or the repository root — no extra configuration required. See [`../DEPLOY.md`](../DEPLOY.md).
