import { buildSitemap } from "@seo/core/seo/routes";
import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { tools } from "@/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(site, [
    { path: "/", priority: 1 },
    ...tools.all.map((tool) => ({
      path: `/${tool.slug}`,
      lastModified: tool.updatedAt,
      priority: 0.8,
    })),
  ]);
}
