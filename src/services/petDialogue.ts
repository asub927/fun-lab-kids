import {
  PET_DIALOGUE_POOLS,
  type PetCelebrationCue,
  type PetDialogueContext,
} from "../data/petDialogue";
import type { PetSpeciesId } from "../data/pets";
import type { ProgressStore } from "./progress";

function displayName(store: ProgressStore): string {
  return store.profile.name?.trim() || "Jordan";
}

function interpolate(template: string, name: string): string {
  return template.replace(/\{name\}/g, name);
}

export function pickPetCelebrationCue(
  speciesId: PetSpeciesId,
  context: PetDialogueContext,
  store: ProgressStore,
  seed = 0,
): PetCelebrationCue {
  const pool = PET_DIALOGUE_POOLS[speciesId][context];
  const index = pool.length > 0 ? Math.abs(seed) % pool.length : 0;
  const template = pool[index] ?? pool[0];
  if (!template) {
    return { id: `${speciesId}-${context}-fallback`, text: "Nice work!", audio: "" };
  }
  return {
    ...template,
    text: interpolate(template.text, displayName(store)),
  };
}

/** @deprecated Use pickPetCelebrationCue for paired text + audio. */
export function pickPetCelebrationLine(
  speciesId: PetSpeciesId,
  context: PetDialogueContext,
  store: ProgressStore,
  seed = 0,
): string {
  return pickPetCelebrationCue(speciesId, context, store, seed).text;
}
