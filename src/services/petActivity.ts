import type { PetMood } from "../data/pets";

/** Strong celebration / milestone reaction window. */
export const PET_REACTION_MS = 4500;

/** Soft waiting pulse — shorter than celebrate (R3 / AE3). */
export const PET_WAITING_MS = 2200;

/** Soft stuck/working pulse — shorter than celebrate (R3 / AE3). */
export const PET_WORKING_MS = 2800;

/** Invite cheer / wave beat. */
export const PET_WAVE_MS = 1800;

export type PetReaction = "celebrating" | "working" | "waiting" | "waving";

export type PetActivityInput = {
  /** Timed reaction from the latest check / celebration / waiting pulse. */
  reaction: PetReaction | null;
  /** True when the kid is on a lab route (route gate, not sticky session). */
  inLab: boolean;
  /** True when the board looks empty / unanswered. */
  needsAnswer?: boolean;
};

export type ReactionIntensity = "soft" | "strong";

/**
 * Duration for a timed pet reaction. Waiting/working stay softer/shorter than celebrate.
 */
export function reactionDurationMs(reaction: PetReaction): number {
  switch (reaction) {
    case "celebrating":
      return PET_REACTION_MS;
    case "waiting":
      return PET_WAITING_MS;
    case "working":
      return PET_WORKING_MS;
    case "waving":
      return PET_WAVE_MS;
  }
}

export function reactionIntensity(reaction: PetReaction): ReactionIntensity {
  if (reaction === "celebrating") return "strong";
  if (reaction === "waiting" || reaction === "working") return "soft";
  return "strong";
}

/**
 * Codex-inspired activity → animation map for the ambient lab buddy.
 * Keep it calm by default; only burst into motion for real events.
 * Needs-answer is NOT a sustained latch — IslandPet fires a timed waiting pulse.
 */
export function deriveAmbientMood(input: PetActivityInput): PetMood {
  if (input.reaction === "celebrating") return "celebrating";
  if (input.reaction === "waving") return "waving";
  if (input.reaction === "working") return "working";
  if (input.reaction === "waiting") return "waiting";
  // Parked calm between pulses (idle), including empty board mid-lab (KTD4).
  // `inLab` / `needsAnswer` remain on the input for callers; waiting is edge-pulsed in UI.
  return "idle";
}

export function reactionFromAppEvent(options: {
  lastCheckOk: boolean | null;
  isCelebrating: boolean;
}): "celebrating" | "working" | null {
  if (options.isCelebrating || options.lastCheckOk === true) return "celebrating";
  if (options.lastCheckOk === false) return "working";
  return null;
}
