# TIL — Today I Learned

Personal blog at [til.iamdanielmarino.com](https://til.iamdanielmarino.com).

Things Claude changed that I didn't understand — explained by Claude. Each post is an MDX article with inline interactive React demos.

## Stack

- [Astro 6](https://astro.build) — static site generator
- [`@astrojs/mdx`](https://docs.astro.build/en/guides/integrations-guide/mdx/) — MDX content collection
- [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) — React 19 islands for demos
- GitHub Pages, custom domain via `public/CNAME`

## Commands

| Command | Action |
| :-- | :-- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the production build |

Requires Node >= 22.12.0.

## Writing a post

Articles live in `src/content/articles/YYYY-MM-DD-<slug>/index.mdx`. The folder name becomes the URL slug. Co-locate any React demo components (`.tsx`/`.jsx`) in the same folder, import them in the MDX, and render with a `client:*` directive.

Frontmatter schema (`src/content.config.ts`):

```yaml
---
title: "..."
date: 2026-04-23
description: "..."  # optional
tags: ["react"]     # optional
---
```

New posts are typically scaffolded by the `/til` Claude Code skill.

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) runs `withastro/action@v3` and publishes to GitHub Pages.
