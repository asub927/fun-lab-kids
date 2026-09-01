import {
  getPetSpecies,
  stageFromChecks,
  type PetMood,
  type PetSpeciesId,
  type PetStage,
} from "../data/pets";
import { loadProgress } from "./progress";

export type PetSave = {
  version: 1;
  speciesId: PetSpeciesId | null;
  nickname: string;
  hatchedAt: number | null;
  careCount: number;
  lastCaredAt: number | null;
};

export type PetSnapshot = {
  hatched: boolean;
  speciesId: PetSpeciesId | null;
  nickname: string;
  displayName: string;
  stage: PetStage;
  careCount: number;
  lifetimeChecks: number;
  totalXp: number;
  currentStreak: number;
};

const STORAGE_KEY = "inquiry-island-pet";

const IDLE_LINES = [
  "{name} is ready to explore with you.",
  "{name} wiggles. Practice makes pets grow!",
  "Tap {name} for a cheer, then jump into a lab.",
];
const WORKING_LINES = [
  "{name} is watching closely…",
  "{name} believes you can figure this out.",
  "Steady… {name} is rooting for you.",
];
const CELEBRATE_LINES = [
  "{name} hops with joy!",
  "Yes! {name} is so proud of you.",
  "{name} does a little victory dance!",
];
const HUNGRY_LINES = [
  "{name} looks hungry for a high five.",
  "Give {name} some care, then try a skill.",
];
const SLEEPY_LINES = [
  "{name} is taking a tiny nap. Wake them with practice!",
  "{name} yawns. A quick lab will perk them up.",
];

function emptySave(): PetSave {
  return {
    version: 1,
    speciesId: null,
    nickname: "",
    hatchedAt: null,
    careCount: 0,
    lastCaredAt: null,
  };
}

function normalizeSave(raw: unknown): PetSave {
  if (!raw || typeof raw !== "object") return emptySave();
  const data = raw as Partial<PetSave>;
  const speciesId =
    data.speciesId === "pebble" || data.speciesId === "coral" || data.speciesId === "sprout"
      ? data.speciesId
      : null;
  return {
    version: 1,
    speciesId,
    nickname: typeof data.nickname === "string" ? data.nickname.slice(0, 16) : "",
    hatchedAt: typeof data.hatchedAt === "number" ? data.hatchedAt : null,
    careCount: typeof data.careCount === "number" ? Math.max(0, data.careCount) : 0,
    lastCaredAt: typeof data.lastCaredAt === "number" ? data.lastCaredAt : null,
  };
}

export function loadPet(): PetSave {
  if (typeof localStorage === "undefined") return emptySave();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySave();
    return normalizeSave(JSON.parse(raw) as unknown);
  } catch {
    return emptySave();
  }
}

export function savePet(save: PetSave): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

export function hatchPet(speciesId: PetSpeciesId, nickname = ""): PetSave {
  const save: PetSave = {
    version: 1,
    speciesId,
    nickname: nickname.trim().slice(0, 16),
    hatchedAt: Date.now(),
    careCount: 1,
    lastCaredAt: Date.now(),
  };
  savePet(save);
  return save;
}

export function careForPet(): PetSave {
  const save = loadPet();
  if (!save.speciesId) return save;
  const next: PetSave = {
    ...save,
    careCount: save.careCount + 1,
    lastCaredAt: Date.now(),
  };
  savePet(next);
  return next;
}

export function renamePet(nickname: string): PetSave {
  const save = loadPet();
  if (!save.speciesId) return save;
  const next: PetSave = {
    ...save,
    nickname: nickname.trim().slice(0, 16),
  };
  savePet(next);
  return next;
}

export function getPetSnapshot(save = loadPet()): PetSnapshot {
  const progress = loadProgress();
  const species = save.speciesId ? getPetSpecies(save.speciesId) : null;
  const nickname = save.nickname.trim();
  return {
    hatched: Boolean(save.speciesId),
    speciesId: save.speciesId,
    nickname,
    displayName: nickname || species?.name || "Island Pet",
    stage: stageFromChecks(progress.gamification.lifetimeChecks),
    careCount: save.careCount,
    lifetimeChecks: progress.gamification.lifetimeChecks,
    totalXp: progress.gamification.totalXp,
    currentStreak: progress.gamification.currentStreak,
  };
}

export function derivePetMood(options: {
  lastCheckOk: boolean | null;
  isCelebrating: boolean;
  lastCaredAt: number | null;
  now?: number;
}): PetMood {
  const now = options.now ?? Date.now();
  if (options.isCelebrating || options.lastCheckOk === true) return "celebrating";
  if (options.lastCheckOk === false) return "working";
  if (options.lastCaredAt == null) return "idle";
  const age = now - options.lastCaredAt;
  if (age > 1000 * 60 * 60 * 36) return "sleepy";
  if (age > 1000 * 60 * 60 * 12) return "hungry";
  return "idle";
}

function pickLine(pool: string[], seed: number): string {
  return pool[Math.abs(seed) % pool.length] ?? pool[0];
}

export function getPetLine(mood: PetMood, displayName: string, seed = 0): string {
  const pool =
    mood === "celebrating"
      ? CELEBRATE_LINES
      : mood === "working"
        ? WORKING_LINES
        : mood === "hungry"
          ? HUNGRY_LINES
          : mood === "sleepy"
            ? SLEEPY_LINES
            : IDLE_LINES;
  return pickLine(pool, seed).replaceAll("{name}", displayName);
}
