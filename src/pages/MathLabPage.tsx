import { useEffect } from "react";
import { LabShell } from "../components/LabShell";
import { PlaceValueLab } from "../components/PlaceValueLab";
import { useApp } from "../context/AppContext";
import { useWebMCP } from "../webmcp/register";

export function MathLabPage() {
  const { setActiveLab, labId } = useApp();

  useEffect(() => {
    setActiveLab("place-value", "NC.2.NBT.1");
  }, [setActiveLab]);

  useWebMCP(labId);

  return (
    <LabShell title="Place Value Island">
      <PlaceValueLab />
    </LabShell>
  );
}
