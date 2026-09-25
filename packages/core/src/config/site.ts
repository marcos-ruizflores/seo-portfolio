export type NavItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  /** URL absoluta sin barra final, p. ej. https://example.com */
  url: string;
  description: string;
  /** BCP 47 code for <html lang>, e.g. "es" */
  language: string;
  /** Open Graph locale, e.g. "es_ES" */
  locale: string;
  country: string;
  /**
   * false locally and on previews (*.pages.dev): robots.txt blocks everything and
   * every page gets noindex, so Google never indexes duplicate copies.
   */
  indexable: boolean;
  themeColor: string;
  navigation: NavItem[];
  footerNavigation: NavItem[];
  social: {
    twitter?: string;
    github?: string;
  };
  /** Owner details for the legal and contact pages. Filled in by the site owner. */
  owner: {
    name: string;
    email: string;
  };
  analytics: {
    cloudflareBeaconToken?: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
  };
  monetization: {
    adsenseEnabled: boolean;
    adsensePublisherId?: string;
  };
};

export function defineSiteConfig(config: SiteConfig): SiteConfig {
  return { ...config, url: config.url.replace(/\/+$/, "") };
}

/** Reads the public URL from the build env (NEXT_PUBLIC_SITE_URL). */
export function siteUrlFromEnv(fallback = "http://localhost:3000"): string {
  return process.env.NEXT_PUBLIC_SITE_URL || fallback;
}

/** Only indexable when the production build explicitly asks for it. */
export function indexableFromEnv(): boolean {
  return process.env.NEXT_PUBLIC_INDEXABLE === "true";
}
