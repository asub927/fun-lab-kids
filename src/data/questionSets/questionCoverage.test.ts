import { describe, expect, it } from "vitest";
import { listGrade2Standards } from "../standards";
import { getQuestionSet, validateQuestionSets } from "../questionSets";
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

  it("gives every playable standard 10 unique questions with displayable prompts", () => {
    const playable = listGrade2Standards().filter((standard) => !SHOWCASE.has(standard.code));

    for (const standard of playable) {
      const questions = getQuestionSet(standard.code);
      expect(questions, `${standard.code} question count`).toHaveLength(10);

      const serialized = questions.map((question) => JSON.stringify(question));
      expect(new Set(serialized).size, `${standard.code} duplicates`).toBe(10);

      for (const [index, question] of questions.entries()) {
        expect(
          questionHasPrompt(question as Record<string, unknown>),
          `${standard.code} Q${index} missing prompt/story`,
        ).toBe(true);
        expect(labIdFromActivityType(standard.activityType), `${standard.code} lab mapping`).toBeTruthy();
      }
    }
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
