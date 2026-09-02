import { useEffect, useRef, useState } from "react";
import { CharacterSpeech } from "./CharacterSpeech";
import { IslandPet, type PetSpeechDockState } from "./IslandPet";
import { isPetVisible, PET_PREFS_EVENT, setPetVisible } from "../services/pet";

/** Reserved bottom lane for the lab buddy — collapses when hidden. */
export function PetFooter() {
  const laneRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => isPetVisible());
  const [dock, setDock] = useState<PetSpeechDockState | null>(null);

  useEffect(() => {
    const onPrefs = (event: Event) => {
      const detail = (event as CustomEvent<{ visible?: boolean }>).detail;
      if (detail && typeof detail.visible === "boolean") setVisible(detail.visible);
      else setVisible(isPetVisible());
    };
    window.addEventListener(PET_PREFS_EVENT, onPrefs);
    return () => window.removeEventListener(PET_PREFS_EVENT, onPrefs);
  }, []);

  if (!visible) return null;

  const confirmHide = () => {
    setPetVisible(false);
    setDock(null);
  };

  return (
    <footer className="pet-footer" aria-label="Lab buddy area">
      {dock && (dock.line || dock.hint) && (
        <div
          className={`pet-footer-speech-dock pet-footer-speech-dock--${dock.side}`}
          aria-live="polite"
        >
          {dock.line && !dock.hint && <CharacterSpeech text={dock.line} compact live />}
          {dock.hint && (
            <div className="island-pet-hint" role="dialog" aria-label="Hide pet">
              <span>{dock.hint}</span>
              <button type="button" className="island-pet-hide" onClick={confirmHide}>
                Hide
              </button>
            </div>
          )}
        </div>
      )}
      <div ref={laneRef} className="pet-footer-lane">
        <IslandPet laneRef={laneRef} onSpeechDockChange={setDock} />
      </div>
    </footer>
  );
}
