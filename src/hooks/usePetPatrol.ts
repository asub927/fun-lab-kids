import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { PetMood } from "../data/pets";
import {
  clampPatrolX,
  oppositeFacing,
  PATROL_IDLE_TIMING,
  patrolLaneWidth,
  patrolTargetX,
  petSizeForViewport,
  type PatrolBounds,
} from "../services/petPatrol";

type PatrolPhase = "walking" | "paused";

type PatrolState = {
  x: number;
  facing: "left" | "right";
  phase: PatrolPhase;
  walkMs: number;
};

type UsePetPatrolOptions = {
  enabled: boolean;
  /** Pause patrol in place without resetting position (e.g. while speaking). */
  suspended?: boolean;
  mood: PetMood;
  laneRef: RefObject<HTMLDivElement | null>;
  railRef: RefObject<HTMLDivElement | null>;
};

function shouldPatrol(mood: PetMood): boolean {
  return mood === "idle";
}

function readBounds(laneRef: RefObject<HTMLDivElement | null>): PatrolBounds {
  const lane = laneRef.current;
  const containerWidth = lane?.getBoundingClientRect().width ?? 0;
  const petSize = petSizeForViewport(window.innerWidth);
  if (containerWidth <= 0) {
    return { minX: 0, maxX: 0 };
  }
  return patrolLaneWidth(containerWidth, petSize);
}

export function usePetPatrol({
  enabled,
  suspended = false,
  mood,
  laneRef,
  railRef,
}: UsePetPatrolOptions): PatrolState {
  const boundsRef = useRef<PatrolBounds>({ minX: 0, maxX: 0 });
  const pauseTimerRef = useRef<number | null>(null);
  const wasSuspendedRef = useRef(false);
  const stateRef = useRef<PatrolState>({
    x: 0,
    facing: "right",
    phase: "paused",
    walkMs: 0,
  });
  const [state, setState] = useState<PatrolState>(() => stateRef.current);

  const commitState = useCallback((next: PatrolState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const refreshBounds = useCallback(() => {
    const bounds = readBounds(laneRef);
    boundsRef.current = bounds;
    commitState({
      ...stateRef.current,
      x: clampPatrolX(stateRef.current.x, bounds),
    });
  }, [commitState, laneRef]);

  const beginWalk = useCallback(
    (facing: "left" | "right") => {
      if (suspended) return;
      const bounds = boundsRef.current;
      const startX = clampPatrolX(stateRef.current.x, bounds);
      const targetX = patrolTargetX(facing, bounds);
      commitState({
        x: startX,
        facing,
        phase: "walking",
        walkMs: PATROL_IDLE_TIMING.walkMs,
      });
      window.requestAnimationFrame(() => {
        commitState({
          ...stateRef.current,
          x: targetX,
        });
      });
    },
    [commitState, suspended],
  );

  const scheduleNextWalk = useCallback(
    (facing: "left" | "right") => {
      if (suspended) return;
      clearPauseTimer();
      pauseTimerRef.current = window.setTimeout(() => beginWalk(facing), PATROL_IDLE_TIMING.pauseMs);
    },
    [beginWalk, clearPauseTimer, suspended],
  );

  useEffect(() => {
    if (suspended) {
      wasSuspendedRef.current = true;
      clearPauseTimer();
      commitState({
        ...stateRef.current,
        phase: "paused",
        walkMs: 0,
      });
      return;
    }

    if (wasSuspendedRef.current && enabled && shouldPatrol(mood)) {
      wasSuspendedRef.current = false;
      scheduleNextWalk(stateRef.current.facing);
    }
  }, [suspended, clearPauseTimer, commitState, enabled, mood, scheduleNextWalk]);

  useEffect(() => {
    clearPauseTimer();

    if (!enabled || !shouldPatrol(mood)) {
      const bounds = readBounds(laneRef);
      boundsRef.current = bounds;
      commitState({
        x: clampPatrolX(bounds.minX, bounds),
        facing: "right",
        phase: "paused",
        walkMs: 0,
      });
      return;
    }

    refreshBounds();
    commitState({
      x: boundsRef.current.minX,
      facing: "right",
      phase: "paused",
      walkMs: 0,
    });
    beginWalk("right");

    const lane = laneRef.current;
    let observer: ResizeObserver | null = null;
    if (lane && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => refreshBounds());
      observer.observe(lane);
    }

    const onResize = () => refreshBounds();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      clearPauseTimer();
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [beginWalk, clearPauseTimer, commitState, enabled, laneRef, mood, refreshBounds]);

  useEffect(() => {
    if (!enabled || !shouldPatrol(mood) || suspended) return;

    const node = railRef.current;
    if (!node) return;

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== node) return;
      if (event.propertyName !== "transform") return;
      if (stateRef.current.phase !== "walking") return;

      const nextFacing = oppositeFacing(stateRef.current.facing);
      commitState({
        ...stateRef.current,
        phase: "paused",
        walkMs: 0,
        facing: nextFacing,
      });
      scheduleNextWalk(nextFacing);
    };

    node.addEventListener("transitionend", onTransitionEnd);
    return () => node.removeEventListener("transitionend", onTransitionEnd);
  }, [commitState, enabled, mood, railRef, scheduleNextWalk, suspended]);

  return state;
}
