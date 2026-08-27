import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { hasWebMCP } from "../webmcp/register";

type LabShellProps = {
  title: string;
  children: React.ReactNode;
};

export function LabShell({ title, children }: LabShellProps) {
  const { activeStandard, lastCheck, undo, runCheck, resetBoard } = useApp();

  const handleReset = () => {
    if (window.confirm("Reset the board?")) resetBoard();
  };

  const handleReveal = () => {
    if (window.confirm("Show the answer?")) runCheck();
  };

  return (
    <div className="lab-shell">
      <header className="lab-header">
        <div>
          <Link to="/demo" className="back-link">
            ← Demo hub
          </Link>
          <h1>{title}</h1>
          {activeStandard && (
            <p className="standard-chip">
              <span>{activeStandard.code}</span> {activeStandard.text.slice(0, 120)}
              {activeStandard.text.length > 120 ? "…" : ""}
            </p>
          )}
        </div>
        <div className="lab-actions">
          <button type="button" className="btn secondary" onClick={undo}>
            Undo
          </button>
          <button type="button" className="btn primary" onClick={() => runCheck()}>
            Check
          </button>
          <button type="button" className="btn secondary" onClick={handleReveal}>
            Show answer
          </button>
          <button type="button" className="btn danger" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>

      {hasWebMCP() && (
        <p className="agent-ready">WebMCP tools are active — your agent can use this board.</p>
      )}

      {lastCheck && (
        <div className={`check-result ${lastCheck.ok ? "ok" : "warn"}`} role="status">
          {lastCheck.feedback}
        </div>
      )}

      <div className="lab-board">{children}</div>
    </div>
  );
}
