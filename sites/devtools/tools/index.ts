import { createToolRegistry } from "@seo/core/tools/registry";
import { reservedSlugs } from "@/config/site";
import { formatearJson } from "./formatear-json";

// Para añadir una herramienta: crea su carpeta en tools/ y añádela aquí.
export const tools = createToolRegistry([formatearJson], reservedSlugs);
