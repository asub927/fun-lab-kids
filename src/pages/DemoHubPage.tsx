import { Link } from "react-router-dom";
import { grade2ShowcaseStandards } from "../data/standards";

const PROMPTS = [
  {
    lab: "Math",
    prompt:
      "Open Place Value Island. Use tools to build 243 with hundreds, tens, and ones blocks, then run_check.",
  },
  {
    lab: "ELA",
    prompt:
      "Help me write an opinion about recess. Add two reasons and a linking word; suggest one revision and wait for my confirm.",
  },
  {
    lab: "Science",
    prompt: "Classify the objects, heat the ice, predict the state, then run_check.",
  },
];

export function DemoHubPage() {
  return (
    <div className="page demo-hub">
      <h1 className="hero-title">Jordan&apos;s Grade 2 Demo</h1>
      <p className="lead">
        Pick a lab to explore with your AI teammate. No login needed. Your progress stays on this
        device.
      </p>

      <div className="lab-cards" role="list">
        {grade2ShowcaseStandards.map((s) => {
          const path =
            s.subject === "math"
              ? "/demo/math"
              : s.subject === "ela"
                ? "/demo/ela"
                : "/demo/science";
          const title =
            s.activityType === "showcase:place-value"
              ? "Place Value Island"
              : s.activityType === "showcase:opinion-builder"
                ? "Opinion Builder"
                : "Matter Lab";
          return (
            <Link key={s.code} to={path} className="lab-card" role="listitem">
              <span className="subject-tag">{s.subject}</span>
              <h2>{title}</h2>
              <p translate="no">{s.code}</p>
            </Link>
          );
        })}
      </div>

      <section className="judge-prompts" aria-labelledby="judge-prompts-heading">
        <h2 id="judge-prompts-heading">ChatGPT Judge Prompts</h2>
        <ol>
          {PROMPTS.map((p) => (
            <li key={p.lab}>
              <strong>{p.lab}:</strong> <code translate="no">{p.prompt}</code>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
