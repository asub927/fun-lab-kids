import { describe, expect, it, beforeEach } from "vitest";
import {
  applyPlaceValueAction,
  createPlaceValueState,
} from "../boards/placeValue";
import {
  applyOpinionAction,
  buildOpinionParagraph,
  createOpinionState,
} from "../boards/opinionBuilder";
import { clearAgentEvents, emitAgentEvent, getRecentAgentEvents } from "./events";
import { listBoardActionsForLab, HUMAN_CONFIRM_ACTIONS } from "./boardActions";
import {
  extractCurrentChallenge,
  redactParams,
  safeBoardSnapshot,
} from "./safeReads";
import type { TemplateBoardState } from "../types";

describe("place value compare_values", () => {
  it("stores comparison feedback on the board", () => {
    let state = createPlaceValueState(243);
    state = applyPlaceValueAction(state, { action: "compose_number", value: 200 });
    state = applyPlaceValueAction(state, { action: "compare_values", other: 150 });
    expect(state.lastComparison?.other).toBe(150);
    expect(state.lastComparison?.feedback).toMatch(/greater than/);
  });
});

describe("opinion read_aloud_preview", () => {
  it("builds a paragraph preview on the board", () => {
    let state = createOpinionState();
    state = applyOpinionAction(state, {
      action: "place_sentence_part",
      part: "topic",
      text: "recess",
    });
    state = applyOpinionAction(state, {
      action: "place_sentence_part",
      part: "opinion",
      text: "Recess should be longer.",
    });
    state = applyOpinionAction(state, { action: "read_aloud_preview" });
    expect(state.readAloudPreview).toContain("Recess should be longer.");
    expect(state.readAloudPreview).toBe(buildOpinionParagraph(state));
  });
});

describe("webmcp events", () => {
  beforeEach(() => clearAgentEvents());

  it("keeps newest events first", () => {
    emitAgentEvent("route_changed", { pathname: "/a" });
    emitAgentEvent("check_completed", { ok: true });
    const events = getRecentAgentEvents(10);
    expect(events[0]?.type).toBe("check_completed");
    expect(events[1]?.type).toBe("route_changed");
  });
});

describe("board action catalog", () => {
  it("lists place-value actions and marks spoilers", () => {
    const actions = listBoardActionsForLab("place-value");
    expect(actions.some((a) => a.action === "place_block")).toBe(true);
    expect(HUMAN_CONFIRM_ACTIONS.has("compose_number")).toBe(true);
  });
});

describe("safe reads", () => {
  it("redacts answer keys from params", () => {
    expect(redactParams({ prompt: "Hi", answer: 12, expectedHint: "x" })).toEqual({
      prompt: "Hi",
    });
  });

  it("keeps template learner responses without answer keys", () => {
    const board: TemplateBoardState = {
      labId: "numeric-flash",
      standardCode: "NC.2.OA.1",
      params: { prompt: "2+2?", answer: 4 },
      textResponse: "",
      numericAnswer: "4",
      selectedOption: "",
      checklist: [],
      frameFields: {},
    };
    const snap = safeBoardSnapshot(board);
    expect(snap?.params).toEqual({ prompt: "2+2?" });
    expect(snap?.numericAnswer).toBe("4");
    const challenge = extractCurrentChallenge(board);
    expect(challenge.prompt).toBe("2+2?");
    expect(challenge).not.toHaveProperty("answer");
  });
});
