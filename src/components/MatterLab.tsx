import { useApp } from "../context/AppContext";
import { getIceStateAfterHeat } from "../boards/matterLab";

export function MatterLab() {
  const { boardState, applyAction } = useApp();

  if (!boardState || boardState.labId !== "matter-lab") return null;

  const iceAfter = getIceStateAfterHeat(boardState);

  return (
    <div className="matter-lab">
      <div className="temp-control">
        <label htmlFor="temp">Temperature: {boardState.temperatureC}°C</label>
        <input
          id="temp"
          type="range"
          min={-10}
          max={40}
          value={boardState.temperatureC}
          onChange={(e) =>
            applyAction({ action: "set_temperature", celsius: Number(e.target.value) })
          }
        />
        <button
          type="button"
          className="btn primary"
          onClick={() => applyAction({ action: "run_state_change" })}
        >
          Run heat/cool step
        </button>
      </div>

      <div className="object-grid">
        {boardState.objects.map((obj) => (
          <div key={obj.id} className="object-card">
            <h3>{obj.name}</h3>
            <p>Now: {obj.state}</p>
            <div className="classify-btns">
              <button
                type="button"
                className={`btn ${boardState.classifications[obj.id] === "solid" ? "primary" : "secondary"}`}
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
          </div>
        ))}
      </div>

      <div className="predict-row">
        <span>Predict ice after heating:</span>
        <button
          type="button"
          className="btn secondary"
          onClick={() => applyAction({ action: "predict_state", state: "solid" })}
        >
          Solid
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => applyAction({ action: "predict_state", state: "liquid" })}
        >
          Liquid
        </button>
        <span className="hint">Ice → {iceAfter} at {boardState.temperatureC}°C</span>
      </div>

      {boardState.observations.length > 0 && (
        <ul className="observations">
          {boardState.observations.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
