import { useEffect, useState } from "react";
import { IslandPet } from "./IslandPet";
import { isPetVisible, PET_PREFS_EVENT } from "../services/pet";

/** Viewport overlay for the ambient lab buddy — no reserved footer lane. */
export function PetFooter() {
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
    <div className="pet-ambient" aria-label="Lab buddy">
      <IslandPet />
    </div>
  );
}
