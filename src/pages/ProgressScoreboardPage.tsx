import { useState } from "react";
import { Link } from "react-router-dom";
import { loadProgress, updateProfileName } from "../services/progress";
import { getScoreboardSummary } from "../services/progressStats";

const SUBJECT_LABELS = {
  math: "Math Island",
  ela: "Word Cove",
  science: "Discovery Bay",
} as const;

const SUBJECT_ACCENTS = {
  math: "green",
  ela: "pink",
  science: "orange",
} as const;

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ProgressScoreboardPage() {
  const [store, setStore] = useState(loadProgress);
  const summary = getScoreboardSummary(store);
  const [nameDraft, setNameDraft] = useState(summary.displayName);

  const saveName = () => {
    const next = updateProfileName(nameDraft);
    setStore(next);
  };

  return (
    <div className="page scoreboard-page">
      <Link to="/grade-2" className="back-link">
        ← Grade 2 Hub
      </Link>
      <p className="eyebrow">My Progress</p>
      <h1 className="hero-title">{summary.displayName}&apos;s Scoreboard</h1>
      <p className="lead">Island Points, streaks, and badges save on this device.</p>

      <div className="profile-name-edit">
        <label htmlFor="profile-name">Your name</label>
        <div className="profile-name-row">
          <input
            id="profile-name"
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
          />
          <button type="button" className="btn secondary" onClick={saveName}>
            Save
          </button>
        </div>
      </div>

      <div className="scoreboard-hero" role="region" aria-label="Progress summary">
        <div className="scoreboard-stat accent-yellow">
          <span className="scoreboard-stat-label">Island Points</span>
          <span className="scoreboard-stat-value">{summary.totalXp}</span>
        </div>
        <div className="scoreboard-stat accent-orange">
          <span className="scoreboard-stat-label">Streak</span>
          <span className="scoreboard-stat-value">
            {summary.currentStreak > 0 ? `🔥 ${summary.currentStreak}` : "0"}
          </span>
          <span className="scoreboard-stat-sub">Best: {summary.longestStreak} days</span>
        </div>
        <div className="scoreboard-stat accent-green">
          <span className="scoreboard-stat-label">Mastered</span>
          <span className="scoreboard-stat-value">
            {summary.mastered}/{summary.totalStandards}
          </span>
          {summary.averageSmartScore !== null && (
            <span className="scoreboard-stat-sub">Avg Smart Score: {summary.averageSmartScore}</span>
          )}
        </div>
      </div>

      <section className="scoreboard-section" aria-labelledby="subject-progress-heading">
        <h2 id="subject-progress-heading" className="section-label accent-yellow">
          Subject Progress
        </h2>
        <div className="subject-progress-list">
          {summary.subjectStats.map((stat) => (
            <div key={stat.subject} className="subject-progress-row">
              <div className="subject-progress-header">
                <span className={`subject-tag accent-${SUBJECT_ACCENTS[stat.subject]}`}>
                  {SUBJECT_LABELS[stat.subject]}
                </span>
                <span className="subject-progress-count">
                  {stat.done}/{stat.total} · {stat.percent}%
                </span>
              </div>
              <div
                className="subject-progress-bar"
                role="progressbar"
                aria-valuenow={stat.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${SUBJECT_LABELS[stat.subject]} progress`}
              >
                <div
                  className={`subject-progress-fill accent-${SUBJECT_ACCENTS[stat.subject]}`}
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="scoreboard-section" aria-labelledby="achievements-heading">
        <h2 id="achievements-heading" className="section-label accent-pink">
          Achievement Badges
        </h2>
        {summary.nextAchievement && (
          <p className="next-achievement-hint">
            Next up: {summary.nextAchievement.icon} {summary.nextAchievement.title} —{" "}
            {summary.nextAchievement.description}
          </p>
        )}
        <div className="achievement-grid">
          {summary.unlockedAchievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card earned">
              <span className="achievement-icon" aria-hidden="true">
                {achievement.icon}
              </span>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
            </div>
          ))}
          {summary.lockedAchievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card locked">
              <span className="achievement-icon" aria-hidden="true">
                {achievement.icon}
              </span>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="scoreboard-section" aria-labelledby="recent-activity-heading">
        <h2 id="recent-activity-heading" className="section-label accent-green">
          Recent Activity
        </h2>
        {summary.recentActivity.length === 0 ? (
          <p className="empty-state">No practice yet — pick a standard to start earning points!</p>
        ) : (
          <ul className="recent-activity-list">
            {summary.recentActivity.map((item) => (
              <li key={item.code}>
                <Link to={`/lab/${encodeURIComponent(item.code)}`} className="recent-activity-row">
                  <span className="standard-code" translate="no">
                    {item.code}
                  </span>
                  <span className="recent-activity-text">{item.text}</span>
                  <span className="recent-activity-meta">
                    {item.completed ? "✓ Mastered" : `SS ${item.smartScore}`} · {formatDate(item.lastAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="scoreboard-footer" role="status">
        Lifetime checks: {summary.lifetimeChecks} · Correct: {summary.lifetimeCorrect}
      </p>
    </div>
  );
}
