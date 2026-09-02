import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPetSpecies } from "../data/pets";
import { useApp } from "../context/AppContext";
import { loadProgress } from "../services/progress";
import { getPetSpeciesId, isPetVisible, PET_PREFS_EVENT, setPetVisible } from "../services/pet";
import {
  deriveAmbientMood,
  PET_REACTION_MS,
  reactionFromAppEvent,
} from "../services/petActivity";
import {
  PET_SPEECH_MS,
  speechForCelebration,
  speechForCheck,
  speechForRoute,
  speechForWave,
} from "../services/petSpeech";
import { CharacterSpeech } from "./CharacterSpeech";
import { PetSprite } from "./pets/PetSprite";

/**
 * Codex-like ambient pet: stays in a quiet nest (bottom-left),
 * paces a tiny bit locally, animates by activity, and speaks in a bubble.
 */
export function IslandPet() {
  const app = useApp();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => isPetVisible());
  const [speciesId, setSpeciesId] = useState(() => getPetSpeciesId());
  const [speechLine, setSpeechLine] = useState<string | null>(null);
  const [waveSeed, setWaveSeed] = useState(0);
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
  const speechTimer = useRef<number | null>(null);

  const species = getPetSpecies(speciesId);
  const inLab = Boolean(app.activeStandard);
  const needsAnswer = inLab && boardLooksEmpty(app.boardState);
  const checkCount = loadProgress().gamification.lifetimeChecks;

  const mood = useMemo(
    () => deriveAmbientMood({ reaction, inLab, needsAnswer }),
    [reaction, inLab, needsAnswer],
  );

  const showSpeech = useCallback((line: string) => {
    setSpeechLine(line);
    if (speechTimer.current) window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeechLine(null), PET_SPEECH_MS);
  }, []);

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
    if (!visible) return;
    const line = speechForRoute(pathname, speciesId, loadProgress());
    if (line) showSpeech(line);
  }, [pathname, speciesId, visible, showSpeech]);

  useEffect(() => {
    if (!visible || !app.lastCheck) return;
    showSpeech(speechForCheck(app.lastCheck.ok, speciesId, loadProgress(), checkCount));
  }, [app.lastCheck, speciesId, visible, checkCount, showSpeech]);

  useEffect(() => {
    if (!visible || !app.lastCelebration) return;
    const celebrating =
      app.lastCelebration.isNewMastery || app.lastCelebration.newAchievements.length > 0;
    if (!celebrating) return;
    showSpeech(speechForCelebration(app.lastCelebration, speciesId, loadProgress(), checkCount));
  }, [app.lastCelebration, speciesId, visible, checkCount, showSpeech]);

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
      if (speechTimer.current) window.clearTimeout(speechTimer.current);
    };
  }, []);

  if (!visible) return null;

  const onPointerDown = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      setHint("Hide lab buddy?");
      setSpeechLine(null);
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
    const nextSeed = waveSeed + 1;
    setWaveSeed(nextSeed);
    showSpeech(speechForWave(speciesId, loadProgress(), nextSeed));
    window.setTimeout(() => setReaction(null), 1800);
  };

  const confirmHide = () => {
    setPetVisible(false);
    setVisible(false);
    setHint(null);
    setSpeechLine(null);
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
    >
      {speechLine && !hint && (
        <div className="island-pet-nest-speech" aria-live="polite">
          <CharacterSpeech text={speechLine} compact live />
        </div>
      )}
      <div
        className="island-pet-nest-hit"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={onWaveClick}
        role="img"
        aria-label={
          speechLine && !hint
            ? `${species.name}, your lab buddy: ${speechLine}`
            : `${species.name}, your lab buddy`
        }
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
