import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CelebrationBurst } from "./CelebrationBurst";
import { CharacterGuide } from "./CharacterGuide";
import { useApp } from "../context/AppContext";
import { loadProgress } from "../services/progress";
import {
  pickAchievementLine,
  pickLabLine,
  pickMasteryLine,
  pickStreakLine,
} from "../services/characterDialogue";

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

export function LabShell({ title, children }: LabShellProps) {
  const {
    activeStandard,
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
  const subject = activeStandard?.subject ?? "math";
  const checkCount = store.gamification.lifetimeChecks;
  const hasQuestionPager = questionTotal > 1;

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

  const resultClass = lastCheck
    ? lastCheck.ok
      ? "ok"
      : lastCheck.revealed
        ? "reveal"
        : "warn"
    : "";

  const showCelebration =
    lastCelebration && (lastCelebration.isNewMastery || lastCelebration.newAchievements.length > 0);

  const celebrationLine = (() => {
    if (!lastCelebration) return "";
    if (lastCelebration.isNewMastery) {
      return pickMasteryLine(subject, store, checkCount);
    }
    const first = lastCelebration.newAchievements[0];
    if (first) {
      return pickAchievementLine(subject, store, first, checkCount);
    }
    return pickMasteryLine(subject, store, checkCount);
  })();

  const streakLine =
    lastCelebration && lastCelebration.streakDays > 1
      ? pickStreakLine(subject, store, lastCelebration.streakDays)
      : null;

  const inlineLine = lastCheck
    ? lastCheck.ok
      ? pickLabLine(subject, "labCorrect", store, checkCount)
      : pickLabLine(subject, "labEncourage", store, checkCount)
    : "";

  const inlineMood = lastCheck?.ok ? "happy" : "thinking";

  return (
    <article className="lab-shell">
      <header className="lab-header">
        <div>
          <Link to={backTo} className="back-link">
            ← Grade 2 Hub
          </Link>
          <h1 className="lab-title">{title}</h1>
          {activeStandard && (
            <p className="standard-chip">
              <span translate="no">{activeStandard.code}</span>{" "}
              {activeStandard.text.slice(0, 120)}
              {activeStandard.text.length > 120 ? "…" : ""}
            </p>
          )}
          {hasQuestionPager && (
            <div className="practice-stats" role="status">
              <p className="question-progress">
                Question {questionIndex + 1} of {questionTotal} · Level {questionLevel}
              </p>
              <p className="smart-score">
                Smart Score: {smartScore} · Correct: {correctCount}
              </p>
            </div>
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
          <CharacterGuide subject={subject} line={celebrationLine} mood="cheering" live />
          <div className="mastery-panel-body">
            <p className="mastery-panel-heading">
              {lastCelebration.isNewMastery ? "Skill mastered!" : "Badge unlocked!"}
            </p>
            {lastCelebration.xpEarned > 0 && (
              <p className="mastery-xp">+{lastCelebration.xpEarned} Island Points</p>
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

      {lastCheck && (
        <div
          className={`check-result ${resultClass} ${lastCheck.ok ? "check-result--ok" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span>{lastCheck.feedback}</span>
          {lastCelebration && lastCelebration.xpEarned > 0 && !showCelebration && (
            <span className="inline-xp">+{lastCelebration.xpEarned} Island Points</span>
          )}
          {!showCelebration && (
            <div className="character-lab-reaction">
              <CharacterGuide
                subject={subject}
                line={inlineLine}
                mood={inlineMood}
                compact
                live
              />
            </div>
          )}
        </div>
      )}

      <div className="lab-board">{children}</div>

      {hasQuestionPager && (
        <nav className="question-nav" aria-label="Question navigation">
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
          <p className="question-nav-hint">Use ← → arrow keys to move between questions</p>
        </nav>
      )}
    </article>
  );
}
