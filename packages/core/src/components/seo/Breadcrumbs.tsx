import Link from "next/link";
import type { SiteConfig } from "../../config/site";
import { breadcrumbJsonLd, JsonLd, type Crumb } from "../../seo/json-ld";

/** Visible breadcrumbs plus their BreadcrumbList JSON-LD. The last one is the current page. */
export function Breadcrumbs({ site, crumbs }: { site: SiteConfig; crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Migas de pan" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="text-fg">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="hover:text-fg">
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(site, crumbs)} />
    </>
  );
}
