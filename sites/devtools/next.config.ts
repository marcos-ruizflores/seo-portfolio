import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático: HTML puro servido por Cloudflare Pages, sin servidor.
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@seo/core"],
  images: { unoptimized: true },
};

export default createMDX({})(nextConfig);
