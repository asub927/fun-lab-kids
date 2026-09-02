import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { BoardState, LabId, Standard, ToolCallLogEntry } from "../types";
import {
  applyBoardAction,
  createBoardState,
  isShowcaseLab,
  revealBoardAnswer,
  runBoardCheck,
  proposeRevision,
} from "../boards";
import { findStandard } from "../data/standards";
import { getQuestionSet, resolveLabForStandard } from "../data/activities";
import {
  QUESTIONS_TO_MASTER,
  SMART_SCORE_TARGET,
} from "../data/questionSets";
import { recordCheckResult, recordLabVisit, type RecordCheckResult } from "../services/progress";
import type { Achievement } from "../data/achievements";
import {
  AUTO_CHECK_DEBOUNCE_MS,
  getAutoCheckMode,
  type AutoCheckMode,
} from "../services/autoCheck";

export type CelebrationPayload = {
  xpEarned: number;
  newAchievements: Achievement[];
  streakDays: number;
  isNewMastery: boolean;
};

function toCelebration(result: RecordCheckResult): CelebrationPayload | null {
  if (result.xpEarned <= 0 && !result.isNewMastery && result.newAchievements.length === 0) {
    return null;
  }
  return {
    xpEarned: result.xpEarned,
    newAchievements: result.newAchievements,
    streakDays: result.streakDays,
    isNewMastery: result.isNewMastery,
  };
}

function bumpSmartScore(current: number, ok: boolean, revealed: boolean): number {
  if (ok) return Math.min(100, current + 10);
  if (revealed) return Math.min(100, current + 5);
  return Math.max(0, current - 5);
}

type SessionSnapshot = {
  activeStandard: Standard | null;
  questionSet: Record<string, unknown>[];
  questionIndex: number;
  sessionScores: number[];
  smartScore: number;
  correctCount: number;
};

type AppContextValue = {
  activeStandard: Standard | null;
  boardState: BoardState | null;
  labId: LabId | null;
  toolLog: ToolCallLogEntry[];
  lastCheck: ReturnType<typeof runBoardCheck> | null;
  lastCelebration: CelebrationPayload | null;
  clearCelebration: () => void;
  questionIndex: number;
  questionTotal: number;
  sessionScores: number[];
  smartScore: number;
  correctCount: number;
  questionLevel: number;
  setActiveLab: (labId: LabId, standardCode: string) => void;
  setActiveStandard: (standardCode: string) => boolean;
  applyAction: (action: Record<string, unknown>) => BoardState | null;
  undo: () => void;
  runCheck: () => ReturnType<typeof runBoardCheck> | null;
  revealAnswer: () => ReturnType<typeof runBoardCheck> | null;
  advanceQuestion: () => void;
  previousQuestion: () => void;
  canAdvanceQuestion: boolean;
  canGoPreviousQuestion: boolean;
  resetBoard: () => void;
  proposeRevision: (revision: string) => void;
  acceptRevision: () => void;
  rejectRevision: () => void;
  logToolCall: (entry: Omit<ToolCallLogEntry, "id" | "timestamp">) => void;
  getBoardSnapshot: () => Record<string, unknown> | null;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeStandard, setActiveStandardState] = useState<Standard | null>(null);
  const [labId, setLabId] = useState<LabId | null>(null);
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [questionSet, setQuestionSet] = useState<Record<string, unknown>[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [smartScore, setSmartScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [, setHistory] = useState<BoardState[]>([]);
  const [toolLog, setToolLog] = useState<ToolCallLogEntry[]>([]);
  const [lastCheck, setLastCheck] = useState<ReturnType<typeof runBoardCheck> | null>(null);
  const [lastCelebration, setLastCelebration] = useState<CelebrationPayload | null>(null);

  const sessionRef = useRef<SessionSnapshot>({
    activeStandard: null,
    questionSet: [],
    questionIndex: 0,
    sessionScores: [],
    smartScore: 0,
    correctCount: 0,
  });
  const autoCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  sessionRef.current = {
    activeStandard,
    questionSet,
    questionIndex,
    sessionScores,
    smartScore,
    correctCount,
  };

  const clearAutoCheckTimer = useCallback(() => {
    if (autoCheckTimerRef.current !== null) {
      clearTimeout(autoCheckTimerRef.current);
      autoCheckTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearAutoCheckTimer(), [clearAutoCheckTimer]);

  const clearCelebration = useCallback(() => setLastCelebration(null), []);

  const bootLab = useCallback(
    (nextLabId: LabId, standardCode: string, params: Record<string, unknown>) => {
      clearAutoCheckTimer();
      const standard = findStandard(standardCode);
      const visitIndex = isShowcaseLab(nextLabId) ? 0 : recordLabVisit(standardCode);
      const set = isShowcaseLab(nextLabId) ? [] : getQuestionSet(standardCode, visitIndex);
      const initialParams = set.length > 0 ? set[0] : params;

      setActiveStandardState(standard ?? null);
      setLabId(nextLabId);
      setQuestionSet(set);
      setQuestionIndex(0);
      setSessionScores([]);
      setSmartScore(0);
      setCorrectCount(0);
      setBoardState(createBoardState(nextLabId, { standardCode, params: initialParams }));
      setHistory([]);
      setLastCheck(null);
      setLastCelebration(null);
    },
    [clearAutoCheckTimer],
  );

  const setActiveLab = useCallback(
    (nextLabId: LabId, standardCode: string) => {
      bootLab(nextLabId, standardCode, resolveLabForStandard(standardCode)?.params ?? {});
    },
    [bootLab],
  );

  const setActiveStandard = useCallback(
    (standardCode: string) => {
      const resolved = resolveLabForStandard(standardCode);
      if (!resolved) return false;
      bootLab(resolved.labId, standardCode, resolved.params);
      return true;
    },
    [bootLab],
  );

  const runCheckWithState = useCallback((state: BoardState) => {
    const session = sessionRef.current;
    if (!session.activeStandard) return null;
    const result = runBoardCheck(state);
    setLastCheck(result);

    if (!result.ok) {
      setSmartScore((s) => bumpSmartScore(s, false, false));
      const gamification = recordCheckResult(session.activeStandard.code, false, 0);
      setLastCelebration(toCelebration(gamification));
      return result;
    }

    const hasQuestionSet = session.questionSet.length > 0;
    const nextScores = [...session.sessionScores, result.score];
    const nextCorrect = session.correctCount + 1;
    const nextSmart = bumpSmartScore(session.smartScore, true, false);

    setSessionScores(nextScores);
    setCorrectCount(nextCorrect);
    setSmartScore(nextSmart);

    const mastered =
      hasQuestionSet &&
      (nextCorrect >= QUESTIONS_TO_MASTER || nextSmart >= SMART_SCORE_TARGET) &&
      session.questionIndex >= session.questionSet.length - 1;

    if (hasQuestionSet && session.questionIndex < session.questionSet.length - 1) {
      const gamification = recordCheckResult(session.activeStandard.code, true, result.score, {
        completed: false,
        questionsCorrect: nextCorrect,
        smartScore: nextSmart,
      });
      setLastCelebration(toCelebration(gamification));
      return {
        ...result,
        feedback: `${result.feedback} Smart Score: ${nextSmart}. Tap Next Question when you are ready.`,
      };
    }

    const avgScore = Math.round(
      nextScores.reduce((a, b) => a + b, 0) / Math.max(nextScores.length, 1),
    );

    if (hasQuestionSet) {
      const gamification = recordCheckResult(session.activeStandard.code, mastered, avgScore, {
        completed: mastered,
        questionsCorrect: nextCorrect,
        smartScore: nextSmart,
      });
      setLastCelebration(toCelebration(gamification));
      return {
        ...result,
        feedback: mastered
          ? `You mastered this skill! Smart Score: ${nextSmart}. Great job!`
          : `Session complete. Smart Score: ${nextSmart}. Keep practicing to reach ${SMART_SCORE_TARGET}!`,
      };
    }

    const gamification = recordCheckResult(session.activeStandard.code, true, result.score, {
      completed: true,
    });
    setLastCelebration(toCelebration(gamification));
    return result;
  }, []);

  const queueAutoCheck = useCallback(
    (mode: AutoCheckMode, state: BoardState) => {
      clearAutoCheckTimer();
      if (!mode) return;
      if (mode === "now") {
        runCheckWithState(state);
        return;
      }
      autoCheckTimerRef.current = setTimeout(() => {
        autoCheckTimerRef.current = null;
        runCheckWithState(state);
      }, AUTO_CHECK_DEBOUNCE_MS);
    },
    [clearAutoCheckTimer, runCheckWithState],
  );

  const applyAction = useCallback(
    (action: Record<string, unknown>) => {
      if (!boardState) return null;
      clearAutoCheckTimer();
      setLastCheck(null);
      setHistory((h) => [...h, boardState]);
      const next = applyBoardAction(boardState, action);
      setBoardState(next);
      queueAutoCheck(getAutoCheckMode(action, next), next);
      return next;
    },
    [boardState, clearAutoCheckTimer, queueAutoCheck],
  );

  const undo = useCallback(() => {
    clearAutoCheckTimer();
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setBoardState(prev);
      return h.slice(0, -1);
    });
  }, [clearAutoCheckTimer]);

  const loadQuestion = useCallback(
    (index: number, clearCheck = false) => {
      if (!labId || !activeStandard || questionSet.length === 0) return;
      clearAutoCheckTimer();
      const params = questionSet[index];
      setBoardState(createBoardState(labId, { standardCode: activeStandard.code, params }));
      setHistory([]);
      if (clearCheck) setLastCheck(null);
    },
    [labId, activeStandard, questionSet, clearAutoCheckTimer],
  );

  const runCheck = useCallback(() => {
    clearAutoCheckTimer();
    if (!boardState) return null;
    return runCheckWithState(boardState);
  }, [boardState, clearAutoCheckTimer, runCheckWithState]);

  const revealAnswer = useCallback(() => {
    if (!boardState || !activeStandard) return null;
    clearAutoCheckTimer();
    const { result, actions } = revealBoardAnswer(boardState);
    let next = boardState;
    for (const action of actions) {
      next = applyBoardAction(next, action);
    }
    setBoardState(next);
    setSmartScore((s) => bumpSmartScore(s, false, true));
    setLastCheck(result);
    const gamification = recordCheckResult(activeStandard.code, false, 0);
    setLastCelebration(toCelebration(gamification));
    return result;
  }, [boardState, activeStandard, clearAutoCheckTimer]);

  const advanceQuestion = useCallback(() => {
    if (questionSet.length === 0 || questionIndex >= questionSet.length - 1) return;
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    loadQuestion(nextIndex, true);
  }, [questionSet.length, questionIndex, loadQuestion]);

  const previousQuestion = useCallback(() => {
    if (questionSet.length === 0 || questionIndex <= 0) return;
    const prevIndex = questionIndex - 1;
    setQuestionIndex(prevIndex);
    loadQuestion(prevIndex, true);
  }, [questionSet.length, questionIndex, loadQuestion]);

  const canAdvanceQuestion = questionSet.length > 1 && questionIndex < questionSet.length - 1;
  const canGoPreviousQuestion = questionSet.length > 1 && questionIndex > 0;

  const resetBoard = useCallback(() => {
    if (!labId || !activeStandard) return;
    clearAutoCheckTimer();
    const params =
      questionSet.length > 0
        ? questionSet[questionIndex]
        : resolveLabForStandard(activeStandard.code)?.params ?? {};
    setBoardState(createBoardState(labId, { standardCode: activeStandard.code, params }));
    setHistory([]);
    setLastCheck(null);
  }, [labId, activeStandard, questionSet, questionIndex, clearAutoCheckTimer]);

  const proposeRevisionText = useCallback(
    (revision: string) => {
      if (boardState?.labId !== "opinion-builder") return;
      setBoardState(proposeRevision(boardState, revision));
    },
    [boardState],
  );

  const acceptRevision = useCallback(() => {
    if (boardState?.labId !== "opinion-builder" || !boardState.pendingRevision) return;
    setHistory((h) => [...h, boardState]);
    setBoardState({
      ...boardState,
      opinion: boardState.pendingRevision,
      pendingRevision: null,
    });
  }, [boardState]);

  const rejectRevision = useCallback(() => {
    if (boardState?.labId !== "opinion-builder") return;
    setBoardState({ ...boardState, pendingRevision: null });
  }, [boardState]);

  const logToolCall = useCallback((entry: Omit<ToolCallLogEntry, "id" | "timestamp">) => {
    setToolLog((log) =>
      [{ ...entry, id: crypto.randomUUID(), timestamp: Date.now() }, ...log].slice(0, 50),
    );
  }, []);

  const getBoardSnapshot = useCallback(() => {
    if (!boardState) return null;
    return { ...boardState };
  }, [boardState]);

  const questionTotal = questionSet.length;
  const currentParams = questionSet[questionIndex] as { difficulty?: number } | undefined;
  const questionLevel = currentParams?.difficulty ?? Math.min(3, Math.floor(questionIndex / 3) + 1);

  const value = useMemo(
    () => ({
      activeStandard,
      boardState,
      labId,
      toolLog,
      lastCheck,
      lastCelebration,
      clearCelebration,
      questionIndex,
      questionTotal,
      sessionScores,
      smartScore,
      correctCount,
      questionLevel,
      setActiveLab,
      setActiveStandard,
      applyAction,
      undo,
      runCheck,
      revealAnswer,
      advanceQuestion,
      previousQuestion,
      canAdvanceQuestion,
      canGoPreviousQuestion,
      resetBoard,
      proposeRevision: proposeRevisionText,
      acceptRevision,
      rejectRevision,
      logToolCall,
      getBoardSnapshot,
    }),
    [
      activeStandard,
      boardState,
      labId,
      toolLog,
      lastCheck,
      lastCelebration,
      clearCelebration,
      questionIndex,
      questionTotal,
      sessionScores,
      smartScore,
      correctCount,
      questionLevel,
      setActiveLab,
      setActiveStandard,
      applyAction,
      undo,
      runCheck,
      revealAnswer,
      advanceQuestion,
      previousQuestion,
      canAdvanceQuestion,
      canGoPreviousQuestion,
      resetBoard,
      proposeRevisionText,
      acceptRevision,
      rejectRevision,
      logToolCall,
      getBoardSnapshot,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
