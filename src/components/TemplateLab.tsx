import type { TemplateBoardState } from "../types";
import { useApp } from "../context/AppContext";
import { StrategyFromParams } from "./StrategyPanel";

type TemplateLabProps = {
  state: TemplateBoardState;
};

export function TemplateLab({ state }: TemplateLabProps) {
  const { applyAction } = useApp();
  const p = state.params;

  if (state.labId === "checklist") {
    const items = (p.items as string[]) ?? ["I completed the activity."];
    return (
      <div className="template-lab checklist-lab">
        <StrategyFromParams params={p} />
        <p className="lead">{String(p.prompt ?? "Complete each step:")}</p>
        <ul className="checklist-items">
          {items.map((item, i) => (
            <li key={item}>
              <label>
                <input
                  type="checkbox"
                  checked={state.checklist[i] ?? false}
                  onChange={() => applyAction({ action: "toggle_check", index: i })}
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (state.labId === "word-problem" || state.labId === "numeric-flash" || state.labId === "computation") {
    const triple = p.mode === "triple-add" && Array.isArray(p.values);
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        {triple && (
          <p className="story-card tabular">Add: {(p.values as number[]).join(" + ")}</p>
        )}
        {typeof p.story === "string" && <p className="story-card">{p.story}</p>}
        {!triple && typeof p.a === "number" && (
          <p className="target-number tabular">
            {String(p.a)} {String(p.op)} {String(p.b)}
          </p>
        )}
        <div className="answer-field">
          <label htmlFor="numeric-answer">
            Your answer
            <input
              id="numeric-answer"
              type="number"
              inputMode="numeric"
              value={state.numericAnswer}
              onChange={(e) => applyAction({ action: "set_numeric", value: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "equal-groups" && typeof p.rows === "number") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        <p className="story-card">
          {String(p.rows)} rows × {String(p.cols)} columns
        </p>
        <div className="answer-field">
          <label htmlFor="groups-answer">
            Total objects
            <input
              id="groups-answer"
              type="number"
              inputMode="numeric"
              value={state.numericAnswer}
              onChange={(e) => applyAction({ action: "set_numeric", value: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "equal-groups" && p.mode === "odd-even") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        <p className="story-card">Is {String(p.count)} odd or even?</p>
        <div className="classify-btns">
          {["odd", "even"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`btn ${state.selectedOption === opt ? "primary" : "secondary"}`}
              aria-pressed={state.selectedOption === opt}
              onClick={() => applyAction({ action: "set_option", value: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (state.labId === "number-sense" && p.mode === "expanded") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        <p className="target-number tabular">{String(p.number)}</p>
        <div className="answer-field">
          <label htmlFor="expanded-form">
            Write in expanded form (e.g. 300+50+2)
            <input
              id="expanded-form"
              value={state.textResponse}
              onChange={(e) => applyAction({ action: "set_text", text: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "number-sense" && p.mode === "skip-count") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        <p className="story-card">
          Skip-count by {String(p.step)} starting at {String(p.start)}. What comes next?
        </p>
        <div className="answer-field">
          <label htmlFor="skip-answer">
            Next number
            <input
              id="skip-answer"
              type="number"
              inputMode="numeric"
              value={state.numericAnswer}
              onChange={(e) => applyAction({ action: "set_numeric", value: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "number-sense" && p.mode === "compare") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        <p className="target-number tabular">
          {String(p.a)} ? {String(p.b)}
        </p>
        <div className="classify-btns">
          {[">", "<", "="].map((sym) => (
            <button
              key={sym}
              type="button"
              className={`btn ${state.selectedOption === sym ? "primary" : "secondary"}`}
              aria-pressed={state.selectedOption === sym}
              onClick={() => applyAction({ action: "set_option", value: sym })}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (state.labId === "writing-frame") {
    const parts = (p.requiredParts as string[]) ?? ["topic", "detail"];
    return (
      <div className="template-lab form-grid">
        <StrategyFromParams params={p} />
        <p className="lead">{String(p.prompt)}</p>
        {parts.map((part) => (
          <label key={part} htmlFor={`frame-${part}`}>
            {part}
            <input
              id={`frame-${part}`}
              value={state.frameFields[part] ?? ""}
              onChange={(e) =>
                applyAction({ action: "set_frame_field", field: part, text: e.target.value })
              }
            />
          </label>
        ))}
      </div>
    );
  }

  if (state.labId === "reading-response") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        {typeof p.passage === "string" && (
          <section className="paragraph-preview">
            <h2>Passage</h2>
            <p>{p.passage}</p>
          </section>
        )}
        <div className="answer-field">
          <label htmlFor="reading-answer">
            {String(p.question ?? "Your answer")}
            <textarea
              id="reading-answer"
              rows={3}
              value={state.textResponse}
              onChange={(e) => applyAction({ action: "set_text", text: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "language-edit") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        <p className="revision-card">Fix this sentence: &ldquo;{String(p.sentence)}&rdquo;</p>
        <div className="answer-field">
          <label htmlFor="fixed-sentence">
            Corrected sentence
            <input
              id="fixed-sentence"
              value={state.textResponse}
              onChange={(e) => applyAction({ action: "set_text", text: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "science-inquiry") {
    return (
      <div className="template-lab">
        <StrategyFromParams params={p} />
        <p className="lead">{String(p.prompt ?? p.scenario)}</p>
        {Array.isArray(p.stages) && (
          <ol>
            {(p.stages as string[]).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        )}
        <div className="answer-field">
          <label htmlFor="science-answer">
            Your observation or answer
            <textarea
              id="science-answer"
              rows={2}
              value={state.textResponse}
              onChange={(e) => applyAction({ action: "set_text", text: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  // measurement, time-money, data-chart, geometry, equal-groups default
  return (
    <div className="template-lab form-grid">
      <StrategyFromParams params={p} />
      <p className="lead">{String(p.prompt ?? "Solve the challenge:")}</p>
      {typeof p.object === "string" && (
        <p>
          Object: {p.object} · Tool: {typeof p.tool === "string" ? p.tool : ""}
        </p>
      )}
      {typeof p.time === "string" && <p>Time: {p.time}</p>}
      {typeof p.shape === "string" && <p>Shape: {p.shape}</p>}
      <div className="answer-field">
        <label htmlFor="template-answer">
          Answer
          <input
            id="template-answer"
            value={state.numericAnswer || state.textResponse}
            onChange={(e) => {
              applyAction({ action: "set_numeric", value: e.target.value });
              applyAction({ action: "set_text", text: e.target.value });
            }}
          />
        </label>
      </div>
    </div>
  );
}
