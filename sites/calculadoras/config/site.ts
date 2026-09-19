import { defineSiteConfig, indexableFromEnv, siteUrlFromEnv } from "@seo/core/config/site";

// Único sitio donde vive la identidad de esta web. El nombre es provisional
// hasta elegir dominio.
export const site = defineSiteConfig({
  name: "Calculadoras Laborales",
  url: siteUrlFromEnv("http://localhost:3001"),
  description:
    "Calculadoras laborales gratuitas para España: finiquito, indemnización por despido y más. Cálculos actualizados a 2026 y explicados paso a paso.",
  language: "es",
  locale: "es_ES",
  country: "ES",
  indexable: indexableFromEnv(),
  themeColor: "#0f766e",
  navigation: [{ label: "Calculadoras", href: "/" }],
  footerNavigation: [],
  social: {},
  owner: {
    name: "[PENDIENTE: nombre del titular]",
    email: "[PENDIENTE: email de contacto]",
  },
  analytics: {},
  monetization: { adsenseEnabled: false },
});

/** Rutas propias del sitio que ninguna calculadora puede usar como slug. */
export const reservedSlugs = [
  "blog",
  "calculadoras",
  "sobre-nosotros",
  "contacto",
  "privacidad",
  "cookies",
  "aviso-legal",
  "terminos",
];
