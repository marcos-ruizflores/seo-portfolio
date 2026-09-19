import { SiteFooter } from "@seo/core/components/layout/SiteFooter";
import { SiteHeader } from "@seo/core/components/layout/SiteHeader";
import { rootMetadata } from "@seo/core/seo/metadata";
import { JsonLd, websiteJsonLd } from "@seo/core/seo/json-ld";
import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = rootMetadata(site);

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.language}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
        >
          Saltar al contenido
        </a>
        <SiteHeader site={site} />
        <div id="contenido" className="flex-1">
          {children}
        </div>
        <SiteFooter site={site} />
        <JsonLd data={websiteJsonLd(site)} />
      </body>
    </html>
  );
}
