import { useState } from "react";
import { useApp } from "../context/AppContext";
import { buildOpinionParagraph } from "../boards/opinionBuilder";

const LINKING = ["because", "also", "for example", "first", "next", "finally"];

export function OpinionBuilderLab() {
  const { boardState, applyAction, acceptRevision, rejectRevision } = useApp();
  const [reasonInput, setReasonInput] = useState("");
  const [topicInput, setTopicInput] = useState("recess");
  const [opinionInput, setOpinionInput] = useState("Recess should be longer.");

  if (!boardState || boardState.labId !== "opinion-builder") return null;

  return (
    <div className="opinion-lab">
      <div className="form-grid">
        <label>
          Topic
          <input
            value={boardState.topic || topicInput}
            onChange={(e) => {
              setTopicInput(e.target.value);
              applyAction({ action: "place_sentence_part", part: "topic", text: e.target.value });
            }}
          />
        </label>
        <label>
          Opinion
          <input
            value={boardState.opinion || opinionInput}
            onChange={(e) => {
              setOpinionInput(e.target.value);
              applyAction({ action: "place_sentence_part", part: "opinion", text: e.target.value });
            }}
          />
        </label>
        <label>
          Add a reason
          <div className="inline-field">
            <input
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="We need time to play and rest"
            />
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                if (!reasonInput.trim()) return;
                applyAction({ action: "add_reason", text: reasonInput });
                setReasonInput("");
              }}
            >
              Add
            </button>
          </div>
        </label>
      </div>

      <div className="linking-row">
        <span>Linking words:</span>
        {LINKING.map((word) => (
          <button
            key={word}
            type="button"
            className="chip-btn"
            onClick={() => applyAction({ action: "insert_linking_word", word })}
          >
            {word}
          </button>
        ))}
      </div>

      {boardState.pendingRevision && (
        <div className="revision-card">
          <p>
            <strong>Agent suggests:</strong> {boardState.pendingRevision}
          </p>
          <button type="button" className="btn primary" onClick={acceptRevision}>
            Accept
          </button>
          <button type="button" className="btn secondary" onClick={rejectRevision}>
            Reject
          </button>
        </div>
      )}

      <div className="paragraph-preview">
        <h2>Your paragraph</h2>
        <p>{buildOpinionParagraph(boardState) || "Start writing your opinion…"}</p>
        <ul>
          {boardState.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
