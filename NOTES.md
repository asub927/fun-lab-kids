# Fun Lab — loop notes

## Product

Grade 2 kid app (Jordan persona). NCSCOS curriculum: ~77 standards across Math (23), ELA (41), Science (13). Routes: `/grade-2` hub → subject browser → `/lab/:standardCode`. Progress in localStorage per standard.

## Design target

[Creative Mode](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/creative-mode) neo-brutalist system. Authoritative token ref: `design.md` in that repo.

**Intended:** cream canvas, 4px ink borders, hard shadows, Archivo Black / Space Grotesk / JetBrains Mono, four accent colors (green, pink, orange, yellow) used as **flat color-blocks** — slides use 2–3 accents at once via component variants (`stat-cell-green`, `step-card-pink`, `table-col-orange`, etc.).

**Current gap (2026-08-29):** Reskin landed tokens/fonts but accent is a single `--accent` CSS var per route (`data-accent` on `<main>`). Hub cards, CTAs, eyebrows all inherit one accent — `/grade-2` is all green (see screenshot). Missing: per-component color variants, featured multi-shadow blocks, strand/table column accents, subject-specific card fills.

## Activity / lab model

**Intended (Phase 1 design):** Hybrid — 3 showcase labs + reusable templates with per-standard config.

**Current gap:** `getActivityParams()` in `src/data/activities.ts` returns **one static param object** per standard. ~24 standards have bespoke params; rest fall back to generic checklist / placeholder text. No question banks, no multi-step sessions, no randomization — same single question every visit.

Templates: word-problem, numeric-flash, equal-groups, number-sense, computation, measurement, time-money, data-chart, geometry, writing-frame, reading-response, language-edit, checklist, science-inquiry.

## Tools & channels

- Stack: Vite + React + TypeScript, CSS in `src/index.css`
- Deploy: Netlify static
- AI teammate: WebMCP tools (unchanged by visual/content work)
- User: Anantha, software engineer, codes directly

## Terminology

- **Standard** — one NCSCOS row (e.g. `NC.2.OA.1`)
- **Lab** — interactive activity for a standard
- **Template** — reusable lab UI pattern driven by params
- **Showcase lab** — bespoke board (place-value, opinion-builder, matter-lab)
- **Question set** — 3 aligned questions per standard; all must pass to complete

## Settled loop decisions (2026-08-29)

- Two workflows: `workflows/creative-mode-fidelity.md` + `workflows/grade2-question-sets.md`
- Design: subject-fixed card colors + route accent chrome + strand rotation
- Curriculum: 3 questions/standard, sequential, unlimited retry, hybrid content
- Showcase labs excluded from question sets
- Triggers: manual for both
