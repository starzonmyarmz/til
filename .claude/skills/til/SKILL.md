---
description: Turn the code Claude just finished into a TIL article for the user's blog. Writes an MDX post with inline React demo components into $TIL_DIR/src/content/articles/YYYY-MM-DD-<slug>/, commits + pushes, waits for GitHub Pages to deploy, and opens the live article in the browser. Use when the user says "/til" or asks Claude to write a TIL entry about the recent work.
user_invocable: true
---

# TIL — blog article from recent code

Blog is an Astro + MDX + React site deployed to GitHub Pages. Articles are folders in `src/content/articles/` following the pattern `YYYY-MM-DD-<kebab-topic>/` with an `index.mdx` and sibling `.tsx` demo components.

## Config

The skill reads two required env vars:

- `TIL_DIR` — absolute path to the local til repo (e.g. `$HOME/Code/til`)
- `TIL_URL` — live site base URL, no trailing slash (e.g. `https://til.example.com`)

Optional:

- `TIL_DEPLOY_WORKFLOW` — GitHub Actions workflow name. Default: `Deploy to GitHub Pages`.
- `TIL_BRANCH` — deploy branch. Default: `main`.

If `TIL_DIR` or `TIL_URL` is unset, stop and tell the user to export them (e.g. in `~/.zshrc`). Do not guess.

Sanity-check at the start of the run:

```bash
: "${TIL_DIR:?set TIL_DIR to your til repo path}"
: "${TIL_URL:?set TIL_URL to the live site base URL}"
test -d "$TIL_DIR/src/content/articles" || { echo "TIL_DIR ($TIL_DIR) does not look like the til repo"; exit 1; }
```

## Effort hint

Keep thinking light. Don't pre-plan prose in detail — write it directly into `index.mdx`. Parallelize all file writes. Don't re-read reference articles unless you need a concrete styling example. Target: commit + push in under ~2 minutes of wall time.

---

## 1. Identify the recent code

Find the scope in this order:

1. Uncommitted changes — `git status --porcelain` + `git diff HEAD`.
2. Branch commits not on `main`/`master` — `git log --oneline main..HEAD` + `git diff main...HEAD`.
3. Last 3 commits — `git log -3 -p`.

Run these in the user's *current working directory* (the project the user just worked in), not in `$TIL_DIR`. The TIL is *about* that work; the article lives in the til repo.

If no repo / no changes, ask which scope.

Also scan the current conversation for non-code context: decisions, trade-offs, why. That's the teaching gold the diff can't capture.

## 2. Extract 3–7 teachable concepts

For each: one-line what, one-line why it matters here, one specific demo idea. Don't write these out in chat — go straight to `index.mdx`.

## Length target

Aim for a **5–10 minute read**: roughly **1,250–2,500 words** of prose (code blocks and demos don't count toward the read time). If the topic is thin, fewer concepts with deeper explanation beats padding. If it's rich, cut the weakest concept rather than ship a 15-minute article.

## 3. Pick slug + create article dir

Slug format: `YYYY-MM-DD-<kebab-topic>`. Date is today. Topic is 2–5 kebab words capturing the insight (e.g. `why-usememo-fixed-rerenders`, not `react-stuff`).

Check existing dirs to avoid collision:

```bash
ls "$TIL_DIR/src/content/articles/"
```

If `$TIL_DIR/src/content/articles/<slug>/` already exists, ask before overwriting.

Create the directory:

```bash
mkdir -p "$TIL_DIR/src/content/articles/<slug>"
```

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

**Frontmatter strings are plain text.** `title` and `description` render as-is on the index page — no markdown parsing. No backticks, asterisks, links, or escaped quotes. Write around code terms ("as-casts" not `` `as` casts ``) instead of using inline code.

**Imports.** MDX imports sibling components with relative paths:

```mdx
import MyDemo from './MyDemo.tsx';
```

Render them with a `client:*` directive so React hydrates. Use `client:load` only for the **first** demo in the article; every subsequent demo gets `client:visible` (hydrates when scrolled into view) so a five-demo article doesn't hydrate all five React islands on page load:

```mdx
<FirstDemo client:load />
...
<SecondDemo client:visible />
<ThirdDemo client:visible />
```

**Voice/prose rules.** Impersonal. **No personal pronouns** — no `I`, `we`, `you`, `my`, `our`, `your`. **No references to people or agents** — no `Claude`, `the human`, `the user`, `the author`, `the AI`, `the assistant`. Focus on the code, the concepts, and what the change does. Prefer the imperative or passive voice when describing actions ("Wrap the prop in `useMemo`" / "The component was re-rendering on every keystroke"). State observations as facts about the code, not as a narrator's experience.

Examples:
- Bad: "I wrapped the prop in `useMemo` because the human's list was thrashing."
- Good: "Wrapping the prop in `useMemo` stopped the list from thrashing."
- Bad: "You'll recognize these field names from the diff."
- Good: "The field names below come straight from the form."
- Bad: "Claude's fix was to switch to `Record`."
- Good: "The fix: switch to `Record`."

Warm and specific is still the goal — impersonal does not mean dry. Define jargon inline. Short paragraphs (3–5 lines). Include real code snippets in fenced blocks with a short "what to notice" caption underneath.

**Smart punctuation in prose.** Use typographic characters in article prose and frontmatter (`title`, `description`):

- Apostrophes and single quotes: `’` (U+2019), `‘` (U+2018) — e.g. `didn’t`, `’90s`.
- Double quotes: `“` `”` (U+201C/U+201D).
- Em dash `—` (U+2014) for breaks; en dash `–` (U+2013) for ranges; ellipsis `…` (U+2026) for trailing-off.

**Keep ASCII in code.** Inside fenced code blocks, inline `` `code` ``, demo `.tsx` files, and any string literal that represents code or a user-typed value, use plain ASCII (`'`, `"`, `--`, `...`). Smart quotes break syntax and look wrong in a monospace context. The split: prose reads like a book, code reads like code.

**No real source paths or proprietary names.** The blog is public; the human's day-job repo is not. Do not name actual file paths, internal route paths, internal model/table names, internal product or company names, or anything else that would only make sense to a coworker. Generalize:

- `app/javascript/components/billing/edit_address_modal.tsx` → "a billing address modal" or just "the form component"
- `/org_deletions/${id}` → `/jobs/${id}` or "a job-status endpoint"
- `delete_organization_modal.tsx` → "a delete-confirmation modal"

Generic function and variable names (`handleFieldChange`, `formErrors`, `checkForCompletion`) are fine — they describe a pattern, not a private codebase. The bar: a reader who has never seen the source repo should still get the lesson, and nothing in the article should leak details specific to the human's employer.

**Demo patterns.** Every major concept gets a demo or an explicit "(no interactive demo — the snippet above is the core idea)" note. Patterns:

- **Slider-driven** — `<input type="range">` drives a visualization (magnitudes: delay, duration, size).
- **Before/after toggle** — one button flips naive vs improved.
- **Step-through** — "Next" advances stages (sorts, state machines).
- **Live input → output** — textarea flows through the code live (parsers, regex, validation).

**Demo component rules.**

- Plain React + TypeScript. `useState`, `useMemo`, etc. — whatever the article teaches.
- No new npm deps unless a demo truly needs one. The site already has React 19 + Astro 6.
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
- Slider scrubber with a value readout → `<Slider>` (use `format` to render units/decimals). Raw `<input type="range">` is still fine for sliders that don't need a readout; CSS already styles it inside `.demo`.
- Showing computed output (raw → resolved → range) → `<Output>` with `<OutputRow>` children (grid mode is the default).
- Free-form block that doesn't fit a label/value grid (a JSON dump, a code preview, a single formatted result) → `<Panel>`. Two or more side by side (raw vs. parsed) → wrap them in `<PanelGrid columns={2}>`.
- Log/trace output with colored lines → `useConsoleLog()` for the push/cap/reset state, feed its `lines` into `<Console lines={lines} />`. Don't hand-roll `setLines((prev) => [...prev.slice(-n), entry])` — that's exactly what the hook replaces.
- Inline status pill (state name, category, count) → `<Badge tone="...">`.
- Tone color on inline text → `<span data-tone="good|warn|bad|info">…</span>`. **Do not hardcode hex colors** for status — use tone tokens or `data-tone`.
- Sprite/canvas/game-loop demo → `<CanvasStage canvasRef={ref} width height />` for the centered, bordered, pixelated wrapper instead of hand-rolling the centering div + inline canvas styles.
- Any demo involving a native `<dialog>` (modal, backdrop-click-to-close, `showModal()` vs. the `open` attribute) → `<NativeDialog>`. It owns the ref + open/close sync effect; don't reimplement that `useEffect`.

If the demo needs a control the library doesn't ship, write it inline with the same CSS variables (`var(--mono)`, `var(--rule)`, `var(--ink-soft)`, `var(--tone-*)`) so it visually matches the rest.

**Reference article.** If a brand-new pattern (not covered above) needs a styling cue, peek at one existing demo under `$TIL_DIR/src/content/articles/`. Pick the most recent by slug date. Don't read more than one.

## 5. Build check

Before committing, run a local build to catch MDX/TS errors the deploy would reject:

```bash
cd "$TIL_DIR" && npm run build
```

If the build fails, fix the errors and rebuild. Don't push broken articles.

## 6. Commit, push, wait for deploy, open

From `$TIL_DIR`:

```bash
cd "$TIL_DIR"
git add "src/content/articles/<slug>"
git commit -m "Add TIL: <title>"
git push origin "${TIL_BRANCH:-main}"
```

Commit message: single line, conventional. No Claude co-author trailer — this is the user's personal blog.

Then find the deploy run **for this exact commit** (match on SHA — `--limit 1` alone can grab a prior push's run that hasn't been superseded yet, or one still registering):

```bash
WORKFLOW="${TIL_DEPLOY_WORKFLOW:-Deploy to GitHub Pages}"
SHA=$(git rev-parse HEAD)
RUN_ID=""
for _ in 1 2 3 4 5 6 7 8 9 10; do
  RUN_ID=$(gh run list --workflow "$WORKFLOW" -c "$SHA" --limit 1 --json databaseId -q '.[0].databaseId')
  [ -n "$RUN_ID" ] && break
done
echo "$RUN_ID"
```

The run can take a few seconds to register — the loop polls (no foreground `sleep`; this harness blocks it). If `RUN_ID` is still empty after the loop, retry the loop once more before giving up.

**Report the live URL to the user now** — `$TIL_URL/<slug>/`. The commit is pushed; the article is final. Don't make the user wait on the deploy to learn where it lands.

Then watch the deploy **in the background** so the user isn't blocked for the 1–3 min Pages build:

```bash
gh run watch "$RUN_ID" --exit-status
```

Run that with `run_in_background: true`. The harness re-invokes you when it exits:

- **Exit 0** → open the live article: `open "$TIL_URL/<slug>/"` and confirm it's live.
- **Non-zero** → surface the failure (`gh run view "$RUN_ID" --log-failed | tail -50`) and stop. Do not open a broken URL; tell the user the deploy failed.

---

## Quality bar

- Length lands in target (see **Length target** above).
- Every concept has a demo or an explicit no-demo note.
- Prose readable by someone who hasn't seen the original code; jargon defined inline.
- `npm run build` passes locally before pushing.
- No proprietary paths/names leak; generic function/variable names only (see privacy rules in step 4).
- Frontmatter `date` matches the slug date. Title is a human sentence, not a slug echo.
- Tags are lowercase, short, reusable across articles (`react`, `typescript`, `performance`) — not hyper-specific.
