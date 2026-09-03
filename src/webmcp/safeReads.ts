import type { BoardState, LabId } from "../types";
import { parseStrategyParams, hasStrategyContent } from "../components/StrategyPanel";
import { getLabGoal, listBoardActionsForLab } from "./boardActions";

const SPOILER_KEYS = new Set([
  "answer",
  "expectedHint",
  "expected",
  "correct",
  "correctAnswer",
  "solution",
  "solutions",
  "key",
  "keys",
  "rubricAnswer",
]);

export function redactParams(params: Record<string, unknown> | undefined | null): Record<string, unknown> {
  if (!params) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (SPOILER_KEYS.has(key)) continue;
    if (key.toLowerCase().includes("answer") || key.toLowerCase().includes("solution")) continue;
    out[key] = value;
  }
  return out;
}

export function safeBoardSnapshot(boardState: BoardState | null): Record<string, unknown> | null {
  if (!boardState) return null;

  if (boardState.labId === "place-value") {
    return {
      labId: boardState.labId,
      targetNumber: boardState.targetNumber,
      blocks: boardState.blocks,
      lastComparison: boardState.lastComparison ?? null,
    };
  }

  if (boardState.labId === "opinion-builder") {
    return {
      labId: boardState.labId,
      topic: boardState.topic,
      opinion: boardState.opinion,
      reasons: boardState.reasons,
      linkingWords: boardState.linkingWords,
      pendingRevision: boardState.pendingRevision,
      readAloudPreview: boardState.readAloudPreview ?? null,
    };
  }

  if (boardState.labId === "matter-lab") {
    return {
      labId: boardState.labId,
      objects: boardState.objects,
      classifications: boardState.classifications,
      temperatureC: boardState.temperatureC,
      prediction: boardState.prediction,
      observations: boardState.observations,
    };
  }

  return {
    labId: boardState.labId,
    standardCode: boardState.standardCode,
    params: redactParams(boardState.params),
    textResponse: boardState.textResponse,
    numericAnswer: boardState.numericAnswer,
    selectedOption: boardState.selectedOption,
    checklist: boardState.checklist,
    frameFields: boardState.frameFields,
  };
}

export function extractCurrentChallenge(boardState: BoardState | null): Record<string, unknown> {
  if (!boardState) return { error: "No active lab" };

  if (boardState.labId === "place-value") {
    return {
      labId: boardState.labId,
      prompt: `Build ${boardState.targetNumber} with hundreds, tens, and ones.`,
      targetNumber: boardState.targetNumber,
    };
  }

  if (boardState.labId === "opinion-builder") {
    return {
      labId: boardState.labId,
      prompt: "Write an opinion piece with topic, opinion, two reasons, and a linking word.",
      topic: boardState.topic,
      opinion: boardState.opinion,
      reasons: boardState.reasons,
      linkingWords: boardState.linkingWords,
    };
  }

  if (boardState.labId === "matter-lab") {
    return {
      labId: boardState.labId,
      prompt: "Classify objects, heat the ice, predict the state, then run the change.",
      objects: boardState.objects.map((o) => ({ id: o.id, name: o.name })),
      temperatureC: boardState.temperatureC,
      prediction: boardState.prediction,
    };
  }

  const params = redactParams(boardState.params);
  return {
    labId: boardState.labId,
    standardCode: boardState.standardCode,
    prompt: typeof params.prompt === "string" ? params.prompt : undefined,
    story: typeof params.story === "string" ? params.story : undefined,
    passage: typeof params.passage === "string" ? params.passage : undefined,
    question: typeof params.question === "string" ? params.question : undefined,
    mode: typeof params.mode === "string" ? params.mode : undefined,
    options: params.options,
    checklistItems: params.items ?? params.checklist,
    visibleNumbers: {
      a: params.a,
      b: params.b,
      rows: params.rows,
      cols: params.cols,
    },
    learner: {
      textResponse: boardState.textResponse,
      numericAnswer: boardState.numericAnswer,
      selectedOption: boardState.selectedOption,
      checklist: boardState.checklist,
      frameFields: boardState.frameFields,
    },
  };
}

export function extractStrategy(boardState: BoardState | null): Record<string, unknown> {
  if (!boardState) return { error: "No active lab" };

  if (!("params" in boardState) || !boardState.params) {
    return {
      available: false,
      message: "No strategy panel for this showcase lab. Use request_hint instead.",
    };
  }

  const parsed = parseStrategyParams(boardState.params);
  if (!hasStrategyContent(parsed)) {
    return { available: false, message: "No strategy steps for this question." };
  }

  return {
    available: true,
    title: parsed.title,
    steps: parsed.steps,
    sourceLabel: parsed.sourceLabel,
    sourceUrl: parsed.sourceUrl,
    videoTitle: parsed.videoTitle,
    videoProvider: parsed.videoProvider,
    // Intentionally omit videoUrl to avoid yanking kids off the board without intent.
    hasVideo: Boolean(parsed.videoUrl),
  };
}

export function buildLabOverview(labId: LabId | null, standardCode: string | null): Record<string, unknown> {
  if (!labId) return { error: "No active lab" };
  const actions = listBoardActionsForLab(labId).filter((a) => !a.humanConfirmOnly);
  return {
    labId,
    standardCode,
    goal: getLabGoal(labId),
    allowedActions: actions.map((a) => a.action),
    actionDetails: actions,
  };
}
