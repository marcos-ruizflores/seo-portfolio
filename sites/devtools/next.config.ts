import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: plain HTML served by Cloudflare Pages, no server.
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@seo/core"],
  images: { unoptimized: true },
};

export default createMDX({})(nextConfig);
