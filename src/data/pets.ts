export type PetSpeciesId = "dog" | "cat" | "rabbit";
export type PetMood = "idle" | "working" | "celebrating" | "waiting" | "waving";

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
    name: "Buddy",
    tagline: "A loyal pup who cheers when you practice",
    accentClass: "accent-green",
  },
  {
    id: "cat",
    name: "Whiskers",
    tagline: "A curious cat who keeps you company in the corner",
    accentClass: "accent-pink",
  },
  {
    id: "rabbit",
    name: "Hopper",
    tagline: "A bouncy bunny who hops for every win",
    accentClass: "accent-orange",
  },
];

const BY_ID = new Map(PET_SPECIES.map((pet) => [pet.id, pet]));

export function getPetSpecies(id: PetSpeciesId): PetSpecies {
  return BY_ID.get(id) ?? PET_SPECIES[0];
}
