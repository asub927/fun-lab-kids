import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { useLocation } from "react-router-dom";
import { getPetSpecies } from "../data/pets";
import { useApp } from "../context/AppContext";
import type { PetDialogueContext } from "../data/petDialogue";
import { usePetPatrol } from "../hooks/usePetPatrol";
import { isLabRoute, petSizeForViewport } from "../services/petPatrol";
import { loadProgress } from "../services/progress";
import { getPetSpeciesId, PET_PREFS_EVENT, setPetVisible } from "../services/pet";
import { pickPetCelebrationCue } from "../services/petDialogue";
import {
  deriveAmbientMood,
  reactionDurationMs,
  reactionFromAppEvent,
  type PetReaction,
} from "../services/petActivity";
import {
  consumeStickySpeechEvent,
  PET_SPEECH_MS,
  playPetCelebrationCue,
  speechForCheck,
  speechForRoute,
  speechForWave,
  stopPetSpeech,
} from "../services/petSpeech";
import { CharacterSpeech } from "./CharacterSpeech";
import { PetSprite } from "./pets/PetSprite";

type IslandPetProps = {
  laneRef: RefObject<HTMLDivElement | null>;
};

function computeSpeechSide(
  laneRef: RefObject<HTMLDivElement | null>,
  patrolX: number,
): "left" | "right" {
  const laneWidth = laneRef.current?.getBoundingClientRect().width ?? 0;
  if (laneWidth <= 0) return "right";

  const petSize =
    laneRef.current?.querySelector(".island-pet-rail")?.getBoundingClientRect().width ??
    petSizeForViewport(window.innerWidth);
  const minSpeechWidth = window.innerWidth <= 640 ? 208 : 224;
  const edgeGap = 12;
  const spaceRight = laneWidth - patrolX - petSize - edgeGap;
  const spaceLeft = patrolX - edgeGap;

  if (spaceRight >= minSpeechWidth) return "right";
  if (spaceLeft >= minSpeechWidth) return "left";
  return spaceRight >= spaceLeft ? "right" : "left";
}

/**
 * Codex-like ambient pet: patrols left-to-right inside the footer lane when calm,
 * plays in-place Codex sprite actions for activity, and speaks in a bubble.
 */
export function IslandPet({ laneRef }: IslandPetProps) {
  const app = useApp();
  const { pathname } = useLocation();
  const railRef = useRef<HTMLDivElement>(null);
  const [speciesId, setSpeciesId] = useState(() => getPetSpeciesId());
  const [speechLine, setSpeechLine] = useState<string | null>(null);
  const [waveSeed, setWaveSeed] = useState(0);
  const [reaction, setReaction] = useState<PetReaction | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const [hint, setHint] = useState<string | null>(null);
  const [laneWidth, setLaneWidth] = useState(0);
  const hideTimer = useRef<number | null>(null);
  const pressTimer = useRef<number | null>(null);
  const speechTimer = useRef<number | null>(null);
  const prevNeedsAnswerRef = useRef(false);
  const spokenCheckRef = useRef<typeof app.lastCheck>(null);
  const spokenCelebrationRef = useRef<typeof app.lastCelebration>(null);

  const species = getPetSpecies(speciesId);
  const onLabRoute = isLabRoute(pathname);
  const needsAnswer = onLabRoute && boardLooksEmpty(app.boardState);
  const checkCount = loadProgress().gamification.lifetimeChecks;
  const speaking = Boolean(speechLine || hint);

  const mood = useMemo(() => deriveAmbientMood({ reaction }), [reaction]);

  const patrol = usePetPatrol({
    enabled: !reducedMotion,
    suspended: speaking,
    mood,
    onLabRoute,
    laneRef,
    railRef,
  });

  const patrolling = mood === "idle" && patrol.phase === "walking" && !speaking;
  const speechSide = computeSpeechSide(laneRef, patrol.x);

  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;

    const updateLaneWidth = () => {
      setLaneWidth(lane.getBoundingClientRect().width);
    };

    updateLaneWidth();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateLaneWidth);
      observer.observe(lane);
    }

    window.addEventListener("resize", updateLaneWidth);
    window.addEventListener("orientationchange", updateLaneWidth);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateLaneWidth);
      window.removeEventListener("orientationchange", updateLaneWidth);
    };
  }, [laneRef]);

  const anchorStyle = {
    "--pet-x": `${patrol.x}px`,
    "--lane-width": `${laneWidth}px`,
  } as CSSProperties;

  const clearSpeechTimer = useCallback(() => {
    if (speechTimer.current) {
      window.clearTimeout(speechTimer.current);
      speechTimer.current = null;
    }
  }, []);

  const showSpeech = useCallback(
    (line: string) => {
      stopPetSpeech();
      setSpeechLine(line);
      clearSpeechTimer();
      speechTimer.current = window.setTimeout(() => setSpeechLine(null), PET_SPEECH_MS);
    },
    [clearSpeechTimer],
  );

  const showCelebrationCue = useCallback(
    (context: PetDialogueContext, seed: number) => {
      const store = loadProgress();
      const cue = pickPetCelebrationCue(speciesId, context, store, seed);
      setSpeechLine(cue.text);
      playPetCelebrationCue(cue);
      clearSpeechTimer();
      speechTimer.current = window.setTimeout(() => {
        setSpeechLine(null);
        stopPetSpeech();
      }, PET_SPEECH_MS);
    },
    [speciesId, clearSpeechTimer],
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
      const detail = (event as CustomEvent<{ speciesId?: string }>).detail;
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
    const line = speechForRoute(pathname, speciesId, loadProgress());
    if (line) showSpeech(line);
  }, [pathname, speciesId, showSpeech]);

  useEffect(() => {
    // Sticky lastCheck must not re-play the same celebration MP3 on route changes
    // (e.g. answering in a lab, then navigating home).
    if (!consumeStickySpeechEvent(spokenCheckRef, app.lastCheck) || !app.lastCheck) return;
    const store = loadProgress();
    if (app.lastCheck.ok) {
      // Always use paired pet text + MP3 for correct answers (labs included).
      showCelebrationCue("correct", store.gamification.lifetimeChecks);
      return;
    }
    showSpeech(
      speechForCheck(false, pathname, speciesId, store, checkCount, app.activeStandard?.subject),
    );
  }, [app.lastCheck, app.activeStandard?.subject, pathname, speciesId, checkCount, showSpeech, showCelebrationCue]);

  useEffect(() => {
    if (!consumeStickySpeechEvent(spokenCelebrationRef, app.lastCelebration) || !app.lastCelebration) {
      return;
    }
    const celebrating =
      app.lastCelebration.isNewMastery || app.lastCelebration.newAchievements.length > 0;
    if (!celebrating) return;
    // Mastery / badge unlocks always play the matching pet voice clip.
    const context: PetDialogueContext = app.lastCelebration.isNewMastery
      ? "mastery"
      : "achievement";
    showCelebrationCue(context, checkCount);
  }, [app.lastCelebration, checkCount, showCelebrationCue]);

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
    const timer = window.setTimeout(() => setReaction(null), reactionDurationMs(next));
    return () => window.clearTimeout(timer);
  }, [app.lastCheck, app.lastCelebration]);

  // Rising edge of needs-answer → soft timed waiting pulse (KTD4), not a sustained latch.
  // Falling edge clears waiting immediately so park/home patrol can resume (AE7 / R4).
  // Cleanup resets the edge latch so React Strict Mode remounts can re-arm the timer.
  useEffect(() => {
    if (!needsAnswer) {
      prevNeedsAnswerRef.current = false;
      setReaction((current) => (current === "waiting" ? null : current));
      return;
    }

    const rising = !prevNeedsAnswerRef.current;
    prevNeedsAnswerRef.current = true;
    if (!rising) return;

    setReaction((current) => {
      // Do not interrupt a stronger celebrate / wave / working beat.
      if (current === "celebrating" || current === "waving" || current === "working") {
        return current;
      }
      return "waiting";
    });
    const timer = window.setTimeout(() => {
      setReaction((current) => (current === "waiting" ? null : current));
    }, reactionDurationMs("waiting"));

    return () => {
      window.clearTimeout(timer);
      prevNeedsAnswerRef.current = false;
      setReaction((current) => (current === "waiting" ? null : current));
    };
  }, [needsAnswer]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      if (pressTimer.current) window.clearTimeout(pressTimer.current);
      clearSpeechTimer();
      stopPetSpeech();
    };
  }, [clearSpeechTimer]);

  const onPointerDown = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      setHint("Hide lab buddy?");
      setSpeechLine(null);
      stopPetSpeech();
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
    showSpeech(speechForWave(pathname, speciesId, loadProgress(), nextSeed));
    window.setTimeout(() => setReaction(null), reactionDurationMs("waving"));
  };

  const confirmHide = () => {
    setPetVisible(false);
    setHint(null);
    setSpeechLine(null);
    stopPetSpeech();
  };

  const buddyLabel =
    speechLine && !hint
      ? `${species.name}, your lab buddy: ${speechLine}`
      : `${species.name}, your lab buddy`;

  return (
    <div
      className={[
        "island-pet-anchor",
        `pet-mood-${mood}`,
        reducedMotion ? "is-reduced-motion" : "",
        patrolling ? "is-patrolling" : "",
        speaking ? "is-speaking" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={anchorStyle}
    >
      {speechLine && !hint && (
        <div
          className={`island-pet-side-speech island-pet-side-speech--${speechSide}`}
          aria-live="polite"
        >
          <CharacterSpeech text={speechLine} compact live />
        </div>
      )}
      {hint && (
        <div className={`island-pet-side-speech island-pet-side-speech--${speechSide}`}>
          <div className="island-pet-hint" role="dialog" aria-label="Hide pet">
            <span>{hint}</span>
            <button type="button" className="island-pet-hide" onClick={confirmHide}>
              Hide
            </button>
          </div>
        </div>
      )}
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
          aria-label={buddyLabel}
        >
          <PetSprite
            speciesId={speciesId}
            mood={mood}
            facing={patrol.facing}
            patrolling={patrolling}
          />
        </div>
      </div>
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
