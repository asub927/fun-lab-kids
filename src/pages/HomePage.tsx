import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="page home">
      <p className="eyebrow">Inquiry Island</p>
      <h1 className="hero-title">NC K–5 Math, English &amp; Science — Learn With Your AI Teammate</h1>
      <p className="lead">
        A shared learning board where kids and an agent place blocks, build sentences, and run
        science sims together — through WebMCP tools, not UI scraping.
      </p>
      <div className="hero-actions">
        <Link to="/demo" className="btn primary large">
          Start Grade 2 Demo
        </Link>
        <Link to="/catalog" className="btn secondary large">
          Browse Standards
        </Link>
      </div>
    </div>
  );
}
