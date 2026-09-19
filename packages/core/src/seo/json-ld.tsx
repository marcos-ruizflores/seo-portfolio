import type { SiteConfig } from "../config/site";
import { canonicalUrl } from "./metadata";

type JsonLdObject = Record<string, unknown>;

/** Serializa JSON-LD escapando "<" para que no se pueda cerrar el <script>. */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function websiteJsonLd(site: SiteConfig): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: canonicalUrl(site, "/"),
    description: site.description,
    inLanguage: site.language,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(site: SiteConfig, crumbs: Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(site, crumb.path),
    })),
  };
}

export function webApplicationJsonLd(
  site: SiteConfig,
  app: { name: string; description: string; path: string; category: string },
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: app.name,
    description: app.description,
    url: canonicalUrl(site, app.path),
    applicationCategory: app.category,
    operatingSystem: "Any",
    inLanguage: site.language,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };
}

export function articleJsonLd(
  site: SiteConfig,
  article: {
    title: string;
    description: string;
    path: string;
    publishedTime: string;
    modifiedTime?: string;
    author: string;
  },
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: canonicalUrl(site, article.path),
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime ?? article.publishedTime,
    inLanguage: site.language,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: site.name, url: canonicalUrl(site, "/") },
  };
}
