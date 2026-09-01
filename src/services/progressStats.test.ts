import { describe, expect, it } from "vitest";
import { getAchievementById } from "../data/achievements";
import { listGrade2Standards } from "../data/standards";
import { emptyGamificationState } from "./gamification";
import type { ProgressStore } from "./progress";
import {
  getAchievementNavigationPath,
  getBestSmartScoreBelow100,
  getFirstUnmasteredCode,
} from "./progressStats";

function makeStore(overrides: Partial<ProgressStore> = {}): ProgressStore {
  return {
    version: 2,
    profile: {},
    gamification: emptyGamificationState(),
    progress: {},
    ...overrides,
  };
}

function mastered(smartScore = 80): ProgressStore["progress"][string] {
  return {
    completed: true,
    bestScore: 1,
    lastAt: Date.now(),
    smartScore,
  };
}

function inProgress(smartScore: number, lastAt = Date.now()): ProgressStore["progress"][string] {
  return {
    completed: false,
    bestScore: 0.5,
    lastAt,
    smartScore,
  };
}

describe("getFirstUnmasteredCode", () => {
  it("returns the first unmastered standard in catalog order", () => {
    const store = makeStore();
    const first = listGrade2Standards()[0]?.code;
    expect(getFirstUnmasteredCode(store)).toBe(first);
  });

  it("skips completed standards", () => {
    const first = listGrade2Standards("math")[0]?.code;
    const second = listGrade2Standards("math")[1]?.code;
    const store = makeStore({
      progress: { [first!]: mastered() },
    });
    expect(getFirstUnmasteredCode(store, "math")).toBe(second);
  });
});

describe("getBestSmartScoreBelow100", () => {
  it("returns the in-progress skill with the highest smart score under 100", () => {
    const store = makeStore({
      progress: {
        "NC.2.OA.1": inProgress(60),
        "RL.2.1": inProgress(85),
      },
    });
    expect(getBestSmartScoreBelow100(store)).toBe("RL.2.1");
  });

  it("returns null when no in-progress skills have a smart score", () => {
    expect(getBestSmartScoreBelow100(makeStore())).toBeNull();
  });
});

describe("getAchievementNavigationPath", () => {
  it("links first-explorer to the first unmastered lab on an empty store", () => {
    const achievement = getAchievementById("first-explorer")!;
    const first = listGrade2Standards()[0]?.code;
    expect(getAchievementNavigationPath(achievement, makeStore())).toBe(`/lab/${encodeURIComponent(first!)}`);
  });

  it("links math-captain to the next unmastered math skill", () => {
    const achievement = getAchievementById("math-captain")!;
    const first = listGrade2Standards("math")[0]?.code;
    const second = listGrade2Standards("math")[1]?.code;
    const store = makeStore({
      progress: { [first!]: mastered() },
    });
    expect(getAchievementNavigationPath(achievement, store)).toBe(`/lab/${encodeURIComponent(second!)}`);
  });

  it("links word-captain to the ELA subject browser when all ELA skills are mastered", () => {
    const achievement = getAchievementById("word-captain")!;
    const progress = Object.fromEntries(
      listGrade2Standards("ela").map((s) => [s.code, mastered()]),
    );
    expect(getAchievementNavigationPath(achievement, makeStore({ progress }))).toBe("/grade-2/ela");
  });

  it("links smart-score-star to the highest smart score below 100", () => {
    const achievement = getAchievementById("smart-score-star")!;
    const store = makeStore({
      progress: {
        "NC.2.OA.1": inProgress(85),
        "RL.2.1": inProgress(70),
      },
    });
    expect(getAchievementNavigationPath(achievement, store)).toBe("/lab/NC.2.OA.1");
  });

  it("links hot-streak to the most recent in-progress skill", () => {
    const achievement = getAchievementById("hot-streak")!;
    const store = makeStore({
      progress: {
        "NC.2.OA.1": inProgress(40, 1000),
        "RL.2.1": inProgress(55, 2000),
      },
    });
    expect(getAchievementNavigationPath(achievement, store)).toBe("/lab/RL.2.1");
  });

  it("links island-champion to the hub when every skill is mastered", () => {
    const achievement = getAchievementById("island-champion")!;
    const progress = Object.fromEntries(
      listGrade2Standards().map((s) => [s.code, mastered()]),
    );
    expect(getAchievementNavigationPath(achievement, makeStore({ progress }))).toBe("/grade-2");
  });
});
