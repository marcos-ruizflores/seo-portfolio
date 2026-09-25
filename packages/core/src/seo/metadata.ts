import type { Metadata } from "next";
import type { SiteConfig } from "../config/site";

/** Absolute canonical URL, no trailing slash except on the home page. */
export function canonicalUrl(site: SiteConfig, path: string): string {
  const clean = ("/" + path.replace(/^\/+/, "")).replace(/\/+$/, "");
  return clean === "" ? `${site.url}/` : `${site.url}${clean}`;
}

/** Base metadata for the root layout: title template, verification, robots. */
export function rootMetadata(site: SiteConfig): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    applicationName: site.name,
    robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
    verification: site.analytics.googleSiteVerification
      ? { google: site.analytics.googleSiteVerification }
      : undefined,
    openGraph: {
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary",
      site: site.social.twitter,
    },
  };
}

export type PageSeo = {
  /** Title without the site name, the layout template adds it. */
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authors?: string[];
  };
};

/** Metadata for a single page. Every page should go through this. */
export function buildMetadata(site: SiteConfig, page: PageSeo): Metadata {
  const url = canonicalUrl(site, page.path);
  const noindex = page.noindex || !site.indexable;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: !page.noindex } : undefined,
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: site.name,
      locale: site.locale,
      ...(page.article
        ? {
            type: "article",
            publishedTime: page.article.publishedTime,
            modifiedTime: page.article.modifiedTime,
            authors: page.article.authors,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}
