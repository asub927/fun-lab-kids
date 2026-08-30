import { Link, useParams } from "react-router-dom";
import { listGrade2Standards } from "../data/standards";
import type { Standard } from "../types";
import { loadProgress } from "../services/progress";

const SUBJECTS = {
  math: { title: "Math Standards" },
  ela: { title: "ELA Standards" },
  science: { title: "Science Standards" },
} as const;

const STRAND_ACCENTS = ["green", "pink", "orange", "yellow"] as const;

export function SubjectBrowserPage() {
  const { subject = "math" } = useParams();
  const key = subject as keyof typeof SUBJECTS;
  const meta = SUBJECTS[key] ?? SUBJECTS.math;
  const standards = listGrade2Standards(key as Standard["subject"]);
  const progress = loadProgress().progress;

  const byStrand = standards.reduce<Record<string, typeof standards>>((acc, s) => {
    (acc[s.strand] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className={`page subject-browser subject-browser--${key}`}>
      <Link to="/grade-2" className="back-link">
        ← Grade 2 Hub
      </Link>
      <h1 className="hero-title">{meta.title}</h1>
      <p className="lead">{standards.length} NCSCOS standards — tap any row to play.</p>

      {Object.entries(byStrand).map(([strand, items], strandIndex) => (
        <section key={strand} className="strand-section">
          <h2 className={`section-label accent-${STRAND_ACCENTS[strandIndex % STRAND_ACCENTS.length]}`}>
            {strand}
          </h2>
          <ul className="standard-list">
            {items.map((s) => {
              const prog = progress[s.code];
              return (
                <li key={s.code}>
                  <Link to={`/lab/${encodeURIComponent(s.code)}`} className="standard-row">
                    <span className="standard-code" translate="no">
                      {s.code}
                    </span>
                    <span className="standard-text">{s.text}</span>
                    {prog?.completed && <span className="done-badge">✓</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
