# Workflow: Creative Mode design fidelity

## Loop

Anantha ships Inquiry Island visual changes before demo or judge review. The app should read as **Creative Mode** — multi-accent color-blocking on one screen — not a single-green wash.

## Trigger

**Manual.** Anantha says "run the creative mode fidelity workflow" (or equivalent) in Cursor when the UI needs to match the template.

## Scope

Visual layer only. No changes to board reducers, routing logic, or progress semantics.

**Reference:** [Creative Mode design.md](https://github.com/zarazhangrui/beautiful-html-templates/blob/main/templates/creative-mode/design.md)

**In scope routes:** `/`, `/grade-2`, `/grade-2/:subject`, `/lab/:standardCode`, `/catalog`

**Out of scope:** Decorative-only elements (floating yellow circles, iso panels) unless trivial CSS; dark mode; npm package extraction.

---

## Problem

Current reskin set tokens and fonts but routes expose **one** `--accent` via `main[data-accent]`. Hub subject cards, eyebrows, CTAs, and progress text all inherit that single accent — `/grade-2` is all green. Creative Mode uses **component variants** (`stat-cell-green`, `step-card-pink`, `table-col-orange`) so 2–3 accent colors appear on the same view.

---

## Decisions (settled)

| Decision | Choice |
|---|---|
| Workflows | Separate from curriculum workflow; can ship first |
| Subject colors | Math=green, ELA=pink, Science=orange on subject cards and subject-scoped UI |
| Page chrome | Route-level `data-accent` remains for eyebrows, primary CTAs, skip link |
| Hub layout | Per-card accent classes, not route accent inheritance |
| Strand browser | Alternate strand section header fills (green → pink → orange → yellow cycle) |
| Decorative extras | Skip for v1; functional color-blocking only |
| Showcase labs | Same accent rules as other labs in their subject |

---

## Implementation

### 1. CSS component variants (`src/index.css`)

Add Creative Mode variant classes mapped from `design.md` components:

| Class | Background | Text |
|---|---|---|
| `.accent-green` | `--color-green` | cream |
| `.accent-pink` | `--color-pink` | ink |
| `.accent-orange` | `--color-orange` | cream |
| `.accent-yellow` | `--color-yellow` | ink |
| `.accent-cream` | `--color-cream` | ink |

Apply to:
- `.lab-card.accent-*` — card fill + matching ink/cream text
- `.strand-section .section-label.accent-*` — strand header band
- `.standard-row:hover` — optional left accent bar per subject (via parent class)

Add `.featured-block` with `--shadow-featured` (orange + ink double shadow) for home hero CTA only.

Ensure `.check-result.ok` uses green (not `--accent`) so success is always green per template closing-slide convention.

Table: catalog `th` stays yellow; add optional `.table-col-accent` utility if column highlights are needed later.

### 2. Hub subject cards (`src/pages/Grade2HubPage.tsx`)

Replace uniform `.lab-card` with per-subject classes:

```tsx
<Link className="lab-card accent-green" …>  // Math
<Link className="lab-card accent-pink" …>   // ELA
<Link className="lab-card accent-orange" …> // Science
```

Cards must **not** depend on `main[data-accent]`.

### 3. Route accent table (`src/App.tsx`)

Keep `accentForPath()` but set hub explicitly:

| Path | `data-accent` |
|---|---|
| `/` | green |
| `/grade-2` | yellow (hub chrome differs from cards) |
| `/grade-2/math`, `/lab/NC.*` | green |
| `/grade-2/ela`, `/lab/W.*`, `/lab/RL.*`, `/lab/RI.*`, `/lab/RF.*`, `/lab/SL.*`, `/lab/L.*` | pink |
| `/grade-2/science`, `/lab/2.*` | orange |
| `/catalog` | yellow |

### 4. Subject browser strand rotation (`src/pages/SubjectBrowserPage.tsx`)

Assign cycling accent to each strand section header:

```tsx
const STRAND_ACCENTS = ["green", "pink", "orange", "yellow"] as const;
// strand index % 4 → section-label class
```

Add `subject-browser--math|ela|science` on page root for subject-scoped row hover accents.

### 5. Lab shell fixes (`src/components/LabShell.tsx`)

- Back link: `← Grade 2 Hub` pointing to `/grade-2` or subject browser (not `/demo`).
- Optional: show subject accent on `.standard-chip span` via standard subject lookup.

### 6. Home page (`src/pages/HomePage.tsx`)

- Hero CTA uses `.btn.primary.featured-block` or green fill with featured shadow.
- Eyebrow uses route accent (green on `/`).

---

## Verification

Run after implementation:

```bash
npm run typecheck && npm run test && npm run build
```

**Visual smoke matrix:**

| Route | Pass criteria |
|---|---|
| `/grade-2` | Three hub cards: green, pink, orange — visible simultaneously |
| `/grade-2/math` | Green eyebrow; strand headers cycle accents |
| `/grade-2/ela` | Pink eyebrow |
| `/grade-2/science` | Orange eyebrow |
| `/catalog` | Yellow table headers; cream-2 body |
| `/lab/NC.2.OA.1` | Green accent context; success stamp on check |
| `/lab/W.2.2` | Pink accent context |
| `/lab/2.P.1.1` | Orange accent context |

**Accessibility:** skip link, focus rings, 44px targets, `prefers-reduced-motion`, `aria-live` on check results — unchanged from baseline.

---

## Checkpoint

None required for CSS-only work. Anantha spot-checks the smoke matrix in dev (`npm run dev`).

---

## Definition of done

- [ ] Hub shows three distinct accent cards at once
- [ ] Subject browsers use strand accent rotation
- [ ] Route eyebrows match subject where applicable
- [ ] No route renders entirely one accent color except intentional single-accent pages (`/catalog` yellow chrome is OK; table still has ink/cream contrast)
- [ ] LabShell back link correct
- [ ] All verification commands pass
