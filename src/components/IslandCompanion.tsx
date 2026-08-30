import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getCharacterBySubject } from "../data/characters";
import {
  buildCompanionContext,
  getCompanionGreeting,
  respondToCompanionAction,
  subjectFromPath,
  type CompanionAction,
  type CompanionSuggestion,
} from "../services/companion";
import { CharacterAvatar } from "./CharacterAvatar";

const ACTIONS: { id: CompanionAction; label: string }[] = [
  { id: "hint", label: "Give me a hint" },
  { id: "next", label: "What should I try?" },
  { id: "cheer", label: "Cheer me on!" },
];

export function IslandCompanion() {
  const { pathname } = useLocation();
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState<CompanionSuggestion | null>(null);
  const [actionSeed, setActionSeed] = useState(0);

  const subject = app.activeStandard?.subject ?? subjectFromPath(pathname);
  const character = getCharacterBySubject(subject);

  const context = useMemo(
    () =>
      buildCompanionContext(pathname, {
        activeStandard: app.activeStandard,
        boardState: app.boardState,
        lastCheckOk: app.lastCheck ? app.lastCheck.ok : null,
        questionIndex: app.questionIndex,
        questionTotal: app.questionTotal,
        smartScore: app.smartScore,
        seed: actionSeed,
      }),
    [
      pathname,
      app.activeStandard,
      app.boardState,
      app.lastCheck,
      app.questionIndex,
      app.questionTotal,
      app.smartScore,
      actionSeed,
    ],
  );

  const greeting = useMemo(() => getCompanionGreeting(context), [context]);

  useEffect(() => {
    setReply(null);
    setActionSeed(0);
  }, [pathname, app.questionIndex, app.activeStandard?.code]);

  const handleAction = useCallback(
    (action: CompanionAction) => {
      setActionSeed((seed) => seed + 1);
      setReply(respondToCompanionAction(action, { ...context, seed: actionSeed + 1 }));
    },
    [context, actionSeed],
  );

  const display = reply ?? greeting;

  return (
    <div className={`island-companion ${open ? "is-open" : ""}`}>
      {open && (
        <section
          id="island-companion-panel"
          className={`island-companion-panel ${character.accentClass}`}
          aria-label={`${character.name} companion`}
        >
          <header className="island-companion-header">
            <CharacterAvatar subject={subject} mood={reply ? "thinking" : "happy"} size="compact" />
            <div>
              <p className="island-companion-name">{character.name}</p>
              <p className="island-companion-role">Island companion</p>
            </div>
            <button
              type="button"
              className="island-companion-close"
              onClick={() => setOpen(false)}
              aria-label="Close companion"
            >
              ×
            </button>
          </header>

          <div className="island-companion-speech" role="status" aria-live="polite">
            <p key={display.line}>{display.line}</p>
            {display.link && display.linkLabel && (
              <Link to={display.link} className="island-companion-link" onClick={() => setOpen(false)}>
                {display.linkLabel} →
              </Link>
            )}
          </div>

          <div className="island-companion-actions" role="group" aria-label="Companion actions">
            {ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                className="island-companion-action"
                onClick={() => handleAction(action.id)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <button
        type="button"
        className={`island-companion-toggle ${character.accentClass}`}
        aria-expanded={open}
        aria-controls="island-companion-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <CharacterAvatar subject={subject} mood={open ? "happy" : "idle"} size="compact" />
        <span className="island-companion-toggle-label">
          {open ? "Hide companion" : "Ask companion"}
        </span>
      </button>
    </div>
  );
}
