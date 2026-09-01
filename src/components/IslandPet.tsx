import { useEffect, useMemo, useState } from "react";
import {
  PET_SPECIES,
  checksToNextStage,
  stageLabel,
  type PetSpeciesId,
} from "../data/pets";
import { useApp } from "../context/AppContext";
import {
  careForPet,
  derivePetMood,
  getPetLine,
  getPetSnapshot,
  hatchPet,
  loadPet,
  renamePet,
  type PetSave,
} from "../services/pet";
import { PetSprite } from "./pets/PetSprite";

export function IslandPet() {
  const app = useApp();
  const [save, setSave] = useState<PetSave>(() => loadPet());
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [pulse, setPulse] = useState(0);
  const [reaction, setReaction] = useState<"celebrating" | "working" | null>(null);

  const snapshot = useMemo(
    () => getPetSnapshot(save),
    [save, app.lastCheck, app.lastCelebration, pulse],
  );

  const mood = derivePetMood({
    lastCheckOk: reaction === "celebrating" ? true : reaction === "working" ? false : null,
    isCelebrating: reaction === "celebrating",
    lastCaredAt: save.lastCaredAt,
  });

  const line = getPetLine(mood, snapshot.displayName, pulse + snapshot.careCount);
  const growth = checksToNextStage(snapshot.lifetimeChecks);
  const spriteStage =
    snapshot.hatched && snapshot.stage === "egg" ? "hatchling" : snapshot.stage;

  useEffect(() => {
    setPulse((value) => value + 1);
  }, [app.lastCheck, app.lastCelebration, app.questionIndex]);

  useEffect(() => {
    if (!app.lastCheck && !app.lastCelebration) return;
    const won =
      app.lastCheck?.ok === true ||
      Boolean(app.lastCelebration?.isNewMastery) ||
      Boolean(app.lastCelebration && app.lastCelebration.newAchievements.length > 0);
    setReaction(won ? "celebrating" : app.lastCheck?.ok === false ? "working" : "celebrating");
    const timer = window.setTimeout(() => setReaction(null), 4500);
    return () => window.clearTimeout(timer);
  }, [app.lastCheck, app.lastCelebration]);

  useEffect(() => {
    if (!open) return;
    setDraftName(snapshot.nickname);
  }, [open, snapshot.nickname]);

  const handleHatch = (speciesId: PetSpeciesId) => {
    setSave(hatchPet(speciesId, draftName));
    setPulse((value) => value + 1);
  };

  const handleCare = () => {
    setSave(careForPet());
    setPulse((value) => value + 1);
  };

  const handleRename = () => {
    setSave(renamePet(draftName));
  };

  return (
    <div className={`island-pet ${open ? "is-open" : ""}`}>
      {open && (
        <section id="island-pet-panel" className="island-pet-panel" aria-label="Island pet">
          {!snapshot.hatched ? (
            <div className="island-pet-hatch">
              <header className="island-pet-care-header">
                <PetSprite speciesId="pebble" stage="egg" mood="idle" />
                <div>
                  <h2 className="island-pet-title">Hatch your Island Pet</h2>
                  <p className="island-pet-copy">
                    Pick a buddy. They grow when you practice and cheer when you win.
                  </p>
                </div>
                <button
                  type="button"
                  className="island-pet-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close pet panel"
                >
                  ×
                </button>
              </header>
              <label className="island-pet-name-field" htmlFor="pet-nickname">
                Nickname (optional)
                <input
                  id="pet-nickname"
                  name="pet-nickname"
                  maxLength={16}
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Pebble…"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <div className="island-pet-species-grid" role="list">
                {PET_SPECIES.map((species) => (
                  <button
                    key={species.id}
                    type="button"
                    className={`island-pet-species ${species.accentClass}`}
                    role="listitem"
                    onClick={() => handleHatch(species.id)}
                  >
                    <PetSprite speciesId={species.id} stage="buddy" mood="idle" />
                    <span className="island-pet-species-name">{species.name}</span>
                    <span className="island-pet-species-tag">{species.tagline}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="island-pet-care">
              <header className="island-pet-care-header">
                <PetSprite speciesId={snapshot.speciesId!} stage={spriteStage} mood={mood} />
                <div>
                  <h2 className="island-pet-title">{snapshot.displayName}</h2>
                  <p className="island-pet-stage">
                    {stageLabel(snapshot.stage)}
                    {growth.next
                      ? ` · ${growth.remaining} checks to ${stageLabel(growth.next)}`
                      : " · Max level"}
                  </p>
                </div>
                <button
                  type="button"
                  className="island-pet-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close pet panel"
                >
                  ×
                </button>
              </header>

              <p className="island-pet-speech" role="status" aria-live="polite">
                {line}
              </p>

              <div className="island-pet-stats" aria-label="Pet stats">
                <span>{snapshot.totalXp} Island Points</span>
                <span>{snapshot.currentStreak} day streak</span>
                <span>{snapshot.careCount} cares</span>
              </div>

              <div className="island-pet-actions">
                <button type="button" className="btn primary" onClick={handleCare}>
                  High Five
                </button>
                <label className="island-pet-name-field island-pet-name-field--inline" htmlFor="pet-rename">
                  Rename
                  <input
                    id="pet-rename"
                    name="pet-rename"
                    maxLength={16}
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    onBlur={handleRename}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </label>
              </div>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        className={`island-pet-toggle pet-mood-${mood}`}
        aria-expanded={open}
        aria-controls="island-pet-panel"
        onClick={() => setOpen((value) => !value)}
      >
        {snapshot.hatched && snapshot.speciesId ? (
          <PetSprite speciesId={snapshot.speciesId} stage={spriteStage} mood={mood} />
        ) : (
          <PetSprite speciesId="pebble" stage="egg" mood="idle" />
        )}
        <span className="island-pet-toggle-label">
          {snapshot.hatched ? snapshot.displayName : "Hatch Pet"}
        </span>
      </button>
    </div>
  );
}
