import { Link } from "react-router-dom";
import { CharacterGuide } from "../components/CharacterGuide";
import { HeroBackdrop } from "../components/HeroBackdrop";
import { Reveal, RevealGroup } from "../components/Reveal";
import { CHARACTERS } from "../data/characters";
import { listGrade2Standards } from "../data/standards";
import { loadProgress } from "../services/progress";
import { pickHubGreetingLine } from "../services/characterDialogue";

const FEATURES = [
  {
    icon: "🧱",
    title: "Build it yourself",
    text: "Stack blocks, write stories, and run science labs. You use your hands, not just taps on a screen.",
    accent: "green",
  },
  {
    icon: "🐕",
    title: "Island friend",
    text: "Pick an island friend on Progress — they hang out in the corner while you practice.",
    accent: "pink",
  },
  {
    icon: "🦜",
    title: "Island companion",
    text: "Ripple, Digits, and Spark travel with you. They give hints, cheer you on, and suggest what to try next.",
    accent: "green",
  },
  {
    icon: "🏝",
    title: "Earn your stripes",
    text: "Collect Island Points, keep your streak alive, and unlock badges as you master each skill.",
    accent: "orange",
  },
  {
    icon: "📚",
    title: "Grade 2 ready",
    text: "Every math, reading, and science skill for Grade 2 has its own playable lab.",
    accent: "yellow",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Pick a subject",
    text: "Choose Math Island, Word Cove, or Discovery Bay. Every skill is ready for Grade 2.",
  },
  {
    step: "02",
    title: "Play the lab",
    text: "Move blocks, write sentences, and tap Check. Your Smart Score shows how you grow.",
  },
  {
    step: "03",
    title: "Level up",
    text: "Master skills, earn badges, and climb your scoreboard.",
  },
] as const;

export function HomePage() {
  const all = listGrade2Standards();
  const mathCount = listGrade2Standards("math").length;
  const elaCount = listGrade2Standards("ela").length;
  const scienceCount = listGrade2Standards("science").length;
  const store = loadProgress();

  return (
    <div className="page home-page">
      <section className="home-hero" aria-labelledby="home-headline">
        <HeroBackdrop />
        <p className="home-eyebrow">Ready for adventure?</p>
        <h1 id="home-headline" className="home-headline">
          <span className="home-headline-line">Learning is</span>
          <span className="home-headline-line">better together.</span>
        </h1>
        <p className="home-subhead">
          Inquiry Island is a shared learning board where you and a helper place blocks, build
          sentences, and run science labs side by side.
        </p>
        <div className="home-hero-actions">
          <Link to="/grade-2" className="btn primary large home-cta-primary">
            Lets go!
          </Link>
          <Link to="/grade-2/progress" className="btn secondary large">
            View Progress
          </Link>
        </div>
      </section>

      <RevealGroup className="home-stats" aria-label="App highlights">
        <div className="home-stat-card accent-green">
          <span className="home-stat-value">{all.length}</span>
          <span className="home-stat-label">Skills to play</span>
        </div>
        <div className="home-stat-card accent-pink">
          <span className="home-stat-value">3</span>
          <span className="home-stat-label">Subjects: math, reading, science</span>
        </div>
        <div className="home-stat-card accent-orange">
          <span className="home-stat-value">10</span>
          <span className="home-stat-label">Questions per round</span>
        </div>
      </RevealGroup>

      <Reveal delay={100}>
        <section className="home-section home-guides" aria-labelledby="guides-heading">
          <p className="home-eyebrow">Meet your guides</p>
          <h2 id="guides-heading" className="home-section-title">
            Friends who cheer you on.
          </h2>
          <p className="home-section-lead">
            Ripple, Digits, and Spark live on the islands. They cheer louder every time you practice.
          </p>
          <RevealGroup className="character-crew">
            {CHARACTERS.map((character, index) => (
              <CharacterGuide
                key={character.id}
                subject={character.subject}
                line={pickHubGreetingLine(character.subject, store, index)}
                mood="idle"
                featured={character.subject === "ela"}
              />
            ))}
          </RevealGroup>
        </section>
      </Reveal>

      <Reveal delay={50}>
        <section className="home-section" aria-labelledby="why-heading">
          <p className="home-eyebrow">Why Inquiry Island?</p>
          <h2 id="why-heading" className="home-section-title">
            Channel your inner explorer!
          </h2>
          <p className="home-section-lead">
            Less watching. More building, checking, and winning with a teammate who understands the
            board.
          </p>
          <RevealGroup className="home-feature-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className={`home-feature-card accent-${feature.accent}`}>
                <span className="home-feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </RevealGroup>
        </section>
      </Reveal>

      <Reveal delay={50}>
        <section className="home-section" aria-labelledby="how-heading">
          <p className="home-eyebrow">How does it work?</p>
          <h2 id="how-heading" className="home-section-title">
            Three steps to win.
          </h2>
          <RevealGroup className="home-steps">
            {STEPS.map((item) => (
              <article key={item.step} className="home-step-card">
                <span className="home-step-num">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </RevealGroup>
          <div className="home-subject-strip" role="list" aria-label="Subject breakdown">
            <span className="home-subject-pill accent-green" role="listitem">
              Math · {mathCount}
            </span>
            <span className="home-subject-pill accent-pink" role="listitem">
              Reading · {elaCount}
            </span>
            <span className="home-subject-pill accent-orange" role="listitem">
              Science · {scienceCount}
            </span>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="home-closer" aria-labelledby="closer-heading">
          <h2 id="closer-heading" className="home-closer-title">
            Ready to explore?
          </h2>
          <p className="home-closer-text">
            No account needed. Your progress stays on this device. Jump in and master your first
            skill today.
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
      </Reveal>
    </div>
  );
}
