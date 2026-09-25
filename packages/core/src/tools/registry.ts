import type { ComponentType } from "react";

export type Faq = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  /** Public route: /{slug}. Lowercase and hyphens. */
  slug: string;
  /** Short name for cards and links. */
  name: string;
  /** SEO title (without the site name). */
  title: string;
  /** Meta description: 120-160 characters. */
  description: string;
  h1: string;
  /** Paragraph under the H1: what the tool does, in one or two sentences. */
  intro: string;
  category: string;
  keywords: string[];
  faq: Faq[];
  relatedTools: string[];
  relatedArticles: string[];
  /** ISO date of the last content review. */
  updatedAt: string;
  /** Interactive UI (client component). */
  Component: ComponentType;
  /** Editorial content: how it works, examples, extra info (MDX). */
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
 * Builds the registry and checks it's consistent: unique, well formed slugs and
 * relatedTools that point to tools that exist. Fails at build/test time instead
 * of shipping broken links.
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
