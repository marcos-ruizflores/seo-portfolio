# seo-portfolio

Portfolio de webs nicho en español: herramientas útiles que buscan tráfico orgánico de Google, preparadas para monetizarse con AdSense y afiliación.

## Webs

| Web                                                            | Carpeta              | Estado                    |
| -------------------------------------------------------------- | -------------------- | ------------------------- |
| Herramientas para desarrolladores (nombre provisional: DevKit) | `sites/devtools`     | Plantilla + 1 herramienta |
| Calculadoras laborales (España)                                | `sites/calculadoras` | Planificada               |
| Fechas y días hábiles (España)                                 | `sites/fechas`       | Planificada               |

## Puesta en marcha

Requiere Node 24 (`nvm use`).

```bash
npm install
npm run dev:devtools      # http://localhost:3000
npm test                  # tests unitarios (Vitest)
npm run lint              # ESLint
npm run typecheck         # TypeScript
npm run build:devtools    # export estático en sites/devtools/out
```

## Cómo añadir una herramienta

1. Crea `sites/<web>/tools/<slug>/` con:
   - `logica.ts` + `logica.test.ts`: cálculo puro y sus tests.
   - `MiHerramienta.tsx`: interfaz (`"use client"`).
   - `content.mdx`: cómo funciona, ejemplos, información adicional.
   - `index.ts`: la `ToolDefinition` (slug, título SEO, descripción, H1, FAQ, relacionadas…).
2. Regístrala en `sites/<web>/tools/index.ts`.

La ruta `/<slug>`, su metadata, el sitemap y los enlaces internos se generan solos. El registro falla en el build si hay slugs duplicados o enlaces a herramientas que no existen.

## Entornos e indexación

| Variable                | Local / preview                                      | Producción              |
| ----------------------- | ---------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_SITE_URL`  | vacía (localhost) o la URL `*.pages.dev`             | `https://tudominio.com` |
| `NEXT_PUBLIC_INDEXABLE` | vacía → `robots.txt` bloquea y todo va con `noindex` | `true`                  |

Así Google nunca indexa las copias de preview y no hay contenido duplicado.
