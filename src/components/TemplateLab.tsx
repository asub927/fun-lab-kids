import type { TemplateBoardState } from "../types";
import { useApp } from "../context/AppContext";
import {
  BarChartVisual,
  ClockVisual,
  CoinVisual,
  NumberLineVisual,
  RulerVisual,
  ShapeVisual,
} from "./lab-visuals/LabVisuals";
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
              name="answer"
              autoComplete="off"
              spellCheck={false}
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
              name="answer"
              autoComplete="off"
              spellCheck={false}
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
        <p className="target-number tabular">{String(p.number)}</p>
        <div className="answer-field">
          <label htmlFor="expanded-form">
            Write in expanded form (e.g. 300+50+2)
            <input
              id="expanded-form"
              name="answer"
              autoComplete="off"
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
              name="answer"
              autoComplete="off"
              spellCheck={false}
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
              name="answer"
              autoComplete="off"
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
        <p className="revision-card">Fix this sentence: &ldquo;{String(p.sentence)}&rdquo;</p>
        <div className="answer-field">
          <label htmlFor="fixed-sentence">
            Corrected sentence
            <input
              id="fixed-sentence"
              name="answer"
              autoComplete="off"
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
              name="answer"
              autoComplete="off"
              rows={2}
              value={state.textResponse}
              onChange={(e) => applyAction({ action: "set_text", text: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "number-sense" && p.mode === "mental-add") {
    return (
      <div className="template-lab">
        <p className="target-number tabular">{String(p.prompt)}</p>
        <div className="answer-field">
          <label htmlFor="mental-answer">
            Your answer
            <input
              id="mental-answer"
              type="number"
              inputMode="numeric"
              name="answer"
              autoComplete="off"
              spellCheck={false}
              value={state.numericAnswer}
              onChange={(e) => applyAction({ action: "set_numeric", value: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "measurement") {
    const mode = String(p.mode ?? "measure");
    return (
      <div className="template-lab">
        <p className="story-card">{String(p.prompt)}</p>
        {mode === "measure-twice" && (
          <div className="measurement-pair">
            <p>
              First measure: {String((p.measure1 as { value?: number })?.value ?? "")}{" "}
              {String((p.measure1 as { unit?: string })?.unit ?? "")}
            </p>
            <p>
              Second measure: {String((p.measure2 as { value?: number })?.value ?? "")}{" "}
              {String((p.measure2 as { unit?: string })?.unit ?? "")}
            </p>
          </div>
        )}
        {mode === "compare-length" && (
          <div className="measurement-pair">
            <p>
              {String(p.objectA)}: {String(p.lengthA)} inches
            </p>
            <p>
              {String(p.objectB)}: {String(p.lengthB)} inches
            </p>
          </div>
        )}
        {mode === "number-line" && (
          <NumberLineVisual
            start={Number(p.start)}
            end={typeof p.end === "number" ? p.end : undefined}
          />
        )}
        {(mode === "measure" || mode === "estimate") && typeof p.length === "number" && (
          <RulerVisual length={Number(p.length)} unit={String(p.unit ?? "inches")} />
        )}
        {typeof p.object === "string" && mode !== "compare-length" && mode !== "measure-twice" && (
          <p className="lab-object-label">Object: {p.object}</p>
        )}
        <div className="answer-field">
          <label htmlFor="measurement-answer">
            Your answer
            <input
              id="measurement-answer"
              type="number"
              inputMode="numeric"
              name="answer"
              autoComplete="off"
              spellCheck={false}
              value={state.numericAnswer}
              onChange={(e) => applyAction({ action: "set_numeric", value: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "data-chart" && Array.isArray(p.categories) && Array.isArray(p.counts)) {
    return (
      <div className="template-lab">
        <BarChartVisual categories={p.categories as string[]} counts={p.counts as number[]} />
        <p className="story-card">{String(p.prompt ?? p.question)}</p>
        <div className="answer-field">
          <label htmlFor="chart-answer">
            Your answer
            <input
              id="chart-answer"
              type="number"
              inputMode="numeric"
              name="answer"
              autoComplete="off"
              spellCheck={false}
              value={state.numericAnswer}
              onChange={(e) => applyAction({ action: "set_numeric", value: e.target.value })}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "geometry") {
    return (
      <div className="template-lab">
        <ShapeVisual shape={String(p.shape)} parts={typeof p.parts === "number" ? p.parts : undefined} />
        <p className="story-card">{String(p.prompt)}</p>
        <div className="answer-field">
          <label htmlFor="geometry-answer">
            {typeof p.parts === "number" ? "Name the equal parts" : "Number of sides"}
            <input
              id="geometry-answer"
              name="answer"
              autoComplete="off"
              value={state.textResponse || state.numericAnswer}
              onChange={(e) => {
                applyAction({ action: "set_text", text: e.target.value });
                applyAction({ action: "set_numeric", value: e.target.value });
              }}
            />
          </label>
        </div>
      </div>
    );
  }

  if (state.labId === "time-money") {
    const mode = String(p.mode ?? (p.time ? "clock" : "money"));
    return (
      <div className="template-lab">
        <p className="story-card">{String(p.prompt)}</p>
        {mode === "clock" && typeof p.time === "string" && <ClockVisual time={p.time} />}
        {mode === "money" && typeof p.coins === "string" && <CoinVisual coins={p.coins} />}
        <div className="answer-field">
          <label htmlFor="time-money-answer">
            {mode === "clock" ? "Write the time" : "Total cents"}
            <input
              id="time-money-answer"
              name="answer"
              autoComplete="off"
              value={state.textResponse || state.numericAnswer}
              onChange={(e) => {
                applyAction({ action: "set_text", text: e.target.value });
                applyAction({ action: "set_numeric", value: e.target.value });
              }}
            />
          </label>
        </div>
      </div>
    );
  }

  // Fallback for any remaining template types
  return (
    <div className="template-lab form-grid">
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
            name="answer"
            autoComplete="off"
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
