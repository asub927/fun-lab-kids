import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { CharacterGuide } from "../components/CharacterGuide";
import { PetSprite } from "../components/pets/PetSprite";
import { Reveal, RevealGroup } from "../components/Reveal";
import { PET_SPECIES, type PetSpeciesId } from "../data/pets";
import { loadProgress, updateProfileName } from "../services/progress";
import { pickScoreboardHintLine } from "../services/characterDialogue";
import { getScoreboardSummary } from "../services/progressStats";
import { getPetSpeciesId, isPetVisible, setPetSpecies, setPetVisible } from "../services/pet";

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
  const [petVisible, setPetVisibleState] = useState(() => isPetVisible());
  const [speciesId, setSpeciesId] = useState<PetSpeciesId>(() => getPetSpeciesId());

  useEffect(() => {
    const onPrefs = (event: Event) => {
      const detail = (event as CustomEvent<{ visible?: boolean; speciesId?: PetSpeciesId }>).detail;
      if (detail && typeof detail.visible === "boolean") setPetVisibleState(detail.visible);
      if (detail?.speciesId === "dog" || detail?.speciesId === "cat" || detail?.speciesId === "rabbit") {
        setSpeciesId(detail.speciesId);
      }
    };
    window.addEventListener("inquiry-island-pet-prefs", onPrefs);
    return () => window.removeEventListener("inquiry-island-pet-prefs", onPrefs);
  }, []);

  const saveName = () => {
    const next = updateProfileName(nameDraft);
    setStore(next);
  };

  const togglePet = () => {
    const next = setPetVisible(!petVisible);
    setPetVisibleState(next.visible);
  };

  const pickSpecies = (id: PetSpeciesId) => {
    const next = setPetSpecies(id);
    setSpeciesId(next.speciesId);
  };

  return (
    <div className="page scoreboard-page">
      <Link to="/grade-2" className="back-link">
        ← Grade 2 Hub
      </Link>
      <p className="eyebrow">My Progress</p>
      <h1 className="hero-title">{summary.displayName}&apos;s Scoreboard</h1>
      <p className="lead">Island Points, streaks, and badges stay on this device.</p>

      <Reveal>
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
      </Reveal>

      <section
        id="island-friend"
        className="scoreboard-section pet-settings-section"
        aria-labelledby="island-friend-heading"
      >
        <h2 id="island-friend-heading" className="section-label accent-pink">
          Island Friend
        </h2>
        <p className="pet-settings-lead">
          Pick an island friend to hang out in the bottom-left corner while you practice.
        </p>
        <label className="pet-pref-toggle" htmlFor="pet-visible">
          <input
            id="pet-visible"
            type="checkbox"
            checked={petVisible}
            onChange={togglePet}
          />
          <span>Show island friend (corner buddy)</span>
        </label>
        <div className="pet-species-picker" role="group" aria-labelledby="pet-species-heading">
          <p id="pet-species-heading" className="pet-species-picker-label">
            Pick your island friend
          </p>
          <div className="pet-species-picker-grid">
            {PET_SPECIES.map((species) => (
              <button
                key={species.id}
                type="button"
                className={[
                  "pet-species-option",
                  speciesId === species.id ? "is-selected" : "",
                  !petVisible ? "is-dimmed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={speciesId === species.id}
                onClick={() => pickSpecies(species.id)}
              >
                <span className="pet-species-preview" aria-hidden="true">
                  <PetSprite speciesId={species.id} mood="idle" preview />
                </span>
                <span className="pet-species-label">{species.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <RevealGroup className="scoreboard-hero" role="region" aria-label="Progress summary">
        <div className="scoreboard-stat accent-yellow scoreboard-stat--xp">
          <span className="scoreboard-stat-label">Island Points</span>
          <span className="scoreboard-stat-value">
            <AnimatedNumber value={summary.totalXp} />
          </span>
        </div>
        <div className={`scoreboard-stat accent-orange ${summary.currentStreak > 0 ? "scoreboard-stat--streak" : ""}`}>
          <span className="scoreboard-stat-label">Streak</span>
          <span className="scoreboard-stat-value">
            {summary.currentStreak > 0 ? (
              <>
                <span className="streak-flame" aria-hidden="true">
                  🔥
                </span>{" "}
                <AnimatedNumber value={summary.currentStreak} />
              </>
            ) : (
              "0"
            )}
          </span>
          <span className="scoreboard-stat-sub">Best: {summary.longestStreak} days</span>
        </div>
        <div className="scoreboard-stat accent-green">
          <span className="scoreboard-stat-label">Mastered</span>
          <span className="scoreboard-stat-value">
            <AnimatedNumber value={summary.mastered} />/{summary.totalStandards}
          </span>
          {summary.averageSmartScore !== null && (
            <span className="scoreboard-stat-sub">Avg Smart Score: {summary.averageSmartScore}</span>
          )}
        </div>
      </RevealGroup>

      <Reveal delay={80}>
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
      </Reveal>

      <Reveal delay={120}>
        <section className="scoreboard-section" aria-labelledby="achievements-heading">
          <h2 id="achievements-heading" className="section-label accent-pink">
            Achievement Badges
          </h2>
          {summary.nextAchievement && (
            <>
              <CharacterGuide
                subject="ela"
                line={pickScoreboardHintLine(store, summary.nextAchievement, summary.mastered)}
                mood="thinking"
              />
              <p className="next-achievement-hint">
                {summary.nextAchievement.icon} {summary.nextAchievement.title}:{" "}
                {summary.nextAchievement.description}
              </p>
            </>
          )}
          <RevealGroup className="achievement-grid">
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
          </RevealGroup>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <section className="scoreboard-section" aria-labelledby="recent-activity-heading">
          <h2 id="recent-activity-heading" className="section-label accent-green">
            Recent Activity
          </h2>
          {summary.recentActivity.length === 0 ? (
            <p className="empty-state">No practice yet. Pick a skill and start earning points!</p>
          ) : (
            <ul className="recent-activity-list">
              {summary.recentActivity.map((item, index) => (
                <li key={item.code} style={{ "--row-delay": `${index * 60}ms` } as CSSProperties}>
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
      </Reveal>

      <p className="scoreboard-footer" role="status">
        Lifetime checks: {summary.lifetimeChecks} · Correct: {summary.lifetimeCorrect}
      </p>
    </div>
  );
}
