import { applyGamificationEvent, backfillXpFromProgress, emptyGamificationState } from "./gamification";
import type { Achievement } from "../data/achievements";
import type { GamificationResult } from "./gamification";

export type StandardProgress = {
  completed: boolean;
  bestScore: number;
  lastAt: number;
  questionsCorrect?: number;
  smartScore?: number;
  /** How many times this lab has been opened; used to rotate question slices. */
  visitCount?: number;
};

export type GamificationState = {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  unlockedAchievements: Record<string, { unlockedAt: number }>;
  lifetimeChecks: number;
  lifetimeCorrect: number;
};

type ProgressStoreV1 = {
  version: 1;
  profile: { name?: string };
  progress: Record<string, StandardProgress>;
};

export type ProgressStore = {
  version: 2;
  profile: { name?: string };
  gamification: GamificationState;
  progress: Record<string, StandardProgress>;
};

export type RecordCheckResult = {
  store: ProgressStore;
  xpEarned: number;
  newAchievements: Achievement[];
  streakDays: number;
  isNewMastery: boolean;
};

const STORAGE_KEY = "funlab-progress";
const LEGACY_STORAGE_KEY = "inquiry-island-progress";

function emptyStore(): ProgressStore {
  return {
    version: 2,
    profile: {},
    gamification: emptyGamificationState(),
    progress: {},
  };
}

function migrateV1(parsed: ProgressStoreV1): ProgressStore {
  const gamification = emptyGamificationState();
  gamification.totalXp = backfillXpFromProgress({
    version: 2,
    profile: parsed.profile ?? {},
    gamification,
    progress: parsed.progress ?? {},
  });
  return {
    version: 2,
    profile: parsed.profile ?? {},
    gamification,
    progress: parsed.progress ?? {},
  };
}

function normalizeStore(parsed: unknown): ProgressStore {
  if (!parsed || typeof parsed !== "object") return emptyStore();
  const raw = parsed as Partial<ProgressStoreV1 | ProgressStore>;
  if (!raw.progress || typeof raw.progress !== "object") return emptyStore();

  if (raw.version === 1) {
    return migrateV1(raw as ProgressStoreV1);
  }

  if (raw.version === 2 && raw.gamification) {
    return {
      version: 2,
      profile: raw.profile ?? {},
      gamification: {
        ...emptyGamificationState(),
        ...raw.gamification,
        unlockedAchievements: raw.gamification.unlockedAchievements ?? {},
      },
      progress: raw.progress,
    };
  }

  return emptyStore();
}

export function loadProgress(): ProgressStore {
  if (typeof localStorage === "undefined") return emptyStore();
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    let migratedFromLegacy = false;
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        raw = legacy;
        migratedFromLegacy = true;
      }
    }
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as unknown;
    const store = normalizeStore(parsed);
    const migratedFromV1 =
      parsed && typeof parsed === "object" && (parsed as { version?: number }).version === 1;
    if (migratedFromLegacy || migratedFromV1) {
      saveProgress(store);
    }
    return store;
  } catch {
    return emptyStore();
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function updateProfileName(name: string): ProgressStore {
  const store = loadProgress();
  store.profile.name = name.trim() || undefined;
  saveProgress(store);
  return store;
}

export function recordCheckResult(
  standardCode: string,
  ok: boolean,
  score: number,
  options?: { completed?: boolean; questionsCorrect?: number; smartScore?: number },
): RecordCheckResult {
  let store = loadProgress();
  const prev = store.progress[standardCode];
  const wasCompleted = prev?.completed ?? false;
  const completed = options?.completed ?? wasCompleted;
  const isNewMastery = completed && !wasCompleted;

  store.progress[standardCode] = {
    completed,
    bestScore: Math.max(prev?.bestScore ?? 0, score),
    lastAt: Date.now(),
    questionsCorrect: options?.questionsCorrect ?? prev?.questionsCorrect,
    smartScore: Math.max(prev?.smartScore ?? 0, options?.smartScore ?? 0),
    visitCount: prev?.visitCount,
  };

  const gamification: GamificationResult = applyGamificationEvent(store, {
    ok,
    isNewMastery,
    smartScore: options?.smartScore,
  });

  saveProgress(gamification.store);

  return {
    store: gamification.store,
    xpEarned: gamification.xpEarned,
    newAchievements: gamification.newAchievements,
    streakDays: gamification.streakDays,
    isNewMastery,
  };
}

/**
 * Records a lab open and returns the visit index to use for question-slice rotation
 * (0 on first open, 1 on second, ...).
 */
export function recordLabVisit(standardCode: string): number {
  const store = loadProgress();
  const prev = store.progress[standardCode];
  const visitIndex = prev?.visitCount ?? 0;

  store.progress[standardCode] = {
    completed: prev?.completed ?? false,
    bestScore: prev?.bestScore ?? 0,
    lastAt: prev?.lastAt ?? Date.now(),
    questionsCorrect: prev?.questionsCorrect,
    smartScore: prev?.smartScore,
    visitCount: visitIndex + 1,
  };

  saveProgress(store);
  return visitIndex;
}

export function countCompleted(codes: string[]): { done: number; total: number } {
  const store = loadProgress();
  const done = codes.filter((c) => store.progress[c]?.completed).length;
  return { done, total: codes.length };
}

export function getProgressSnapshot(): ProgressStore["progress"] {
  return loadProgress().progress;
}
