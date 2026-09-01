import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatedLayout } from "./components/AnimatedLayout";
import { AppProvider } from "./context/AppContext";
import { IslandPet } from "./components/IslandPet";
import { useWebMCPCurriculum } from "./webmcp/register";
import { HomePage } from "./pages/HomePage";
import { Grade2HubPage } from "./pages/Grade2HubPage";
import { SubjectBrowserPage } from "./pages/SubjectBrowserPage";
import { StandardLabPage } from "./pages/StandardLabPage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProgressScoreboardPage } from "./pages/ProgressScoreboardPage";

type Accent = "green" | "pink" | "orange" | "yellow";

function accentForPath(pathname: string): Accent {
  if (pathname === "/") return "green";
  if (pathname === "/grade-2") return "yellow";
  if (pathname.startsWith("/grade-2/progress")) return "yellow";
  if (pathname.startsWith("/catalog")) return "yellow";
  if (
    pathname.startsWith("/grade-2/ela") ||
    pathname.startsWith("/lab/W.") ||
    pathname.startsWith("/lab/RL.") ||
    pathname.startsWith("/lab/RI.") ||
    pathname.startsWith("/lab/RF.") ||
    pathname.startsWith("/lab/SL.") ||
    pathname.startsWith("/lab/L.")
  ) {
    return "pink";
  }
  if (pathname.startsWith("/grade-2/science") || pathname.startsWith("/lab/2.")) return "orange";
  if (pathname.startsWith("/grade-2/math") || pathname.startsWith("/lab/NC.")) return "green";
  return "green";
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  useWebMCPCurriculum();

  return (
    <BrowserRouter>
      <AppChrome />
    </BrowserRouter>
  );
}

function AppChrome() {
  const { pathname } = useLocation();
  const accent = accentForPath(pathname);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="app">
        <nav className="top-nav" aria-label="Main">
          <Link to="/" className="brand">
            <span aria-hidden="true">🏝️</span> Inquiry Island
          </Link>
          <div className="nav-links">
            <Link to="/grade-2" className={pathname.startsWith("/grade-2") || pathname.startsWith("/lab") ? "active" : undefined}>
              Grade 2
            </Link>
            <Link to="/grade-2/progress" className={pathname.startsWith("/grade-2/progress") ? "active" : undefined}>
              Progress
            </Link>
            <Link to="/catalog" className={pathname === "/catalog" ? "active" : undefined}>
              Catalog
            </Link>
          </div>
        </nav>
        <main id="main-content" tabIndex={-1} data-accent={accent}>
          <Routes>
            <Route element={<AnimatedLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/grade-2/progress" element={<ProgressScoreboardPage />} />
              <Route path="/grade-2" element={<Grade2HubPage />} />
              <Route path="/grade-2/:subject" element={<SubjectBrowserPage />} />
              <Route path="/lab/:standardCode" element={<StandardLabPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/demo" element={<Navigate to="/grade-2" replace />} />
              <Route path="/demo/math" element={<Navigate to="/lab/NC.2.NBT.1" replace />} />
              <Route path="/demo/ela" element={<Navigate to="/lab/W.2.1" replace />} />
              <Route path="/demo/science" element={<Navigate to="/lab/2.P.2.1" replace />} />
            </Route>
          </Routes>
        </main>
        <IslandPet />
      </div>
    </>
  );
}
