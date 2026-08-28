import { LabShell } from "../components/LabShell";
import { MatterLab } from "../components/MatterLab";
import { LabPage } from "./LabPage";

export function ScienceLabPage() {
  return (
    <LabPage labId="matter-lab" standardCode="PS.2.1">
      <LabShell title="Matter Lab">
        <MatterLab />
      </LabShell>
    </LabPage>
  );
}
