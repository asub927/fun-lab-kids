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
      <div className="target-card">
        <h2>Build this number</h2>
        <p className="target-number">{boardState.targetNumber}</p>
        <p className="current-value">Your board: {value}</p>
        <p className="counts">
          {counts.hundreds} hundreds · {counts.tens} tens · {counts.ones} ones
        </p>
      </div>

      <div className="block-tray">
        {BLOCKS.map((b) => (
          <button
            key={b.type}
            type="button"
            className="block-btn"
            onClick={() => applyAction({ action: "place_block", block: b.type })}
            aria-label={`Add ${b.label} block`}
          >
            <span aria-hidden>{b.emoji}</span>
            {b.label}
          </button>
        ))}
        <button
          type="button"
          className="btn secondary"
          onClick={() => applyAction({ action: "group_by_tens" })}
        >
          Group 10 ones → 1 ten
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() =>
            applyAction({ action: "compose_number", value: boardState.targetNumber })
          }
        >
          Auto-build target
        </button>
      </div>

      <div className="block-area" aria-label="Base-ten blocks">
        {boardState.blocks.map((block, i) => (
          <span key={`${block}-${i}`} className={`block piece-${block}`} title={block}>
            {block === "hundred" ? "🟦" : block === "ten" ? "🟩" : "🟨"}
          </span>
        ))}
      </div>
    </div>
  );
}
