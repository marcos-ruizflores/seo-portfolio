# seo-portfolio

Monorepo de webs nicho en español orientadas a tráfico orgánico y monetizadas con AdSense/afiliación.
Objetivo: DEMANDA DE BÚSQUEDA → HERRAMIENTA ÚTIL → TRÁFICO ORGÁNICO → MONETIZACIÓN. Valor por página, no cantidad de páginas.

## Estructura

- `packages/core` (`@seo/core`): código compartido por todas las webs (config, SEO, JSON-LD, sitemap/robots, registro de herramientas, layout, AdSlot, UI). Se importa como `@seo/core/<ruta>` (resuelto por `paths` en el tsconfig de cada web).
- `sites/<web>`: una app Next.js por web. Identidad en `config/site.ts`. Una carpeta por herramienta en `tools/<slug>/` (`index.ts` definición, `*.tsx` interfaz, `content.mdx` contenido, lógica pura + `*.test.ts`), registrada en `tools/index.ts`.
- Next.js 16 con `output: "export"` (HTML estático para Cloudflare Pages). No hay servidor: nada de route handlers dinámicos, cookies, redirects de next.config ni server actions. Antes de usar APIs de Next, leer `node_modules/next/dist/docs/`.

## Reglas de trabajo (del roadmap del propietario)

- Trabajar **fase a fase**. Al terminar cada fase, ejecutar `npm run lint`, `npm run typecheck`, `npm test` y el build de la web, corregir, explicar brevemente y **esperar aprobación** antes de seguir.
- No instalar dependencias innecesarias. No meter backend si algo puede hacerse en el cliente o en el build.
- No generar contenido SEO masivo ni automático. No inventar volúmenes de búsqueda (van en `SEO_RESEARCH.md` como PENDIENTE si no hay dato real).
- No inventar textos legales: usar marcadores `[PENDIENTE: ...]` visibles.
- No activar AdSense hasta que el propietario dé su publisher ID.
- Los cálculos financieros, fiscales o laborales **deben** tener tests unitarios con casos verificados a mano y citar la fuente o norma aplicada.
- TypeScript estricto, sin `any`. Lógica separada de la presentación. Toda metadata de página pasa por `buildMetadata()`.
- Las páginas no son indexables salvo que el build tenga `NEXT_PUBLIC_INDEXABLE=true` (solo producción con dominio propio).
- Git: `main` + ramas `feature/*`; commits en formato `feat: ...`, `fix: ...`.

## Comandos (Node 24: `nvm use`)

- `npm run dev:devtools` / `npm run build:devtools`
- `npm test` (Vitest), `npm run lint`, `npm run typecheck`, `npm run format`
