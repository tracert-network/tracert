import type { MetadataRoute } from "next";
import { SITE_ORIGIN, allCapabilities } from "@/lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/about", "/publish", "/use", "/agents", "/capabilities"].map((p) => ({
    url: `${SITE_ORIGIN}${p}`,
  }));
  const caps = allCapabilities().map(({ manifest }) => ({
    url: `${SITE_ORIGIN}/capabilities/${manifest.capability.id}`,
  }));
  return [...statics, ...caps];
}
