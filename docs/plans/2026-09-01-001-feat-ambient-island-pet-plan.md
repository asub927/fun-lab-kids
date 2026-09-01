---
title: "feat: Ambient floating Island Pet (Codex-style)"
date: 2026-09-01
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: session request 2026-09-01 + Codex pet documentation research
execution: code
origin: User feedback that the docked hatch/care pet is wrong; want a free-floating experience feature like Codex pet
---

# feat: Ambient floating Island Pet (Codex-style) — Plan

## Goal Capsule

**Objective:** Replace the current docked “Hatch Pet / High Five” widget with a **Codex-style ambient pet**: a sprite that freely floats around the app, reacts to learning activity through animation only, and has **no action buttons or care panel**.

**Product authority:** User direction (2026-09-01) plus Codex terminal-pet behavior documented in OpenAI Codex (`codex-rs/tui/src/pets/*`, `[tui].pet` / `pet_anchor`, `/pets`) and community pet packaging notes ([Awesome Codex Pet](https://github.com/legeling/awesome-codex-pet)).

**Open blockers:** None for planning. Art direction for the default island creature can use existing original SVG pets (Pebble / Coral / Sprout); do **not** ship third-party Codex community spritesheets (CC BY-NC).

---

## Research summary (what “Codex pet” actually is)

From OpenAI Codex source/docs:

| Codex behavior | Implication for Inquiry Island |
| --- | --- |
| Module is explicitly an **“Ambient terminal pet”** | Experience / atmosphere feature, not a mini-game |
| Anchored near the composer by default (`pet_anchor`) | Lives in the viewport as decoration, not a toolbar control |
| Animation states: `idle`, `running`, `waiting`, `review`, `wave`, directional run | Mood comes from **activity**, not from tapping “High Five” |
| Brief status chips like “Thinking” / “Needs input” / “Ready” | Optional tiny transient labels only — never a full panel |
| Choose / hide via Settings or `/pets` — not a floating CTA | Hide/show belongs in settings or a non-chrome gesture, not a hatch button |
| Package = `pet.json` + spritesheet; picker is separate | We can keep one built-in island creature (or subject-linked) without a hatch storefront |

Community gallery confirms the same UX: pets show Idle / Waving / Running / Waiting / Review loops — **no in-scene action buttons**.

**What we built that diverges (to remove):** bottom-left pill toggle, hatch species grid, nickname/rename, High Five, care stats panel, growth-stage progression as primary UX.

**What we keep as separate product:** `IslandCompanion` (hints / next / cheer) remains the **interactive** helper. Pet and companion must not compete for the same job.

---

## Product Contract

### Summary

Kids see a small island creature **drift around the page** while they learn. It idles when calm, hustles when they’re mid-lab or stuck, and celebrates briefly after a win. There is no hatch flow and no pet toolbar. The pet is presence + motion only.

### Problem Frame

The current pet reads as a second companion app (button + panel + care loop). Codex pet succeeds because it is ambient: always there, rarely demanding attention, emotionally synced to work state.

### Requirements

- R1. Pet is **always ambient** when enabled: fixed/absolute layer over the app, not a docked pill or card.
- R2. Pet **freely floats / wanders** within the safe viewport (avoids covering primary CTAs, lab action toolbar, and the companion toggle).
- R3. Pet has **no action buttons**: no Hatch, High Five, Rename, Close panel, or persistent “open pet” control.
- R4. Pet appearance is driven only by **animation / pose / brief optional speech bubble** tied to app activity.
- R5. Activity → animation map (Codex-inspired, kid-domain adapted):
  - `idle` — default roaming / bobbing
  - `working` / `running` — active lab focus, check in progress, or recent incorrect check
  - `waiting` — board empty / needs an answer (optional)
  - `review` / `celebrate` — brief burst after correct check, mastery, or badge unlock
  - `wave` — rare idle flourish or single soft click (optional; still no panel)
- R6. Celebrations auto-expire (≈3–5s) then return to idle wander — never stick forever.
- R7. `IslandCompanion` stays interactive and bottom-right; pet must not look like a second companion chrome.
- R8. Prefer **zero setup**: default one creature on first visit (subject-linked or fixed island default). No hatch gate.
- R9. Hide/show is allowed only as a **non-chrome preference** (e.g. Progress settings toggle, or long-press pet → tiny ephemeral “Hide pet” chip that disappears). Default: visible.
- R10. Respect `prefers-reduced-motion`: pet stays put (or very subtle bob) with a static/idle frame; no wander path.
- R11. Pet must remain pointer-events-safe for learning: either `pointer-events: none` by default, or only the sprite hit-target with no blocking overlays.
- R12. Home marketing copy updated from “Hatch Pebble…” to ambient language (“A tiny island friend floats with you while you practice”).
- R13. Existing gamification (XP, streaks, badges) unchanged; pet may *reflect* progress visually but must not introduce care counters as a goal.

### Actors

- A1. **Jordan (Grade 2 kid)** — notices the friend without needing to manage it.
- A2. **Helper / parent** — can hide the pet if distracting; companion still available for hints.
- A3. **Builder** — maintains one sprite system and a small activity→mood mapper.

### Key Flows

- F1. Kid opens any route → pet already floating; no onboarding modal.
- F2. Kid enters a lab and works → pet shifts to working/running loop and wanders near board edges.
- F3. Kid gets a correct check → pet celebrate/review burst, then calm idle again.
- F4. Kid ignores pet entirely → learning UX unaffected (no required taps).
- F5. Helper hides pet via preference → pet gone; companion remains.

### Acceptance Examples

- AE1. Homepage shows **Lets go!** and a free-floating pet with **no** “Hatch Pet” pill.
- AE2. Lab page shows pet floating; Undo / Check / Show Answer / Reset unchanged; no pet care panel.
- AE3. After a correct check, pet visibly celebrates briefly without opening UI chrome.
- AE4. With reduced motion, pet does not roam across the screen.
- AE5. Companion still opens hints from bottom-right; pet never presents Hint / Cheer buttons.

### Key Decisions

- KD1. **Ambient experience over pet-care game** — remove hatch/care as primary UX. *(user-directed)*
- KD2. **Free float (wander)** rather than Codex’s strict composer-anchor — better fit for a full-page kid web app; still avoid UI collisions. *(user-directed “freely float”)*
- KD3. **Keep Island Companion** for interactive help; pet is emotional presence only.
- KD4. **Original SVG / CSS sprite art** for Pebble/Coral/Sprout (or one default) — do not vendor community Codex spritesheets.
- KD5. **Subject-linked default creature** (math→Digits-adjacent crab/pebble, ela→coral, science→sprout) without a picker in v1; optional later settings picker is out of critical path.

### Scope Boundaries

**In scope:**
- Rewrite `IslandPet` into ambient floater
- Remove hatch/care panel UI and related CSS chrome
- Activity→animation wiring from `AppContext` (`lastCheck`, `lastCelebration`, route/lab presence)
- Wander motion + collision padding + reduced-motion
- Home feature copy update
- Tests for mood/activity mapping; light component smoke if practical

**Out of scope:**
- Full Codex `pet.json` / spritesheet runtime compatibility
- Shipping third-party anime/game pet packs
- Pet XP / hunger / care economy
- Replacing Island Companion
- Multiplayer pet presence

---

## Technical Approach

### Architecture

```text
AppChrome
  ├─ IslandCompanion   (interactive, bottom-right)  [unchanged role]
  └─ IslandPetAmbient  (decorative, free-float)     [rewritten]

App activity signals ──► petActivityMapper ──► animation state
viewport + safeboxes ──► wanderController ──► x/y transform
```

### Implementation units

#### IU1 — Strip care chrome; redefine pet as ambient shell
- **Files:** `src/components/IslandPet.tsx`, `src/index.css`, `src/App.tsx`, `src/pages/HomePage.tsx`
- **Approach:** Replace panel/toggle markup with a single absolutely positioned sprite root (`aria-hidden` or decorative `role="img"` with accessible name). Delete hatch grid, rename, High Five, stats. Update home feature blurb. Remove bottom-left dock styles that mimic a button chrome.
- **Done when:** No pet action buttons render on any route; pet still mounts globally.

#### IU2 — Activity → animation mapper (Codex-inspired)
- **Files:** `src/services/pet.ts` (slim), `src/data/pets.ts`, new `src/services/petActivity.ts` (+ tests)
- **Approach:** Keep species/sprite ids if useful; remove care-count growth as UX. Map:
  - celebrating if recent successful check / celebration payload (timed)
  - working if recent failed check or active lab interaction
  - idle otherwise
  Drop hungry/sleepy care timers from primary mood model (or keep only as rare idle flavor if zero UX surface).
- **Done when:** Unit tests cover activity transitions and auto-expiry back to idle.

#### IU3 — Free-float wander + collision pads
- **Files:** `src/components/IslandPet.tsx` (or `src/components/pets/AmbientPet.tsx`), `src/index.css`
- **Approach:** rAF or CSS-driven wander between random waypoints inside `viewport - padding`. Maintain exclusion zones roughly matching: top nav, `.lab-actions`, `.island-companion`, primary home CTAs. Soft ease between points; flip sprite when moving left/right. `prefers-reduced-motion`: fixed corner offset, idle bob only.
- **Done when:** Pet visibly drifts without covering Check Answer / companion toggle in manual desktop+mobile checks.

#### IU4 — Sprite polish for ambient loops
- **Files:** `src/components/pets/PetSprite.tsx`, CSS keyframes
- **Approach:** Expand SVG poses/keyframes for idle / working / celebrate / wave. Prefer CSS sprite animation over interactive controls. Optional single soft click → wave (no menu). Default `pointer-events: none` unless wave click is enabled.
- **Done when:** At least 3 readable motion states; reduced-motion disables loops.

#### IU5 — Preference: hide ambient pet
- **Files:** `src/services/pet.ts` or progress prefs, small control on Progress page **or** long-press ephemeral chip
- **Approach:** Persist `petVisible: boolean` (default true). No floating settings gear on the pet itself.
- **Done when:** Hidden pet stays hidden across reload; companion unaffected.

### Testing / verification

- Unit: activity mapper transitions + expiry
- Manual: home, hub, lab — no hatch UI; float + celebrate; companion still works
- Manual: reduced-motion
- Manual: pet does not block Check Answer taps
- Regression: prior lab polish (Show Answer color, question nav, Lets go!) remains

### Risks

| Risk | Mitigation |
| --- | --- |
| Floating pet distracts or occludes taps | Exclusion pads + `pointer-events: none` default |
| Feels like a second companion | No speech-action panel; leave Hint/Cheer on companion only |
| Wander feels chaotic on small screens | Smaller travel radius / park in corner more often on ≤640px |
| Kids expect hatch/care after earlier build | Soft copy update; no migration pain (ignore old care localStorage keys) |

---

## Execution notes

- Prefer rewrite-in-place of `IslandPet` over parallel dead code.
- Do not block on building a Codex-compatible spritesheet pipeline.
- Commit on current cloud branch after implementation; keep Vite preview on **5175** so local `main` servers on 5173 are not confused.

---

## Confidence

**High** on product direction (user + Codex ambient model aligned).  
**Medium** on exact wander tuning (needs visual pass once floating).  
**High** on technical feasibility inside current React/CSS stack.
