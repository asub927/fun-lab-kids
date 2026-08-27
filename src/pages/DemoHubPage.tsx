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
      <h1>Jordan&apos;s Grade 2 Demo</h1>
      <p className="lead">
        Pick a lab to explore with your AI teammate. No login — session progress stays on this device.
      </p>

      <div className="lab-cards">
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
            <Link key={s.code} to={path} className="lab-card">
              <span className="subject-tag">{s.subject}</span>
              <h2>{title}</h2>
              <p>{s.code}</p>
            </Link>
          );
        })}
      </div>

      <section className="judge-prompts">
        <h2>ChatGPT judge prompts</h2>
        <ol>
          {PROMPTS.map((p) => (
            <li key={p.lab}>
              <strong>{p.lab}:</strong> <code>{p.prompt}</code>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
