import { Link } from "react-router-dom";
import { grade2ShowcaseStandards } from "../data/standards";

export function DemoHubPage() {
  return (
    <div className="page demo-hub">
      <h1 className="hero-title">Jordan&apos;s Grade 2 Demo</h1>
      <p className="lead">
        Pick a lab to explore. No login needed. Your progress stays on this device.
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
    </div>
  );
}
