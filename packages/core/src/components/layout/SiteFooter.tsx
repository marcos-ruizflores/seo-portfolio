import Link from "next/link";
import type { SiteConfig } from "../../config/site";

export function SiteFooter({ site }: { site: SiteConfig }) {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        {site.footerNavigation.length > 0 && (
          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {site.footerNavigation.map((item) => (
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
    </footer>
  );
}
