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
import { hasWebMCP } from "../webmcp/register";

type LabShellProps = {
  title: string;
  children: React.ReactNode;
};

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
    undo,
    runCheck,
    revealAnswer,
    advanceQuestion,
    resetBoard,
  } = useApp();

  const store = loadProgress();
  const subject = activeStandard?.subject ?? "math";
  const checkCount = store.gamification.lifetimeChecks;

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

  const resultClass = lastCheck
    ? lastCheck.ok
      ? "ok"
      : lastCheck.revealed
        ? "reveal"
        : "warn"
    : "";

  const showCelebration = lastCelebration && (lastCelebration.isNewMastery || lastCelebration.newAchievements.length > 0);

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

  const inlineMood = lastCheck?.ok ? "cheering" : "thinking";

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
          {questionTotal > 1 && (
            <div className="practice-stats" role="status">
              <p className="question-progress">
                Question {questionIndex + 1} of {questionTotal} · Level {questionLevel}
              </p>
              <p className="smart-score">Smart Score: {smartScore} · Correct: {correctCount}</p>
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
          <button type="button" className="btn secondary" onClick={() => revealAnswer()}>
            Show Answer
          </button>
          {canAdvanceQuestion && (
            <button type="button" className="btn primary" onClick={advanceQuestion}>
              Next Question →
            </button>
          )}
          <button type="button" className="btn danger" onClick={handleReset}>
            Reset Board
          </button>
        </div>
      </header>

      {hasWebMCP() && (
        <p className="agent-ready" role="status">
          WebMCP tools are active. Your agent can use this board.
        </p>
      )}

      {showCelebration && lastCelebration && (
        <div className="mastery-panel" role="status" aria-live="polite">
          <CelebrationBurst withBalloons />
          <CharacterGuide
            subject={subject}
            line={celebrationLine}
            mood="cheering"
            live
          />
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
            Keep going
          </button>
        </div>
      )}

      {lastCheck && (
        <div
          className={`check-result ${resultClass} ${lastCheck.ok ? "check-result--ok" : ""}`}
          role="status"
          aria-live="polite"
        >
          {lastCheck.ok && !showCelebration && <CelebrationBurst withBalloons />}
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
    </article>
  );
}
