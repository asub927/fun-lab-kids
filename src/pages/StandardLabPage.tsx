import { Navigate, useParams } from "react-router-dom";
import { LabShell } from "../components/LabShell";
import { PlaceValueLab } from "../components/PlaceValueLab";
import { OpinionBuilderLab } from "../components/OpinionBuilderLab";
import { MatterLab } from "../components/MatterLab";
import { TemplateLab } from "../components/TemplateLab";
import { useApp } from "../context/AppContext";
import { findStandard, isPlayable } from "../data/standards";
import { resolveLabForStandard } from "../data/activities";
import { LabPage } from "./LabPage";
import type { LabId, TemplateBoardState } from "../types";

export function StandardLabPage() {
  const { standardCode = "" } = useParams();
  const decoded = decodeURIComponent(standardCode);
  const standard = findStandard(decoded);
  const resolved = resolveLabForStandard(decoded);

  if (!standard || !resolved || !isPlayable(standard)) {
    return <Navigate to="/grade-2" replace />;
  }

  const title = standard.strand.split("—")[0]?.trim() ?? standard.subject;

  return (
    <LabPage labId={resolved.labId} standardCode={decoded}>
      <LabShell title={titleForLab(standard.code, title)}>
        <LabBody labId={resolved.labId} />
      </LabShell>
    </LabPage>
  );
}

function titleForLab(code: string, fallback: string): string {
  const names: Record<string, string> = {
    "NC.2.NBT.1": "Place Value Island",
    "W.2.1": "Opinion Builder",
    "2.P.2.1": "Matter Lab",
  };
  return names[code] ?? fallback;
}

function LabBody({ labId }: { labId: LabId }) {
  const { boardState } = useApp();

  if (labId === "place-value") return <PlaceValueLab />;
  if (labId === "opinion-builder") return <OpinionBuilderLab />;
  if (labId === "matter-lab") return <MatterLab />;
  if (boardState && boardState.labId !== "place-value" && boardState.labId !== "opinion-builder" && boardState.labId !== "matter-lab") {
    return <TemplateLab state={boardState as TemplateBoardState} />;
  }
  return null;
}
