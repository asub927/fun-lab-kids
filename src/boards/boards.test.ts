import { describe, expect, it } from "vitest";
import {
  applyPlaceValueAction,
  blocksToValue,
  checkPlaceValue,
  createPlaceValueState,
} from "./placeValue";
import { checkOpinion, createOpinionState, applyOpinionAction } from "./opinionBuilder";
import {
  applyMatterAction,
  checkMatter,
  createMatterState,
} from "./matterLab";
import {
  applyTemplateAction,
  checkTemplate,
  createTemplateState,
} from "./templates";
import { labIdFromStandardActivity, createBoardState, runBoardCheck } from "./index";
import { listGrade2Standards } from "../data/standards";
import { resolveLabForStandard } from "../data/activities";

describe("place value board", () => {
  it("builds target 243 from blocks", () => {
    let state = createPlaceValueState(243);
    state = applyPlaceValueAction(state, { action: "compose_number", value: 243 });
    expect(blocksToValue(state.blocks)).toBe(243);
    expect(checkPlaceValue(state).ok).toBe(true);
  });

  it("fails check for wrong total", () => {
    let state = createPlaceValueState(243);
    state = applyPlaceValueAction(state, { action: "place_block", block: "one" });
    expect(checkPlaceValue(state).ok).toBe(false);
  });
});

describe("opinion board", () => {
  it("passes with topic, opinion, reasons, linking word", () => {
    let state = createOpinionState();
    state = applyOpinionAction(state, { action: "place_sentence_part", part: "topic", text: "recess" });
    state = applyOpinionAction(state, { action: "place_sentence_part", part: "opinion", text: "Recess should be longer." });
    state = applyOpinionAction(state, { action: "add_reason", text: "We need exercise." });
    state = applyOpinionAction(state, { action: "add_reason", text: "It helps us focus." });
    state = applyOpinionAction(state, { action: "insert_linking_word", word: "because" });
    expect(checkOpinion(state).ok).toBe(true);
  });
});

describe("matter lab", () => {
  it("passes when classified and ice melts with prediction", () => {
    let state = createMatterState();
    for (const id of ["ice", "water", "rock", "juice"]) {
      const classification =
        id === "water" || id === "juice" ? "liquid" : "solid";
      state = applyMatterAction(state, {
        action: "classify_object",
        objectId: id,
        classification,
      });
    }
    state = applyMatterAction(state, { action: "set_temperature", celsius: 10 });
    state = applyMatterAction(state, { action: "predict_state", state: "liquid" });
    state = applyMatterAction(state, { action: "run_state_change" });
    expect(checkMatter(state).ok).toBe(true);
  });
});

describe("grade 2 curriculum coverage", () => {
  it("lists all NCSCOS grade 2 standards as playable", () => {
    const all = listGrade2Standards();
    expect(all.length).toBeGreaterThanOrEqual(75);
    for (const s of all) {
      expect(resolveLabForStandard(s.code)).not.toBeNull();
    }
  });
});

describe("template labs", () => {
  it("passes word-problem with correct numeric answer", () => {
    let state = createTemplateState("word-problem", "NC.2.OA.1", { answer: 63 });
    state = applyTemplateAction(state, { action: "set_numeric", value: "63" });
    expect(checkTemplate(state).ok).toBe(true);
  });

  it("passes checklist when all items checked", () => {
    let state = createTemplateState("checklist", "SL.2.1", {
      items: ["a", "b"],
    });
    state = applyTemplateAction(state, { action: "toggle_check", index: 0 });
    state = applyTemplateAction(state, { action: "toggle_check", index: 1 });
    expect(checkTemplate(state).ok).toBe(true);
  });

  it("creates board state from activity type mapping", () => {
    const labId = labIdFromStandardActivity("word-problem");
    expect(labId).toBe("word-problem");
    const board = createBoardState("word-problem", {
      standardCode: "NC.2.OA.1",
      params: { answer: 10 },
    });
    expect(board.labId).toBe("word-problem");
    if (board.labId === "word-problem") {
      const checked = runBoardCheck({ ...board, numericAnswer: "10" });
      expect(checked.ok).toBe(true);
    }
  });
});
