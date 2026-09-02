import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { listStandards, findStandard, listGrade2Standards } from "../data/standards";
import { resolveLabForStandard } from "../data/activities";
import { getProgressSnapshot, loadProgress } from "../services/progress";
import { getScoreboardSummary } from "../services/progressStats";
import { labHint, isShowcaseLab } from "../boards";
import type { LabId, Subject } from "../types";
import { HUMAN_CONFIRM_ACTIONS, getLabGoal, listBoardActionsForLab } from "./boardActions";
import { getRecentAgentEvents } from "./events";
import { getWebMCPPathname, navigateWebMCP } from "./navigation";
import {
  buildLabOverview,
  extractCurrentChallenge,
  extractStrategy,
} from "./safeReads";

function jsonSchema(
  props: Record<string, unknown>,
  required?: string[],
  allowExtra = false,
) {
  return {
    type: "object",
    properties: props,
    required: required ?? Object.keys(props),
    additionalProperties: allowExtra,
  };
}

const BOARD_ACTION_SCHEMA = jsonSchema(
  {
    action: { type: "string" },
    block: { type: "string" },
    value: { type: "number" },
    other: { type: "number" },
    part: { type: "string" },
    text: { type: "string" },
    word: { type: "string" },
    objectId: { type: "string" },
    classification: { type: "string" },
    celsius: { type: "number" },
    state: { type: "string" },
    revision: { type: "string" },
    question: { type: "string" },
    index: { type: "number" },
    field: { type: "string" },
  },
  ["action"],
  true,
);

const SHOWCASE_CODES = ["NC.2.NBT.1", "W.2.1", "2.P.2.1"] as const;

type AppApi = ReturnType<typeof useApp>;

function useAppRef(app: AppApi) {
  const ref = useRef(app);
  ref.current = app;
  return ref;
}

function openLabByCode(code: string) {
  const standard = findStandard(code);
  if (!standard) return { error: "Standard not found", code };
  const resolved = resolveLabForStandard(code);
  if (!resolved) return { error: "No lab for this standard", code };
  const path = `/lab/${encodeURIComponent(code)}`;
  const nav = navigateWebMCP(path);
  if ("error" in nav) return nav;
  return {
    ok: true,
    path,
    labId: resolved.labId,
    standard: code,
    goal: getLabGoal(resolved.labId),
  };
}

function recommendNext(subject?: Subject) {
  const progress = getProgressSnapshot();
  const standards = listGrade2Standards(subject);
  const incomplete = standards.filter((s) => !progress[s.code]?.completed);
  if (incomplete.length === 0) {
    return {
      done: true,
      message: subject
        ? `All Grade 2 ${subject} skills are mastered on this device.`
        : "All Grade 2 skills are mastered on this device.",
      suggestion: null,
    };
  }

  const suggestion = incomplete[0];
  return {
    done: false,
    suggestion: {
      code: suggestion.code,
      subject: suggestion.subject,
      strand: suggestion.strand,
      text: suggestion.text,
      path: `/lab/${encodeURIComponent(suggestion.code)}`,
    },
    remaining: incomplete.length,
  };
}

export function useWebMCPCurriculum() {
  const app = useApp();
  const appRef = useAppRef(app);
  const registeredRef = useRef<string[]>([]);

  useEffect(() => {
    const mc = document.modelContext;
    if (!mc?.registerTool) return;

    let cancelled = false;
    let generation = 0;

    const unregisterAll = async () => {
      for (const name of registeredRef.current) {
        try {
          await mc.unregisterTool(name);
        } catch {
          /* ignore */
        }
      }
      registeredRef.current = [];
    };

    const register = async (
      gen: number,
      name: string,
      description: string,
      inputSchema: Record<string, unknown>,
      execute: (input: Record<string, unknown>) => Promise<unknown> | unknown,
      readOnly = false,
    ) => {
      if (cancelled || gen !== generation) return;
      await mc.registerTool({
        name,
        description,
        inputSchema,
        annotations: readOnly ? { readOnlyHint: true } : undefined,
        execute: async (input) => {
          try {
            const result = await execute(input);
            appRef.current.logToolCall({
              tool: name,
              argsSummary: JSON.stringify(input).slice(0, 120),
              ok: true,
            });
            return result;
          } catch (err) {
            const message = err instanceof Error ? err.message : "Tool failed";
            appRef.current.logToolCall({
              tool: name,
              argsSummary: JSON.stringify(input).slice(0, 120),
              ok: false,
              message,
            });
            throw err;
          }
        },
      });
      if (!cancelled && gen === generation) registeredRef.current.push(name);
    };

    void (async () => {
      generation += 1;
      const gen = generation;
      await unregisterAll();

      await register(gen, "list_subjects", "List available subjects", jsonSchema({}), () =>
        ["math", "ela", "science"],
      true);

      await register(
        gen,
        "list_grades",
        "List grade levels with standards",
        jsonSchema({ subject: { type: "string", enum: ["math", "ela", "science"] } }, ["subject"]),
        (input) => {
          const standards = listStandards({ subject: input.subject as Subject });
          return [...new Set(standards.map((s) => s.grade))].sort();
        },
        true,
      );

      await register(
        gen,
        "list_standards",
        "List standards for a subject and grade",
        jsonSchema({
          subject: { type: "string", enum: ["math", "ela", "science"] },
          grade: { type: "number", minimum: 0, maximum: 5 },
        }),
        (input) =>
          listStandards({
            subject: input.subject as Subject,
            grade: input.grade as 0 | 1 | 2 | 3 | 4 | 5,
          }).map((s) => ({ code: s.code, strand: s.strand, activityType: s.activityType })),
        true,
      );

      await register(
        gen,
        "list_playable_standards",
        "List Grade 2 playable standards with local progress flags",
        jsonSchema({
          subject: { type: "string", enum: ["math", "ela", "science"] },
        }, [], true),
        (input) => {
          const subject = input.subject ? (String(input.subject) as Subject) : undefined;
          const progress = getProgressSnapshot();
          return listGrade2Standards(subject).map((s) => ({
            code: s.code,
            subject: s.subject,
            strand: s.strand,
            text: s.text,
            activityType: s.activityType,
            showcase: (() => {
              const labId = resolveLabForStandard(s.code)?.labId;
              return labId ? isShowcaseLab(labId) : false;
            })(),
            completed: Boolean(progress[s.code]?.completed),
            bestScore: progress[s.code]?.bestScore ?? 0,
            smartScore: progress[s.code]?.smartScore ?? 0,
          }));
        },
        true,
      );

      await register(
        gen,
        "get_standard",
        "Get full standard details by code",
        jsonSchema({ code: { type: "string" } }),
        (input) => findStandard(String(input.code)) ?? { error: "Standard not found" },
        true,
      );

      await register(
        gen,
        "search_standards",
        "Search standards by keyword",
        jsonSchema({ query: { type: "string" } }),
        (input) => {
          const q = String(input.query).toLowerCase();
          return listStandards().filter(
            (s) =>
              s.code.toLowerCase().includes(q) ||
              s.text.toLowerCase().includes(q) ||
              s.strand.toLowerCase().includes(q),
          );
        },
        true,
      );

      await register(
        gen,
        "open_lab",
        "Navigate the shared UI to a Grade 2 lab by standard code (registers board tools)",
        jsonSchema({ code: { type: "string" } }),
        (input) => openLabByCode(String(input.code)),
      );

      await register(
        gen,
        "set_active_standard",
        "Open a standard lab in the UI by code (alias of open_lab — navigates to /lab/:code)",
        jsonSchema({ code: { type: "string" } }),
        (input) => openLabByCode(String(input.code)),
      );

      await register(
        gen,
        "open_showcase",
        "Open a judge showcase lab: place-value, opinion, or matter",
        jsonSchema({
          showcase: {
            type: "string",
            enum: ["place-value", "opinion", "matter", "math", "ela", "science"],
          },
        }),
        (input) => {
          const key = String(input.showcase);
          const map: Record<string, string> = {
            "place-value": "NC.2.NBT.1",
            math: "NC.2.NBT.1",
            opinion: "W.2.1",
            ela: "W.2.1",
            matter: "2.P.2.1",
            science: "2.P.2.1",
          };
          const code = map[key];
          if (!code) {
            return { error: "Unknown showcase", allowed: Object.keys(map) };
          }
          return openLabByCode(code);
        },
      );

      await register(
        gen,
        "get_app_location",
        "Get the child's current route and active lab context",
        jsonSchema({}),
        () => ({
          pathname: getWebMCPPathname(),
          labId: appRef.current.labId,
          activeStandard: appRef.current.activeStandard?.code ?? null,
          guidingQuestion: appRef.current.guidingQuestion,
          pendingConfirm: appRef.current.pendingConfirm,
        }),
        true,
      );

      await register(
        gen,
        "get_progress",
        "Grade 2 progress snapshot (localStorage)",
        jsonSchema({}),
        () => ({
          grade2: listGrade2Standards().map((s) => ({
            code: s.code,
            ...(getProgressSnapshot()[s.code] ?? { completed: false, bestScore: 0 }),
          })),
          activeStandard: appRef.current.activeStandard?.code ?? null,
          labId: appRef.current.labId,
          lastCheck: appRef.current.lastCheck
            ? {
                ok: appRef.current.lastCheck.ok,
                score: appRef.current.lastCheck.score,
                feedback: appRef.current.lastCheck.feedback,
                revealed: appRef.current.lastCheck.revealed,
              }
            : null,
        }),
        true,
      );

      await register(
        gen,
        "get_scoreboard",
        "Gamification scoreboard: Island Points, streak, subject stats, achievements",
        jsonSchema({}),
        () => {
          const summary = getScoreboardSummary(loadProgress());
          return {
            displayName: summary.displayName,
            totalXp: summary.totalXp,
            currentStreak: summary.currentStreak,
            longestStreak: summary.longestStreak,
            mastered: summary.mastered,
            totalStandards: summary.totalStandards,
            averageSmartScore: summary.averageSmartScore,
            lifetimeChecks: summary.lifetimeChecks,
            lifetimeCorrect: summary.lifetimeCorrect,
            subjectStats: summary.subjectStats,
            unlockedAchievements: summary.unlockedAchievements.map((a) => ({
              id: a.id,
              title: a.title,
              description: a.description,
              icon: a.icon,
            })),
            nextAchievement: summary.nextAchievement
              ? {
                  id: summary.nextAchievement.id,
                  title: summary.nextAchievement.title,
                  description: summary.nextAchievement.description,
                }
              : null,
            recentActivity: summary.recentActivity,
          };
        },
        true,
      );

      await register(
        gen,
        "recommend_next_standard",
        "Suggest the next incomplete Grade 2 standard to practice",
        jsonSchema({
          subject: { type: "string", enum: ["math", "ela", "science"] },
        }, [], true),
        (input) =>
          recommendNext(input.subject ? (String(input.subject) as Subject) : undefined),
        true,
      );

      await register(
        gen,
        "get_recent_events",
        "Poll recent agent-relevant UI events (route, check, board, celebration, revision)",
        jsonSchema({
          limit: { type: "number" },
          since: { type: "number", description: "Unix ms — only events after this time" },
        }, [], true),
        (input) => {
          const limit = typeof input.limit === "number" ? input.limit : 20;
          const since = typeof input.since === "number" ? input.since : undefined;
          return { events: getRecentAgentEvents(limit, since) };
        },
        true,
      );

      await register(
        gen,
        "dismiss_celebration",
        "Dismiss the mastery/badge celebration overlay",
        jsonSchema({}),
        () => {
          appRef.current.clearCelebration();
          return { ok: true };
        },
      );
    })();

    return () => {
      cancelled = true;
      generation += 1;
      void unregisterAll();
    };
  }, [appRef]);
}

export function useWebMCPLab(activeLabId: LabId | null) {
  const app = useApp();
  const appRef = useAppRef(app);
  const registeredRef = useRef<string[]>([]);

  useEffect(() => {
    const mc = document.modelContext;
    if (!mc?.registerTool) return;

    let cancelled = false;
    let generation = 0;

    const unregisterAll = async () => {
      for (const name of registeredRef.current) {
        try {
          await mc.unregisterTool(name);
        } catch {
          /* ignore */
        }
      }
      registeredRef.current = [];
    };

    const register = async (
      gen: number,
      name: string,
      description: string,
      inputSchema: Record<string, unknown>,
      execute: (input: Record<string, unknown>) => Promise<unknown> | unknown,
      readOnly = false,
    ) => {
      if (cancelled || gen !== generation) return;
      await mc.registerTool({
        name,
        description,
        inputSchema,
        annotations: readOnly ? { readOnlyHint: true } : undefined,
        execute: async (input) => {
          try {
            const result = await execute(input);
            appRef.current.logToolCall({
              tool: name,
              argsSummary: JSON.stringify(input).slice(0, 120),
              ok: true,
            });
            return result;
          } catch (err) {
            const message = err instanceof Error ? err.message : "Tool failed";
            appRef.current.logToolCall({
              tool: name,
              argsSummary: JSON.stringify(input).slice(0, 120),
              ok: false,
              message,
            });
            throw err;
          }
        },
      });
      if (!cancelled && gen === generation) registeredRef.current.push(name);
    };

    void (async () => {
      generation += 1;
      const gen = generation;
      await unregisterAll();

      if (!activeLabId) return;

      await register(
        gen,
        "get_board_state",
        "Get answer-safe board state for the active lab (spoilers redacted)",
        jsonSchema({}),
        () => appRef.current.getSafeBoardSnapshot() ?? { error: "No active lab" },
        true,
      );

      await register(
        gen,
        "list_board_actions",
        "List valid apply_board_action operations for the active lab",
        jsonSchema({}),
        () => ({
          labId: appRef.current.labId,
          actions: listBoardActionsForLab(appRef.current.labId),
        }),
        true,
      );

      await register(
        gen,
        "get_current_challenge",
        "Kid-visible challenge prompt/passage/options without answer keys",
        jsonSchema({}),
        () => extractCurrentChallenge(appRef.current.boardState),
        true,
      );

      await register(
        gen,
        "get_session_state",
        "Live practice session meters and last feedback (answer-safe)",
        jsonSchema({}),
        () => {
          const last = appRef.current.lastCheck;
          return {
            standardCode: appRef.current.activeStandard?.code ?? null,
            labId: appRef.current.labId,
            questionIndex: appRef.current.questionIndex,
            questionTotal: appRef.current.questionTotal,
            questionLevel: appRef.current.questionLevel,
            smartScore: appRef.current.smartScore,
            correctCount: appRef.current.correctCount,
            canAdvanceQuestion: appRef.current.canAdvanceQuestion,
            canGoPreviousQuestion: appRef.current.canGoPreviousQuestion,
            guidingQuestion: appRef.current.guidingQuestion,
            pendingConfirm: appRef.current.pendingConfirm,
            lastCheck: last
              ? {
                  ok: last.ok,
                  score: last.score,
                  feedback: last.feedback,
                  revealed: last.revealed,
                }
              : null,
            challenge: extractCurrentChallenge(appRef.current.boardState),
          };
        },
        true,
      );

      await register(
        gen,
        "get_strategy",
        "Coaching strategy steps for the current question (no answers)",
        jsonSchema({}),
        () => extractStrategy(appRef.current.boardState),
        true,
      );

      await register(
        gen,
        "get_lab_overview",
        "One-shot lab goal plus allowed board actions",
        jsonSchema({}),
        () =>
          buildLabOverview(
            appRef.current.labId,
            appRef.current.activeStandard?.code ?? null,
          ),
        true,
      );

      await register(
        gen,
        "apply_board_action",
        "Apply an action on the active lab board (action plus payload fields)",
        BOARD_ACTION_SCHEMA,
        (input) => {
          const action = String(input.action ?? "");
          if (HUMAN_CONFIRM_ACTIONS.has(action)) {
            return {
              error: "This action requires child confirmation in the UI",
              action,
              hint:
                action === "compose_number"
                  ? "Use reveal_solution so the child can confirm Show Answer."
                  : "Ask the child to Accept or Reject the revision in the app.",
            };
          }
          const next = appRef.current.applyAction(input);
          return next
            ? (appRef.current.getSafeBoardSnapshot() ?? { ok: true })
            : { error: "No active lab" };
        },
      );

      await register(gen, "undo", "Undo the last board action", jsonSchema({}), () => {
        appRef.current.undo();
        return appRef.current.getSafeBoardSnapshot();
      });

      await register(
        gen,
        "run_check",
        "Check whether the board meets the lab success criteria",
        jsonSchema({}),
        () => {
          const result = appRef.current.runCheck();
          if (!result) return { error: "No active lab" };
          return {
            ok: result.ok,
            score: result.score,
            feedback: result.feedback,
            revealed: result.revealed,
          };
        },
      );

      await register(
        gen,
        "next_question",
        "Advance to the next question in a multi-question practice set",
        jsonSchema({}),
        () => {
          if (!appRef.current.canAdvanceQuestion) {
            return {
              error: "Cannot advance",
              questionIndex: appRef.current.questionIndex,
              questionTotal: appRef.current.questionTotal,
            };
          }
          const nextIndex = appRef.current.questionIndex + 1;
          const questionTotal = appRef.current.questionTotal;
          appRef.current.advanceQuestion();
          return {
            ok: true,
            questionIndex: nextIndex,
            questionTotal,
            message: `Advanced to question ${nextIndex + 1} of ${questionTotal}. Call get_current_challenge for the new prompt.`,
          };
        },
      );

      await register(
        gen,
        "request_hint",
        "Get a non-spoiling hint for the active lab",
        jsonSchema({}),
        () => ({ hint: labHint(appRef.current.boardState) }),
        true,
      );

      await register(
        gen,
        "ask_guiding_question",
        "Show a guiding/Socratic question on the shared board for the child",
        jsonSchema({ question: { type: "string" } }),
        (input) => {
          const question = String(input.question ?? "").trim();
          if (!question) return { error: "question is required" };
          appRef.current.setGuidingQuestion(question);
          return { displayed: true, question };
        },
      );

      await register(
        gen,
        "reveal_solution",
        "Request Show Answer — child must confirm in the UI",
        jsonSchema({}),
        () => {
          appRef.current.requestConfirm("reveal");
          return {
            requiresConfirm: true,
            message: "Ask the child to tap Confirm Show Answer in the app.",
          };
        },
      );

      await register(
        gen,
        "reset_board",
        "Request Reset Board — child must confirm in the UI",
        jsonSchema({}),
        () => {
          appRef.current.requestConfirm("reset");
          return {
            requiresConfirm: true,
            message: "Ask the child to tap Confirm Reset in the app.",
          };
        },
      );

      if (activeLabId === "opinion-builder") {
        await register(
          gen,
          "suggest_revision",
          "Suggest a revision to the opinion sentence; child must confirm in UI",
          jsonSchema({ revision: { type: "string" } }),
          (input) => {
            const revision = String(input.revision);
            appRef.current.proposeRevision(revision);
            return {
              pendingRevision: revision,
              message: "Child must tap Accept or Reject in the app.",
            };
          },
        );
      }
    })();

    return () => {
      cancelled = true;
      generation += 1;
      void unregisterAll();
    };
  }, [activeLabId, appRef]);
}

/** @deprecated use useWebMCPCurriculum + useWebMCPLab */
export function useWebMCP(activeLabId: LabId | null) {
  useWebMCPCurriculum();
  useWebMCPLab(activeLabId);
}

export function hasWebMCP(): boolean {
  return typeof document !== "undefined" && !!document.modelContext?.registerTool;
}

export { SHOWCASE_CODES };
