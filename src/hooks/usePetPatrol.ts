import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { PetMood } from "../data/pets";
import {
  clampPatrolX,
  hasPatrolLane,
  oppositeFacing,
  parkPatrolX,
  PATROL_IDLE_TIMING,
  patrolLaneWidth,
  patrolTargetX,
  petSizeForViewport,
  restPatrolX,
  shouldAllowPetPatrol,
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
  /** When true, idle mood parks instead of roaming (lab quieter contract). */
  onLabRoute?: boolean;
  laneRef: RefObject<HTMLDivElement | null>;
  railRef: RefObject<HTMLDivElement | null>;
};

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
  onLabRoute = false,
  laneRef,
  railRef,
}: UsePetPatrolOptions): PatrolState {
  const boundsRef = useRef<PatrolBounds>({ minX: 0, maxX: 0 });
  const pauseTimerRef = useRef<number | null>(null);
  const wasSuspendedRef = useRef(false);
  /** Once the lane has been measured, keep in-place parks instead of re-resting right. */
  const settledRef = useRef(false);
  const stateRef = useRef<PatrolState>({
    x: 0,
    facing: "left",
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

  const canPatrol = shouldAllowPetPatrol({ mood, onLabRoute, enabled });

  const placeForBounds = useCallback((bounds: PatrolBounds): number => {
    if (!settledRef.current) {
      if (!hasPatrolLane(bounds)) return stateRef.current.x;
      settledRef.current = true;
      return restPatrolX(bounds);
    }
    return clampPatrolX(stateRef.current.x, bounds);
  }, []);

  const refreshBounds = useCallback(() => {
    const bounds = readBounds(laneRef);
    boundsRef.current = bounds;
    commitState({
      ...stateRef.current,
      x: placeForBounds(bounds),
    });
  }, [commitState, laneRef, placeForBounds]);

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

    if (wasSuspendedRef.current && canPatrol) {
      wasSuspendedRef.current = false;
      scheduleNextWalk(stateRef.current.facing);
    }
  }, [suspended, clearPauseTimer, commitState, canPatrol, scheduleNextWalk]);

  // Layout effect so the first paint already rests at the right corner (no left→right skate).
  useLayoutEffect(() => {
    clearPauseTimer();

    if (!canPatrol) {
      const bounds = readBounds(laneRef);
      boundsRef.current = bounds;
      commitState({
        x: parkPatrolX(placeForBounds(bounds), bounds),
        facing: stateRef.current.facing,
        phase: "paused",
        walkMs: 0,
      });
      return;
    }

    const bounds = readBounds(laneRef);
    boundsRef.current = bounds;
    const wasUnset = !settledRef.current;
    const nextX = placeForBounds(bounds);
    // First measurable lane: face left so the opening walk crosses the footer.
    const nextFacing = wasUnset && hasPatrolLane(bounds) ? "left" : stateRef.current.facing;
    commitState({
      x: nextX,
      facing: nextFacing,
      phase: "paused",
      walkMs: 0,
    });
    // Rest first (right corner on first settle); walk only after the idle pause.
    scheduleNextWalk(nextFacing);

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
  }, [
    clearPauseTimer,
    canPatrol,
    commitState,
    laneRef,
    placeForBounds,
    refreshBounds,
    scheduleNextWalk,
  ]);

  useEffect(() => {
    if (!canPatrol || suspended) return;

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
  }, [canPatrol, commitState, railRef, scheduleNextWalk, suspended]);

  return state;
}
