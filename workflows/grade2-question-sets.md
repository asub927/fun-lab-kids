# Workflow: Grade 2 question sets

## Loop

Anantha expands Inquiry Island labs with **curated question pools** that cover the NC Grade 2 curriculum. Jordan practices a 10-question session slice; revisits rotate to a fresh slice so completed skills do not replay the same items.

## Trigger

**Manual.** Anantha says "run the grade 2 question sets workflow" when curriculum depth is the priority.

## Scope

Template labs + checklist standards. **Exclude** the 3 showcase labs (place-value, opinion-builder, matter-lab) — they stay single rich interactions.

**Playable standards:** 77 total → **74** get question sets (77 − 3 showcase).

---

## Decisions (settled)

| Decision | Choice |
|---|---|
| Pool size | **30 unique questions** per playable standard |
| Session model | **10-question slice** per visit, sequential |
| Visit rotation | `visitCount` in progress; visit N uses seeds `(N*10) % 30` |
| Advance rule | Correct check → stay until learner taps Next |
| Retry | Unlimited retries on current question until correct |
| Standard mastery | 8 correct **or** smart score ≥ 80, and session reached last question |
| Coverage | Every playable non-showcase standard has a full unique pool; no generic fallbacks |
| Content strategy | **Hybrid** — generators for math; hand-authored bases (6 each) + variation for ELA/science |
| Progress storage | `StandardProgress` includes `visitCount`; session index is in-memory only |
| Showcase labs | No question sets |

---

## Data model

### Constants

```ts
// src/data/questionSets/types.ts
export const QUESTIONS_PER_STANDARD = 10; // session length
export const QUESTION_POOL_SIZE = 30;     // unique pool per standard
export const QUESTIONS_TO_MASTER = 8;
export const SMART_SCORE_TARGET = 80;
```

### File layout

```
src/data/questionSets/
  types.ts
  elaContent.ts      // 6 hand-authored bases per ELA standard
  scienceContent.ts  // 6 hand-authored bases per science standard
  index.ts           // getQuestionPool / getQuestionSet(code, visitIndex)
src/data/generators/
  math.ts
  ela.ts
  science.ts
```

### Generator contract

Each generator accepts `(standard | code, seed: number) => ActivityParams` where `seed` is `0..29`. Generators must:

- Produce **different** params per seed (different numbers, stories, or objects)
- Stay within Grade 2 constraints
- Align with the standard's `activityType` and `text`
- Support session difficulty banding via `difficultyForSeed(seed)` (L1/L2/L3 within each 10-question slice)

### ELA / science

Each standard has **6 hand-authored bases**. Generators expand to 30 unique items with name/place variation, prompt pools, and a `practiceId` for uniqueness across revisits.

---

## Runtime

### Boot (`AppContext`)

1. `visitIndex = recordLabVisit(standardCode)` (0 on first open)
2. `getQuestionSet(standardCode, visitIndex)` → 10 questions from the pool
3. Board starts at question 0; UI shows **Question N of 10**

### Progress

```ts
export type StandardProgress = {
  completed: boolean;
  bestScore: number;
  lastAt: number;
  questionsCorrect?: number;
  smartScore?: number;
  visitCount?: number;
};
```

Re-opening a completed standard advances `visitCount` and serves the next slice (wraps after 3 visits).

---

## Verification

```bash
npm run test          # includes question-set coverage + visit rotation tests
npm run build
```

**Manual smoke:**

1. Open `/lab/NC.2.OA.1` — answer through the set; note the stories
2. Re-open the same standard — a different 10-question slice should appear
3. Complete mastery → subject browser still shows ✓
4. Open showcase `/lab/NC.2.NBT.1` — no question counter; single interaction unchanged

---

## Definition of done

- [x] 74 non-showcase standards each have 30 unique, aligned pool questions
- [x] Sessions are 10 questions; revisits rotate slices
- [x] No generic fallback content in any question set
- [x] Validation test enforces pool coverage and uniqueness
- [x] Showcase labs unchanged
