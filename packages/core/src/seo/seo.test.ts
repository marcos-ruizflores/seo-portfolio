import { describe, expect, it } from "vitest";
import { defineSiteConfig, type SiteConfig } from "../config/site";
import { serializeJsonLd } from "./json-ld";
import { buildMetadata, canonicalUrl } from "./metadata";
import { buildRobots, buildSitemap } from "./routes";

function site(overrides: Partial<SiteConfig> = {}): SiteConfig {
  return defineSiteConfig({
    name: "Test",
    url: "https://example.com/",
    description: "desc",
    language: "es",
    locale: "es_ES",
    country: "ES",
    indexable: true,
    themeColor: "#000",
    navigation: [],
    footerNavigation: [],
    social: {},
    owner: { name: "", email: "" },
    analytics: {},
    monetization: { adsenseEnabled: false },
    ...overrides,
  });
}

describe("canonicalUrl", () => {
  it("normaliza barras y quita la barra final de la URL base", () => {
    expect(canonicalUrl(site(), "/")).toBe("https://example.com/");
    expect(canonicalUrl(site(), "")).toBe("https://example.com/");
    expect(canonicalUrl(site(), "formatear-json")).toBe("https://example.com/formatear-json");
    expect(canonicalUrl(site(), "//blog/post/")).toBe("https://example.com/blog/post");
  });
});

describe("buildMetadata", () => {
  it("pone canonical y Open Graph con la misma URL", () => {
    const meta = buildMetadata(site(), { title: "T", description: "D", path: "/x" });
    expect(meta.alternates?.canonical).toBe("https://example.com/x");
    expect(meta.openGraph?.url).toBe("https://example.com/x");
    expect(meta.robots).toBeUndefined();
  });

  it("marca noindex si el sitio no es indexable (previews)", () => {
    const meta = buildMetadata(site({ indexable: false }), {
      title: "T",
      description: "D",
      path: "/x",
    });
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it("respeta noindex explícito de página", () => {
    const meta = buildMetadata(site(), { title: "T", description: "D", path: "/x", noindex: true });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});

describe("sitemap y robots", () => {
  it("deduplica URLs del sitemap", () => {
    const map = buildSitemap(site(), [{ path: "/" }, { path: "/a" }, { path: "/a/" }]);
    expect(map.map((e) => e.url)).toEqual(["https://example.com/", "https://example.com/a"]);
  });

  it("sitemap vacío y robots bloqueando todo si no es indexable", () => {
    const preview = site({ indexable: false });
    expect(buildSitemap(preview, [{ path: "/" }])).toEqual([]);
    expect(buildRobots(preview)).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("robots enlaza el sitemap en producción", () => {
    expect(buildRobots(site()).sitemap).toBe("https://example.com/sitemap.xml");
  });
});

describe("serializeJsonLd", () => {
  it("escapa < para no poder cerrar el <script>", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)" })).not.toContain("</script>");
  });
});
