import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { IconAlert, IconCode, IconDoc, IconGauge, IconRepo } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: IconGauge },
  { to: "/explorer", label: "API Explorer", icon: IconCode },
  { to: "/changes", label: "Changes", icon: IconAlert },
  { to: "/documentation", label: "Documentation", icon: IconDoc },
  { to: "/repository", label: "Repository", icon: IconRepo },
];

function navClasses(isActive: boolean) {
  return `inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-blue-50 text-blue-800 shadow-panel ring-1 ring-inset ring-blue-100"
      : "text-ink-soft hover:bg-gray-100 hover:text-ink"
  }`;
}

export function LogoMark({ small = false }: { small?: boolean }) {
  const box = small ? "h-9 w-9 rounded-xl" : "h-16 w-16 rounded-2xl";
  const glyph = small ? "h-5 w-5" : "h-9 w-9";
  return (
    <div
      className={`${box} flex shrink-0 items-center justify-center bg-blue-600 shadow-btn ring-1 ring-inset ring-blue-700/15`}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={glyph}
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5" />
        <path d="M9.6 12.6 8.2 14l1.4 1.4" />
        <path d="M14.4 12.6 15.8 14l-1.4 1.4" />
      </svg>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3 rounded-lg transition-opacity hover:opacity-90">
            <LogoMark small />
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-semibold leading-tight text-ink">
                API Documentation Agent
              </span>
              <span className="block truncate text-[11px] leading-tight text-ink-mute">
                Keeping APIs and documentation in sync
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => navClasses(isActive)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
            </nav>
          </div>
        </div>

        {/* Compact navigation for tablet/mobile — stays usable without a drawer. */}
        <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-3 py-2 md:hidden">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => navClasses(isActive)}>
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 lg:px-8">{children}</main>

      <footer className="border-t border-gray-200 bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-ink-mute sm:px-6 lg:px-8">
          <span>API Documentation Agent — deterministic API change analysis for FastAPI backends</span>
          <span>OpenAPI 3.0.3 · SQLite</span>
        </div>
      </footer>
    </div>
  );
}

