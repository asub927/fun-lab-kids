import { createContext, useCallback, useContext, useMemo, useState } from "react";
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
import { recordCheckResult } from "../services/progress";

function bumpSmartScore(current: number, ok: boolean, revealed: boolean): number {
  if (ok) return Math.min(100, current + 10);
  if (revealed) return Math.min(100, current + 5);
  return Math.max(0, current - 5);
}

type AppContextValue = {
  activeStandard: Standard | null;
  boardState: BoardState | null;
  labId: LabId | null;
  toolLog: ToolCallLogEntry[];
  lastCheck: ReturnType<typeof runBoardCheck> | null;
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
  canAdvanceQuestion: boolean;
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

  const bootLab = useCallback(
    (nextLabId: LabId, standardCode: string, params: Record<string, unknown>) => {
      const standard = findStandard(standardCode);
      const set = isShowcaseLab(nextLabId) ? [] : getQuestionSet(standardCode);
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
    },
    [],
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

  const applyAction = useCallback(
    (action: Record<string, unknown>) => {
      if (!boardState) return null;
      setLastCheck(null);
      setHistory((h) => [...h, boardState]);
      const next = applyBoardAction(boardState, action);
      setBoardState(next);
      return next;
    },
    [boardState],
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setBoardState(prev);
      return h.slice(0, -1);
    });
  }, []);

  const loadQuestion = useCallback(
    (index: number, clearCheck = false) => {
      if (!labId || !activeStandard || questionSet.length === 0) return;
      const params = questionSet[index];
      setBoardState(createBoardState(labId, { standardCode: activeStandard.code, params }));
      setHistory([]);
      if (clearCheck) setLastCheck(null);
    },
    [labId, activeStandard, questionSet],
  );

  const runCheck = useCallback(() => {
    if (!boardState || !activeStandard) return null;
    const result = runBoardCheck(boardState);
    setLastCheck(result);

    if (!result.ok) {
      setSmartScore((s) => bumpSmartScore(s, false, false));
      return result;
    }

    const hasQuestionSet = questionSet.length > 0;
    const nextScores = [...sessionScores, result.score];
    const nextCorrect = correctCount + 1;
    const nextSmart = bumpSmartScore(smartScore, true, false);

    setSessionScores(nextScores);
    setCorrectCount(nextCorrect);
    setSmartScore(nextSmart);

    const mastered =
      hasQuestionSet &&
      (nextCorrect >= QUESTIONS_TO_MASTER || nextSmart >= SMART_SCORE_TARGET) &&
      questionIndex >= questionSet.length - 1;

    if (hasQuestionSet && questionIndex < questionSet.length - 1) {
      return {
        ...result,
        feedback: `${result.feedback} Smart Score: ${nextSmart}. Tap Next Question when you are ready.`,
      };
    }

    const avgScore = Math.round(
      nextScores.reduce((a, b) => a + b, 0) / Math.max(nextScores.length, 1),
    );

    if (hasQuestionSet) {
      recordCheckResult(activeStandard.code, mastered, avgScore, {
        completed: mastered,
        questionsCorrect: nextCorrect,
        smartScore: nextSmart,
      });
      return {
        ...result,
        feedback: mastered
          ? `You mastered this skill! Smart Score: ${nextSmart}. Great job!`
          : `Session complete. Smart Score: ${nextSmart}. Keep practicing to reach ${SMART_SCORE_TARGET}!`,
      };
    }

    recordCheckResult(activeStandard.code, true, result.score, { completed: true });
    return result;
  }, [
    boardState,
    activeStandard,
    questionSet,
    questionIndex,
    sessionScores,
    smartScore,
    correctCount,
  ]);

  const revealAnswer = useCallback(() => {
    if (!boardState) return null;
    const { result, actions } = revealBoardAnswer(boardState);
    let next = boardState;
    for (const action of actions) {
      next = applyBoardAction(next, action);
    }
    setBoardState(next);
    setSmartScore((s) => bumpSmartScore(s, false, true));
    setLastCheck(result);
    return result;
  }, [boardState]);

  const advanceQuestion = useCallback(() => {
    if (questionSet.length === 0 || questionIndex >= questionSet.length - 1) return;
    if (!lastCheck?.ok && !lastCheck?.revealed) return;
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    loadQuestion(nextIndex, true);
  }, [questionSet.length, questionIndex, lastCheck, loadQuestion]);

  const canAdvanceQuestion =
    questionSet.length > 1 &&
    questionIndex < questionSet.length - 1 &&
    Boolean(lastCheck?.ok || lastCheck?.revealed);

  const resetBoard = useCallback(() => {
    if (!labId || !activeStandard) return;
    const params =
      questionSet.length > 0
        ? questionSet[questionIndex]
        : resolveLabForStandard(activeStandard.code)?.params ?? {};
    setBoardState(createBoardState(labId, { standardCode: activeStandard.code, params }));
    setHistory([]);
    setLastCheck(null);
  }, [labId, activeStandard, questionSet, questionIndex]);

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
      canAdvanceQuestion,
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
      canAdvanceQuestion,
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
