import { Navigate, useLocation } from "react-router-dom";

const DEMO_MAP: Record<string, string> = {
  "/demo": "/grade-2",
  "/demo/math": "/lab/NC.2.NBT.1",
  "/demo/ela": "/lab/W.2.1",
  "/demo/science": "/lab/2.P.2.1",
};

export function DemoRedirect() {
  const { pathname } = useLocation();
  const target = DEMO_MAP[pathname] ?? "/grade-2";
  return <Navigate to={target} replace />;
}
