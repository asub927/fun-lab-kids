import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPetSpecies, speciesForSubject } from "../data/pets";
import { useApp } from "../context/AppContext";
import { isPetVisible, setPetVisible } from "../services/pet";
import {
  deriveAmbientMood,
  PET_REACTION_MS,
  reactionFromAppEvent,
} from "../services/petActivity";
import { subjectFromPath } from "../services/companion";
import { PetSprite } from "./pets/PetSprite";

type Point = { x: number; y: number };

const PET_SIZE = 72;
const PAD = 16;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randomPoint(width: number, height: number): Point {
  const maxX = Math.max(PAD, width - PET_SIZE - PAD);
  const maxY = Math.max(PAD, height - PET_SIZE - PAD);
  // Bias away from the top nav.
  const x = PAD + Math.random() * Math.max(1, maxX - PAD);
  const y = 72 + Math.random() * Math.max(1, maxY - 72);
  return {
    x: clamp(x, PAD, maxX),
    y: clamp(y, 72, maxY),
  };
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

export function IslandPet() {
  const app = useApp();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => isPetVisible());
  const [reaction, setReaction] = useState<"celebrating" | "working" | "waiting" | "waving" | null>(
    null,
  );
  const [pos, setPos] = useState<Point>({ x: 24, y: 120 });
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [hint, setHint] = useState<string | null>(null);
  const hideTimer = useRef<number | null>(null);
  const pressTimer = useRef<number | null>(null);

  const subject = app.activeStandard?.subject ?? subjectFromPath(pathname);
  const speciesId = speciesForSubject(subject);
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
      const detail = (event as CustomEvent<{ visible?: boolean }>).detail;
      if (typeof detail?.visible === "boolean") setVisible(detail.visible);
      else setVisible(isPetVisible());
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
    if (!next && !app.lastCheck && !app.lastCelebration) return;
    if (!next) return;
    setReaction(next);
    const timer = window.setTimeout(() => setReaction(null), PET_REACTION_MS);
    return () => window.clearTimeout(timer);
  }, [app.lastCheck, app.lastCelebration]);

  useEffect(() => {
    if (!visible || reducedMotion) return;

    const move = () => {
      setPos((current) => {
        const next = randomPoint(window.innerWidth, window.innerHeight);
        setFacing(next.x >= current.x ? "right" : "left");
        return next;
      });
    };

    move();
    const id = window.setInterval(move, 5200 + Math.random() * 2400);
    return () => window.clearInterval(id);
  }, [visible, reducedMotion, pathname]);

  useEffect(() => {
    if (!reducedMotion || !visible) return;
    setPos({
      x: PAD,
      y: Math.max(88, window.innerHeight - PET_SIZE - 96),
    });
    setFacing("right");
  }, [reducedMotion, visible]);

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
      className={`island-pet-ambient pet-mood-${mood}${reducedMotion ? " is-reduced-motion" : ""}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden={hint ? undefined : true}
    >
      <div
        className="island-pet-ambient-hit"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={onWaveClick}
        role="img"
        aria-label={`${species.name}, your floating island friend`}
      >
        <PetSprite speciesId={speciesId} mood={mood} facing={facing} />
      </div>
      {hint && (
        <div className="island-pet-ambient-hint" role="dialog" aria-label="Hide pet">
          <span>{hint}</span>
          <button type="button" className="island-pet-ambient-hide" onClick={confirmHide}>
            Hide
          </button>
        </div>
      )}
    </div>
  );
}
