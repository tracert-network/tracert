import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page and machine export is generated from the registry at build
  // time; nothing here needs request-time compute yet.
  trailingSlash: false,
  // Paths agents and tools probe for that live elsewhere here.
  async redirects() {
    return [
      { source: "/docs", destination: "/agents", permanent: true },
      { source: "/docs/mcp", destination: "/agents", permanent: true },
      { source: "/swagger.json", destination: "/openapi.json", permanent: true },
      { source: "/llm.txt", destination: "/llms.txt", permanent: true },
    ];
  },
};

export default nextConfig;
