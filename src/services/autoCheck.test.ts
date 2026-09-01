import { describe, expect, it } from "vitest";
import { getAutoCheckMode } from "./autoCheck";
import type { BoardState, TemplateBoardState } from "../types";

function templateState(overrides: Partial<TemplateBoardState> = {}): TemplateBoardState {
  return {
    labId: "numeric-flash",
    standardCode: "NC.2.NBT.1",
    params: { answer: 12 },
    textResponse: "",
    numericAnswer: "",
    selectedOption: "",
    checklist: [false, false],
    frameFields: {},
    ...overrides,
  };
}

const placeValueState = {
  labId: "place-value",
  targetNumber: 243,
  blocks: [],
} as BoardState;

describe("getAutoCheckMode", () => {
  it("checks immediately on set_option", () => {
    expect(getAutoCheckMode({ action: "set_option", value: ">" }, templateState())).toBe("now");
  });

  it("ignores empty set_option", () => {
    expect(getAutoCheckMode({ action: "set_option", value: "  " }, templateState())).toBeNull();
  });

  it("checks immediately when checklist is complete", () => {
    const next = templateState({ labId: "checklist", checklist: [true, true] });
    expect(getAutoCheckMode({ action: "toggle_check", index: 1 }, next)).toBe("now");
  });

  it("does not auto-check a partial checklist", () => {
    const next = templateState({ labId: "checklist", checklist: [true, false] });
    expect(getAutoCheckMode({ action: "toggle_check", index: 0 }, next)).toBeNull();
  });

  it("debounces typed numeric answers", () => {
    expect(
      getAutoCheckMode({ action: "set_numeric", value: "12" }, templateState({ numericAnswer: "12" })),
    ).toBe("debounce");
  });

  it("ignores empty typed answers", () => {
    expect(getAutoCheckMode({ action: "set_numeric", value: "" }, templateState())).toBeNull();
  });

  it("debounces text and frame fields", () => {
    expect(getAutoCheckMode({ action: "set_text", text: "hello" }, templateState())).toBe("debounce");
    expect(
      getAutoCheckMode({ action: "set_frame_field", field: "topic", text: "cats" }, templateState()),
    ).toBe("debounce");
  });

  it("skips showcase multi-step labs", () => {
    expect(getAutoCheckMode({ action: "add_block", block: "ten" }, placeValueState)).toBeNull();
  });
});
