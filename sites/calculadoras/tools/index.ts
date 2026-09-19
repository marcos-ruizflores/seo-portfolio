import { createToolRegistry } from "@seo/core/tools/registry";
import { reservedSlugs } from "@/config/site";
import { finiquito } from "./finiquito";

// Para añadir una calculadora: crea su carpeta en tools/ y añádela aquí.
export const tools = createToolRegistry([finiquito], reservedSlugs);
