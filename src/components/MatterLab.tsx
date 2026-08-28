import { useApp } from "../context/AppContext";
import { getIceStateAfterHeat } from "../boards/matterLab";

export function MatterLab() {
  const { boardState, applyAction } = useApp();

  if (!boardState || boardState.labId !== "matter-lab") return null;

  const iceAfter = getIceStateAfterHeat(boardState);

  return (
    <div className="matter-lab">
      <div className="temp-control">
        <label htmlFor="temp-slider">
          Temperature: <span className="tabular">{boardState.temperatureC}°C</span>
        </label>
        <input
          id="temp-slider"
          name="temperature"
          type="range"
          min={-10}
          max={40}
          value={boardState.temperatureC}
          aria-valuemin={-10}
          aria-valuemax={40}
          aria-valuenow={boardState.temperatureC}
          onChange={(e) =>
            applyAction({ action: "set_temperature", celsius: Number(e.target.value) })
          }
        />
        <button
          type="button"
          className="btn primary"
          onClick={() => applyAction({ action: "run_state_change" })}
        >
          Run Heat/Cool Step
        </button>
      </div>

      <div className="object-grid">
        {boardState.objects.map((obj) => (
          <article key={obj.id} className="object-card">
            <h3>{obj.name}</h3>
            <p>
              Now: <strong>{obj.state}</strong>
            </p>
            <div className="classify-btns" role="group" aria-label={`Classify ${obj.name}`}>
              <button
                type="button"
                className={`btn ${boardState.classifications[obj.id] === "solid" ? "primary" : "secondary"}`}
                aria-pressed={boardState.classifications[obj.id] === "solid"}
                onClick={() =>
                  applyAction({
                    action: "classify_object",
                    objectId: obj.id,
                    classification: "solid",
                  })
                }
              >
                Solid
              </button>
              <button
                type="button"
                className={`btn ${boardState.classifications[obj.id] === "liquid" ? "primary" : "secondary"}`}
                aria-pressed={boardState.classifications[obj.id] === "liquid"}
                onClick={() =>
                  applyAction({
                    action: "classify_object",
                    objectId: obj.id,
                    classification: "liquid",
                  })
                }
              >
                Liquid
              </button>
            </div>
          </article>
        ))}
      </div>

      <fieldset className="predict-row">
        <legend>Predict Ice After Heating</legend>
        <button
          type="button"
          className="btn secondary"
          aria-pressed={boardState.prediction === "solid"}
          onClick={() => applyAction({ action: "predict_state", state: "solid" })}
        >
          Solid
        </button>
        <button
          type="button"
          className="btn secondary"
          aria-pressed={boardState.prediction === "liquid"}
          onClick={() => applyAction({ action: "predict_state", state: "liquid" })}
        >
          Liquid
        </button>
        <p className="hint">
          Ice → {iceAfter} at <span className="tabular">{boardState.temperatureC}°C</span>
        </p>
      </fieldset>

      {boardState.observations.length > 0 && (
        <section aria-label="Observations">
          <h2 className="section-label">Observations</h2>
          <ul className="observations">
            {boardState.observations.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
