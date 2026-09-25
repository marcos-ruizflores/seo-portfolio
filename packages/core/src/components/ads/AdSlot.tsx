import type { SiteConfig } from "../../config/site";

export type AdPosition =
  "header" | "content-top" | "content-middle" | "content-bottom" | "sidebar" | "footer";

/**
 * Ad slot. While monetization.adsenseEnabled is false it renders nothing (not
 * even reserved space). Once AdSense is on, the <ins class="adsbygoogle"> block
 * goes here with a fixed min height to avoid CLS.
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
