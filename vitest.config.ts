import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@seo/core": fileURLToPath(new URL("./packages/core/src", import.meta.url)),
    },
  },
  test: {
    include: ["packages/**/*.test.ts", "sites/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**"],
  },
});
