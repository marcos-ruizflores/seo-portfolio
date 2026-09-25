import type { MetadataRoute } from "next";
import type { SiteConfig } from "../config/site";
import { canonicalUrl } from "./metadata";

export type SitemapEntry = {
  path: string;
  lastModified?: string;
  priority?: number;
};

/** Only pass indexable pages here: no 404, previews or internal routes. */
export function buildSitemap(site: SiteConfig, entries: SitemapEntry[]): MetadataRoute.Sitemap {
  if (!site.indexable) return [];

  const seen = new Set<string>();
  const sitemap: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    const url = canonicalUrl(site, entry.path);
    if (seen.has(url)) continue;
    seen.add(url);
    sitemap.push({
      url,
      lastModified: entry.lastModified,
      priority: entry.priority,
    });
  }
  return sitemap;
}

export function buildRobots(site: SiteConfig): MetadataRoute.Robots {
  if (!site.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: canonicalUrl(site, "/sitemap.xml"),
  };
}
