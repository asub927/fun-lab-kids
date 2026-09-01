import { DEFAULT_PET_SPECIES, getPetSpecies, type PetSpeciesId } from "../data/pets";

export type PetPrefs = {
  version: 3;
  visible: boolean;
  speciesId: PetSpeciesId;
};

const STORAGE_KEY = "inquiry-island-pet";

const LEGACY_SPECIES: Record<string, PetSpeciesId> = {
  pebble: "dog",
  coral: "cat",
  sprout: "rabbit",
};

function isPetSpeciesId(value: unknown): value is PetSpeciesId {
  return value === "dog" || value === "cat" || value === "rabbit";
}

function migrateSpeciesId(raw: unknown): PetSpeciesId {
  if (isPetSpeciesId(raw)) return raw;
  if (typeof raw === "string" && raw in LEGACY_SPECIES) {
    return LEGACY_SPECIES[raw];
  }
  return DEFAULT_PET_SPECIES;
}

function defaultPrefs(): PetPrefs {
  return { version: 3, visible: true, speciesId: DEFAULT_PET_SPECIES };
}

function normalizePrefs(raw: unknown): PetPrefs {
  if (!raw || typeof raw !== "object") return defaultPrefs();
  const data = raw as Partial<PetPrefs> & { speciesId?: unknown; version?: number };
  return {
    version: 3,
    visible: typeof data.visible === "boolean" ? data.visible : true,
    speciesId: migrateSpeciesId(data.speciesId),
  };
}

function emitPrefs(prefs: PetPrefs): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("inquiry-island-pet-prefs", { detail: prefs }));
  }
}

export function loadPetPrefs(): PetPrefs {
  if (typeof localStorage === "undefined") return defaultPrefs();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrefs();
    return normalizePrefs(JSON.parse(raw) as unknown);
  } catch {
    return defaultPrefs();
  }
}

export function savePetPrefs(prefs: PetPrefs): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function isPetVisible(): boolean {
  return loadPetPrefs().visible;
}

export function getPetSpeciesId(): PetSpeciesId {
  return loadPetPrefs().speciesId;
}

export function setPetVisible(visible: boolean): PetPrefs {
  const current = loadPetPrefs();
  const next: PetPrefs = { ...current, version: 3, visible };
  savePetPrefs(next);
  emitPrefs(next);
  return next;
}

export function setPetSpecies(speciesId: PetSpeciesId): PetPrefs {
  const current = loadPetPrefs();
  const next: PetPrefs = { ...current, version: 3, speciesId };
  savePetPrefs(next);
  emitPrefs(next);
  return next;
}

export function getPetDisplayName(speciesId: PetSpeciesId): string {
  return getPetSpecies(speciesId).name;
}
