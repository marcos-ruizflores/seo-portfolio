import type { SiteConfig } from "../../config/site";

export type AdPosition =
  "header" | "content-top" | "content-middle" | "content-bottom" | "sidebar" | "footer";

/**
 * Hueco publicitario. Mientras monetization.adsenseEnabled sea false no
 * renderiza nada (ni espacio reservado). Al activar AdSense, aquí irá el
 * bloque <ins class="adsbygoogle"> con altura mínima fija para evitar CLS.
 */
export function AdSlot({ site, position }: { site: SiteConfig; position: AdPosition }) {
  const { adsenseEnabled, adsensePublisherId } = site.monetization;
  if (!adsenseEnabled || !adsensePublisherId) return null;

  return (
    <aside
      aria-label="Publicidad"
      data-ad-position={position}
      className="my-8 min-h-[100px] rounded-lg border border-dashed border-border"
    />
  );
}
