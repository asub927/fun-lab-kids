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
