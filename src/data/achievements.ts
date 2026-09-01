import { listGrade2Standards } from "./standards";
import type { ProgressStore } from "../services/progress";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  evaluate: (store: ProgressStore) => boolean;
};

function countMasteredBySubject(store: ProgressStore, subject: "math" | "ela" | "science"): number {
  return listGrade2Standards(subject).filter((s) => store.progress[s.code]?.completed).length;
}

function hasSmartScore100(store: ProgressStore): boolean {
  return Object.values(store.progress).some((p) => (p.smartScore ?? 0) >= 100);
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-explorer",
    title: "First Explorer",
    description: "Master your first skill",
    icon: "🌱",
    evaluate: (store) =>
      listGrade2Standards().filter((s) => store.progress[s.code]?.completed).length >= 1,
  },
  {
    id: "math-captain",
    title: "Math Captain",
    description: "Master 5 math skills",
    icon: "🔢",
    evaluate: (store) => countMasteredBySubject(store, "math") >= 5,
  },
  {
    id: "word-captain",
    title: "Word Captain",
    description: "Master 5 reading and writing skills",
    icon: "📖",
    evaluate: (store) => countMasteredBySubject(store, "ela") >= 5,
  },
  {
    id: "science-captain",
    title: "Science Captain",
    description: "Master 3 science skills",
    icon: "🔬",
    evaluate: (store) => countMasteredBySubject(store, "science") >= 3,
  },
  {
    id: "hot-streak",
    title: "Hot Streak",
    description: "Practice 3 days in a row",
    icon: "🔥",
    evaluate: (store) => store.gamification.currentStreak >= 3,
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Practice 7 days in a row",
    icon: "⚡",
    evaluate: (store) => store.gamification.currentStreak >= 7,
  },
  {
    id: "smart-score-star",
    title: "Smart Score Star",
    description: "Reach Smart Score 100 on any skill",
    icon: "⭐",
    evaluate: hasSmartScore100,
  },
  {
    id: "island-champion",
    title: "Lab Champion",
    description: "Master every Grade 2 skill",
    icon: "🏆",
    evaluate: (store) => {
      const all = listGrade2Standards();
      return all.length > 0 && all.every((s) => store.progress[s.code]?.completed);
    },
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
