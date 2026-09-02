import { describe, expect, it } from "vitest";
import { listGrade2Standards } from "../standards";
import {
  getQuestionPool,
  getQuestionSet,
  validateQuestionSets,
  QUESTION_POOL_SIZE,
  QUESTIONS_PER_STANDARD,
} from "../questionSets";
import { labIdFromActivityType } from "../activities";

const SHOWCASE = new Set(["NC.2.NBT.1", "W.2.1", "2.P.2.1"]);

function questionHasPrompt(params: Record<string, unknown>): boolean {
  if (typeof params.prompt === "string" && params.prompt.trim().length > 8) return true;
  if (typeof params.story === "string" && params.story.trim().length > 8) return true;
  if (typeof params.passage === "string" && typeof params.question === "string") return true;
  if (typeof params.sentence === "string") return true;
  if (Array.isArray(params.items) && params.items.length > 0) return true;
  if (typeof params.a === "number" && typeof params.op === "string") return true;
  if (params.mode === "triple-add" && Array.isArray(params.values)) return true;
  if (params.mode === "compare" && typeof params.a === "number") return true;
  if (params.mode === "skip-count" && typeof params.start === "number") return true;
  if (params.mode === "expanded" && typeof params.number === "number") return true;
  if (params.mode === "odd-even" && typeof params.count === "number") return true;
  if (typeof params.rows === "number" && typeof params.cols === "number") return true;
  if (Array.isArray(params.categories) && typeof params.question === "string") return true;
  return false;
}

describe("question set coverage", () => {
  it("passes validateQuestionSets with no errors", () => {
    expect(validateQuestionSets()).toEqual([]);
  });

  it("gives every playable standard a 30-question unique pool and 10-question sessions", () => {
    const playable = listGrade2Standards().filter((standard) => !SHOWCASE.has(standard.code));

    for (const standard of playable) {
      const pool = getQuestionPool(standard.code);
      expect(pool, `${standard.code} pool count`).toHaveLength(QUESTION_POOL_SIZE);

      const serialized = pool.map((question) => JSON.stringify(question));
      expect(new Set(serialized).size, `${standard.code} pool duplicates`).toBe(QUESTION_POOL_SIZE);

      for (let visit = 0; visit < QUESTION_POOL_SIZE / QUESTIONS_PER_STANDARD; visit++) {
        const questions = getQuestionSet(standard.code, visit);
        expect(questions, `${standard.code} visit ${visit} count`).toHaveLength(QUESTIONS_PER_STANDARD);
        expect(questions[0]).toEqual(pool[visit * QUESTIONS_PER_STANDARD]);
      }

      for (const [index, question] of pool.entries()) {
        expect(
          questionHasPrompt(question as Record<string, unknown>),
          `${standard.code} Q${index} missing prompt/story`,
        ).toBe(true);
        expect(labIdFromActivityType(standard.activityType), `${standard.code} lab mapping`).toBeTruthy();
      }
    }
  });

  it("rotates session slices across visits and wraps after the pool", () => {
    const visit0 = getQuestionSet("NC.2.OA.1", 0);
    const visit1 = getQuestionSet("NC.2.OA.1", 1);
    const visit2 = getQuestionSet("NC.2.OA.1", 2);
    const visit3 = getQuestionSet("NC.2.OA.1", 3);

    expect(visit0).not.toEqual(visit1);
    expect(visit1).not.toEqual(visit2);
    expect(visit3).toEqual(visit0);
  });

  it("uses standard-specific measurement modes", () => {
    expect(getQuestionSet("NC.2.MD.1")[0].mode).toBe("measure");
    expect(getQuestionSet("NC.2.MD.2")[0].mode).toBe("measure-twice");
    expect(getQuestionSet("NC.2.MD.3")[0].mode).toBe("estimate");
    expect(getQuestionSet("NC.2.MD.4")[0].mode).toBe("compare-length");
    expect(getQuestionSet("NC.2.MD.6")[0].mode).toBe("number-line");
    expect(getQuestionSet("NC.2.MD.10")[0].prompt).toMatch(/How many/);
    expect(getQuestionSet("NC.2.G.1")[0].prompt).toMatch(/sides/);
    expect(getQuestionSet("NC.2.NBT.8")[0].mode).toBe("mental-add");
  });
});
