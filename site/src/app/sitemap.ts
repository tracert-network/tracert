import type { MetadataRoute } from "next";
import { SITE_ORIGIN, allCapabilities } from "@/lib/registry";
import { allRoutes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/routes", "/about", "/publish", "/use", "/agents", "/capabilities"].map((p) => ({
    url: `${SITE_ORIGIN}${p}`,
  }));
  const caps = allCapabilities().map(({ manifest }) => ({
    url: `${SITE_ORIGIN}/capabilities/${manifest.capability.id}`,
  }));
  const routes = allRoutes().map((r) => ({ url: `${SITE_ORIGIN}/routes/${r.slug}`, lastModified: r.last_verified }));
  return [...statics, ...routes, ...caps];
}
