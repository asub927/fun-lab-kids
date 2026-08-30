import { describe, expect, it } from "vitest";
import { buildCompanionContext, getCompanionHint, getCompanionNextStep } from "./companion";
import type { ProgressStore } from "./progress";

const emptyStore: ProgressStore = {
  version: 2,
  profile: { name: "Alex" },
  progress: {},
  gamification: {
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lifetimeChecks: 0,
    lifetimeCorrect: 0,
    unlockedAchievements: {},
    lastPracticeDate: null,
  },
};

describe("companion", () => {
  it("returns a strategy step as a lab hint", () => {
    const ctx = buildCompanionContext("/lab/NC.2.OA.1", {
      store: emptyStore,
      activeStandard: {
        code: "NC.2.OA.1",
        subject: "math",
        grade: 2,
        strand: "Operations",
        text: "Use addition and subtraction within 100.",
        activityType: "word-problem",
        source: "test",
      },
      boardState: {
        labId: "word-problem",
        standardCode: "NC.2.OA.1",
        numericAnswer: "",
        textResponse: "",
        selectedOption: "",
        checklist: [],
        frameFields: {},
        params: {
          story: "Mia has 12 stickers. She gets 5 more stickers. How many does she have now?",
          a: 12,
          b: 5,
          op: "+",
        },
      },
    });

    const hint = getCompanionHint(ctx);
    expect(hint.line).toMatch(/12/);
    expect(hint.line).toMatch(/5/);
  });

  it("suggests an incomplete skill as the next step", () => {
    const ctx = buildCompanionContext("/grade-2/math", {
      store: emptyStore,
    });

    const next = getCompanionNextStep(ctx);
    expect(next.link).toMatch(/^\/lab\//);
    expect(next.line).toMatch(/Try NC\./);
  });
});
