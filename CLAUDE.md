# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal "Today I Learned" blog at https://til.iamdanielmarino.com — static Astro site where each article explains something Claude changed that the author didn't initially understand. Articles are MDX with inline interactive React demos.

## Commands

- `npm run dev` — local dev server at localhost:4321
- `npm run build` — production build to `./dist/`
- `npm run preview` — preview the built site
- `npm run astro -- --help` — Astro CLI

Node >=22.12.0 required (pinned in `package.json` engines; CI uses node 22).

No test, lint, or typecheck scripts are configured. Use `npm run astro check` if a type check is needed.

## Architecture

**Astro 6 + MDX + React 19 islands.** Static site, no SSR, no backend.

### Content collection (the core model)

All articles live under `src/content/articles/<slug>/index.mdx`, co-located with any React components the article imports. The collection is defined in `src/content.config.ts`:

- `glob` loader matches `**/index.{md,mdx}` with base `./src/content/articles`
- `generateId` strips `/index.(md|mdx)` so the entry ID equals the folder name (e.g. `2026-04-23-why-usememo-fixed-rerenders`) — that ID is used as the URL slug
- Frontmatter schema: `title` (string), `date` (coerced Date), `description?`, `tags?: string[]`

Article folder convention: `YYYY-MM-DD-kebab-slug/`. Date appears both in the folder name and in frontmatter.

### Routing

- `src/pages/index.astro` — lists articles sorted by date desc
- `src/pages/[...slug].astro` — renders a single article via `getStaticPaths` over the collection + `render(article)` to mount the MDX `Content`

Both pages prefix links with `import.meta.env.BASE_URL` — do not hardcode `/` in internal links; the site serves from a custom domain (CNAME `til.iamdanielmarino.com` in `public/`) but the BASE_URL pattern is preserved.

### React islands

MDX files import `.tsx`/`.jsx` components from their own folder and render them with a `client:*` directive (existing articles use `client:load`). The `@astrojs/react` integration handles hydration. Keep demo components in the article folder, not in a shared `components/` directory — they are per-article.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds with `withastro/action@v3` on push to `main` and deploys to GitHub Pages. Custom domain via `public/CNAME`.

## Related skill

The `til` skill (invoked by the user via `/til`) scaffolds new article folders into `src/content/articles/YYYY-MM-DD-<slug>/`, commits, pushes, and waits for the Pages deploy. If asked to write a new TIL entry, prefer invoking that skill over creating files manually.
