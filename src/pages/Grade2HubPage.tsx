import { Link } from "react-router-dom";
import { listGrade2Standards } from "../data/standards";
import { countCompleted, loadProgress } from "../services/progress";
import { getScoreboardSummary } from "../services/progressStats";

export function Grade2HubPage() {
  const all = listGrade2Standards();
  const { done, total } = countCompleted(all.map((s) => s.code));
  const summary = getScoreboardSummary(loadProgress());
  const subjects = [
    { key: "math" as const, title: "Math Island", accent: "accent-green" },
    { key: "ela" as const, title: "Word Cove", accent: "accent-pink" },
    { key: "science" as const, title: "Discovery Bay", accent: "accent-orange" },
  ];

  return (
    <div className="page grade-2-hub">
      <p className="eyebrow">Grade 2</p>
      <h1 className="hero-title">{summary.displayName}&apos;s Learning Hub</h1>
      <p className="lead">
        Pick a subject to explore NC standards with your AI teammate. Progress saves on this device.
      </p>

      <div className="hub-stats-strip" role="status">
        <span className="hub-stat">
          <strong>{summary.totalXp}</strong> Island Points
        </span>
        <span className="hub-stat">
          {summary.currentStreak > 0 ? (
            <>
              <strong>🔥 {summary.currentStreak}</strong> day streak
            </>
          ) : (
            <>
              <strong>0</strong> day streak
            </>
          )}
        </span>
        <span className="hub-stat">
          <strong>
            {done}/{total}
          </strong>{" "}
          mastered
        </span>
        <Link to="/grade-2/progress" className="hub-progress-link">
          My Progress →
        </Link>
      </div>

      <p className="progress-summary" role="status">
        {done} of {total} standards completed
      </p>

      <div className="lab-cards" role="list">
        {subjects.map(({ key, title, accent }) => {
          const subjectStandards = listGrade2Standards(key);
          const subjectStat = summary.subjectStats.find((s) => s.subject === key);
          return (
            <Link
              key={key}
              to={`/grade-2/${key}`}
              className={`lab-card ${accent}`}
              role="listitem"
            >
              <span className="subject-tag">{key.toUpperCase()}</span>
              <h2>{title}</h2>
              <p>{subjectStandards.length} standards</p>
              {subjectStat && (
                <div className="lab-card-progress">
                  <div
                    className="subject-progress-bar compact"
                    role="progressbar"
                    aria-valuenow={subjectStat.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${title} progress`}
                  >
                    <div className="subject-progress-fill" style={{ width: `${subjectStat.percent}%` }} />
                  </div>
                  <p className="lab-card-progress-label">
                    {subjectStat.done}/{subjectStat.total} mastered
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
