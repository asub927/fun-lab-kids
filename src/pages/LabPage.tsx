import { useLayoutEffect } from "react";
import type { LabId } from "../types";
import { useApp } from "../context/AppContext";

type LabPageProps = {
  labId: LabId;
  standardCode: string;
  children: React.ReactNode;
};

export function LabPage({ labId, standardCode, children }: LabPageProps) {
  const { setActiveLab } = useApp();

  useLayoutEffect(() => {
    setActiveLab(labId, standardCode);
  }, [labId, standardCode, setActiveLab]);

  return <div className="page lab-page">{children}</div>;
}
