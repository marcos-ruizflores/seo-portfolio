import Link from "next/link";
import type { ToolDefinition } from "../../tools/registry";

export function ToolCard({ tool }: { tool: Pick<ToolDefinition, "slug" | "name" | "intro"> }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-brand"
    >
      <h3 className="font-medium group-hover:text-brand">{tool.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{tool.intro}</p>
    </Link>
  );
}
