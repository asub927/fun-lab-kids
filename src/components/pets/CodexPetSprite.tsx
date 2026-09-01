import { useEffect, useMemo, useState } from "react";
import type { PetMood } from "../../data/pets";
import {
  CODEX_ANIMATIONS,
  CODEX_CELL_HEIGHT,
  CODEX_CELL_WIDTH,
  CODEX_COLUMNS,
  codexAtlasHeight,
  codexFramePosition,
  getCodexPetPackage,
  moodToCodexAction,
  type CodexAction,
} from "../../data/codexPets";

type CodexPetSpriteProps = {
  packageId: string;
  mood: PetMood;
  facing?: "left" | "right";
  /** Display scale relative to native 192×208 cells. */
  scale?: number;
  className?: string;
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function useCodexFrame(action: CodexAction, reducedMotion: boolean): number {
  const animation = CODEX_ANIMATIONS[action];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
    if (reducedMotion) return;

    let frameIndex = 0;
    let timer: number | undefined;

    const schedule = () => {
      const duration = animation.durations[frameIndex] ?? 200;
      timer = window.setTimeout(() => {
        frameIndex = (frameIndex + 1) % animation.frames;
        setFrame(frameIndex);
        schedule();
      }, duration);
    };

    schedule();
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [action, animation, reducedMotion]);

  return frame;
}

/** Renders a Codex-format spritesheet pet with frame-stepped CSS background animation. */
export function CodexPetSprite({
  packageId,
  mood,
  facing = "right",
  scale = 0.34,
  className = "",
}: CodexPetSpriteProps) {
  const pkg = getCodexPetPackage(packageId);
  const reducedMotion = useReducedMotion();
  const action = moodToCodexAction(mood, facing);
  const frame = useCodexFrame(action, reducedMotion);

  const style = useMemo(() => {
    if (!pkg) return undefined;
    const cellW = CODEX_CELL_WIDTH * scale;
    const cellH = CODEX_CELL_HEIGHT * scale;
    const sheetW = CODEX_COLUMNS * CODEX_CELL_WIDTH * scale;
    const sheetH = codexAtlasHeight(pkg.spriteVersionNumber) * scale;
    const { x, y } = codexFramePosition(action, frame, scale);
    return {
      width: `${cellW}px`,
      height: `${cellH}px`,
      backgroundImage: `url(${pkg.spritesheetPath})`,
      backgroundRepeat: "no-repeat" as const,
      backgroundSize: `${sheetW}px ${sheetH}px`,
      backgroundPosition: `${x}px ${y}px`,
    };
  }, [pkg, action, frame, scale]);

  if (!pkg || !style) return null;

  const spriteClass = [
    "codex-pet-sprite",
    `codex-pet-sprite--${mood}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={spriteClass}
      role="img"
      aria-label={pkg.displayName}
      style={style}
    />
  );
}
