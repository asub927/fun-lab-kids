import type { PetMood } from "./pets";

/** Codex pet atlas cell size (pixels). */
export const CODEX_CELL_WIDTH = 192;
export const CODEX_CELL_HEIGHT = 208;
export const CODEX_COLUMNS = 8;

export type CodexSpriteVersion = 1 | 2;

export type CodexAction =
  | "idle"
  | "running-right"
  | "running-left"
  | "waving"
  | "jumping"
  | "failed"
  | "waiting"
  | "running"
  | "review";

export type CodexAnimation = {
  row: number;
  frames: number;
  durations: number[];
};

/** Standard Codex animation rows (shared by v1 and v2 atlases). */
export const CODEX_ANIMATIONS: Record<CodexAction, CodexAnimation> = {
  idle: { row: 0, frames: 6, durations: [280, 110, 110, 140, 140, 320] },
  "running-right": { row: 1, frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  "running-left": { row: 2, frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  waving: { row: 3, frames: 4, durations: [140, 140, 140, 280] },
  jumping: { row: 4, frames: 5, durations: [140, 140, 140, 140, 280] },
  failed: { row: 5, frames: 8, durations: [140, 140, 140, 140, 140, 140, 140, 240] },
  waiting: { row: 6, frames: 6, durations: [150, 150, 150, 150, 150, 260] },
  running: { row: 7, frames: 6, durations: [120, 120, 120, 120, 120, 220] },
  review: { row: 8, frames: 6, durations: [150, 150, 150, 150, 150, 280] },
};

export type CodexPetPackage = {
  id: string;
  displayName: string;
  description: string;
  spriteVersionNumber: CodexSpriteVersion;
  spritesheetPath: string;
  author?: string;
  license?: string;
};

export const CODEX_PET_PACKAGES: Record<string, CodexPetPackage> = {
  "om-nom--kasyan1337": {
    id: "om-nom--kasyan1337",
    displayName: "Om Nom",
    description:
      "A cheerful lime-green, toothy candy-loving creature with huge white eyes, a small antenna, and a soft squat body.",
    spriteVersionNumber: 2,
    spritesheetPath: "/pets/om-nom--kasyan1337/spritesheet.webp",
    author: "Kasyan Janci",
    license: "Unofficial fan content; non-commercial use only (CC BY-NC 4.0)",
  },
  "jinmao--legeling": {
    id: "jinmao--legeling",
    displayName: "Buddy",
    description:
      "A pale cream-gold fluffy puppy with oversized floppy ears, a white ruff, pink paw pads, and a chartreuse tennis ball.",
    spriteVersionNumber: 2,
    spritesheetPath: "/pets/jinmao--legeling/spritesheet.webp",
    author: "Legeling",
    license: "CC BY-NC 4.0",
  },
  "chispa--giiilberto-nm": {
    id: "chispa--giiilberto-nm",
    displayName: "Chispa",
    description:
      "A tiny rusty helper robot with binocular eyes, tank treads, and clamp arms.",
    spriteVersionNumber: 1,
    spritesheetPath: "/pets/chispa--giiilberto-nm/spritesheet.webp",
    author: "giiilberto_nm",
    license: "Community upload; see submission.json for source attribution",
  },
};

export function getCodexPetPackage(id: string): CodexPetPackage | undefined {
  return CODEX_PET_PACKAGES[id];
}

export function codexAtlasHeight(version: CodexSpriteVersion): number {
  return version === 2 ? 2288 : 1872;
}

export function moodToCodexAction(mood: PetMood, facing: "left" | "right"): CodexAction {
  switch (mood) {
    case "working":
      return facing === "left" ? "running-left" : "running-right";
    case "celebrating":
      return "jumping";
    case "waiting":
      return "waiting";
    case "waving":
      return "waving";
    case "idle":
    default:
      return "idle";
  }
}

export function codexFramePosition(
  action: CodexAction,
  frame: number,
  scale: number,
): { x: number; y: number } {
  const anim = CODEX_ANIMATIONS[action];
  const col = frame % CODEX_COLUMNS;
  const row = anim.row;
  return {
    x: -(col * CODEX_CELL_WIDTH * scale),
    y: -(row * CODEX_CELL_HEIGHT * scale),
  };
}
