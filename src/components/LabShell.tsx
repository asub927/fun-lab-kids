import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CelebrationBurst } from "./CelebrationBurst";
import { hasStrategyContent, parseStrategyParams, StrategyPanel } from "./StrategyPanel";
import { useApp } from "../context/AppContext";
import { pickBuddyLine, pickStreakLine } from "../services/characterDialogue";
import { loadProgress } from "../services/progress";
import { getPetSpeciesId } from "../services/pet";

type LabShellProps = {
  title: string;
  children: React.ReactNode;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function focusPrimaryAnswerInput() {
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

  const root = document.querySelector(".lab-board");
  if (!root) return;

  const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    [
      ".answer-field input:not([type='hidden'])",
      ".answer-field textarea",
      "input:not([type='checkbox']):not([type='radio']):not([type='hidden'])",
      "textarea",
    ].join(", "),
  );
  if (!input) return;

  input.focus({ preventScroll: true });
  input.scrollIntoView({ block: "nearest", inline: "nearest" });
}

export function LabShell({ title, children }: LabShellProps) {
  const {
    activeStandard,
    boardState,
    lastCheck,
    lastCelebration,
    clearCelebration,
    questionIndex,
    questionTotal,
    smartScore,
    correctCount,
    questionLevel,
    canAdvanceQuestion,
    canGoPreviousQuestion,
    undo,
    runCheck,
    revealAnswer,
    advanceQuestion,
    previousQuestion,
    resetBoard,
  } = useApp();

  const store = loadProgress();
  const hasQuestionPager = questionTotal > 1;
  const lastCheckKey = lastCheck
    ? `${lastCheck.ok ? "ok" : "miss"}:${lastCheck.feedback}`
    : "none";

  const backTo =
    activeStandard?.subject === "math"
      ? "/grade-2/math"
      : activeStandard?.subject === "ela"
        ? "/grade-2/ela"
        : activeStandard?.subject === "science"
          ? "/grade-2/science"
          : "/grade-2";

  const handleReset = () => {
    if (window.confirm("Reset this question?")) resetBoard();
  };

  useEffect(() => {
    if (!hasQuestionPager) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousQuestion();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        advanceQuestion();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasQuestionPager, previousQuestion, advanceQuestion]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      focusPrimaryAnswerInput();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [questionIndex, activeStandard?.code, lastCheckKey]);

  const resultClass = lastCheck
    ? lastCheck.ok
      ? "ok"
      : lastCheck.revealed
        ? "reveal"
        : "warn"
    : "";

  const showCelebration =
    lastCelebration && (lastCelebration.isNewMastery || lastCelebration.newAchievements.length > 0);

  const streakLine =
    lastCelebration && lastCelebration.streakDays > 1
      ? activeStandard?.subject
        ? pickStreakLine(activeStandard.subject, store, lastCelebration.streakDays)
        : pickBuddyLine(
            getPetSpeciesId(),
            "streak",
            store,
            { streak: lastCelebration.streakDays },
            lastCelebration.streakDays,
          )
      : null;

  const strategy = useMemo(() => {
    if (!boardState || !("params" in boardState) || !boardState.params) return null;
    const parsed = parseStrategyParams(boardState.params);
    return hasStrategyContent(parsed) ? parsed : null;
  }, [boardState]);

  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    setHelpOpen(false);
  }, [questionIndex, activeStandard?.code, strategy?.panelKey]);

  return (
    <div className={`lab-layout ${strategy ? "lab-layout--with-help" : ""} ${helpOpen ? "lab-layout--help-open" : ""}`}>
      <article className="lab-shell lab-work-card">
        <header className="lab-header">
          <div className="lab-header-meta">
            <Link to={backTo} className="back-link">
              ← Grade 2 Hub
            </Link>
            <h1 className="lab-title">{title}</h1>
            {activeStandard && (
              <p className="standard-chip" title={activeStandard.text}>
                <span translate="no">{activeStandard.code}</span>
              </p>
            )}
            {hasQuestionPager && (
              <p className="practice-stats" role="status">
                Question {questionIndex + 1}/{questionTotal} · L{questionLevel} · Score{" "}
                {smartScore} · Correct {correctCount}
              </p>
            )}
          </div>
          <div className="lab-actions" role="toolbar" aria-label="Board actions">
            <button type="button" className="btn secondary" onClick={undo}>
              Undo
            </button>
            <button type="button" className="btn primary" onClick={() => runCheck()}>
              Check Answer
            </button>
            <button type="button" className="btn hint" onClick={() => revealAnswer()}>
              Show Answer
            </button>
            <button type="button" className="btn danger" onClick={handleReset}>
              Reset Board
            </button>
          </div>
        </header>

        {showCelebration && lastCelebration && (
          <div className="mastery-panel" role="status" aria-live="polite">
            <CelebrationBurst />
            <div className="mastery-panel-body">
              <p className="mastery-panel-heading">
                {lastCelebration.isNewMastery ? "Skill mastered!" : "Badge unlocked!"}
              </p>
              {lastCelebration.xpEarned > 0 && (
                <p className="mastery-xp">+{lastCelebration.xpEarned} Fun Points</p>
              )}
              {lastCelebration.newAchievements.length > 0 && (
                <ul className="mastery-achievements">
                  {lastCelebration.newAchievements.map((achievement) => (
                    <li key={achievement.id}>
                      {achievement.icon} {achievement.title}
                    </li>
                  ))}
                </ul>
              )}
              {streakLine && <p className="mastery-streak">{streakLine}</p>}
            </div>
            <button type="button" className="btn secondary mastery-dismiss" onClick={clearCelebration}>
              Keep Going
            </button>
          </div>
        )}

        <div className="lab-work-stage">
          <div className="lab-board">{children}</div>

          {lastCheck && (
            <div
              className={`check-result ${resultClass} ${lastCheck.ok ? "check-result--ok" : ""}`}
              role="status"
              aria-live="polite"
            >
              <div className="check-result-main">
                <span>{lastCheck.feedback}</span>
                {lastCelebration && lastCelebration.xpEarned > 0 && !showCelebration && (
                  <span className="inline-xp">+{lastCelebration.xpEarned} Fun Points</span>
                )}
              </div>
            </div>
          )}
        </div>

        {hasQuestionPager && (
          <nav className="question-nav lab-work-footer" aria-label="Question navigation">
            <button
              type="button"
              className="btn secondary question-nav-btn"
              onClick={previousQuestion}
              disabled={!canGoPreviousQuestion}
              aria-label="Previous question"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <p className="question-nav-status" aria-live="polite">
              Question <span className="tabular">{questionIndex + 1}</span> of{" "}
              <span className="tabular">{questionTotal}</span>
            </p>
            <button
              type="button"
              className="btn primary question-nav-btn"
              onClick={advanceQuestion}
              disabled={!canAdvanceQuestion}
              aria-label="Next question"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </nav>
        )}
      </article>

      {strategy && (
        <aside className="lab-help-card" aria-label="Strategy help">
            <StrategyPanel
              key={strategy.panelKey}
              title={strategy.title}
              steps={strategy.steps}
              sourceLabel={strategy.sourceLabel}
              sourceUrl={strategy.sourceUrl}
              videoUrl={strategy.videoUrl}
              videoTitle={strategy.videoTitle}
              videoProvider={strategy.videoProvider}
              layout="rail"
              open={helpOpen}
              onOpenChange={setHelpOpen}
            />
        </aside>
      )}
    </div>
  );
}
