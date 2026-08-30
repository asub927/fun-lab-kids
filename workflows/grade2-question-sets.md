# Workflow: Grade 2 question sets

## Loop

Anantha expands Inquiry Island labs from **one static question per standard** to **curated question sets** that cover the NC Grade 2 curriculum. Jordan completes a set to mark a standard done.

## Trigger

**Manual.** Anantha says "run the grade 2 question sets workflow" when curriculum depth is the priority.

## Scope

Template labs + checklist standards. **Exclude** the 3 showcase labs (place-value, opinion-builder, matter-lab) — they stay single rich interactions.

**Playable standards:** 77 total → **74** get question sets (77 − 3 showcase).

---

## Problem

`getActivityParams()` returns one static object per standard. ~24 have bespoke params; the rest fall back to generic checklist placeholders (`"I read the learning goal…"`). Every revisit shows the same single question. Progress marks complete on any one correct check.

---

## Decisions (settled)

| Decision | Choice |
|---|---|
| Session model | **Question set** — 3 questions per standard, sequential |
| Advance rule | Correct check → auto-advance to next question (or explicit "Next" after success toast) |
| Retry | Unlimited retries on current question until correct |
| Standard completion | All 3 questions passed in one session → `completed: true` |
| Coverage | Every playable non-showcase standard has exactly 3 aligned questions; no generic fallbacks |
| Content strategy | **Hybrid** — generators for math drill templates; hand-authored (or AI-drafted + reviewed) for ELA/science |
| Checklist standards (14 ELA) | Replace generic fallback with 3 standard-specific items each (reading-response or tailored checklist prompts) |
| Progress storage | Extend `StandardProgress`; session index is in-memory only |
| Showcase labs | No question sets in this workflow |

---

## Data model

### Question set shape

```ts
// src/data/questionSets/types.ts
export type QuestionSet = {
  standardCode: string;
  questions: ActivityParams[]; // length === 3
};
```

### File layout

```
src/data/questionSets/
  types.ts
  g2-math.ts      // hand-tuned + generator seeds
  g2-ela.ts       // hand-authored passages/prompts
  g2-science.ts   // hand-authored scenarios
  index.ts        // getQuestionSet(code): ActivityParams[]
src/data/generators/
  index.ts
  word-problem.ts
  numeric-flash.ts
  equal-groups.ts
  number-sense.ts
  computation.ts
  measurement.ts
  time-money.ts
  data-chart.ts
  geometry.ts
```

### Generator contract

Each generator accepts `(standardCode, seed: number) => ActivityParams` where `seed` is 0 | 1 | 2 for the three questions. Generators must:

- Produce **different** params per seed (different numbers, stories, or objects)
- Stay within Grade 2 constraints (e.g. addition within 100, time on hour/half-hour)
- Align with the standard's `activityType` and `text`

Math standards without hand-tuned entries use generator output. Hand-tuned entries in `g2-math.ts` override generator for quality on high-visibility standards (OA.1, NBT.1-adjacent, MD.5, etc.).

### ELA / science

All questions hand-authored in subject files. Each `reading-response` question includes unique `passage`, `question`, and acceptable answer hint. Each `language-edit` has distinct `sentence`/`fixed`. Each `science-inquiry` has distinct `prompt`/`answer`.

### Checklist standards (14)

Convert from generic 3-step checklist to **standard-specific** prompts, e.g. for `SL.2.1`:

1. "Name one partner you could talk with about a book."
2. "What is one rule for taking turns in a group?"
3. "Tell one thing you learned from a class conversation."

Stored as 3 separate `checklist`-type questions (one item each) OR retyped to `reading-response` where a short scenario fits.

---

## Runtime changes

### AppContext (`src/context/AppContext.tsx`)

Add session state:

```ts
questionIndex: number;        // 0..2
questionSet: ActivityParams[];
```

Boot flow:

1. `getQuestionSet(standardCode)` → 3 questions
2. `createBoardState(labId, { standardCode, params: questionSet[0] })`
3. Display progress: **"Question 1 of 3"** in lab header (new `.question-progress` mono label)

On `runCheck()` when `result.ok`:

- If `questionIndex < 2`: increment index, reset board with next params, clear `lastCheck`, keep session alive
- If `questionIndex === 2`: call `recordCheckResult(..., completed: true)`, show island stamp + "Standard complete!"

On `runCheck()` when `!result.ok`: stay on current question (existing warn feedback).

`resetBoard()` resets **current question only**, not the whole set.

### LabShell (`src/components/LabShell.tsx`)

- Render `Question {n} of 3` below standard chip
- After final question success, feedback: "You finished all 3 questions for this standard!"

### Progress (`src/services/progress.ts`)

Extend type (backward compatible):

```ts
export type StandardProgress = {
  completed: boolean;
  bestScore: number;      // average of last completed run
  lastAt: number;
  questionsCorrect?: number; // optional audit: 3 when completed
};
```

Only write `completed: true` when all 3 questions pass. Partial sessions do not mark complete.

### Activities resolver (`src/data/activities.ts`)

- Deprecate single `getActivityParams()` as sole source
- `resolveLabForStandard()` returns `labId` + first question params (compat)
- New export: `getQuestionSet(standardCode)` from questionSets index

---

## Content production

### Phase A — Math (generators + spot overrides)

1. Implement generators for all 9 math template types
2. Run generator for each of 20 non-showcase math standards × 3 seeds
3. Hand-review and override in `g2-math.ts` where generator output is weak (~5–8 standards)

### Phase B — ELA (hand-authored)

1. Author 3 questions × 38 non-showcase ELA standards = **114 items**
2. Priority order: reading-response (22) → language-edit (6) → writing-frame (4) → checklist (14) → rest
3. Passages: 2–4 sentences, Grade 2 readability

### Phase C — Science (hand-authored)

1. Author 3 questions × 12 non-showcase science standards = **36 items**
2. Mix observation prompts, vocabulary, tool identification

### Validation script

Add `src/data/questionSets/validate.ts` (or vitest):

- Every playable non-showcase standard has exactly 3 questions
- No question set contains generic fallback strings (`"I read the learning goal"`, `"student response"`, `"explored"`)
- Each question in a set differs by JSON.stringify comparison

Run: `npm run test` includes validation test.

---

## Checkpoint

**Push right:** Implementer completes all three content phases and validation passes before asking Anantha.

**Brief format** (present at checkpoint):

```
Grade 2 question sets ready for review

Coverage: 74/74 standards × 3 questions = 222 total
Math: 20 standards (generators + N overrides)
ELA: 38 standards (hand-authored)
Science: 12 standards (hand-authored)

Spot-check links (dev):
- /lab/NC.2.OA.1  (word-problem set)
- /lab/RL.2.1     (reading-response set)
- /lab/SL.2.1     (checklist→specific set)
- /lab/2.E.1.2    (science-inquiry set)

Validation: npm run test — question set coverage test PASS

Decision: Approve merge / request edits on [list standards]
```

Anantha reviews 4 spot-check labs + validation output once.

---

## Verification

```bash
npm run typecheck
npm run test          # includes question-set coverage test
npm run build
```

**Manual smoke:**

1. Open `/lab/NC.2.OA.1` — answer Q1 correctly → advances to Q2 with different story
2. Fail Q2 → retry until correct → Q3
3. Complete Q3 → standard marked done on subject browser (✓)
4. Re-open same standard → starts fresh at Q1 (session reset); still shows ✓
5. Open showcase `/lab/NC.2.NBT.1` — no question counter; single interaction unchanged

---

## Definition of done

- [ ] 74 non-showcase standards each have 3 unique, aligned questions
- [ ] No generic fallback content in any question set
- [ ] Sequential UI with "Question N of 3"
- [ ] Standard completes only after all 3 correct
- [ ] Generators produce varied math params per seed
- [ ] Validation test enforces coverage
- [ ] Checkpoint brief delivered; Anantha approves or lists edits
- [ ] Showcase labs unchanged
- [ ] WebMCP board snapshot still works per question
