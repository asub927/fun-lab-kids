import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
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
          WebMCP tools are active — your agent can use this board.
        </p>
      )}

      {showCelebration && lastCelebration && (
        <div className="mastery-panel" role="status" aria-live="polite">
          <div className="island-stamp" aria-hidden="true">
            <div className="island-stamp-inner">
              <span className="island-stamp-emoji">🏝</span>
              <span className="island-stamp-label">
                {lastCelebration.isNewMastery ? "Standard mastered!" : "Achievement unlocked!"}
              </span>
            </div>
          </div>
          <div className="mastery-panel-body">
            {lastCelebration.isNewMastery && <p>You mastered this skill. Great job!</p>}
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
            {lastCelebration.streakDays > 1 && (
              <p className="mastery-streak">🔥 {lastCelebration.streakDays}-day streak</p>
            )}
          </div>
          <button type="button" className="btn secondary mastery-dismiss" onClick={clearCelebration}>
            Keep going
          </button>
        </div>
      )}

      {lastCheck && (
        <div
          className={`check-result ${resultClass}`}
          role="status"
          aria-live="polite"
        >
          {lastCheck.ok && !showCelebration && (
            <div className="island-stamp" aria-hidden="true">
              <div className="island-stamp-inner">
                <span className="island-stamp-emoji">🏝</span>
                <span className="island-stamp-label">Nice work!</span>
              </div>
            </div>
          )}
          <span>{lastCheck.feedback}</span>
          {lastCelebration && lastCelebration.xpEarned > 0 && !showCelebration && (
            <span className="inline-xp">+{lastCelebration.xpEarned} Island Points</span>
          )}
        </div>
      )}

      <div className="lab-board">{children}</div>
    </article>
  );
}
