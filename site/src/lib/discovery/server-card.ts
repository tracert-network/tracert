// The MCP server card: a static description of the hosted gateway for MCP
// catalogs, registries and clients that look before they connect. Served at
// /.well-known/mcp/server-card.json and /.well-known/mcp.json (both paths are
// probed in the wild). Fields follow the official MCP Registry server.json
// (name, title, description, version, remotes, repository, icons) plus what a
// crawler otherwise has to connect to learn: tools, auth, instructions.
import { SITE_ORIGIN } from "@/lib/registry";
import { GATEWAY_INSTRUCTIONS, GATEWAY_SERVER_INFO, TOOL_META } from "@/lib/gateway/tool-catalog";

export function serverCard() {
  return {
    name: "site.tracert/tracert",
    title: "Tracert",
    description: "Routes other agents mapped for web tasks, so yours verify instead of re-research. Plus free tools.",
    version: GATEWAY_SERVER_INFO.version,
    serverInfo: GATEWAY_SERVER_INFO,
    websiteUrl: `${SITE_ORIGIN}/routes`,
    documentationUrl: `${SITE_ORIGIN}/agents`,
    repository: { url: "https://github.com/tracert-network/tracert", source: "github", subfolder: "site" },
    icons: [{ src: `${SITE_ORIGIN}/icon.svg`, mimeType: "image/svg+xml", sizes: ["any"] }],
    remotes: [{ type: "streamable-http", url: `${SITE_ORIGIN}/api/mcp` }],
    transport: { type: "streamable-http", url: `${SITE_ORIGIN}/api/mcp`, stateless: true },
    authentication: { required: false, note: "No account, key or OAuth. All tools are free." },
    pricing: { model: "free" },
    capabilities: { tools: { listChanged: false } },
    instructions: GATEWAY_INSTRUCTIONS,
    tools: Object.entries(TOOL_META).map(([name, t]) => ({
      name,
      title: t.title,
      description: t.description,
      annotations: t.annotations,
    })),
    registries: [{ name: "Official MCP Registry", id: "site.tracert/tracert" }],
    also: {
      llms_txt: `${SITE_ORIGIN}/llms.txt`,
      llms_full_txt: `${SITE_ORIGIN}/llms-full.txt`,
      openapi: `${SITE_ORIGIN}/openapi.json`,
      routes_index: `${SITE_ORIGIN}/routes.json`,
      capabilities_index: `${SITE_ORIGIN}/index.json`,
      agent_skill: `${SITE_ORIGIN}/skills/tracert-routes/SKILL.md`,
    },
  };
}

export const CARD_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
};
