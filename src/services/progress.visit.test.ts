import { beforeEach, describe, expect, it } from "vitest";
import { emptyGamificationState } from "./gamification";
import { loadProgress, recordCheckResult, recordLabVisit, saveProgress } from "./progress";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => store.clear(),
    },
  });

  saveProgress({
    version: 2,
    profile: {},
    gamification: emptyGamificationState(),
    progress: {},
  });
});

describe("progress visit rotation", () => {
  it("returns ascending visit indexes and preserves mastery fields", () => {
    expect(recordLabVisit("NC.2.OA.1")).toBe(0);
    expect(recordLabVisit("NC.2.OA.1")).toBe(1);
    expect(recordLabVisit("NC.2.OA.1")).toBe(2);

    recordCheckResult("NC.2.OA.1", true, 90, {
      completed: true,
      questionsCorrect: 8,
      smartScore: 80,
    });

    const afterCheck = loadProgress().progress["NC.2.OA.1"];
    expect(afterCheck.visitCount).toBe(3);
    expect(afterCheck.completed).toBe(true);
    expect(afterCheck.smartScore).toBe(80);

    expect(recordLabVisit("NC.2.OA.1")).toBe(3);
    expect(loadProgress().progress["NC.2.OA.1"].completed).toBe(true);
  });
});
