import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { listStandards, findStandard } from "../data/standards";
import type { LabId } from "../types";

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
  },
  ["action"],
  true,
);

type AppApi = ReturnType<typeof useApp>;

function useAppRef(app: AppApi) {
  const ref = useRef(app);
  ref.current = app;
  return ref;
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
          const standards = listStandards({ subject: input.subject as "math" | "ela" | "science" });
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
            subject: input.subject as "math" | "ela" | "science",
            grade: input.grade as 0 | 1 | 2 | 3 | 4 | 5,
          }).map((s) => ({ code: s.code, strand: s.strand, activityType: s.activityType })),
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
        "set_active_standard",
        "Switch to a standard's lab by code (Grade 2 showcase only in P0)",
        jsonSchema({ code: { type: "string" } }),
        (input) => {
          const standard = findStandard(String(input.code));
          if (!standard) return { error: "Standard not found" };
          const map: Record<string, LabId> = {
            "showcase:place-value": "place-value",
            "showcase:opinion-builder": "opinion-builder",
            "showcase:matter-lab": "matter-lab",
          };
          const lab = map[standard.activityType];
          if (!lab) return { error: "No lab for this standard in P0", standard };
          appRef.current.setActiveLab(lab, standard.code);
          return { ok: true, lab, standard: standard.code };
        },
      );

      await register(
        gen,
        "get_progress",
        "Session-local progress snapshot",
        jsonSchema({}),
        () => ({
          lastCheck: appRef.current.lastCheck,
          activeStandard: appRef.current.activeStandard?.code ?? null,
          labId: appRef.current.labId,
        }),
        true,
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
        "Get current board state for the active lab",
        jsonSchema({}),
        () => appRef.current.getBoardSnapshot() ?? { error: "No active lab" },
        true,
      );

      await register(
        gen,
        "apply_board_action",
        "Apply an action on the active lab board (action plus payload fields)",
        BOARD_ACTION_SCHEMA,
        (input) => {
          const next = appRef.current.applyAction(input);
          return next ?? { error: "No active lab" };
        },
      );

      await register(gen, "undo", "Undo the last board action", jsonSchema({}), () => {
        appRef.current.undo();
        return appRef.current.getBoardSnapshot();
      });

      await register(
        gen,
        "run_check",
        "Check whether the board meets the lab success criteria",
        jsonSchema({}),
        () => appRef.current.runCheck() ?? { error: "No active lab" },
      );

      await register(
        gen,
        "request_hint",
        "Get a non-spoiling hint for the active lab",
        jsonSchema({}),
        () => {
          const hints: Record<LabId, string> = {
            "place-value": "Use hundreds, tens, and ones blocks. Group ten ones into a ten.",
            "opinion-builder": "Add a topic, your opinion, two reasons, and a linking word like because.",
            "matter-lab": "Classify each object, heat above 0°C, predict ice becomes liquid.",
          };
          return { hint: hints[activeLabId] };
        },
        true,
      );

      await register(
        gen,
        "ask_guiding_question",
        "Surface a guiding question on the board for the child",
        jsonSchema({ question: { type: "string" } }),
        (input) => ({ displayed: String(input.question) }),
        true,
      );

      await register(
        gen,
        "reveal_solution",
        "Reveal the answer (requires child confirmation in UI)",
        jsonSchema({}),
        () => ({
          message: "Ask the child to tap Show answer in the app to confirm.",
          requiresConfirm: true,
        }),
        true,
      );

      await register(
        gen,
        "reset_board",
        "Reset the board (requires confirmation in UI)",
        jsonSchema({}),
        () => ({
          message: "Ask the child to tap Reset in the app to confirm.",
          requiresConfirm: true,
        }),
        true,
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
