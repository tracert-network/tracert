import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page and machine export is generated from the registry at build
  // time; nothing here needs request-time compute yet.
  trailingSlash: false,
};

export default nextConfig;
