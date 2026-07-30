import { SITE_ORIGIN, allCapabilities } from "@/lib/registry";

export const dynamic = "force-static";

export function GET() {
  const caps = allCapabilities();
  const capLines = caps
    .map(({ manifest }) => {
      const c = manifest.capability;
      return `- [${c.id}](${SITE_ORIGIN}/capabilities/${c.id}): ${c.promise} (${c.status}, ${c.pricing.free ? "free" : "paid"}; manifest: ${SITE_ORIGIN}/capabilities/${c.id}/manifest.json)`;
    })
    .join("\n");

  const body = `# Tracert

> The open route from agent intent to a provable outcome. Tracert is an open capability network: AI agents discover, evaluate and invoke free or pay-per-use services through one interface, with transparent evidence (TRACE Receipts) of what was promised, what was paid and what happened. TRACE = Transparent Registry for Agent Capabilities and Execution.

Free capabilities never require a wallet or account. Quotes are exact and expire. Every execution reaches an explicit terminal state with machine-actionable reasons. Trust model: transparent evidence + buyer-side policy — no universal quality score.

## Machine entry points

- [Registry index](${SITE_ORIGIN}/index.json): every capability with status, pricing, media types and manifest URL
- [TRACE Manifest schema](${SITE_ORIGIN}/schemas/manifest/v0.1): JSON Schema 2020-12 for capability manifests
- [TRACE Receipt schema](${SITE_ORIGIN}/schemas/receipt/v0.1): JSON Schema for verifiable execution records
- [Agent guide](${SITE_ORIGIN}/agents): how to select, invoke and verify capabilities

## Capabilities

${capLines}

## For suppliers

- [Publish a capability](${SITE_ORIGIN}/publish): one bounded promise per TRACE Manifest, submitted by pull request to the public registry at https://github.com/tracert-network/tracert; free listings are first-class

## For agent developers

- [Connect your agent](${SITE_ORIGIN}/use): the five-tool MCP router (search_capabilities, get_capability, get_quote, invoke_capability, get_execution); local install today, hosted endpoint coming
- [About the network](${SITE_ORIGIN}/about): lifecycle, trust model, standards posture (MCP, A2A, MPP, x402, AP2)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
