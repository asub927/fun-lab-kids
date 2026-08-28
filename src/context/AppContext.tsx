import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { BoardState, LabId, Standard, ToolCallLogEntry } from "../types";
import {
  applyBoardAction,
  createBoardState,
  runBoardCheck,
  proposeRevision,
} from "../boards";
import { findStandard } from "../data/standards";
import { resolveLabForStandard } from "../data/activities";
import { recordCheckResult } from "../services/progress";

type AppContextValue = {
  activeStandard: Standard | null;
  boardState: BoardState | null;
  labId: LabId | null;
  toolLog: ToolCallLogEntry[];
  lastCheck: ReturnType<typeof runBoardCheck> | null;
  setActiveLab: (labId: LabId, standardCode: string) => void;
  setActiveStandard: (standardCode: string) => boolean;
  applyAction: (action: Record<string, unknown>) => BoardState | null;
  undo: () => void;
  runCheck: () => ReturnType<typeof runBoardCheck> | null;
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
  const [activityParams, setActivityParams] = useState<Record<string, unknown>>({});
  const [, setHistory] = useState<BoardState[]>([]);
  const [toolLog, setToolLog] = useState<ToolCallLogEntry[]>([]);
  const [lastCheck, setLastCheck] = useState<ReturnType<typeof runBoardCheck> | null>(null);

  const bootLab = useCallback((nextLabId: LabId, standardCode: string, params: Record<string, unknown>) => {
    const standard = findStandard(standardCode);
    setActiveStandardState(standard ?? null);
    setLabId(nextLabId);
    setActivityParams(params);
    setBoardState(createBoardState(nextLabId, { standardCode, params }));
    setHistory([]);
    setLastCheck(null);
  }, []);

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

  const runCheck = useCallback(() => {
    if (!boardState || !activeStandard) return null;
    const result = runBoardCheck(boardState);
    setLastCheck(result);
    recordCheckResult(activeStandard.code, result.ok, result.score);
    return result;
  }, [boardState, activeStandard]);

  const resetBoard = useCallback(() => {
    if (!labId || !activeStandard) return;
    setBoardState(
      createBoardState(labId, { standardCode: activeStandard.code, params: activityParams }),
    );
    setHistory([]);
    setLastCheck(null);
  }, [labId, activeStandard, activityParams]);

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

  const value = useMemo(
    () => ({
      activeStandard,
      boardState,
      labId,
      toolLog,
      lastCheck,
      setActiveLab,
      setActiveStandard,
      applyAction,
      undo,
      runCheck,
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
      setActiveLab,
      setActiveStandard,
      applyAction,
      undo,
      runCheck,
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
