import { defineSiteConfig, indexableFromEnv, siteUrlFromEnv } from "@seo/core/config/site";

// Single place for this site's identity. The name is a placeholder until the
// domain is picked.
export const site = defineSiteConfig({
  name: "DevKit",
  url: siteUrlFromEnv(),
  description:
    "Herramientas online gratuitas para desarrolladores: formatear JSON, decodificar JWT, generar UUID y más. Todo funciona en tu navegador.",
  language: "es",
  locale: "es_ES",
  country: "ES",
  indexable: indexableFromEnv(),
  themeColor: "#2f5bd8",
  navigation: [{ label: "Herramientas", href: "/" }],
  footerNavigation: [],
  social: {},
  owner: {
    name: "[PENDIENTE: nombre del titular]",
    email: "[PENDIENTE: email de contacto]",
  },
  analytics: {},
  monetization: { adsenseEnabled: false },
});

/** Site routes no tool is allowed to use as its slug. */
export const reservedSlugs = [
  "blog",
  "herramientas",
  "sobre-nosotros",
  "contacto",
  "privacidad",
  "cookies",
  "aviso-legal",
  "terminos",
];
