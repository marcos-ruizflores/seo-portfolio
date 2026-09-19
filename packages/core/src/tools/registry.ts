import type { ComponentType } from "react";

export type Faq = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  /** Ruta pública: /{slug}. Minúsculas y guiones. */
  slug: string;
  /** Nombre corto para tarjetas y enlaces. */
  name: string;
  /** Título SEO (sin el nombre del sitio). */
  title: string;
  /** Meta description: 120–160 caracteres. */
  description: string;
  h1: string;
  /** Párrafo bajo el H1: qué hace la herramienta, en una o dos frases. */
  intro: string;
  category: string;
  keywords: string[];
  faq: Faq[];
  relatedTools: string[];
  relatedArticles: string[];
  /** Fecha ISO de la última revisión del contenido. */
  updatedAt: string;
  /** Interfaz interactiva (client component). */
  Component: ComponentType;
  /** Contenido editorial: cómo funciona, ejemplos, información adicional (MDX). */
  Content: ComponentType;
};

export type ToolRegistry = {
  all: ToolDefinition[];
  get(slug: string): ToolDefinition | undefined;
  related(tool: ToolDefinition): ToolDefinition[];
  categories(): { category: string; tools: ToolDefinition[] }[];
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Crea el registro y valida su coherencia: slugs únicos y bien formados, y
 * relatedTools que apunten a herramientas existentes. Falla en build/test
 * en vez de publicar enlaces rotos.
 */
export function createToolRegistry(
  tools: ToolDefinition[],
  reservedSlugs: string[] = [],
): ToolRegistry {
  const bySlug = new Map<string, ToolDefinition>();
  const reserved = new Set(reservedSlugs);

  for (const tool of tools) {
    if (!SLUG_PATTERN.test(tool.slug)) {
      throw new Error(`Slug de herramienta inválido: "${tool.slug}"`);
    }
    if (reserved.has(tool.slug)) {
      throw new Error(`El slug "${tool.slug}" choca con una ruta reservada del sitio`);
    }
    if (bySlug.has(tool.slug)) {
      throw new Error(`Slug de herramienta duplicado: "${tool.slug}"`);
    }
    bySlug.set(tool.slug, tool);
  }

  for (const tool of tools) {
    for (const related of tool.relatedTools) {
      if (!bySlug.has(related)) {
        throw new Error(`"${tool.slug}" enlaza a una herramienta inexistente: "${related}"`);
      }
      if (related === tool.slug) {
        throw new Error(`"${tool.slug}" no puede enlazarse a sí misma`);
      }
    }
  }

  return {
    all: tools,
    get: (slug) => bySlug.get(slug),
    related: (tool) => tool.relatedTools.map((slug) => bySlug.get(slug)!),
    categories: () => {
      const groups = new Map<string, ToolDefinition[]>();
      for (const tool of tools) {
        groups.set(tool.category, [...(groups.get(tool.category) ?? []), tool]);
      }
      return [...groups].map(([category, grouped]) => ({ category, tools: grouped }));
    },
  };
}
