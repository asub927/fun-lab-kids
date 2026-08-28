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
        <label htmlFor="opinion-topic">
          Topic
          <input
            id="opinion-topic"
            name="topic"
            autoComplete="off"
            spellCheck={false}
            value={boardState.topic || topicInput}
            onChange={(e) => {
              setTopicInput(e.target.value);
              applyAction({ action: "place_sentence_part", part: "topic", text: e.target.value });
            }}
          />
        </label>
        <label htmlFor="opinion-text">
          Opinion
          <input
            id="opinion-text"
            name="opinion"
            autoComplete="off"
            value={boardState.opinion || opinionInput}
            onChange={(e) => {
              setOpinionInput(e.target.value);
              applyAction({ action: "place_sentence_part", part: "opinion", text: e.target.value });
            }}
          />
        </label>
        <label htmlFor="opinion-reason">
          Add a Reason
          <div className="inline-field">
            <input
              id="opinion-reason"
              name="reason"
              autoComplete="off"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="We need time to play and rest…"
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
              Add Reason
            </button>
          </div>
        </label>
      </div>

      <fieldset className="linking-row">
        <legend>Linking Words</legend>
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
      </fieldset>

      {boardState.pendingRevision && (
        <div className="revision-card" role="region" aria-label="Agent suggestion">
          <p>
            <strong>Agent suggests:</strong> {boardState.pendingRevision}
          </p>
          <div className="revision-actions">
            <button type="button" className="btn primary" onClick={acceptRevision}>
              Accept
            </button>
            <button type="button" className="btn secondary" onClick={rejectRevision}>
              Reject
            </button>
          </div>
        </div>
      )}

      <section className="paragraph-preview" aria-label="Your paragraph">
        <h2>Your Paragraph</h2>
        <p>{buildOpinionParagraph(boardState) || "Start writing your opinion…"}</p>
        {boardState.reasons.length > 0 && (
          <ul>
            {boardState.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
