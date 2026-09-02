import { PET_DIALOGUE_POOLS, type PetDialogueContext } from "../data/petDialogue";
import type { PetSpeciesId } from "../data/pets";
import type { ProgressStore } from "./progress";

function displayName(store: ProgressStore): string {
  return store.profile.name?.trim() || "Jordan";
}

function interpolate(template: string, name: string): string {
  return template.replace(/\{name\}/g, name);
}

export function pickPetCelebrationLine(
  speciesId: PetSpeciesId,
  context: PetDialogueContext,
  store: ProgressStore,
  seed = 0,
): string {
  const pool = PET_DIALOGUE_POOLS[speciesId][context];
  const index = pool.length > 0 ? Math.abs(seed) % pool.length : 0;
  const template = pool[index] ?? "";
  return interpolate(template, displayName(store));
}
