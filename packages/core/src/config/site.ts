export type NavItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  /** URL absoluta sin barra final, p. ej. https://example.com */
  url: string;
  description: string;
  /** Código BCP 47 para <html lang>, p. ej. "es" */
  language: string;
  /** Locale de Open Graph, p. ej. "es_ES" */
  locale: string;
  country: string;
  /**
   * false en local y en previews (*.pages.dev): robots.txt bloquea todo y cada
   * página lleva noindex, para que Google no indexe copias duplicadas.
   */
  indexable: boolean;
  themeColor: string;
  navigation: NavItem[];
  footerNavigation: NavItem[];
  social: {
    twitter?: string;
    github?: string;
  };
  /** Datos del titular para páginas legales y contacto. Los completa el propietario. */
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

/** Lee la URL pública del entorno de build (NEXT_PUBLIC_SITE_URL). */
export function siteUrlFromEnv(fallback = "http://localhost:3000"): string {
  return process.env.NEXT_PUBLIC_SITE_URL || fallback;
}

/** Solo se indexa si el build de producción lo pide explícitamente. */
export function indexableFromEnv(): boolean {
  return process.env.NEXT_PUBLIC_INDEXABLE === "true";
}
