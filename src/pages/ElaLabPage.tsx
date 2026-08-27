import { useEffect } from "react";
import { LabShell } from "../components/LabShell";
import { OpinionBuilderLab } from "../components/OpinionBuilderLab";
import { useApp } from "../context/AppContext";
import { useWebMCP } from "../webmcp/register";

export function ElaLabPage() {
  const { setActiveLab, labId } = useApp();

  useEffect(() => {
    setActiveLab("opinion-builder", "W.2.1");
  }, [setActiveLab]);

  useWebMCP(labId);

  return (
    <LabShell title="Opinion Builder">
      <OpinionBuilderLab />
    </LabShell>
  );
}
