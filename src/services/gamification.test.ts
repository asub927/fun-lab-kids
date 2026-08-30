import { describe, expect, it } from "vitest";
import {
  applyGamificationEvent,
  awardCheckXp,
  backfillXpFromProgress,
  daysBetweenDates,
  emptyGamificationState,
  formatLocalDate,
  updateStreak,
  XP_CORRECT,
  XP_MASTERY_BONUS,
  XP_STREAK_BONUS,
} from "./gamification";
import type { ProgressStore } from "./progress";

function makeStore(overrides: Partial<ProgressStore> = {}): ProgressStore {
  return {
    version: 2,
    profile: {},
    gamification: emptyGamificationState(),
    progress: {},
    ...overrides,
  };
}

describe("awardCheckXp", () => {
  it("awards XP for correct answers", () => {
    expect(awardCheckXp(true, false, false)).toBe(XP_CORRECT);
  });

  it("adds mastery and streak bonuses", () => {
    expect(awardCheckXp(true, true, true)).toBe(XP_CORRECT + XP_MASTERY_BONUS + XP_STREAK_BONUS);
  });

  it("awards nothing for incorrect checks", () => {
    expect(awardCheckXp(false, false, false)).toBe(0);
  });
});

describe("updateStreak", () => {
  it("starts streak on first practice day", () => {
    const result = updateStreak(emptyGamificationState(), "2026-08-30");
    expect(result.currentStreak).toBe(1);
    expect(result.streakBonusApplied).toBe(true);
  });

  it("does not double-count same-day practice", () => {
    const gamification = {
      ...emptyGamificationState(),
      currentStreak: 3,
      longestStreak: 3,
      lastPracticeDate: "2026-08-30",
    };
    const result = updateStreak(gamification, "2026-08-30");
    expect(result.currentStreak).toBe(3);
    expect(result.streakBonusApplied).toBe(false);
  });

  it("increments streak on consecutive days", () => {
    const gamification = {
      ...emptyGamificationState(),
      currentStreak: 2,
      longestStreak: 2,
      lastPracticeDate: "2026-08-29",
    };
    const result = updateStreak(gamification, "2026-08-30");
    expect(result.currentStreak).toBe(3);
    expect(result.streakBonusApplied).toBe(true);
  });

  it("resets streak after a skipped day", () => {
    const gamification = {
      ...emptyGamificationState(),
      currentStreak: 5,
      longestStreak: 5,
      lastPracticeDate: "2026-08-27",
    };
    const result = updateStreak(gamification, "2026-08-30");
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(5);
  });
});

describe("applyGamificationEvent", () => {
  it("tracks lifetime stats and XP", () => {
    const store = makeStore({
      progress: {
        "NC.2.NBT.1": { completed: true, bestScore: 100, lastAt: 1, smartScore: 80 },
      },
    });
    const result = applyGamificationEvent(
      store,
      { ok: true, isNewMastery: true },
      Date.parse("2026-08-30T10:00:00"),
      "2026-08-30",
    );

    expect(result.xpEarned).toBe(XP_CORRECT + XP_MASTERY_BONUS + XP_STREAK_BONUS);
    expect(result.store.gamification.lifetimeChecks).toBe(1);
    expect(result.store.gamification.lifetimeCorrect).toBe(1);
    expect(result.newAchievements.some((a) => a.id === "first-explorer")).toBe(true);
  });

  it("unlocks hot streak achievement at 3 days", () => {
    const store = makeStore({
      gamification: {
        ...emptyGamificationState(),
        currentStreak: 2,
        longestStreak: 2,
        lastPracticeDate: "2026-08-29",
      },
      progress: { "NC.2.NBT.1": { completed: true, bestScore: 100, lastAt: 1 } },
    });

    const result = applyGamificationEvent(
      store,
      { ok: true, isNewMastery: false },
      Date.parse("2026-08-30T10:00:00"),
      "2026-08-30",
    );

    expect(result.streakDays).toBe(3);
    expect(result.newAchievements.some((a) => a.id === "hot-streak")).toBe(true);
  });
});

describe("backfillXpFromProgress", () => {
  it("awards 50 XP per mastered standard during migration", () => {
    const store = makeStore({
      progress: {
        A: { completed: true, bestScore: 90, lastAt: 1 },
        B: { completed: false, bestScore: 50, lastAt: 2 },
      },
    });
    expect(backfillXpFromProgress(store)).toBe(XP_MASTERY_BONUS);
  });
});

describe("daysBetweenDates", () => {
  it("counts calendar day gaps", () => {
    expect(daysBetweenDates("2026-08-29", "2026-08-30")).toBe(1);
    expect(daysBetweenDates("2026-08-27", "2026-08-30")).toBe(3);
  });
});

describe("formatLocalDate", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(formatLocalDate(new Date(2026, 7, 30))).toBe("2026-08-30");
  });
});
