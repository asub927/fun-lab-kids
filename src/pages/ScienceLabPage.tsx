import { useEffect } from "react";
import { LabShell } from "../components/LabShell";
import { MatterLab } from "../components/MatterLab";
import { useApp } from "../context/AppContext";
import { useWebMCP } from "../webmcp/register";

export function ScienceLabPage() {
  const { setActiveLab, labId } = useApp();

  useEffect(() => {
    setActiveLab("matter-lab", "PS.2.1");
  }, [setActiveLab]);

  useWebMCP(labId);

  return (
    <LabShell title="Matter Lab">
      <MatterLab />
    </LabShell>
  );
}
