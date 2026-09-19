import Link from "next/link";
import type { SiteConfig } from "../../config/site";

export function SiteHeader({ site }: { site: SiteConfig }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-mono text-base font-semibold tracking-tight">
          {site.name}
        </Link>
        {site.navigation.length > 0 && (
          <nav aria-label="Principal">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
