import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { listStandards, findStandard } from "../data/standards";
import type { LabId } from "../types";

const CURRICULUM_TOOLS = [
  "list_subjects",
  "list_grades",
  "list_standards",
  "get_standard",
  "search_standards",
  "set_active_standard",
  "get_progress",
] as const;

const BOARD_TOOLS = [
  "get_board_state",
  "apply_board_action",
  "undo",
  "run_check",
  "request_hint",
  "ask_guiding_question",
  "reveal_solution",
  "reset_board",
  "suggest_revision",
] as const;

function jsonSchema(props: Record<string, unknown>, required?: string[]) {
  return {
    type: "object",
    properties: props,
    required: required ?? Object.keys(props),
    additionalProperties: false,
  };
}

export function useWebMCP(activeLabId: LabId | null) {
  const app = useApp();
  const registeredRef = useRef<string[]>([]);

  useEffect(() => {
    const mc = document.modelContext;
    if (!mc?.registerTool) return;

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
      name: string,
      description: string,
      inputSchema: Record<string, unknown>,
      execute: (input: Record<string, unknown>) => Promise<unknown> | unknown,
      readOnly = false,
    ) => {
      await mc.registerTool({
        name,
        description,
        inputSchema,
        annotations: readOnly ? { readOnlyHint: true } : undefined,
        execute: async (input) => {
          try {
            const result = await execute(input);
            app.logToolCall({
              tool: name,
              argsSummary: JSON.stringify(input).slice(0, 120),
              ok: true,
            });
            return result;
          } catch (err) {
            const message = err instanceof Error ? err.message : "Tool failed";
            app.logToolCall({
              tool: name,
              argsSummary: JSON.stringify(input).slice(0, 120),
              ok: false,
              message,
            });
            throw err;
          }
        },
      });
      registeredRef.current.push(name);
    };

    void (async () => {
      await unregisterAll();

      await register(
        "list_subjects",
        "List available subjects",
        jsonSchema({}),
        () => ["math", "ela", "science"],
        true,
      );

      await register(
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
        "get_standard",
        "Get full standard details by code",
        jsonSchema({ code: { type: "string" } }),
        (input) => findStandard(String(input.code)) ?? { error: "Standard not found" },
        true,
      );

      await register(
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
          app.setActiveLab(lab, standard.code);
          return { ok: true, lab, standard: standard.code };
        },
      );

      await register(
        "get_progress",
        "Session-local progress snapshot",
        jsonSchema({}),
        () => ({
          lastCheck: app.lastCheck,
          activeStandard: app.activeStandard?.code ?? null,
        }),
        true,
      );

      await register(
        "get_board_state",
        "Get current board state for the active lab",
        jsonSchema({}),
        () => app.getBoardSnapshot() ?? { error: "No active lab" },
        true,
      );

      await register(
        "apply_board_action",
        "Apply an action on the active lab board",
        jsonSchema({
          action: { type: "string" },
        }),
        (input) => {
          const next = app.applyAction(input);
          return next ?? { error: "No active lab" };
        },
      );

      await register(
        "undo",
        "Undo the last board action",
        jsonSchema({}),
        () => {
          app.undo();
          return app.getBoardSnapshot();
        },
      );

      await register(
        "run_check",
        "Check whether the board meets the lab success criteria",
        jsonSchema({}),
        () => app.runCheck() ?? { error: "No active lab" },
      );

      await register(
        "request_hint",
        "Get a non-spoiling hint for the active lab",
        jsonSchema({}),
        () => {
          if (!activeLabId) return { hint: "Open a lab first." };
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
        "ask_guiding_question",
        "Surface a guiding question on the board for the child",
        jsonSchema({ question: { type: "string" } }),
        (input) => ({ displayed: String(input.question) }),
        true,
      );

      await register(
        "reveal_solution",
        "Reveal the answer (requires child confirmation in UI — returns hint only via tool)",
        jsonSchema({}),
        () => ({
          message: "Ask the child to tap Show answer in the app to confirm.",
          requiresConfirm: true,
        }),
        true,
      );

      await register(
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
          "suggest_revision",
          "Suggest a revision to the opinion sentence; child must confirm in UI",
          jsonSchema({ revision: { type: "string" } }),
          (input) => {
            const revision = String(input.revision);
            app.proposeRevision(revision);
            return {
              pendingRevision: revision,
              message: "Child must tap Accept or Reject in the app.",
            };
          },
        );
      }
    })();

    return () => {
      void unregisterAll();
    };
  }, [activeLabId, app]);
}

export function hasWebMCP(): boolean {
  return typeof document !== "undefined" && !!document.modelContext?.registerTool;
}

export const REGISTERED_TOOL_NAMES = [...CURRICULUM_TOOLS, ...BOARD_TOOLS];
