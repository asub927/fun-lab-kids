export type PetSpeciesId = "pebble" | "coral" | "sprout";
export type PetMood = "idle" | "working" | "celebrating" | "waiting" | "waving";

export type PetSpecies = {
  id: PetSpeciesId;
  name: string;
  tagline: string;
  accentClass: string;
};

export const PET_SPECIES: PetSpecies[] = [
  {
    id: "pebble",
    name: "Pebble",
    tagline: "A cozy crab who floats along while you solve",
    accentClass: "accent-green",
  },
  {
    id: "coral",
    name: "Coral",
    tagline: "A bright fish who swirls when you practice",
    accentClass: "accent-pink",
  },
  {
    id: "sprout",
    name: "Sprout",
    tagline: "A gentle turtle who drifts with every discovery",
    accentClass: "accent-orange",
  },
];

const BY_ID = new Map(PET_SPECIES.map((pet) => [pet.id, pet]));

export function getPetSpecies(id: PetSpeciesId): PetSpecies {
  return BY_ID.get(id) ?? PET_SPECIES[0];
}

/** Subject-linked default creature — no hatch picker in v1. */
export function speciesForSubject(subject: "math" | "ela" | "science" | null | undefined): PetSpeciesId {
  if (subject === "ela") return "coral";
  if (subject === "science") return "sprout";
  return "pebble";
}
