# Grade 2 Full App — Phase 1 Design Spec

**Date:** 2026-08-28  
**Status:** Approved via `/goal implement everything we have discussed`

## Objective

Transform Inquiry Island from a hackathon demo into a Grade 2 kid app: NCSCOS-complete curriculum (Math, ELA, Science), real navigation hub, localStorage progress, hybrid template library.

## Phase 1 Scope

- **Curriculum:** All NC Grade 2 standards in Math (~24), ELA (~45), Science (~15)
- **Product:** Kid journey — `/grade-2` hub, subject browsers, `/lab/:standardCode`
- **Progress:** localStorage per standard (completed, bestScore, lastAt)
- **Activity model:** Hybrid — 3 showcase labs + reusable templates with per-standard config
- **Out of scope:** Accounts, parent/coach panel, K–5 expansion

## Routing

| Path | Purpose |
|------|---------|
| `/` | Marketing home |
| `/grade-2` | Grade 2 hub |
| `/grade-2/:subject` | Subject standard browser |
| `/lab/:standardCode` | Activity launcher |
| `/demo/*` | Redirect → `/grade-2/*` |
| `/catalog` | All standards; non-G2 marked coming soon |

## Templates

| Template | Use |
|----------|-----|
| place-value, opinion-builder, matter-lab | Showcase (bespoke) |
| word-problem | OA.1, MD.5, MD.8 |
| numeric-flash | OA.2, NBT.5 |
| equal-groups | OA.3, OA.4 |
| number-sense | NBT.2–4, NBT.8 |
| computation | NBT.6, NBT.7 |
| measurement | MD.1–4, MD.6 |
| time-money | MD.7 |
| data-chart | MD.10 |
| geometry | G.1, G.3 |
| writing-frame | W.2.* |
| reading-response | RL.2.*, RI.2.* |
| language-edit | L.2.* |
| checklist | RF.2.*, SL.2.*, fallback |
| science-inquiry | 2.P.*, 2.E.*, 2.L.* |
