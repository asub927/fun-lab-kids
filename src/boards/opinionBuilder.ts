import type { CheckResult, OpinionState, SentencePart } from "../types";

export function createOpinionState(): OpinionState {
  return {
    labId: "opinion-builder",
    topic: "",
    opinion: "",
    reasons: [],
    linkingWords: [],
    pendingRevision: null,
  };
}

const LINKING_WORDS = new Set([
  "because",
  "also",
  "for example",
  "first",
  "next",
  "finally",
  "and",
  "so",
]);

export function applyOpinionAction(
  state: OpinionState,
  action: Record<string, unknown>,
): OpinionState {
  switch (action.action) {
    case "place_sentence_part": {
      const part = action.part as SentencePart;
      const text = String(action.text ?? "").trim();
      if (!text) return state;
      if (part === "topic") return { ...state, topic: text };
      if (part === "opinion") return { ...state, opinion: text };
      if (part === "closing") return state;
      if (part === "reason") return { ...state, reasons: [...state.reasons, text] };
      if (part === "linking") {
        return {
          ...state,
          linkingWords: [...state.linkingWords, text],
        };
      }
      return state;
    }
    case "add_reason": {
      const text = String(action.text ?? "").trim();
      if (!text) return state;
      return { ...state, reasons: [...state.reasons, text] };
    }
    case "insert_linking_word": {
      const word = String(action.word ?? "").trim().toLowerCase();
      if (!word) return state;
      return { ...state, linkingWords: [...state.linkingWords, word] };
    }
    case "read_aloud_preview":
      return state;
    case "accept_revision": {
      if (!state.pendingRevision) return state;
      return {
        ...state,
        opinion: state.pendingRevision,
        pendingRevision: null,
      };
    }
    case "reject_revision":
      return { ...state, pendingRevision: null };
    default:
      return state;
  }
}

export function proposeRevision(state: OpinionState, revision: string): OpinionState {
  return { ...state, pendingRevision: revision.trim() };
}

export function buildOpinionParagraph(state: OpinionState): string {
  const parts: string[] = [];
  if (state.topic) parts.push(`Topic: ${state.topic}.`);
  if (state.opinion) parts.push(state.opinion);
  state.reasons.forEach((reason, i) => {
    const link = state.linkingWords[i] ?? "because";
    parts.push(`${link.charAt(0).toUpperCase()}${link.slice(1)}, ${reason}.`);
  });
  return parts.join(" ");
}

export function checkOpinion(state: OpinionState): CheckResult {
  const missing: string[] = [];
  if (!state.topic.trim()) missing.push("topic");
  if (!state.opinion.trim()) missing.push("opinion");
  if (state.reasons.length < 2) missing.push("at least two reasons");
  if (state.linkingWords.length < 1) missing.push("a linking word");

  if (missing.length > 0) {
    return {
      ok: false,
      score: Math.max(0, 100 - missing.length * 20),
      feedback: `Add: ${missing.join(", ")}.`,
    };
  }

  const hasValidLink = state.linkingWords.some((w) =>
    LINKING_WORDS.has(w.toLowerCase()),
  );

  if (!hasValidLink) {
    return {
      ok: false,
      score: 70,
      feedback: "Try a linking word like because, also, or for example.",
    };
  }

  return {
    ok: true,
    score: 100,
    feedback: "Your opinion paragraph has a topic, opinion, reasons, and linking words!",
  };
}
