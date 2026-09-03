import { emitAgentEvent } from "./events";

type NavigateFn = (to: string) => void;

let navigateFn: NavigateFn | null = null;
let currentPathname = typeof window !== "undefined" ? window.location.pathname : "/";

export function bindWebMCPNavigation(navigate: NavigateFn): () => void {
  navigateFn = navigate;
  return () => {
    if (navigateFn === navigate) navigateFn = null;
  };
}

export function reportWebMCPPathname(pathname: string): void {
  if (pathname === currentPathname) return;
  currentPathname = pathname;
  emitAgentEvent("route_changed", { pathname });
}

export function getWebMCPPathname(): string {
  return currentPathname;
}

export function navigateWebMCP(to: string): { ok: true; path: string } | { error: string } {
  if (!navigateFn) {
    return { error: "Navigation is not ready yet. Try again in a moment." };
  }
  navigateFn(to);
  currentPathname = to.split("?")[0] ?? to;
  emitAgentEvent("route_changed", { pathname: currentPathname, via: "agent" });
  return { ok: true, path: to };
}
