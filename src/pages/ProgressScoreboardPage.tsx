import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { PetSprite } from "../components/pets/PetSprite";
import { Reveal, RevealGroup } from "../components/Reveal";
import { PET_SPECIES, type PetSpeciesId } from "../data/pets";
import { loadProgress, updateProfileName } from "../services/progress";
import { getAchievementNavigationPath, getScoreboardSummary } from "../services/progressStats";
import { getPetSpeciesId, isPetSoundEnabled, isPetVisible, PET_PREFS_EVENT, setPetSoundEnabled, setPetSpecies, setPetVisible } from "../services/pet";

const SUBJECT_LABELS = {
  math: "Math Lab",
  ela: "Word Lab",
  science: "Science Lab",
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
  const [soundEnabled, setSoundEnabledState] = useState(() => isPetSoundEnabled());

  useEffect(() => {
    const onPrefs = (event: Event) => {
      const detail = (event as CustomEvent<{ visible?: boolean; speciesId?: PetSpeciesId; soundEnabled?: boolean }>).detail;
      if (detail && typeof detail.visible === "boolean") setPetVisibleState(detail.visible);
      if (detail?.speciesId === "dog" || detail?.speciesId === "cat" || detail?.speciesId === "rabbit") {
        setSpeciesId(detail.speciesId);
      }
      if (detail && typeof detail.soundEnabled === "boolean") {
        setSoundEnabledState(detail.soundEnabled);
      }
    };
    window.addEventListener(PET_PREFS_EVENT, onPrefs);
    return () => window.removeEventListener(PET_PREFS_EVENT, onPrefs);
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

  const toggleSound = () => {
    const next = setPetSoundEnabled(!soundEnabled);
    setSoundEnabledState(next.soundEnabled);
  };

  return (
    <div className="page scoreboard-page">
      <Link to="/grade-2" className="back-link">
        ← Grade 2 Hub
      </Link>
      <p className="eyebrow">My Progress</p>
      <h1 className="hero-title">{summary.displayName}&apos;s Scoreboard</h1>
      <p className="lead">Fun Points, streaks, and badges stay on this device.</p>

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
        id="lab-buddy"
        className="scoreboard-section pet-settings-section"
        aria-labelledby="lab-buddy-heading"
      >
        <h2 id="lab-buddy-heading" className="section-label accent-pink">
          Lab Buddy
        </h2>
        <p className="pet-settings-lead">
          Pick Digits, Ripple, or Spark to hang out in the buddy lane while you practice. Tap them to
          hear a greeting.
        </p>
        <label className="pet-pref-toggle" htmlFor="pet-visible">
          <input
            id="pet-visible"
            type="checkbox"
            checked={petVisible}
            onChange={togglePet}
          />
          <span>Show lab buddy</span>
        </label>
        <label className="pet-pref-toggle" htmlFor="pet-sound">
          <input
            id="pet-sound"
            type="checkbox"
            checked={soundEnabled}
            disabled={!petVisible}
            onChange={toggleSound}
          />
          <span>Pet voice during celebrations</span>
        </label>
        <div className="pet-species-picker" role="group" aria-labelledby="pet-species-heading">
          <p id="pet-species-heading" className="pet-species-picker-label">
            Pick your buddy
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
          <span className="scoreboard-stat-label">Fun Points</span>
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
              <Link
                key={stat.subject}
                to={`/grade-2/${stat.subject}`}
                className="subject-progress-row"
                aria-label={`Go to ${SUBJECT_LABELS[stat.subject]}: ${stat.done} of ${stat.total} skills mastered`}
              >
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
              </Link>
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
            <p className="next-achievement-hint">
              {summary.nextAchievement.icon} {summary.nextAchievement.title}:{" "}
              {summary.nextAchievement.description}
            </p>
          )}
          <RevealGroup className="achievement-grid">
            {summary.unlockedAchievements.map((achievement) => (
              <Link
                key={achievement.id}
                to={getAchievementNavigationPath(achievement, store)}
                className="achievement-card earned"
                aria-label={`${achievement.title} earned: ${achievement.description}`}
              >
                <span className="achievement-icon" aria-hidden="true">
                  {achievement.icon}
                </span>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </Link>
            ))}
            {summary.lockedAchievements.map((achievement) => (
              <Link
                key={achievement.id}
                to={getAchievementNavigationPath(achievement, store)}
                className="achievement-card locked"
                aria-label={`Work toward ${achievement.title}: ${achievement.description}`}
              >
                <span className="achievement-icon" aria-hidden="true">
                  {achievement.icon}
                </span>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </Link>
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
