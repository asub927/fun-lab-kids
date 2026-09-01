export type PetSpeciesId = "dog" | "cat" | "rabbit";
export type PetMood = "idle" | "working" | "celebrating" | "waiting" | "waving";

export type PetSpecies = {
  id: PetSpeciesId;
  name: string;
  tagline: string;
  accentClass: string;
  /** When set, renders a Codex spritesheet pet instead of inline SVG art. */
  codexPackageId?: string;
};

export const DEFAULT_PET_SPECIES: PetSpeciesId = "dog";

export const PET_SPECIES: PetSpecies[] = [
  {
    id: "dog",
    name: "Buddy",
    tagline: "A fluffy golden pup with a tennis ball who cheers you on",
    accentClass: "accent-green",
    codexPackageId: "jinmao--legeling",
  },
  {
    id: "cat",
    name: "Om Nom",
    tagline: "A candy-loving friend who keeps you company in the corner",
    accentClass: "accent-pink",
    codexPackageId: "om-nom--kasyan1337",
  },
  {
    id: "rabbit",
    name: "Hopper",
    tagline: "A bouncy pink bunny who hops for every win",
    accentClass: "accent-orange",
    codexPackageId: "serge-le-lapin--legeling",
  },
];

const BY_ID = new Map(PET_SPECIES.map((pet) => [pet.id, pet]));

export function getPetSpecies(id: PetSpeciesId): PetSpecies {
  return BY_ID.get(id) ?? PET_SPECIES[0];
}
