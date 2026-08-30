import { ACHIEVEMENTS, type Achievement } from "../data/achievements";
import { findStandard, listGrade2Standards } from "../data/standards";
import type { Subject } from "../types";
import { type ProgressStore, type StandardProgress } from "./progress";

export type SubjectStat = {
  subject: Subject;
  done: number;
  total: number;
  percent: number;
};

export type RecentActivity = {
  code: string;
  subject: Subject;
  text: string;
  smartScore: number;
  completed: boolean;
  lastAt: number;
};

export type ScoreboardSummary = {
  displayName: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  mastered: number;
  totalStandards: number;
  lifetimeChecks: number;
  lifetimeCorrect: number;
  averageSmartScore: number | null;
  subjectStats: SubjectStat[];
  recentActivity: RecentActivity[];
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
  nextAchievement: Achievement | null;
};

function subjectStat(store: ProgressStore, subject: Subject): SubjectStat {
  const codes = listGrade2Standards(subject).map((s) => s.code);
  const done = codes.filter((c) => store.progress[c]?.completed).length;
  const total = codes.length;
  return {
    subject,
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export function getRecentActivity(store: ProgressStore, limit = 5): RecentActivity[] {
  return Object.entries(store.progress)
    .filter(([, p]) => p.lastAt > 0)
    .sort(([, a], [, b]) => b.lastAt - a.lastAt)
    .slice(0, limit)
    .map(([code, p]) => {
      const standard = findStandard(code);
      return {
        code,
        subject: standard?.subject ?? "math",
        text: standard?.text ?? code,
        smartScore: p.smartScore ?? 0,
        completed: p.completed,
        lastAt: p.lastAt,
      };
    });
}

export function getNextAchievement(store: ProgressStore): Achievement | null {
  const locked = ACHIEVEMENTS.filter((a) => !store.gamification.unlockedAchievements[a.id]);
  return locked[0] ?? null;
}

export function getAverageSmartScore(progress: Record<string, StandardProgress>): number | null {
  const scores = Object.values(progress)
    .map((p) => p.smartScore ?? 0)
    .filter((s) => s > 0);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getScoreboardSummary(store: ProgressStore): ScoreboardSummary {
  const allCodes = listGrade2Standards().map((s) => s.code);
  const done = allCodes.filter((c) => store.progress[c]?.completed).length;
  const total = allCodes.length;
  const unlockedIds = new Set(Object.keys(store.gamification.unlockedAchievements));
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !unlockedIds.has(a.id));

  return {
    displayName: store.profile.name?.trim() || "Jordan",
    totalXp: store.gamification.totalXp,
    currentStreak: store.gamification.currentStreak,
    longestStreak: store.gamification.longestStreak,
    mastered: done,
    totalStandards: total,
    lifetimeChecks: store.gamification.lifetimeChecks,
    lifetimeCorrect: store.gamification.lifetimeCorrect,
    averageSmartScore: getAverageSmartScore(store.progress),
    subjectStats: [
      subjectStat(store, "math"),
      subjectStat(store, "ela"),
      subjectStat(store, "science"),
    ],
    recentActivity: getRecentActivity(store),
    unlockedAchievements,
    lockedAchievements,
    nextAchievement: getNextAchievement(store),
  };
}
