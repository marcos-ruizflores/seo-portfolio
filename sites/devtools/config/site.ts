import { defineSiteConfig, indexableFromEnv, siteUrlFromEnv } from "@seo/core/config/site";

// Único sitio donde vive la identidad de esta web. El nombre es provisional
// hasta elegir dominio.
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

/** Rutas propias del sitio que ninguna herramienta puede usar como slug. */
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
