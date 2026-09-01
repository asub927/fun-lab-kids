import type { BoardState, TemplateBoardState } from "../types";

export type AutoCheckMode = "now" | "debounce" | null;

const DEBOUNCE_TYPED_ACTIONS = new Set(["set_numeric", "set_text", "set_frame_field"]);

function isTemplateState(state: BoardState): state is TemplateBoardState {
  return (
    state.labId !== "place-value" &&
    state.labId !== "opinion-builder" &&
    state.labId !== "matter-lab"
  );
}

function typedValueNonEmpty(action: Record<string, unknown>): boolean {
  const kind = String(action.action ?? "");
  if (kind === "set_numeric") return String(action.value ?? "").trim() !== "";
  if (kind === "set_text" || kind === "set_frame_field") {
    return String(action.text ?? "").trim() !== "";
  }
  return false;
}

/** Decide whether applying this action should auto-run Check Answer. */
export function getAutoCheckMode(
  action: Record<string, unknown>,
  nextState: BoardState,
): AutoCheckMode {
  if (!isTemplateState(nextState)) return null;

  const kind = String(action.action ?? "");

  if (kind === "set_option") {
    return String(action.value ?? "").trim() !== "" ? "now" : null;
  }

  if (kind === "toggle_check") {
    return nextState.checklist.length > 0 && nextState.checklist.every(Boolean) ? "now" : null;
  }

  if (DEBOUNCE_TYPED_ACTIONS.has(kind) && typedValueNonEmpty(action)) {
    return "debounce";
  }

  return null;
}

export const AUTO_CHECK_DEBOUNCE_MS = 800;
