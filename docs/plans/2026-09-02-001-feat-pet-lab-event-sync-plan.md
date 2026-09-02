---
title: "Pet Lab Event Sync - Plan"
date: 2026-09-02
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
execution: code
origin: Design concern that constant L→R pet patrol distracts kids from lab comprehension; explore calmer fun-while-learning alternatives
---

# Pet Lab Event Sync - Plan

## Goal Capsule

**Objective:** Change the ambient lab buddy so that during labs it no longer roams constantly; instead it parks calmly while the kid solves and delivers fun through learning-synced reactions plus optional tap cheer, while home/hub can stay playful.

**Product authority:** ce-brainstorm dialogue (2026-09-02) refining attention behavior of the shipped ambient pet from `docs/plans/2026-09-01-001-feat-ambient-island-pet-plan.md`. Surrounding gamification systems (XP, badges, streaks) and any future interactive hint companion are not active scope.

**Open blockers:** None for planning.

---

## Product Contract

### Summary

In labs, the ambient pet stops constant left-to-right roaming and becomes an event-synced buddy: parked and calm while solving, auto-reacting on real learning moments, plus an optional tap cheer. Home and hub keep a more playful ambient presence so delight still exists outside board work.

### Problem Frame

Continuous idle patrol pulls peripheral attention during the exact window when Grade 2 kids need board focus for subject comprehension. Gamified motion already competes with learning; the ambient pet should feel like a friend who reacts to progress, not like a screensaver running through every problem.

### Key Decisions

- KD1. **Event-synced buddy + invite cheer (Approach B)** over park-and-celebrate-only and solve-minimized token. Fun rides on learning timing, not constant motion. *(session-settled: user-directed — chosen over A and C: richer fun-while-learning without roam)* Governs R1, R2, R3, R4, R5, R6.
- KD2. **Quieter contract in labs only** over making the whole app calm. Distraction risk is during comprehension work; home/hub may stay playful. *(session-settled: user-directed — chosen over everywhere-quiet and labs+all-work-screens: problem is lab focus)* Governs R1, R7.
- KD3. **Progress-mirror + optional tap** over quiet-only or tap-only. Auto delight on learning events and invited play both stay. *(session-settled: user-directed — chosen over auto-only and tap-only)* Governs R2, R3, R5.
- KD4. **Waiting/stuck cues stay softer than celebrations** so mid-solve empathy does not recreate distraction. *(session-settled: user-approved — confirmed with scoping synthesis call-out)* Governs R3.
- KD5. **Pet is not a hint/help companion.** Optional tap is cheer/play only; it must not become a second instructional helper surface. Governs R6.

### Actors

- A1. **Jordan (Grade 2 kid)** — works labs for subject comprehension; notices pet delight on wins without losing board focus mid-solve.
- A2. **Helper / parent** — may still hide the pet if needed; should rarely need to because lab motion stays calm.

### Key Flows

- F1. Mid-lab solve
  - **Trigger:** Kid is in an active lab and no learning event just fired.
  - **Actors:** A1
  - **Steps:** Pet remains visible in the buddy lane, parked (no L→R patrol loop); sprite stays calm/idle-in-place.
  - **Outcome:** Board holds attention; pet does not roam.
  - **Covered by:** R1, R4
- F2. Learning-synced auto reaction
  - **Trigger:** Learning state changes (correct check, waiting/needs answer, stuck/struggle signal, or milestone the product already surfaces).
  - **Actors:** A1
  - **Steps:** Pet plays a brief reaction appropriate to the event; waiting/stuck stay softer than celebrate; reaction auto-expires back to parked calm.
  - **Outcome:** Fun mirrors progress without a lasting motion loop.
  - **Covered by:** R2, R3, R4
- F3. Invite cheer
  - **Trigger:** Kid taps the pet during a lab.
  - **Actors:** A1
  - **Steps:** Short cheer/wave/play beat and optional line; returns to parked calm; no hint panel or care UI opens.
  - **Outcome:** Optional play without requiring interaction to finish the lab.
  - **Covered by:** R5, R6
- F4. Home / hub playful ambient
  - **Trigger:** Kid is on home or hub (non-lab).
  - **Actors:** A1
  - **Steps:** Pet may use playful ambient motion (including patrol-style roam) and occasional flourish.
  - **Outcome:** Outside labs, the buddy still feels alive.
  - **Covered by:** R7
- F5. Hide preference unchanged in role
  - **Trigger:** Helper or kid hides the pet via existing preference / long-press hide.
  - **Actors:** A1, A2
  - **Steps:** Pet stays hidden across reload until shown again.
  - **Outcome:** Escape hatch remains; this work does not depend on hide as the primary fix.
  - **Covered by:** R8

### Requirements

**Lab attention**

- R1. While the kid is in an active lab and no reaction is playing, the pet must not run a continuous left-to-right patrol; it stays parked in the buddy lane (calm in-place idle is allowed).
- R2. In labs, the pet auto-reacts to real learning state changes: at least correct check, waiting/needs-answer, and a stuck/struggle signal when the app can detect one, plus any existing milestone the product already celebrates.
- R3. Waiting and stuck auto-reactions must be clearly softer (less motion/speech intensity and/or shorter) than correct-check celebrations.
- R4. Lab reactions auto-expire and return to parked calm; they must not leave the pet in a lasting roam or celebrate loop.

**Invite play**

- R5. Soft tap/click on the pet during a lab triggers a short cheer/play beat, then returns to parked calm.
- R6. Tap cheer must not open instructional help, care panels, or other chrome that turns the pet into a helper UI.

**Outside labs**

- R7. On home and hub, the pet may remain playfully ambient (including patrol-style motion and occasional flourish); the quieter parked contract is lab-scoped.

**Preserved escape hatch**

- R8. Existing hide/show preference and long-press hide continue to work; this change must not require hiding the pet to make labs usable.

**Accessibility**

- R9. `prefers-reduced-motion: reduce` continues to suppress roam and large motion loops; event reactions, if any, stay minimal or static.

### Acceptance Examples

- AE1. Mid-lab park
  - **Covers:** R1
  - **Given:** Kid is in a lab with no recent check or tap.
  - **When:** Several seconds pass.
  - **Then:** Pet stays in the buddy lane without repeating L→R patrol walks.
- AE2. Correct-check delight
  - **Covers:** R2, R4
  - **Given:** Kid submits a correct check in a lab.
  - **When:** The celebration fires.
  - **Then:** Pet shows a clear celebrate beat (motion and/or speech), then returns to parked calm.
- AE3. Softer stuck/waiting
  - **Covers:** R3
  - **Given:** Lab board needs an answer or a stuck signal fires.
  - **When:** The auto reaction plays.
  - **Then:** The reaction is visibly/audibly milder and/or shorter than a correct-check celebration.
- AE4. Tap invite
  - **Covers:** R5, R6
  - **Given:** Kid is mid-lab.
  - **When:** They tap the pet.
  - **Then:** A short cheer plays and ends; no hint/care panel opens.
- AE5. Home still playful
  - **Covers:** R7
  - **Given:** Kid is on home or hub with the pet visible and motion allowed.
  - **When:** They watch the buddy lane briefly.
  - **Then:** Playful ambient motion (such as patrol) remains available.
- AE6. Hide still works
  - **Covers:** R8
  - **Given:** Pet is visible.
  - **When:** Helper hides it via preference or long-press confirm.
  - **Then:** Pet stays gone across reload until shown again.

### Success Criteria

- SC1. Kids still smile at celebrations (delight preserved).
- SC2. During mid-solve, eyes stay on the board rather than tracking continuous pet roam (distraction proxy; no hard metric yet).
- SC3. Helpers should rarely need to hide the pet solely because of lab motion.

### Scope Boundaries

**In scope:**
- Lab parked/no-patrol idle behavior
- Learning-synced auto reactions with softer waiting/stuck than celebrate
- Optional tap cheer during labs
- Keeping home/hub playful ambient motion
- Preserving hide preference and reduced-motion behavior

**Out of scope / deferred:**
- Solve-minimized near-invisible token mid-solve
- Returning hatch/care economy or pet-care mini-game
- Building a new interactive hint companion (or assigning that job to the pet)
- Broad changes to XP, badges, or streak systems beyond pet reactions that reflect them
- Replacing or redesigning lab board pedagogy itself

### Dependencies / Assumptions

- Assumes the current ambient pet (footer buddy lane, activity→mood mapping, tap wave, long-press hide, reduced-motion gate) remains the base surface to refine.
- Assumes “stuck” can reuse an existing app signal or a planning-chosen proxy; if no reliable stuck signal exists, planning may ship waiting + correct + tap first and note stuck as follow-on.
- Distraction success uses the mid-solve attention proxy in SC2 until classroom observation exists.
- There is no shipped interactive `IslandCompanion` today; KD5 is a product boundary, not preservation of live companion chrome.

### Outstanding Questions

**Resolve Before Planning:** None.

**Deferred to Planning:**
- Which concrete stuck/struggle signal(s) to wire (or whether to defer stuck to a follow-on).
- Exact celebrate vs waiting intensity/duration tuning within R3/R4 bounds.
- Whether home/hub playful motion stays as today’s patrol or gets light flourish polish while labs change.

### Sources / Research

- Prior ambient pet plan: `docs/plans/2026-09-01-001-feat-ambient-island-pet-plan.md` (implementation-ready; this plan refines lab attention behavior).
- Current idle patrol: `src/hooks/usePetPatrol.ts`, `src/services/petPatrol.ts`, `src/components/IslandPet.tsx`.
- Activity→mood map: `src/services/petActivity.ts`.
- Hide preference: `src/services/pet.ts`, Progress scoreboard toggle, long-press hide on `IslandPet`.

<!-- ce-section: work-relationships -->
### How This Work Fits Together

This plan owns **lab attention behavior for the ambient pet** (park mid-solve; event-synced fun; optional tap; home/hub may stay playful). The broader ambient-pet introduction is already captured elsewhere and is context, not a roadmap commitment.

- Ambient floating Island Pet (`docs/plans/2026-09-01-001-feat-ambient-island-pet-plan.md`)
  - **Shares** ambient pet presence, activity→mood idea, hide preference, reduced-motion
  - **This plan depends on** that pet already existing as the lab buddy surface
  - **Still to decide** in later work: any true interactive hint companion (explicitly not this pet’s job)
