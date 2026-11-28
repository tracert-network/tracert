import type { MetadataRoute } from "next";
import { SITE_ORIGIN, allCapabilities } from "@/lib/registry";
import { allHubs, allRoutes, hubLastVerified } from "@/lib/routes";
import { allEditions } from "@/lib/demand";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/routes", "/routes/changes", "/demand", "/about", "/privacy", "/publish", "/use", "/agents", "/capabilities"].map((p) => ({
    url: `${SITE_ORIGIN}${p}`,
  }));
  const caps = allCapabilities().map(({ manifest }) => ({
    url: `${SITE_ORIGIN}/capabilities/${manifest.capability.id}`,
  }));
  const routes = allRoutes().map((r) => ({ url: `${SITE_ORIGIN}/routes/${r.slug}`, lastModified: r.last_verified }));
  const hubs = allHubs().map((h) => ({ url: `${SITE_ORIGIN}/routes/topics/${h.slug}`, lastModified: hubLastVerified(h) }));
  const demand = allEditions().map((e) => ({ url: `${SITE_ORIGIN}/demand/${e.id}`, lastModified: e.generated_at.slice(0, 10) }));
  return [...statics, ...hubs, ...routes, ...demand, ...caps];
}
