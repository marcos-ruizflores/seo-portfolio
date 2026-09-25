import Link from "next/link";
import type { SiteConfig } from "../../config/site";
import { JsonLd, webApplicationJsonLd } from "../../seo/json-ld";
import type { ToolDefinition } from "../../tools/registry";
import { AdSlot } from "../ads/AdSlot";
import { Breadcrumbs } from "../seo/Breadcrumbs";
import { FaqList } from "./FaqList";
import { ToolCard } from "./ToolCard";

export type RelatedArticle = { title: string; path: string };

/**
 * Full landing page for a tool: H1, intro, the tool itself, editorial content,
 * FAQ and internal links. Every tool uses this template.
 */
export function ToolPage({
  site,
  tool,
  relatedTools,
  relatedArticles = [],
  applicationCategory,
}: {
  site: SiteConfig;
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
  relatedArticles?: RelatedArticle[];
  /** schema.org value, e.g. "DeveloperApplication" or "FinanceApplication". */
  applicationCategory: string;
}) {
  const { Component, Content } = tool;
  const path = `/${tool.slug}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        site={site}
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: tool.name, path },
        ]}
      />

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tool.h1}</h1>
        <p className="mt-3 text-lg text-muted">{tool.intro}</p>
      </header>

      <section aria-label={tool.name} className="mt-8">
        <Component />
      </section>

      <AdSlot site={site} position="content-middle" />

      <article className="prose mt-12 max-w-none prose-neutral dark:prose-invert prose-headings:tracking-tight prose-a:text-brand prose-code:before:content-none prose-code:after:content-none">
        <Content />
      </article>

      {tool.faq.length > 0 && (
        <section className="mt-12" aria-labelledby="faq">
          <h2 id="faq" className="mb-4 text-2xl font-semibold tracking-tight">
            Preguntas frecuentes
          </h2>
          <FaqList items={tool.faq} />
        </section>
      )}

      {relatedTools.length > 0 && (
        <section className="mt-12" aria-labelledby="related-tools">
          <h2 id="related-tools" className="mb-4 text-2xl font-semibold tracking-tight">
            Herramientas relacionadas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedTools.map((related) => (
              <ToolCard key={related.slug} tool={related} />
            ))}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="mt-12" aria-labelledby="related-articles">
          <h2 id="related-articles" className="mb-4 text-2xl font-semibold tracking-tight">
            Artículos relacionados
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            {relatedArticles.map((article) => (
              <li key={article.path}>
                <Link href={article.path} className="text-brand hover:underline">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-sm text-muted">
        Última revisión:{" "}
        <time dateTime={tool.updatedAt}>
          {new Date(tool.updatedAt).toLocaleDateString(site.language, { dateStyle: "long" })}
        </time>
      </p>

      <JsonLd
        data={webApplicationJsonLd(site, {
          name: tool.name,
          description: tool.description,
          path,
          category: applicationCategory,
        })}
      />
    </main>
  );
}
