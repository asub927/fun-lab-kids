import { useLayoutEffect } from "react";
import type { LabId } from "../types";
import { useApp } from "../context/AppContext";
import { useWebMCPLab } from "../webmcp/register";

type LabPageProps = {
  labId: LabId;
  standardCode: string;
  title: string;
  children: React.ReactNode;
};

export function LabPage({ labId, standardCode, title, children }: LabPageProps) {
  const { setActiveLab } = useApp();

  useLayoutEffect(() => {
    setActiveLab(labId, standardCode);
  }, [labId, standardCode, setActiveLab]);

  useWebMCPLab(labId);

  return (
    <>
      <h1 className="sr-only">{title}</h1>
      {children}
    </>
  );
}
