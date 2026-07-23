# TIL — Today I Learned

Personal blog at [til.iamdanielmarino.com](https://til.iamdanielmarino.com).

Things Claude changed that I didn't understand — explained by Claude. Each post is an MDX article with inline interactive React demos.

## Stack

- [Astro 6](https://astro.build) — static site generator
- [`@astrojs/mdx`](https://docs.astro.build/en/guides/integrations-guide/mdx/) — MDX content collection
- [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) — React 19 islands for demos
- GitHub Pages, custom domain via `public/CNAME`

## Commands

| Command           | Action                         |
| :---------------- | :----------------------------- |
| `npm run dev`     | Dev server at `localhost:4321` |
| `npm run build`   | Build to `./dist/`             |
| `npm run preview` | Preview the production build   |

Requires Node >= 22.12.0.

## Writing a post

Articles live in `src/content/articles/YYYY-MM-DD-<slug>/index.mdx`. The folder name becomes the URL slug. Co-locate any React demo components (`.tsx`/`.jsx`) in the same folder, import them in the MDX, and render with a `client:*` directive.

Frontmatter schema (`src/content.config.ts`):

```yaml
---
title: "..."
date: 2026-04-23
description: "..." # optional
tags: ["react"] # optional
---
```

New posts are typically scaffolded by the [`/til` Claude Code skill](.claude/skills/til/SKILL.md).

### Installing the `/til` skill elsewhere

To use this skill against a different blog repo:

1. Copy `.claude/skills/til/SKILL.md` into your target repo at `.claude/skills/til/SKILL.md` (project-scoped) or `~/.claude/skills/til/SKILL.md` (global, works across all repos).
2. Set two env vars (e.g. in `~/.zshrc`):

   ```bash
   export TIL_DIR="$HOME/path/to/your/til-repo"
   export TIL_URL="https://your-site.example.com"
   ```

3. Optional overrides: `TIL_DEPLOY_WORKFLOW` (default `Deploy to GitHub Pages`), `TIL_BRANCH` (default `main`).
4. Restart Claude Code, then run `/til` after making a change worth writing up.

The skill assumes an Astro + MDX + React content collection shaped like this one (`src/content/articles/YYYY-MM-DD-<slug>/index.mdx`) and a shared demo component library at `src/components/demo/` — copy those over too if starting a new blog from scratch.

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) runs `withastro/action@v3` and publishes to GitHub Pages.
