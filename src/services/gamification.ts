import { ACHIEVEMENTS, type Achievement } from "../data/achievements";
import type { GamificationState, ProgressStore } from "./progress";

export const XP_CORRECT = 10;
export const XP_MASTERY_BONUS = 50;
export const XP_STREAK_BONUS = 5;

export type GamificationEvent = {
  ok: boolean;
  isNewMastery: boolean;
  smartScore?: number;
};

export type GamificationResult = {
  store: ProgressStore;
  xpEarned: number;
  newAchievements: Achievement[];
  streakDays: number;
  isNewMastery: boolean;
  streakBonusApplied: boolean;
};

export function formatLocalDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysBetweenDates(from: string, to: string): number {
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function emptyGamificationState(): GamificationState {
  return {
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    unlockedAchievements: {},
    lifetimeChecks: 0,
    lifetimeCorrect: 0,
  };
}

export function backfillXpFromProgress(store: ProgressStore): number {
  const mastered = Object.values(store.progress).filter((p) => p.completed).length;
  return mastered * XP_MASTERY_BONUS;
}

export function awardCheckXp(
  ok: boolean,
  isNewMastery: boolean,
  streakBonusApplied: boolean,
): number {
  let xp = 0;
  if (ok) xp += XP_CORRECT;
  if (isNewMastery) xp += XP_MASTERY_BONUS;
  if (streakBonusApplied) xp += XP_STREAK_BONUS;
  return xp;
}

export function updateStreak(
  gamification: GamificationState,
  today: string,
): { currentStreak: number; longestStreak: number; streakBonusApplied: boolean } {
  const { lastPracticeDate, currentStreak, longestStreak } = gamification;

  if (lastPracticeDate === today) {
    return { currentStreak, longestStreak, streakBonusApplied: false };
  }

  let nextStreak = 1;
  if (lastPracticeDate) {
    const gap = daysBetweenDates(lastPracticeDate, today);
    nextStreak = gap === 1 ? currentStreak + 1 : 1;
  }

  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(longestStreak, nextStreak),
    streakBonusApplied: true,
  };
}

export function evaluateNewAchievements(store: ProgressStore): Achievement[] {
  const unlocked = store.gamification.unlockedAchievements;
  return ACHIEVEMENTS.filter((a) => !unlocked[a.id] && a.evaluate(store));
}

export function applyGamificationEvent(
  store: ProgressStore,
  event: GamificationEvent,
  now = Date.now(),
  today = formatLocalDate(new Date(now)),
): GamificationResult {
  const next: ProgressStore = {
    ...store,
    gamification: { ...store.gamification },
  };

  next.gamification.lifetimeChecks += 1;
  if (event.ok) next.gamification.lifetimeCorrect += 1;

  const streakUpdate = updateStreak(next.gamification, today);
  next.gamification.currentStreak = streakUpdate.currentStreak;
  next.gamification.longestStreak = streakUpdate.longestStreak;
  next.gamification.lastPracticeDate = today;

  const xpEarned = awardCheckXp(event.ok, event.isNewMastery, streakUpdate.streakBonusApplied);
  next.gamification.totalXp += xpEarned;

  const newAchievements = evaluateNewAchievements(next);
  for (const achievement of newAchievements) {
    next.gamification.unlockedAchievements[achievement.id] = { unlockedAt: now };
  }

  return {
    store: next,
    xpEarned,
    newAchievements,
    streakDays: next.gamification.currentStreak,
    isNewMastery: event.isNewMastery,
    streakBonusApplied: streakUpdate.streakBonusApplied,
  };
}
