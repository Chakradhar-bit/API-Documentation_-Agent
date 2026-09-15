import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Splash } from "./components/Splash";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ApiExplorer from "./pages/ApiExplorer";
import Changes from "./pages/Changes";
import ChangeDetails from "./pages/ChangeDetails";
import Documentation from "./pages/Documentation";
import Repository from "./pages/Repository";

/** Wraps the authenticated-style app shell and animates each page on navigation. */
function Shell() {
  const { pathname } = useLocation();
  return (
    <Layout>
      <div key={pathname} className="animate-fade-up">
        <Outlet />
      </div>
    </Layout>
  );
}

export default function App() {
  const [splash, setSplash] = useState<"showing" | "fading" | "gone">("showing");
  const location = useLocation();
  const navigate = useNavigate();

  // Startup animation ≈ 1.6s, then a smooth fade into the launch page.
  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplash("fading"), 1250);
    const doneTimer = setTimeout(() => setSplash("gone"), 1750);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const launch = <Landing onLaunch={() => navigate("/dashboard")} onDemo={() => navigate("/dashboard?demo=1")} />;

  return (
    <>
      {splash !== "gone" && <Splash fading={splash === "fading"} />}

      <div key={location.pathname === "/" ? "landing" : "app"} className="animate-fade-in">
        <Routes>
          <Route path="/" element={launch} />
          <Route element={<Shell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explorer" element={<ApiExplorer />} />
            <Route path="/changes" element={<Changes />} />
            <Route path="/changes/:id" element={<ChangeDetails />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/repository" element={<Repository />} />
            <Route path="*" element={launch} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

