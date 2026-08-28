import { useApp } from "../context/AppContext";
import { blocksToValue, countBlocks } from "../boards/placeValue";
import type { BlockType } from "../types";

const BLOCKS: { type: BlockType; label: string; emoji: string }[] = [
  { type: "hundred", label: "Hundred", emoji: "🟦" },
  { type: "ten", label: "Ten", emoji: "🟩" },
  { type: "one", label: "One", emoji: "🟨" },
];

export function PlaceValueLab() {
  const { boardState, applyAction } = useApp();

  if (!boardState || boardState.labId !== "place-value") return null;

  const value = blocksToValue(boardState.blocks);
  const counts = countBlocks(boardState.blocks);

  return (
    <div className="place-value-lab">
      <section className="target-card" aria-label="Target number">
        <h2>Build This Number</h2>
        <p className="target-number" aria-live="polite">
          {boardState.targetNumber}
        </p>
        <p className="current-value">
          Your board: <span className="tabular">{value}</span>
        </p>
        <p className="counts tabular">
          {counts.hundreds} hundreds · {counts.tens} tens · {counts.ones} ones
        </p>
      </section>

      <div className="block-tray" role="group" aria-label="Block tools">
        {BLOCKS.map((b) => (
          <button
            key={b.type}
            type="button"
            className="block-btn"
            onClick={() => applyAction({ action: "place_block", block: b.type })}
            aria-label={`Add ${b.label} block`}
          >
            <span aria-hidden="true">{b.emoji}</span>
            {b.label}
          </button>
        ))}
        <button
          type="button"
          className="btn secondary"
          onClick={() => applyAction({ action: "group_by_tens" })}
        >
          Group 10 Ones → 1 Ten
        </button>
      </div>

      <div className="block-area" role="list" aria-label="Base-ten blocks on the board">
        {boardState.blocks.length === 0 ? (
          <p className="empty-state">Tap a block to start building…</p>
        ) : (
          boardState.blocks.map((block, i) => (
            <span
              key={`${block}-${i}`}
              className={`block piece-${block}`}
              role="listitem"
              aria-label={block}
            >
              <span aria-hidden="true">
                {block === "hundred" ? "🟦" : block === "ten" ? "🟩" : "🟨"}
              </span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
