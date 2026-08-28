import { LabShell } from "../components/LabShell";
import { PlaceValueLab } from "../components/PlaceValueLab";
import { LabPage } from "./LabPage";

export function MathLabPage() {
  return (
    <LabPage labId="place-value" standardCode="NC.2.NBT.1" title="Place Value Island">
      <LabShell title="Place Value Island">
        <PlaceValueLab />
      </LabShell>
    </LabPage>
  );
}
