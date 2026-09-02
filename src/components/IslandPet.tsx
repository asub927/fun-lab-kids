import { useEffect, useMemo, useRef, useState } from "react";
import { getPetSpecies } from "../data/pets";
import { useApp } from "../context/AppContext";
import { usePetPatrol } from "../hooks/usePetPatrol";
import { getPetSpeciesId, isPetVisible, PET_PREFS_EVENT, setPetVisible } from "../services/pet";
import {
  deriveAmbientMood,
  PET_REACTION_MS,
  reactionFromAppEvent,
} from "../services/petActivity";
import { PetSprite } from "./pets/PetSprite";

/**
 * Codex-like ambient pet: patrols left-to-right along the bottom rail when calm,
 * and plays in-place Codex sprite actions for waiting, failed, jumping, and waving.
 */
export function IslandPet() {
  const app = useApp();
  const railRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => isPetVisible());
  const [speciesId, setSpeciesId] = useState(() => getPetSpeciesId());
  const [reaction, setReaction] = useState<"celebrating" | "working" | "waiting" | "waving" | null>(
    null,
  );
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const [hint, setHint] = useState<string | null>(null);
  const hideTimer = useRef<number | null>(null);
  const pressTimer = useRef<number | null>(null);

  const species = getPetSpecies(speciesId);
  const inLab = Boolean(app.activeStandard);
  const needsAnswer = inLab && boardLooksEmpty(app.boardState);

  const mood = useMemo(
    () => deriveAmbientMood({ reaction, inLab, needsAnswer }),
    [reaction, inLab, needsAnswer],
  );

  const patrol = usePetPatrol({
    enabled: visible && !reducedMotion,
    mood,
    railRef,
  });

  const patrolling = mood === "idle" && patrol.phase === "walking";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const onPrefs = (event: Event) => {
      const detail = (event as CustomEvent<{ visible?: boolean; speciesId?: string }>).detail;
      if (detail && typeof detail.visible === "boolean") setVisible(detail.visible);
      else setVisible(isPetVisible());
      if (detail?.speciesId === "dog" || detail?.speciesId === "cat" || detail?.speciesId === "rabbit") {
        setSpeciesId(detail.speciesId);
      } else {
        setSpeciesId(getPetSpeciesId());
      }
    };
    window.addEventListener(PET_PREFS_EVENT, onPrefs);
    return () => window.removeEventListener(PET_PREFS_EVENT, onPrefs);
  }, []);

  useEffect(() => {
    const celebrating =
      Boolean(app.lastCelebration?.isNewMastery) ||
      Boolean(app.lastCelebration && app.lastCelebration.newAchievements.length > 0);
    const next = reactionFromAppEvent({
      lastCheckOk: app.lastCheck ? app.lastCheck.ok : null,
      isCelebrating: celebrating,
    });
    if (!next) return;
    setReaction(next);
    const timer = window.setTimeout(() => setReaction(null), PET_REACTION_MS);
    return () => window.clearTimeout(timer);
  }, [app.lastCheck, app.lastCelebration]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      if (pressTimer.current) window.clearTimeout(pressTimer.current);
    };
  }, []);

  if (!visible) return null;

  const onPointerDown = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      setHint("Hide lab buddy?");
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setHint(null), 4000);
    }, 650);
  };

  const onPointerUp = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const onWaveClick = () => {
    if (hint) return;
    setReaction("waving");
    window.setTimeout(() => setReaction(null), 1800);
  };

  const confirmHide = () => {
    setPetVisible(false);
    setVisible(false);
    setHint(null);
  };

  return (
    <div
      className={[
        "island-pet-anchor",
        `pet-mood-${mood}`,
        reducedMotion ? "is-reduced-motion" : "",
        patrolling ? "is-patrolling" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={hint ? undefined : true}
    >
      <div
        ref={railRef}
        className="island-pet-rail"
        style={{
          transform: reducedMotion ? undefined : `translateX(${patrol.x}px)`,
          transitionDuration: patrol.walkMs > 0 ? `${patrol.walkMs}ms` : undefined,
        }}
      >
        <div
          className="island-pet-hit"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={onWaveClick}
          role="img"
          aria-label={`${species.name}, your lab buddy`}
        >
          <PetSprite
            speciesId={speciesId}
            mood={mood}
            facing={patrol.facing}
            patrolling={patrolling}
          />
        </div>
      </div>
      {hint && (
        <div className="island-pet-hint" role="dialog" aria-label="Hide pet">
          <span>{hint}</span>
          <button type="button" className="island-pet-hide" onClick={confirmHide}>
            Hide
          </button>
        </div>
      )}
    </div>
  );
}

function boardLooksEmpty(boardState: unknown): boolean {
  if (!boardState || typeof boardState !== "object") return true;
  const state = boardState as Record<string, unknown>;
  if (typeof state.answer === "string") return state.answer.trim().length === 0;
  if (typeof state.value === "string") return state.value.trim().length === 0;
  if (typeof state.text === "string") return state.text.trim().length === 0;
  if (Array.isArray(state.blocks)) return state.blocks.length === 0;
  if (Array.isArray(state.tokens)) return state.tokens.length === 0;
  return false;
}
