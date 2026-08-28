import type { CheckResult, TemplateBoardState, TemplateLabId } from "../../types";

function checklistItems(params: Record<string, unknown>): string[] {
  const items = params.items;
  return Array.isArray(items) ? (items as string[]) : ["I completed the activity."];
}

export function createTemplateState(
  labId: TemplateLabId,
  standardCode: string,
  params: Record<string, unknown>,
): TemplateBoardState {
  return {
    labId,
    standardCode,
    params,
    textResponse: "",
    numericAnswer: "",
    selectedOption: "",
    checklist: checklistItems(params).map(() => false),
    frameFields: {},
  };
}

export function applyTemplateAction(
  state: TemplateBoardState,
  action: Record<string, unknown>,
): TemplateBoardState {
  switch (action.action) {
    case "set_text":
      return { ...state, textResponse: String(action.text ?? "") };
    case "set_numeric":
      return { ...state, numericAnswer: String(action.value ?? "") };
    case "set_option":
      return { ...state, selectedOption: String(action.value ?? "") };
    case "toggle_check": {
      const index = Number(action.index);
      const next = [...state.checklist];
      if (index >= 0 && index < next.length) next[index] = !next[index];
      return { ...state, checklist: next };
    }
    case "set_frame_field":
      return {
        ...state,
        frameFields: {
          ...state.frameFields,
          [String(action.field)]: String(action.text ?? ""),
        },
      };
    default:
      return state;
  }
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function checkNumeric(state: TemplateBoardState, expected: unknown): CheckResult {
  const got = Number(state.numericAnswer);
  const want = Number(expected);
  const ok = !Number.isNaN(got) && got === want;
  return {
    ok,
    score: ok ? 100 : Math.max(0, 50 - Math.abs(got - want)),
    feedback: ok
      ? "Correct!"
      : `Your answer was ${state.numericAnswer || "blank"}. Try again.`,
    expectedHint: String(expected),
  };
}

export function checkTemplate(state: TemplateBoardState): CheckResult {
  const p = state.params;

  switch (state.labId) {
    case "word-problem":
      return checkNumeric(state, p.answer);

    case "numeric-flash":
    case "computation":
      return checkNumeric(state, p.answer);

    case "equal-groups": {
      if (p.mode === "odd-even") {
        const got = norm(state.selectedOption);
        const want = norm(String(p.answer));
        const ok = got === want;
        return {
          ok,
          score: ok ? 100 : 0,
          feedback: ok ? "Correct!" : `Is ${p.count} odd or even?`,
        };
      }
      return checkNumeric(state, p.answer);
    }

    case "number-sense": {
      if (p.mode === "compare") {
        const got = state.selectedOption || state.numericAnswer;
        const ok = got === p.answer;
        return {
          ok,
          score: ok ? 100 : 0,
          feedback: ok
            ? "Correct comparison!"
            : `Compare ${p.a} and ${p.b} using >, <, or =.`,
        };
      }
      if (p.mode === "expanded") {
        const ok = norm(state.textResponse).includes("300") && norm(state.textResponse).includes("50");
        return {
          ok,
          score: ok ? 100 : 40,
          feedback: ok ? "Great expanded form!" : "Write the number in expanded form (e.g. 300+50+2).",
        };
      }
      return checkNumeric(state, p.answer ?? p.start);
    }

    case "measurement":
      return checkNumeric(state, p.length);

    case "time-money": {
      const got = norm(state.textResponse || state.numericAnswer);
      const wantTime = norm(String(p.answer ?? p.time ?? ""));
      const ok = got === wantTime || got.includes(String(p.cents));
      return {
        ok,
        score: ok ? 100 : 30,
        feedback: ok ? "Correct!" : "Check your time or money answer.",
      };
    }

    case "data-chart":
      return checkNumeric(state, p.answer);

    case "geometry": {
      const got = norm(state.textResponse || state.selectedOption);
      const ok =
        got.includes(String(p.sides)) ||
        got.includes(String(p.shape)) ||
        got.includes(String(p.answer));
      return {
        ok,
        score: ok ? 100 : 40,
        feedback: ok ? "Nice geometry work!" : "Name the shape or equal parts.",
      };
    }

    case "writing-frame": {
      const required = (p.requiredParts as string[]) ?? ["topic"];
      const filled = required.filter((part) => (state.frameFields[part] ?? "").trim().length > 3);
      const ok = filled.length >= required.length;
      return {
        ok,
        score: Math.round((filled.length / required.length) * 100),
        feedback: ok
          ? "Your writing has all the required parts!"
          : `Add: ${required.filter((r) => !filled.includes(r)).join(", ")}`,
      };
    }

    case "reading-response": {
      const ok = state.textResponse.trim().length >= 8;
      return {
        ok,
        score: ok ? 100 : 20,
        feedback: ok ? "Thoughtful answer!" : "Write a complete answer in your own words.",
      };
    }

    case "language-edit": {
      const ok = norm(state.textResponse) === norm(String(p.fixed));
      return {
        ok,
        score: ok ? 100 : 40,
        feedback: ok ? "Perfect conventions!" : `Fix the sentence: "${p.sentence}"`,
      };
    }

    case "checklist": {
      const items = checklistItems(p);
      const done = state.checklist.filter(Boolean).length;
      const ok = done === items.length;
      return {
        ok,
        score: Math.round((done / items.length) * 100),
        feedback: ok ? "All steps complete!" : `Check off all ${items.length} steps.`,
      };
    }

    case "science-inquiry": {
      const ok =
        state.textResponse.trim().length >= 5 ||
        state.selectedOption.length > 0 ||
        state.checklist.every(Boolean);
      return {
        ok,
        score: ok ? 100 : 35,
        feedback: ok ? "Great scientific thinking!" : "Record your observation or answer.",
      };
    }

    default:
      return { ok: false, score: 0, feedback: "Unknown template." };
  }
}

export function templateHint(state: TemplateBoardState): string {
  switch (state.labId) {
    case "word-problem":
      return "Read the story carefully. What operation will help?";
    case "checklist":
      return "Tap each step when you finish it.";
    case "writing-frame":
      return "Fill in every writing part before you check.";
    case "reading-response":
      return "Use details from the passage in your answer.";
    default:
      return "Try your best, then tap Check Answer.";
  }
}
