import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type {
  BoardState,
  LabId,
  Standard,
  ToolCallLogEntry,
} from "../types";
import {
  applyBoardAction,
  createBoardState,
  runBoardCheck,
  proposeRevision,
} from "../boards";
import { findStandard } from "../data/standards";

type AppContextValue = {
  activeStandard: Standard | null;
  boardState: BoardState | null;
  labId: LabId | null;
  toolLog: ToolCallLogEntry[];
  lastCheck: ReturnType<typeof runBoardCheck> | null;
  setActiveLab: (labId: LabId, standardCode: string) => void;
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
  const [activeStandard, setActiveStandard] = useState<Standard | null>(null);
  const [labId, setLabId] = useState<LabId | null>(null);
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [history, setHistory] = useState<BoardState[]>([]);
  const [toolLog, setToolLog] = useState<ToolCallLogEntry[]>([]);
  const [lastCheck, setLastCheck] = useState<ReturnType<typeof runBoardCheck> | null>(
    null,
  );

  const setActiveLab = useCallback((nextLabId: LabId, standardCode: string) => {
    const standard = findStandard(standardCode);
    setActiveStandard(standard ?? null);
    setLabId(nextLabId);
    const initial = createBoardState(nextLabId);
    setBoardState(initial);
    setHistory([]);
    setLastCheck(null);
  }, []);

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
    if (!boardState) return null;
    const result = runBoardCheck(boardState);
    setLastCheck(result);
    return result;
  }, [boardState]);

  const resetBoard = useCallback(() => {
    if (!labId) return;
    setBoardState(createBoardState(labId));
    setHistory([]);
    setLastCheck(null);
  }, [labId]);

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

  const logToolCall = useCallback(
    (entry: Omit<ToolCallLogEntry, "id" | "timestamp">) => {
      setToolLog((log) => [
        {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
        ...log,
      ].slice(0, 50));
    },
    [],
  );

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
