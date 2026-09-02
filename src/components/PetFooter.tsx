import { useEffect, useRef, useState } from "react";
import { IslandPet } from "./IslandPet";
import { isPetVisible, PET_PREFS_EVENT } from "../services/pet";

/** Reserved bottom lane for the lab buddy — collapses when hidden. */
export function PetFooter() {
  const laneRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => isPetVisible());

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

  return (
    <footer className="pet-footer" aria-label="Lab buddy area">
      <div ref={laneRef} className="pet-footer-lane">
        <IslandPet laneRef={laneRef} />
      </div>
    </footer>
  );
}
