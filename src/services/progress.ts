export type StandardProgress = {
  completed: boolean;
  bestScore: number;
  lastAt: number;
};

export type ProgressStore = {
  version: 1;
  profile: { name?: string };
  progress: Record<string, StandardProgress>;
};

const STORAGE_KEY = "inquiry-island-progress";

function emptyStore(): ProgressStore {
  return { version: 1, profile: {}, progress: {} };
}

export function loadProgress(): ProgressStore {
  if (typeof localStorage === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ProgressStore;
    if (parsed.version !== 1 || !parsed.progress) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function recordCheckResult(
  standardCode: string,
  ok: boolean,
  score: number,
): ProgressStore {
  const store = loadProgress();
  const prev = store.progress[standardCode];
  store.progress[standardCode] = {
    completed: prev?.completed || ok,
    bestScore: Math.max(prev?.bestScore ?? 0, score),
    lastAt: Date.now(),
  };
  saveProgress(store);
  return store;
}

export function countCompleted(codes: string[]): { done: number; total: number } {
  const store = loadProgress();
  const done = codes.filter((c) => store.progress[c]?.completed).length;
  return { done, total: codes.length };
}

export function getProgressSnapshot(): ProgressStore["progress"] {
  return loadProgress().progress;
}
