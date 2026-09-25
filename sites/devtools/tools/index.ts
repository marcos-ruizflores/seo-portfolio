import { createToolRegistry } from "@seo/core/tools/registry";
import { reservedSlugs } from "@/config/site";
import { formatearJson } from "./formatear-json";

// To add a tool: create its folder under tools/ and register it here.
export const tools = createToolRegistry([formatearJson], reservedSlugs);
