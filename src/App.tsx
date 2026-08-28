import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { WebMCPBanner } from "./components/WebMCPBanner";
import { useWebMCPCurriculum } from "./webmcp/register";
import { HomePage } from "./pages/HomePage";
import { DemoHubPage } from "./pages/DemoHubPage";
import { MathLabPage } from "./pages/MathLabPage";
import { ElaLabPage } from "./pages/ElaLabPage";
import { ScienceLabPage } from "./pages/ScienceLabPage";
import { CatalogPage } from "./pages/CatalogPage";

type Accent = "green" | "pink" | "orange" | "yellow";

function accentForPath(pathname: string): Accent {
  if (pathname === "/") return "green";
  if (pathname === "/demo") return "pink";
  if (pathname === "/demo/math") return "green";
  if (pathname === "/demo/ela") return "pink";
  if (pathname === "/demo/science") return "orange";
  if (pathname === "/catalog") return "yellow";
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
        <WebMCPBanner />
        <nav className="top-nav" aria-label="Main">
          <Link to="/" className="brand">
            <span aria-hidden="true">🏝️</span> Inquiry Island
          </Link>
          <div className="nav-links">
            <Link to="/demo" className={pathname.startsWith("/demo") ? "active" : undefined}>
              Demo
            </Link>
            <Link to="/catalog" className={pathname === "/catalog" ? "active" : undefined}>
              Catalog
            </Link>
          </div>
        </nav>
        <main id="main-content" tabIndex={-1} data-accent={accent}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/demo" element={<DemoHubPage />} />
            <Route path="/demo/math" element={<MathLabPage />} />
            <Route path="/demo/ela" element={<ElaLabPage />} />
            <Route path="/demo/science" element={<ScienceLabPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
