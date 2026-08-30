import { Outlet, useLocation } from "react-router-dom";

export function AnimatedLayout() {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="route-transition">
      <Outlet />
    </div>
  );
}
