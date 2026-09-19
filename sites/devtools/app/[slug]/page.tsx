import { ToolPage } from "@seo/core/components/tools/ToolPage";
import { buildMetadata } from "@seo/core/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { tools } from "@/tools";

// Solo existen las rutas de herramientas registradas; cualquier otra es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return tools.all.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const tool = tools.get((await params).slug);
  if (!tool) return {};
  return buildMetadata(site, {
    title: tool.title,
    description: tool.description,
    path: `/${tool.slug}`,
    keywords: tool.keywords,
  });
}

export default async function ToolRoute({ params }: PageProps<"/[slug]">) {
  const tool = tools.get((await params).slug);
  if (!tool) notFound();

  return (
    <ToolPage
      site={site}
      tool={tool}
      relatedTools={tools.related(tool)}
      applicationCategory="DeveloperApplication"
    />
  );
}
