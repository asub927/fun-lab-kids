import type { PetMood } from "../data/pets";

export const PET_REACTION_MS = 4500;

export type PetActivityInput = {
  /** Timed reaction from the latest check / celebration burst. */
  reaction: "celebrating" | "working" | "waiting" | "waving" | null;
  /** True when the kid is inside an active lab route with a standard loaded. */
  inLab: boolean;
  /** True when the board looks empty / unanswered. */
  needsAnswer?: boolean;
};

/**
 * Codex-inspired activity → animation map for the ambient island pet.
 * Keep it calm by default; only burst into motion for real events.
 */
export function deriveAmbientMood(input: PetActivityInput): PetMood {
  if (input.reaction === "celebrating") return "celebrating";
  if (input.reaction === "waving") return "waving";
  if (input.reaction === "working") return "working";
  if (input.reaction === "waiting") return "waiting";
  // In a lab with an empty board, look gently attentive — not scurrying.
  if (input.inLab && input.needsAnswer) return "waiting";
  // Otherwise stay calm in the nest (Codex idle).
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
