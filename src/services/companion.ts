import { resolveCurriculumStrategy } from "../data/curriculumStrategies";
import { listGrade2Standards } from "../data/standards";
import type { BoardState, Standard, Subject } from "../types";
import { pickHubGreetingLine, pickLabLine, pickScoreboardHintLine } from "./characterDialogue";
import { loadProgress, type ProgressStore } from "./progress";
import { getScoreboardSummary } from "./progressStats";

export type CompanionAction = "hint" | "next" | "cheer";

export type CompanionSuggestion = {
  line: string;
  link?: string;
  linkLabel?: string;
};

export type CompanionContext = {
  pathname: string;
  store: ProgressStore;
  activeStandard: Standard | null;
  boardState: BoardState | null;
  lastCheckOk: boolean | null;
  questionIndex: number;
  questionTotal: number;
  smartScore: number;
  seed?: number;
};

export function subjectFromPath(pathname: string): Subject {
  if (
    pathname.startsWith("/grade-2/ela") ||
    pathname.startsWith("/lab/W.") ||
    pathname.startsWith("/lab/RL.") ||
    pathname.startsWith("/lab/RI.") ||
    pathname.startsWith("/lab/RF.") ||
    pathname.startsWith("/lab/SL.") ||
    pathname.startsWith("/lab/L.")
  ) {
    return "ela";
  }
  if (pathname.startsWith("/grade-2/science") || pathname.startsWith("/lab/2.")) return "science";
  if (pathname.startsWith("/grade-2/math") || pathname.startsWith("/lab/NC.")) return "math";
  return "math";
}

function boardParams(boardState: BoardState | null): Record<string, unknown> {
  if (!boardState) return {};
  if ("params" in boardState && boardState.params) {
    return boardState.params as Record<string, unknown>;
  }
  return {};
}

export function getCompanionHint(ctx: CompanionContext): CompanionSuggestion {
  const subject = ctx.activeStandard?.subject ?? subjectFromPath(ctx.pathname);

  if (ctx.activeStandard) {
    const strategy = resolveCurriculumStrategy(
      ctx.activeStandard.code,
      ctx.activeStandard.activityType,
      boardParams(ctx.boardState),
    );
    const step = strategy?.strategySteps?.[0];
    if (step) {
      return { line: step };
    }
    if (strategy?.strategy) {
      return { line: `Start here: ${strategy.strategy}` };
    }
    return {
      line: "Read the question slowly. Circle the important words, then try your first idea.",
    };
  }

  const summary = getScoreboardSummary(ctx.store);
  const weakest = [...summary.subjectStats].sort((a, b) => a.percent - b.percent)[0];
  if (weakest && weakest.percent < 100) {
    const label =
      weakest.subject === "math"
        ? "Math Island"
        : weakest.subject === "ela"
          ? "Word Cove"
          : "Discovery Bay";
    return {
      line: `${label} could use a visit. Pick a skill and I will walk you through it.`,
      link: `/grade-2/${weakest.subject}`,
      linkLabel: `Open ${label}`,
    };
  }

  return {
    line: pickHubGreetingLine(subject, ctx.store, ctx.seed ?? 0),
  };
}

export function getCompanionNextStep(ctx: CompanionContext): CompanionSuggestion {
  const subject = ctx.activeStandard?.subject ?? subjectFromPath(ctx.pathname);
  const standards = listGrade2Standards(subject);
  const inProgress = standards.find((standard) => {
    const progress = ctx.store.progress[standard.code];
    return progress && !progress.completed && (progress.smartScore ?? 0) > 0;
  });
  const fresh = standards.find((standard) => !ctx.store.progress[standard.code]?.completed);

  const target = inProgress ?? fresh;
  if (target) {
    const progress = ctx.store.progress[target.code];
    const status = progress?.completed
      ? "mastered"
      : progress?.smartScore
        ? `Smart Score ${progress.smartScore}`
        : "not started yet";
    return {
      line: `Try ${target.code} next. It is ${status}.`,
      link: `/lab/${encodeURIComponent(target.code)}`,
      linkLabel: "Open skill",
    };
  }

  const summary = getScoreboardSummary(ctx.store);
  if (summary.nextAchievement) {
    return {
      line: pickScoreboardHintLine(ctx.store, summary.nextAchievement, ctx.seed ?? 0),
      link: "/grade-2/progress",
      linkLabel: "View progress",
    };
  }

  return {
    line: "You mastered every skill in this subject. Explore another island!",
    link: "/grade-2",
    linkLabel: "Grade 2 Hub",
  };
}

export function getCompanionCheer(ctx: CompanionContext): CompanionSuggestion {
  const subject = ctx.activeStandard?.subject ?? subjectFromPath(ctx.pathname);
  const checkCount = ctx.store.gamification.lifetimeChecks;

  if (ctx.lastCheckOk === true) {
    return { line: pickLabLine(subject, "labCorrect", ctx.store, checkCount) };
  }
  if (ctx.lastCheckOk === false) {
    return { line: pickLabLine(subject, "labEncourage", ctx.store, checkCount) };
  }

  const summary = getScoreboardSummary(ctx.store);
  if (summary.currentStreak > 1) {
    return {
      line: `You are on a ${summary.currentStreak} day streak. Keep showing up and the points will stack up!`,
    };
  }

  return { line: pickHubGreetingLine(subject, ctx.store, ctx.seed ?? 0) };
}

export function getCompanionGreeting(ctx: CompanionContext): CompanionSuggestion {
  const subject = ctx.activeStandard?.subject ?? subjectFromPath(ctx.pathname);
  const name = ctx.store.profile.name?.trim() || "friend";

  if (ctx.pathname.startsWith("/lab/") && ctx.activeStandard) {
    const questionLabel =
      ctx.questionTotal > 1
        ? ` Question ${ctx.questionIndex + 1} of ${ctx.questionTotal}.`
        : "";
    const scoreLabel = ctx.smartScore > 0 ? ` Smart Score: ${ctx.smartScore}.` : "";
    return {
      line: `Hi ${name}! I am here to help with ${ctx.activeStandard.code}.${questionLabel}${scoreLabel} Tap a button if you want a hint.`,
    };
  }

  if (ctx.pathname.startsWith("/grade-2/progress")) {
    const summary = getScoreboardSummary(ctx.store);
    return {
      line: `${name}, you have ${summary.totalXp} Island Points and ${summary.mastered} mastered skills. Ask me what to try next!`,
    };
  }

  if (ctx.pathname.startsWith("/grade-2")) {
    return {
      line: pickHubGreetingLine(subject, ctx.store, ctx.seed ?? 0),
    };
  }

  return {
    line: `Hi ${name}! I am your island companion. I can give hints, suggest skills, and cheer you on.`,
  };
}

export function respondToCompanionAction(
  action: CompanionAction,
  ctx: CompanionContext,
): CompanionSuggestion {
  switch (action) {
    case "hint":
      return getCompanionHint(ctx);
    case "next":
      return getCompanionNextStep(ctx);
    case "cheer":
      return getCompanionCheer(ctx);
  }
}

export function buildCompanionContext(
  pathname: string,
  overrides: Partial<CompanionContext> = {},
): CompanionContext {
  return {
    pathname,
    store: loadProgress(),
    activeStandard: null,
    boardState: null,
    lastCheckOk: null,
    questionIndex: 0,
    questionTotal: 0,
    smartScore: 0,
    ...overrides,
  };
}
