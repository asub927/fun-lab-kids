import { Link } from "react-router-dom";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { CharacterGuide } from "../components/CharacterGuide";
import { RevealGroup } from "../components/Reveal";
import { listGrade2Standards } from "../data/standards";
import { countCompleted, loadProgress } from "../services/progress";
import { pickHubGreetingLine } from "../services/characterDialogue";
import { getScoreboardSummary } from "../services/progressStats";
import type { Subject } from "../types";

const CREW_SUBJECTS: Subject[] = ["ela", "math", "science"];

export function Grade2HubPage() {
  const all = listGrade2Standards();
  const store = loadProgress();
  const { done, total } = countCompleted(all.map((s) => s.code));
  const summary = getScoreboardSummary(store);
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
        Pick a subject and explore with your AI teammate. Your progress saves on this device.
      </p>

      <div className="hub-stats-strip" role="status">
        <span className="hub-stat hub-stat--xp">
          <strong>
            <AnimatedNumber value={summary.totalXp} />
          </strong>{" "}
          Island Points
        </span>
        <span className={`hub-stat ${summary.currentStreak > 0 ? "hub-stat--streak" : ""}`}>
          {summary.currentStreak > 0 ? (
            <>
              <strong>
                <span className="streak-flame" aria-hidden="true">
                  🔥
                </span>{" "}
                <AnimatedNumber value={summary.currentStreak} />
              </strong>{" "}
              day streak
            </>
          ) : (
            <>
              <strong>0</strong> day streak
            </>
          )}
        </span>
        <span className="hub-stat">
          <strong>
            <AnimatedNumber value={done} />/{total}
          </strong>{" "}
          mastered
        </span>
        <Link to="/grade-2/progress" className="hub-progress-link">
          My Progress →
        </Link>
      </div>

      <RevealGroup className="character-crew" aria-labelledby="crew-heading">
        <p id="crew-heading" className="character-crew-label">
          Meet your crew
        </p>
        {CREW_SUBJECTS.map((subject, index) => (
          <CharacterGuide
            key={subject}
            subject={subject}
            line={pickHubGreetingLine(subject, store, summary.currentStreak + index)}
            mood={summary.currentStreak > 0 ? "happy" : "idle"}
            featured={subject === "ela"}
          />
        ))}
      </RevealGroup>

      <p className="progress-summary" role="status">
        {done} of {total} skills completed
      </p>

      <RevealGroup className="lab-cards" role="list">
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
              <p>{subjectStandards.length} skills</p>
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
      </RevealGroup>
    </div>
  );
}
