import { LabShell } from "../components/LabShell";
import { OpinionBuilderLab } from "../components/OpinionBuilderLab";
import { LabPage } from "./LabPage";

export function ElaLabPage() {
  return (
    <LabPage labId="opinion-builder" standardCode="W.2.1" title="Opinion Builder">
      <LabShell title="Opinion Builder">
        <OpinionBuilderLab />
      </LabShell>
    </LabPage>
  );
}
