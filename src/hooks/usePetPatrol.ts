import { useCallback, useEffect, useRef, useState } from "react";
import type { PetMood } from "../data/pets";
import {
  clampPoint,
  defaultExclusionRects,
  facingForDeltaX,
  PATROL_IDLE_TIMING,
  PATROL_WORKING_TIMING,
  petSizeForViewport,
  pickWanderPoint,
  type Point,
  wanderBoundsForViewport,
} from "../services/petPatrol";

type PatrolPhase = "walking" | "paused";

export type WanderState = {
  x: number;
  y: number;
  facing: "left" | "right";
  phase: PatrolPhase;
  walkMs: number;
};

type UsePetWanderOptions = {
  enabled: boolean;
  /** Pause in place without resetting (e.g. while speaking). */
  suspended?: boolean;
  mood: PetMood;
};

function shouldWander(mood: PetMood): boolean {
  return mood === "idle" || mood === "working" || mood === "waiting";
}

function timingForMood(mood: PetMood) {
  return mood === "working" || mood === "waiting" ? PATROL_WORKING_TIMING : PATROL_IDLE_TIMING;
}

function parkCorner(bounds: { minX: number; maxX: number; minY: number; maxY: number }): Point {
  return {
    x: bounds.minX,
    y: Math.max(bounds.minY, bounds.maxY - 8),
  };
}

/**
 * Free-float wander across the viewport with exclusion pads for nav / lab actions / companion.
 */
export function usePetPatrol({
  enabled,
  suspended = false,
  mood,
}: UsePetWanderOptions): WanderState {
  const pauseTimerRef = useRef<number | null>(null);
  const wasSuspendedRef = useRef(false);
  const stateRef = useRef<WanderState>({
    x: 24,
    y: 120,
    facing: "right",
    phase: "paused",
    walkMs: 0,
  });
  const [state, setState] = useState<WanderState>(() => stateRef.current);

  const commit = useCallback((next: WanderState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const readScene = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const petSize = petSizeForViewport(width);
    const bounds = wanderBoundsForViewport(width, height, petSize);
    const exclusions = defaultExclusionRects(width, height);
    return { width, height, petSize, bounds, exclusions };
  }, []);

  const beginWalk = useCallback(() => {
    if (suspended) return;
    const scene = readScene();
    const start = clampPoint(
      { x: stateRef.current.x, y: stateRef.current.y },
      scene.bounds,
    );
    const target = pickWanderPoint(scene.bounds, scene.petSize, scene.exclusions);
    const timing = timingForMood(mood);
    const facing = facingForDeltaX(target.x - start.x, stateRef.current.facing);

    commit({
      x: start.x,
      y: start.y,
      facing,
      phase: "walking",
      walkMs: timing.walkMs,
    });

    window.requestAnimationFrame(() => {
      commit({
        ...stateRef.current,
        x: target.x,
        y: target.y,
        facing,
      });
    });
  }, [commit, mood, readScene, suspended]);

  const scheduleNextWalk = useCallback(() => {
    if (suspended) return;
    clearPauseTimer();
    const timing = timingForMood(mood);
    pauseTimerRef.current = window.setTimeout(() => beginWalk(), timing.pauseMs);
  }, [beginWalk, clearPauseTimer, mood, suspended]);

  useEffect(() => {
    if (suspended) {
      wasSuspendedRef.current = true;
      clearPauseTimer();
      commit({
        ...stateRef.current,
        phase: "paused",
        walkMs: 0,
      });
      return;
    }

    if (wasSuspendedRef.current && enabled && shouldWander(mood)) {
      wasSuspendedRef.current = false;
      scheduleNextWalk();
    }
  }, [clearPauseTimer, commit, enabled, mood, scheduleNextWalk, suspended]);

  useEffect(() => {
    clearPauseTimer();
    const scene = readScene();

    if (!enabled || !shouldWander(mood)) {
      const parked = clampPoint(
        enabled ? { x: stateRef.current.x, y: stateRef.current.y } : parkCorner(scene.bounds),
        scene.bounds,
      );
      commit({
        x: parked.x,
        y: parked.y,
        facing: stateRef.current.facing,
        phase: "paused",
        walkMs: 0,
      });
      return;
    }

    const start = pickWanderPoint(scene.bounds, scene.petSize, scene.exclusions);
    commit({
      x: start.x,
      y: start.y,
      facing: "right",
      phase: "paused",
      walkMs: 0,
    });
    beginWalk();

    const onResize = () => {
      const next = readScene();
      commit({
        ...stateRef.current,
        ...clampPoint({ x: stateRef.current.x, y: stateRef.current.y }, next.bounds),
        phase: "paused",
        walkMs: 0,
      });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      clearPauseTimer();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [beginWalk, clearPauseTimer, commit, enabled, mood, readScene]);

  useEffect(() => {
    if (!enabled || !shouldWander(mood) || suspended) return;

    const onTransitionEnd = (event: TransitionEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.classList.contains("island-pet-float")) return;
      if (event.propertyName !== "transform") return;
      if (stateRef.current.phase !== "walking") return;

      commit({
        ...stateRef.current,
        phase: "paused",
        walkMs: 0,
      });
      scheduleNextWalk();
    };

    document.addEventListener("transitionend", onTransitionEnd);
    return () => document.removeEventListener("transitionend", onTransitionEnd);
  }, [commit, enabled, mood, scheduleNextWalk, suspended]);

  return state;
}
