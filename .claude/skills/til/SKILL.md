---
description: Turn the code Claude just finished into a TIL article for the user's blog. Writes an MDX post with inline React demo components into $TIL_DIR/src/content/articles/YYYY-MM-DD-<slug>/, commits + pushes, waits for GitHub Pages to deploy, and opens the live article in the browser. Use when the user says "/til" or asks Claude to write a TIL entry about the recent work.
---

# TIL — blog article from recent code

Blog: Astro + MDX + React site, deployed to GitHub Pages. Articles are folders in `src/content/articles/` following pattern `YYYY-MM-DD-<kebab-topic>/` with `index.mdx` and sibling `.tsx` demo components.

## Config

Skill reads two required env vars:

- `TIL_DIR` — absolute path to the local til repo (e.g. `$HOME/Code/til`)
- `TIL_URL` — live site base URL, no trailing slash (e.g. `https://til.example.com`)

Optional:

- `TIL_DEPLOY_WORKFLOW` — GitHub Actions workflow name. Default: `Deploy to GitHub Pages`.
- `TIL_BRANCH` — deploy branch. Default: `main`.

If `TIL_DIR` or `TIL_URL` unset, stop, tell user to export them (e.g. in `~/.zshrc`). Do not guess.

Sanity-check at run start:

```bash
: "${TIL_DIR:?set TIL_DIR to your til repo path}"
: "${TIL_URL:?set TIL_URL to the live site base URL}"
test -d "$TIL_DIR/src/content/articles" || { echo "TIL_DIR ($TIL_DIR) does not look like the til repo"; exit 1; }
```

## Scripts

Mechanical steps below are scripted in `scripts/` (sibling to this file) — call them instead of retyping the shell. `${CLAUDE_SKILL_DIR}` = this skill's own directory.

- `scripts/context.sh` — picks scope (uncommitted > branch-vs-main/master > last 3 commits), prints the diff. Run in the project's cwd.
- `scripts/check-slug.sh <slug>` — collision check + `mkdir -p`. Prints the article dir path, or exits 2 if it already exists.
- `scripts/publish.sh <slug> "<title>"` — build, commit, push, poll for the deploy run. Prints `LIVE_URL=` and `RUN_ID=`, then exits (does not wait for deploy).
- `scripts/watch-deploy.sh <run_id> <slug>` — waits for the run, opens the live URL on success, dumps failed logs on failure. Run with `run_in_background: true`.

## Pace and done condition

Don't pre-plan prose in chat — write directly into `index.mdx`. Parallelize all file writes. Don't re-read reference articles unless a concrete styling example needed. Target: commit + push under ~2 minutes wall time.

Done when: `publish.sh` printed `LIVE_URL`, the URL was reported, and `watch-deploy.sh` exited (live article opened, or failure logs surfaced). No step between slug check and publish needs the user — keep going unless `check-slug.sh` exits 2 or scope is ambiguous.

---

## 1. Identify the recent code

Run `scripts/context.sh` in user's *current working directory* (project just worked in), not `$TIL_DIR`. TIL is *about* that work; article lives in til repo. It picks scope automatically (uncommitted > branch commits > last 3 commits) and prints the relevant diff.

If it exits with `NOT_A_GIT_REPO`, or the diff is empty, ask which scope.

Also scan conversation for non-code context: decisions, trade-offs, why. That's teaching gold the diff can't capture.

## 2. Extract 3–7 teachable concepts

For each: one-line what, one-line why it matters here, one specific demo idea. Don't write these out in chat — go straight to `index.mdx`.

## Length target

Aim for **5–10 minute read**: roughly **1,250–2,500 words** of prose (code blocks/demos don't count toward read time). Thin topic: fewer concepts, deeper explanation beats padding. Rich topic: cut weakest concept rather than ship 15-minute article.

## 3. Pick slug + create article dir

Slug format: `YYYY-MM-DD-<kebab-topic>`. Date is today. Topic: 2–5 kebab words capturing the insight (e.g. `why-usememo-fixed-rerenders`, not `react-stuff`).

Run `scripts/check-slug.sh <slug>`. Exit 2 means the dir already exists — ask before overwriting. Otherwise it creates the dir and prints its path.

## 4. Write index.mdx + demos in parallel

In a **single assistant turn**, emit parallel Write tool calls for:

- `$TIL_DIR/src/content/articles/<slug>/index.mdx` — frontmatter + prose + demo imports.
- One `.tsx` file per interactive demo, sibling to `index.mdx`.

**Frontmatter shape** (matches the content collection schema in `src/content.config.ts`):

```mdx
---
title: "Human sentence, not a slug"
date: YYYY-MM-DD
description: "One or two sentences. What the reader will learn."
tags: ["react", "typescript"]
---
```

**Frontmatter strings are plain text.** `title`/`description` render as-is on index page — no markdown parsing. No backticks, asterisks, links, escaped quotes. Write around code terms ("as-casts" not `` `as` casts ``) instead of inline code.

**Imports.** MDX imports sibling components with relative paths:

```mdx
import MyDemo from './MyDemo.tsx';
```

Render with a `client:*` directive so React hydrates. Use `client:load` only for **first** demo; every subsequent demo gets `client:visible` (hydrates when scrolled into view) so five-demo article doesn't hydrate all five React islands on page load:

```mdx
<FirstDemo client:load />
...
<SecondDemo client:visible />
<ThirdDemo client:visible />
```

**Voice/prose rules.** Impersonal. **No personal pronouns** — no `I`, `we`, `you`, `my`, `our`, `your`. **No references to people or agents** — no `Claude`, `the human`, `the user`, `the author`, `the AI`, `the assistant`. Focus on code, concepts, what the change does. Prefer imperative/passive voice for actions ("Wrap the prop in `useMemo`" / "The component was re-rendering on every keystroke"). State observations as facts about the code, not narrator's experience.

Examples:
- Bad: "I wrapped the prop in `useMemo` because the human's list was thrashing."
- Good: "Wrapping the prop in `useMemo` stopped the list from thrashing."
- Bad: "You'll recognize these field names from the diff."
- Good: "The field names below come straight from the form."
- Bad: "Claude's fix was to switch to `Record`."
- Good: "The fix: switch to `Record`."

Warm and specific still the goal — impersonal doesn't mean dry. Define jargon inline. Short paragraphs (3–5 lines). Include real code snippets in fenced blocks with a short "what to notice" caption underneath.

**Smart punctuation in prose.** Use typographic characters in article prose and frontmatter (`title`, `description`):

- Apostrophes and single quotes: `’` (U+2019), `‘` (U+2018) — e.g. `didn’t`, `’90s`.
- Double quotes: `“` `”` (U+201C/U+201D).
- Em dash `—` (U+2014) for breaks; en dash `–` (U+2013) for ranges; ellipsis `…` (U+2026) for trailing-off.

**Keep ASCII in code.** Inside fenced code blocks, inline `` `code` ``, demo `.tsx` files, and any string literal that represents code or a user-typed value, use plain ASCII (`'`, `"`, `--`, `...`). Smart quotes break syntax and look wrong in a monospace context. Split: prose reads like a book, code reads like code.

**No real source paths or proprietary names.** Blog is public; human's day-job repo isn't. Don't name actual file paths, internal route paths, internal model/table names, internal product or company names, or anything else that would only make sense to a coworker. Generalize:

- `app/javascript/components/billing/edit_address_modal.tsx` → "a billing address modal" or just "the form component"
- `/org_deletions/${id}` → `/jobs/${id}` or "a job-status endpoint"
- `delete_organization_modal.tsx` → "a delete-confirmation modal"

Generic function/variable names (`handleFieldChange`, `formErrors`, `checkForCompletion`) fine — describe a pattern, not a private codebase. Bar: a reader who has never seen the source repo should still get the lesson, and nothing in the article should leak details specific to the human's employer.

**Demo patterns.** Every major concept gets a demo or an explicit "(no interactive demo — the snippet above is the core idea)" note. Patterns:

- **Slider-driven** — `<input type="range">` drives a visualization (magnitudes: delay, duration, size).
- **Before/after toggle** — one button flips naive vs improved.
- **Step-through** — "Next" advances stages (sorts, state machines).
- **Live input → output** — textarea flows through the code live (parsers, regex, validation).

**Demo component rules.**

- Plain React + TypeScript. `useState`, `useMemo`, etc. — whatever the article teaches.
- No new npm deps unless a demo truly needs one. Site already has React 19 + Astro 6.
- **Always wrap the body in `<Demo>`.** Never hand-roll `<div className="demo"><div className="demo-label">…` — that's exactly what `<Demo>` renders, and hand-rolling it means missing future styling changes.
- **Reach for the shared demo library first.** It lives at `src/components/demo/` and exposes `Demo`, `Toolbar`, `Spacer`, `Button`, `ToggleGroup`, `Input`, `Select`, `Field`, `Output`, `OutputRow`, `Panel`, `PanelGrid`, `Console`, `useConsoleLog`, `Hint`, `Row`, `Slider`, `Badge`, `CanvasStage`, `NativeDialog`. Import from the article folder with a relative path (`../../../components/demo`). Use these instead of re-defining inline styles for buttons, mono inputs, dropdowns, output panels, log output, canvases, or `<dialog>` wiring. CSS variables `var(--mono)`, `var(--ink)`, `var(--ink-soft)`, `var(--ink-faint)`, `var(--rule)`, `var(--bg)`, `var(--bg-elev)`, plus tone tokens `var(--tone-good|warn|bad)` exist; the components already use them.
- Keep demos small and self-contained. One file, default export, no external state.

**Shared demo components — quick catalog.**

```tsx
import {
  Demo,           // <Demo>{...}</Demo> — wraps body + adds "Interactive · React" label
  Toolbar,        // flex-wrap row of controls above the demo body; auto bottom-margin
  Spacer,         // push subsequent toolbar items to the right (margin-left: auto)
  Button,         // <Button variant="primary"|"pill" active={bool} ...>
  ToggleGroup,    // <ToggleGroup value onChange options={[{value, label}]} variant />
  Input,          // monospaced text input, full-width by default
  Select,         // <Select value onChange options={[{value, label}]} /> — mono <select>, matches Input styling
  Field,          // labeled row: <Field label="raw"><Input ... /></Field>
  Output,         // bordered mono panel; grid mode (default) lays out label/value pairs in 2 columns — pass grid={false} for free-form
  OutputRow,      // <OutputRow label="raw:">{value}</OutputRow>
  Panel,          // <Panel title?>{...}</Panel> — bordered mono block for content that doesn't fit Output's grid (code previews, raw/parsed blocks)
  PanelGrid,      // <PanelGrid columns={2}><Panel/><Panel/></PanelGrid> — side-by-side Panels
  Console,        // <Console lines={[{ line, tone }]} placeholder /> — tone: info|good|warn|bad
  useConsoleLog,  // const { lines, push, reset } = useConsoleLog(max?) — rolling log capped at `max` entries, feeds <Console lines={lines} />
  Hint,           // <Hint>trailing explanatory paragraph</Hint>
  Row,            // flex-wrap row helper (no margin)
  Slider,         // <Slider label min max step value onChange format? /> — labelled range with mono value readout
  Badge,          // <Badge tone="info|good|warn|bad">label</Badge> — small mono status pill
  CanvasStage,    // <CanvasStage canvasRef width height onClick? background? cursor? /> — centered, bordered, pixelated <canvas>
  NativeDialog,   // <NativeDialog open onOpenChange onBackdropClick? mode="showModal"|"open" maxWidth?>{...}</NativeDialog> — wraps <dialog> ref/effect sync
} from '../../../components/demo';
```

**When to use which:**
- Before/after binary toggle → `<ToggleGroup variant="primary">` (two options).
- Long list of option chips (scenarios, samples, presets) → `<ToggleGroup variant="pill">`.
- Dropdown with more options than fit as chips, or a native-select-specific lesson → `<Select>`.
- Step-through "Next" buttons → `<Button>` inside `<Toolbar>`.
- Slider scrubber with a value readout → `<Slider>` (use `format` to render units/decimals). Raw `<input type="range">` still fine for sliders that don't need a readout; CSS already styles it inside `.demo`.
- Showing computed output (raw → resolved → range) → `<Output>` with `<OutputRow>` children (grid mode is the default).
- Free-form block that doesn't fit a label/value grid (a JSON dump, a code preview, a single formatted result) → `<Panel>`. Two or more side by side (raw vs. parsed) → wrap them in `<PanelGrid columns={2}>`.
- Log/trace output with colored lines → `useConsoleLog()` for the push/cap/reset state, feed its `lines` into `<Console lines={lines} />`. Don't hand-roll `setLines((prev) => [...prev.slice(-n), entry])` — that's exactly what the hook replaces.
- Inline status pill (state name, category, count) → `<Badge tone="...">`.
- Tone color on inline text → `<span data-tone="good|warn|bad|info">…</span>`. **Do not hardcode hex colors** for status — use tone tokens or `data-tone`.
- Sprite/canvas/game-loop demo → `<CanvasStage canvasRef={ref} width height />` for the centered, bordered, pixelated wrapper instead of hand-rolling the centering div + inline canvas styles.
- Any demo involving a native `<dialog>` (modal, backdrop-click-to-close, `showModal()` vs. the `open` attribute) → `<NativeDialog>`. It owns the ref + open/close sync effect; don't reimplement that `useEffect`.

If the demo needs a control the library doesn't ship, write it inline with the same CSS variables (`var(--mono)`, `var(--rule)`, `var(--ink-soft)`, `var(--tone-*)`) so it visually matches the rest.

**Reference article.** If a brand-new pattern (not covered above) needs a styling cue, peek at one existing demo under `$TIL_DIR/src/content/articles/`. Pick most recent by slug date. Don't read more than one.

## 5–6. Build, commit, push, find deploy run

Run `scripts/publish.sh <slug> "<title>"`. It builds (`npm run build`), commits, pushes, and polls for the matching deploy run by SHA (avoids grabbing a prior push's still-registering run). Prints `LIVE_URL=...` and `RUN_ID=...` on success, then exits — it does not wait for the deploy itself.

Commit message it writes: `Add TIL: <title>` — single line, conventional. No Claude co-author trailer, this is user's personal blog.

If build fails, script exits nonzero before committing — fix errors and rerun. Don't push broken articles. If `RUN_ID_NOT_FOUND` after polling, retry once more before giving up.

**Report live URL to user now** — the `LIVE_URL` line. Commit is pushed; article is final. Don't make user wait on deploy to learn where it lands.

Then run `scripts/watch-deploy.sh <run_id> <slug>` with `run_in_background: true` so user isn't blocked for the 1–3 min Pages build. Harness re-invokes when it exits:

- **Exit 0** → it already opened the live article. Confirm it's live.
- **Non-zero** → it already dumped failed logs (`gh run view --log-failed`). Surface that and stop. Don't open broken URL; tell user deploy failed.

---

## Quality bar

- Length lands in target (see **Length target** above).
- Every concept has a demo or an explicit no-demo note.
- Prose readable by someone who hasn't seen original code; jargon defined inline.
- Claims about library/browser/runtime behavior are backed by the diff, a demo, or docs. Anything unconfirmed: cut it or soften it in the article, and list it for the user alongside the `LIVE_URL` report, with where you looked.
- `npm run build` passes locally before pushing.
- No proprietary paths/names leak; generic function/variable names only (see privacy rules in step 4).
- Frontmatter `date` matches the slug date. Title is a human sentence, not a slug echo.
- Tags are lowercase, short, reusable across articles (`react`, `typescript`, `performance`) — not hyper-specific.
