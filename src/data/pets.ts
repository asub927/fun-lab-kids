import type { CharacterId } from "./characters";

export type PetSpeciesId = "dog" | "cat" | "rabbit";
export type PetMood = "idle" | "working" | "celebrating" | "waiting" | "waving";

/** Maps storage IDs to crew character dialogue pools. */
export const PET_TO_CHARACTER: Record<PetSpeciesId, CharacterId> = {
  dog: "digits",
  cat: "ripple",
  rabbit: "spark",
};

export type PetSpecies = {
  id: PetSpeciesId;
  name: string;
  tagline: string;
  accentClass: string;
};

export const DEFAULT_PET_SPECIES: PetSpeciesId = "dog";

export const PET_SPECIES: PetSpecies[] = [
  {
    id: "dog",
    name: "Digits",
    tagline: "A crab who counts every win",
    accentClass: "accent-green",
  },
  {
    id: "cat",
    name: "Ripple",
    tagline: "An otter who loves every story",
    accentClass: "accent-pink",
  },
  {
    id: "rabbit",
    name: "Spark",
    tagline: "A jellyfish who asks why",
    accentClass: "accent-orange",
  },
];

const BY_ID = new Map(PET_SPECIES.map((pet) => [pet.id, pet]));

export function getPetSpecies(id: PetSpeciesId): PetSpecies {
  return BY_ID.get(id) ?? PET_SPECIES[0];
}

export function getCharacterIdForPet(speciesId: PetSpeciesId): CharacterId {
  return PET_TO_CHARACTER[speciesId];
}
