import { describe, expect, it } from "vitest";
import { createToolRegistry, type ToolDefinition } from "./registry";

function tool(slug: string, overrides: Partial<ToolDefinition> = {}): ToolDefinition {
  return {
    slug,
    name: slug,
    title: slug,
    description: "",
    h1: slug,
    intro: "",
    category: "General",
    keywords: [],
    faq: [],
    relatedTools: [],
    relatedArticles: [],
    updatedAt: "2026-09-19",
    Component: () => null,
    Content: () => null,
    ...overrides,
  };
}

describe("createToolRegistry", () => {
  it("resuelve herramientas relacionadas y agrupa por categoría", () => {
    const registry = createToolRegistry([
      tool("a", { relatedTools: ["b"], category: "JSON" }),
      tool("b", { category: "JSON" }),
      tool("c", { category: "Fechas" }),
    ]);
    expect(registry.related(registry.get("a")!).map((t) => t.slug)).toEqual(["b"]);
    expect(registry.categories().map((g) => [g.category, g.tools.length])).toEqual([
      ["JSON", 2],
      ["Fechas", 1],
    ]);
  });

  it("rechaza slugs duplicados, mal formados o reservados", () => {
    expect(() => createToolRegistry([tool("a"), tool("a")])).toThrow(/duplicado/);
    expect(() => createToolRegistry([tool("Mal Slug")])).toThrow(/inválido/);
    expect(() => createToolRegistry([tool("blog")], ["blog"])).toThrow(/reservada/);
  });

  it("rechaza enlaces a herramientas inexistentes o a sí misma", () => {
    expect(() => createToolRegistry([tool("a", { relatedTools: ["x"] })])).toThrow(/inexistente/);
    expect(() => createToolRegistry([tool("a", { relatedTools: ["a"] })])).toThrow(/sí misma/);
  });
});
