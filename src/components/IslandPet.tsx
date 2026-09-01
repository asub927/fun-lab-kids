import { useEffect, useMemo, useRef, useState } from "react";
import { getPetSpecies } from "../data/pets";
import { useApp } from "../context/AppContext";
import { getPetSpeciesId, isPetVisible, setPetVisible } from "../services/pet";
import {
  deriveAmbientMood,
  PET_REACTION_MS,
  reactionFromAppEvent,
} from "../services/petActivity";
import { PetSprite } from "./pets/PetSprite";

/**
 * Codex-like ambient pet: stays in a quiet nest (bottom-left),
 * paces a tiny bit locally, and animates by activity — never roams the page.
 */
export function IslandPet() {
  const app = useApp();
  const [visible, setVisible] = useState(() => isPetVisible());
  const [speciesId, setSpeciesId] = useState(() => getPetSpeciesId());
  const [reaction, setReaction] = useState<"celebrating" | "working" | "waiting" | "waving" | null>(
    null,
  );
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [pace, setPace] = useState(0);
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
    window.addEventListener("inquiry-island-pet-prefs", onPrefs);
    return () => window.removeEventListener("inquiry-island-pet-prefs", onPrefs);
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

  // Tiny local pace inside the nest — not a full-page wander.
  useEffect(() => {
    if (!visible || reducedMotion) return;
    const tick = () => {
      setPace((value) => {
        const next = value >= 1 ? 0 : value + 1;
        setFacing(next === 0 ? "right" : "left");
        return next;
      });
    };
    const id = window.setInterval(tick, mood === "working" ? 2200 : 4800);
    return () => window.clearInterval(id);
  }, [visible, reducedMotion, mood]);

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
      setHint("Hide island friend?");
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
        "island-pet-nest",
        `pet-mood-${mood}`,
        `pet-pace-${pace}`,
        reducedMotion ? "is-reduced-motion" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={hint ? undefined : true}
    >
      <div
        className="island-pet-nest-hit"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={onWaveClick}
        role="img"
        aria-label={`${species.name}, your island friend`}
      >
        <PetSprite speciesId={speciesId} mood={mood} facing={facing} />
      </div>
      {hint && (
        <div className="island-pet-nest-hint" role="dialog" aria-label="Hide pet">
          <span>{hint}</span>
          <button type="button" className="island-pet-nest-hide" onClick={confirmHide}>
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
