# seo-portfolio

Monorepo for a small portfolio of niche websites for the Spanish market: free, useful
tools meant to rank on Google and be monetized with AdSense and affiliate links. The
sites themselves are in Spanish.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

## Sites

| Site | Folder | Status |
| --- | --- | --- |
| Developer tools (working name: DevKit) | `sites/devtools` | Template + 1 tool |
| Employment calculators (Spain) | `sites/calculadoras` | In progress |
| Dates and business days (Spain) | `sites/fechas` | Planned |

## How it's built

- `packages/core` holds everything the sites share: layout, SEO helpers (metadata,
  canonical URLs, JSON-LD, sitemap routes), the tool page template and the tool registry.
- Each site only defines its identity (`config/site.ts`), its brand color and its tools.
- Sites are statically exported and served from Cloudflare Pages, no server involved.
- Adding a tool means adding one folder and registering it. The route, metadata,
  sitemap entry and internal links are generated from the registry, and the registry
  fails the build on duplicate slugs or links to tools that don't exist.

## Getting started

Requires Node 24 (`nvm use`).

```bash
npm install
npm run dev:devtools      # http://localhost:3000
npm test                  # unit tests (Vitest)
npm run lint              # ESLint
npm run typecheck         # TypeScript
npm run build:devtools    # static export to sites/devtools/out
```

## Adding a tool

1. Create `sites/<site>/tools/<slug>/` with:
   - `logic.ts` + `logic.test.ts`: the pure calculation and its tests
   - `MyTool.tsx`: the UI (`"use client"`)
   - `content.mdx`: how it works, examples, extra info
   - `index.ts`: the `ToolDefinition` (slug, SEO title, description, H1, FAQ, related tools...)
2. Register it in `sites/<site>/tools/index.ts`.

## Environments and indexing

| Variable | Local / preview | Production |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | empty (localhost) or the `*.pages.dev` URL | `https://yourdomain.com` |
| `NEXT_PUBLIC_INDEXABLE` | empty, so `robots.txt` blocks and every page is `noindex` | `true` |

That way Google never indexes preview copies and there's no duplicate content.
