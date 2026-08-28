import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { WebMCPBanner } from "./components/WebMCPBanner";
import { useWebMCPCurriculum } from "./webmcp/register";
import { HomePage } from "./pages/HomePage";
import { DemoHubPage } from "./pages/DemoHubPage";
import { MathLabPage } from "./pages/MathLabPage";
import { ElaLabPage } from "./pages/ElaLabPage";
import { ScienceLabPage } from "./pages/ScienceLabPage";
import { CatalogPage } from "./pages/CatalogPage";

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
            <Link to="/demo">Demo</Link>
            <Link to="/catalog">Catalog</Link>
          </div>
        </nav>
        <main id="main-content" tabIndex={-1}>
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
    </BrowserRouter>
  );
}
