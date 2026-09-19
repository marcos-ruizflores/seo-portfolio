import { ToolCard } from "@seo/core/components/tools/ToolCard";
import { buildMetadata } from "@seo/core/seo/metadata";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { tools } from "@/tools";

export const metadata: Metadata = {
  ...buildMetadata(site, {
    title: "Herramientas online gratis para desarrolladores",
    description: site.description,
    path: "/",
  }),
  // En la home el título va completo, sin la plantilla "| DevKit".
  title: { absolute: `${site.name}: herramientas online gratis para desarrolladores` },
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Herramientas online para desarrolladores
        </h1>
        <p className="mt-4 text-lg text-muted">
          Gratis, rápidas y sin registro. Todo se ejecuta en tu navegador: tus datos no salen de tu
          equipo.
        </p>
      </header>

      {tools.categories().map(({ category, tools: grouped }) => (
        <section key={category} className="mt-12" aria-labelledby={`cat-${category}`}>
          <h2 id={`cat-${category}`} className="mb-4 text-xl font-semibold tracking-tight">
            {category}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
