import type { Achievement } from "../data/achievements";
import { getCharacterBySubject, type CharacterId } from "../data/characters";
import { DIALOGUE_POOLS, type DialogueContext } from "../data/characterDialogue";
import type { ProgressStore } from "./progress";
import type { Subject } from "../types";

export type DialogueVars = {
  name?: string;
  done?: number;
  total?: number;
  streak?: number;
  achievement?: string;
};

function displayName(store: ProgressStore): string {
  return store.profile.name?.trim() || "Jordan";
}

function interpolate(template: string, vars: DialogueVars): string {
  return template
    .replace(/\{name\}/g, vars.name ?? "Jordan")
    .replace(/\{done\}/g, String(vars.done ?? 0))
    .replace(/\{total\}/g, String(vars.total ?? 0))
    .replace(/\{streak\}/g, String(vars.streak ?? 0))
    .replace(/\{achievement\}/g, vars.achievement ?? "your next badge");
}

export function getCharacterIdForSubject(subject: Subject): CharacterId {
  return getCharacterBySubject(subject).id;
}

export function pickCharacterLine(
  subject: Subject,
  context: DialogueContext,
  store: ProgressStore,
  vars: DialogueVars = {},
  seed = 0,
): string {
  const characterId = getCharacterIdForSubject(subject);
  const pool = DIALOGUE_POOLS[characterId][context];
  const index = pool.length > 0 ? Math.abs(seed) % pool.length : 0;
  const template = pool[index] ?? "";
  return interpolate(template, {
    name: displayName(store),
    streak: store.gamification.currentStreak,
    ...vars,
  });
}

export function pickAchievementLine(
  subject: Subject,
  store: ProgressStore,
  achievement: Achievement,
  seed = 0,
): string {
  return pickCharacterLine(subject, "achievement", store, { achievement: achievement.title }, seed);
}

export function pickScoreboardHintLine(
  store: ProgressStore,
  achievement: Achievement,
  seed = 0,
): string {
  return pickCharacterLine("ela", "scoreboardHint", store, { achievement: achievement.title }, seed);
}

export function pickHubGreetingLine(subject: Subject, store: ProgressStore, seed = 0): string {
  return pickCharacterLine(subject, "hubGreeting", store, {}, seed);
}

export function pickSubjectWelcomeLine(
  subject: Subject,
  store: ProgressStore,
  done: number,
  total: number,
  seed = 0,
): string {
  return pickCharacterLine(subject, "subjectWelcome", store, { done, total }, seed);
}

export function pickLabLine(
  subject: Subject,
  context: "labCorrect" | "labEncourage",
  store: ProgressStore,
  checkCount: number,
): string {
  return pickCharacterLine(subject, context, store, {}, checkCount);
}

export function pickMasteryLine(subject: Subject, store: ProgressStore, seed = 0): string {
  return pickCharacterLine(subject, "mastery", store, {}, seed);
}

export function pickStreakLine(subject: Subject, store: ProgressStore, streakDays: number): string {
  return pickCharacterLine(subject, "streak", store, { streak: streakDays }, streakDays);
}
