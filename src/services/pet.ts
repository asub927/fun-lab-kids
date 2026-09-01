import { getPetSpecies, type PetSpeciesId } from "../data/pets";

export type PetPrefs = {
  version: 2;
  visible: boolean;
};

const STORAGE_KEY = "inquiry-island-pet";

function defaultPrefs(): PetPrefs {
  return { version: 2, visible: true };
}

function normalizePrefs(raw: unknown): PetPrefs {
  if (!raw || typeof raw !== "object") return defaultPrefs();
  const data = raw as Partial<PetPrefs> & { speciesId?: unknown };
  // Legacy v1 hatch saves still count as "visible" unless explicitly hidden later.
  return {
    version: 2,
    visible: typeof data.visible === "boolean" ? data.visible : true,
  };
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

export function setPetVisible(visible: boolean): PetPrefs {
  const next: PetPrefs = { version: 2, visible };
  savePetPrefs(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("inquiry-island-pet-prefs", { detail: next }));
  }
  return next;
}

export function getPetDisplayName(speciesId: PetSpeciesId): string {
  return getPetSpecies(speciesId).name;
}
