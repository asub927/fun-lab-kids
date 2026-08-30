import { Link } from "react-router-dom";
import { listGrade2Standards } from "../data/standards";

const FEATURES = [
  {
    icon: "🧱",
    title: "Build it yourself",
    text: "Place value blocks, writing frames, and science sims — hands-on, not multiple choice.",
    accent: "green",
  },
  {
    icon: "🤖",
    title: "AI teammate",
    text: "An agent uses WebMCP tools to help on the same board — no UI scraping, no spoilers.",
    accent: "pink",
  },
  {
    icon: "🏝",
    title: "Earn your stripes",
    text: "Island Points, streaks, and badges track every standard you master on this device.",
    accent: "orange",
  },
  {
    icon: "📚",
    title: "NC standards built in",
    text: "Every Grade 2 Math, ELA, and Science standard mapped to a playable lab.",
    accent: "yellow",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Pick a subject",
    text: "Math Island, Word Cove, or Discovery Bay — all NC Grade 2 standards.",
  },
  {
    step: "02",
    title: "Play the lab",
    text: "Manipulate blocks, write sentences, run checks. Smart Score tracks mastery.",
  },
  {
    step: "03",
    title: "Level up",
    text: "Master skills, unlock badges, and climb your personal scoreboard.",
  },
] as const;

export function HomePage() {
  const all = listGrade2Standards();
  const mathCount = listGrade2Standards("math").length;
  const elaCount = listGrade2Standards("ela").length;
  const scienceCount = listGrade2Standards("science").length;

  return (
    <div className="page home-page">
      <section className="home-hero" aria-labelledby="home-headline">
        <p className="home-eyebrow">What&apos;s the challenge?</p>
        <h1 id="home-headline" className="home-headline">
          <span className="home-headline-line">Learning alone</span>
          <span className="home-headline-line">is hard.</span>
        </h1>
        <p className="home-subhead">
          Inquiry Island is a shared learning board where kids and an AI agent place blocks,
          build sentences, and run science sims together — through real tools, not screen scraping.
        </p>
        <div className="home-hero-actions">
          <Link to="/grade-2" className="btn primary large home-cta-primary">
            Start Grade 2
          </Link>
          <Link to="/grade-2/progress" className="btn secondary large">
            View Progress
          </Link>
        </div>
      </section>

      <section className="home-stats" aria-label="App highlights">
        <div className="home-stat-card accent-green">
          <span className="home-stat-value">{all.length}</span>
          <span className="home-stat-label">Playable standards</span>
        </div>
        <div className="home-stat-card accent-pink">
          <span className="home-stat-value">3</span>
          <span className="home-stat-label">Subjects · Math, ELA, Science</span>
        </div>
        <div className="home-stat-card accent-orange">
          <span className="home-stat-value">10</span>
          <span className="home-stat-label">Questions per skill session</span>
        </div>
      </section>

      <section className="home-section" aria-labelledby="why-heading">
        <p className="home-eyebrow">Why Inquiry Island?</p>
        <h2 id="why-heading" className="home-section-title">
          Channel your inner explorer!
        </h2>
        <p className="home-section-lead">
          Less passive scrolling. More building, checking, and mastering NC Grade 2 skills with a
          teammate who actually understands the board.
        </p>
        <div className="home-feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className={`home-feature-card accent-${feature.accent}`}>
              <span className="home-feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="how-heading">
        <p className="home-eyebrow">How does it work?</p>
        <h2 id="how-heading" className="home-section-title">
          Set your learning path.
        </h2>
        <div className="home-steps">
          {STEPS.map((item) => (
            <article key={item.step} className="home-step-card">
              <span className="home-step-num">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="home-subject-strip" role="list" aria-label="Subject breakdown">
          <span className="home-subject-pill accent-green" role="listitem">
            Math · {mathCount}
          </span>
          <span className="home-subject-pill accent-pink" role="listitem">
            ELA · {elaCount}
          </span>
          <span className="home-subject-pill accent-orange" role="listitem">
            Science · {scienceCount}
          </span>
        </div>
      </section>

      <section className="home-closer" aria-labelledby="closer-heading">
        <h2 id="closer-heading" className="home-closer-title">
          Ready to explore?
        </h2>
        <p className="home-closer-text">
          Guest mode — no accounts. Progress saves on this device. Jump in and master your first
          standard today.
        </p>
        <div className="home-hero-actions">
          <Link to="/grade-2" className="btn primary large home-cta-primary">
            Enter Grade 2 Hub
          </Link>
          <Link to="/catalog" className="btn secondary large">
            Browse Catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
