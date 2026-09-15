// src/App.tsx
import { useEffect as useEffect8, useState as useState9 } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate as useNavigate3 } from "react-router-dom";

// src/components/Layout.tsx
import { Link, NavLink } from "react-router-dom";

// src/components/icons.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true
};
function IconGauge({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7.5", height: "7.5", rx: "1.6" }),
    /* @__PURE__ */ jsx("rect", { x: "13.5", y: "3", width: "7.5", height: "7.5", rx: "1.6" }),
    /* @__PURE__ */ jsx("rect", { x: "3", y: "13.5", width: "7.5", height: "7.5", rx: "1.6" }),
    /* @__PURE__ */ jsx("rect", { x: "13.5", y: "13.5", width: "7.5", height: "7.5", rx: "1.6" })
  ] });
}
function IconCode({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("polyline", { points: "9 17 4 12 9 7" }),
    /* @__PURE__ */ jsx("polyline", { points: "15 7 20 12 15 17" })
  ] });
}
function IconAlert({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("path", { d: "M10.6 3.9 2.8 17.1A1.9 1.9 0 0 0 4.4 20h15.2a1.9 1.9 0 0 0 1.6-2.9L13.4 3.9a1.9 1.9 0 0 0-2.8 0Z" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "9.5", x2: "12", y2: "13.5" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "16.5", x2: "12", y2: "16.6" })
  ] });
}
function IconDoc({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("path", { d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" }),
    /* @__PURE__ */ jsx("path", { d: "M14 3v5h5" }),
    /* @__PURE__ */ jsx("path", { d: "M9.5 12.5 8 14l1.5 1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M14.5 12.5 16 14l-1.5 1.5" })
  ] });
}
function IconRepo({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5.5A1.5 1.5 0 0 1 4 18.5Z" }),
    /* @__PURE__ */ jsx("path", { d: "M4 16.5h13" }),
    /* @__PURE__ */ jsx("path", { d: "M8 4v9" })
  ] });
}
function IconPlay({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsx("svg", { ...base, className, children: /* @__PURE__ */ jsx("path", { d: "M6 4.8v14.4a.8.8 0 0 0 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L7.2 4.1A.8.8 0 0 0 6 4.8Z" }) });
}
function IconRefresh({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("path", { d: "M20 12a8 8 0 1 1-2.6-5.9" }),
    /* @__PURE__ */ jsx("polyline", { points: "20 4 20 10 14 10" })
  ] });
}
function IconCheckCircle({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("polyline", { points: "8.5 12.3 11 14.8 15.8 9.5" })
  ] });
}
function IconChevronRight({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsx("svg", { ...base, className, children: /* @__PURE__ */ jsx("polyline", { points: "9 6 15 12 9 18" }) });
}
function IconArrowLeft({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
    /* @__PURE__ */ jsx("polyline", { points: "11 18 5 12 11 6" })
  ] });
}
function IconSearch({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("circle", { cx: "10.8", cy: "10.8", r: "6.3" }),
    /* @__PURE__ */ jsx("line", { x1: "15.5", y1: "15.5", x2: "20", y2: "20" })
  ] });
}
function IconLayers({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 3 3 7.5l9 4.5 9-4.5L12 3Z" }),
    /* @__PURE__ */ jsx("path", { d: "m3 12.5 9 4.5 9-4.5" }),
    /* @__PURE__ */ jsx("path", { d: "m3 17 9 4.5 9-4.5" })
  ] });
}
function IconPulse({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsx("svg", { ...base, className, children: /* @__PURE__ */ jsx("path", { d: "M3 12h4l2.5-6 3.5 12 2.5-6h5.5" }) });
}
function IconArrowRight({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
    /* @__PURE__ */ jsx("polyline", { points: "13 6 19 12 13 18" })
  ] });
}
function IconSun({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { ...base, className, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2.5v2M12 19.5v2M4.3 4.3l1.4 1.4M18.3 18.3l1.4 1.4M2.5 12h2M19.5 12h2M4.3 19.7l1.4-1.4M18.3 5.7l1.4-1.4" })
  ] });
}
function IconMoon({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsx("svg", { ...base, className, children: /* @__PURE__ */ jsx("path", { d: "M20.2 13.6A8.2 8.2 0 0 1 10.4 3.8a8.2 8.2 0 1 0 9.8 9.8Z" }) });
}

// src/components/ThemeToggle.tsx
import { useState } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var STORAGE_KEY = "ada-theme";
function detectTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function ThemeToggle() {
  const [theme, setTheme] = useState(detectTheme);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-anim"), 320);
  };
  const isDark = theme === "dark";
  return /* @__PURE__ */ jsx2(
    "button",
    {
      type: "button",
      onClick: toggle,
      title: isDark ? "Switch to light mode" : "Switch to dark mode",
      "aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
      className: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-surface text-ink-soft shadow-panel transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-ink hover:shadow-btn active:scale-[0.97]",
      children: isDark ? /* @__PURE__ */ jsx2(IconSun, { className: "h-4 w-4 text-amber-600" }) : /* @__PURE__ */ jsx2(IconMoon, { className: "h-4 w-4 text-blue-600" })
    }
  );
}

// src/components/Layout.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var NAV = [
  { to: "/dashboard", label: "Dashboard", icon: IconGauge },
  { to: "/explorer", label: "API Explorer", icon: IconCode },
  { to: "/changes", label: "Changes", icon: IconAlert },
  { to: "/documentation", label: "Documentation", icon: IconDoc },
  { to: "/repository", label: "Repository", icon: IconRepo }
];
function navClasses(isActive) {
  return `inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-800 shadow-panel ring-1 ring-inset ring-blue-100" : "text-ink-soft hover:bg-gray-100 hover:text-ink"}`;
}
function LogoMark({ small = false }) {
  const box = small ? "h-9 w-9 rounded-xl" : "h-16 w-16 rounded-2xl";
  const glyph = small ? "h-5 w-5" : "h-9 w-9";
  return /* @__PURE__ */ jsx3(
    "div",
    {
      className: `${box} flex shrink-0 items-center justify-center bg-blue-600 shadow-btn ring-1 ring-inset ring-blue-700/15`,
      "aria-hidden": true,
      children: /* @__PURE__ */ jsxs2(
        "svg",
        {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "white",
          strokeWidth: "1.7",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: glyph,
          children: [
            /* @__PURE__ */ jsx3("path", { d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" }),
            /* @__PURE__ */ jsx3("path", { d: "M14 3v5h5" }),
            /* @__PURE__ */ jsx3("path", { d: "M9.6 12.6 8.2 14l1.4 1.4" }),
            /* @__PURE__ */ jsx3("path", { d: "M14.4 12.6 15.8 14l-1.4 1.4" })
          ]
        }
      )
    }
  );
}
function Layout({ children }) {
  return /* @__PURE__ */ jsxs2("div", { className: "flex min-h-screen flex-col bg-canvas", children: [
    /* @__PURE__ */ jsxs2("header", { className: "sticky top-0 z-20 border-b border-gray-200 bg-surface", children: [
      /* @__PURE__ */ jsxs2("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs2(Link, { to: "/", className: "flex min-w-0 items-center gap-3 rounded-lg transition-opacity hover:opacity-90", children: [
          /* @__PURE__ */ jsx3(LogoMark, { small: true }),
          /* @__PURE__ */ jsxs2("span", { className: "hidden min-w-0 sm:block", children: [
            /* @__PURE__ */ jsx3("span", { className: "block truncate text-sm font-semibold leading-tight text-ink", children: "API Documentation Agent" }),
            /* @__PURE__ */ jsx3("span", { className: "block truncate text-[11px] leading-tight text-ink-mute", children: "Keeping APIs and documentation in sync" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx3(ThemeToggle, {}),
          /* @__PURE__ */ jsx3("nav", { className: "hidden items-center gap-1 md:flex", children: NAV.map((item) => {
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs2(
              NavLink,
              {
                to: item.to,
                className: ({ isActive }) => navClasses(isActive),
                children: [
                  /* @__PURE__ */ jsx3(Icon, { className: "h-4 w-4" }),
                  item.label
                ]
              },
              item.to
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx3("nav", { className: "flex gap-1 overflow-x-auto border-t border-gray-100 px-3 py-2 md:hidden", children: NAV.map((item) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs2(NavLink, { to: item.to, className: ({ isActive }) => navClasses(isActive), children: [
          /* @__PURE__ */ jsx3(Icon, { className: "h-4 w-4" }),
          item.label
        ] }, item.to);
      }) })
    ] }),
    /* @__PURE__ */ jsx3("main", { className: "mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 lg:px-8", children }),
    /* @__PURE__ */ jsx3("footer", { className: "border-t border-gray-200 bg-surface", children: /* @__PURE__ */ jsxs2("div", { className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-ink-mute sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx3("span", { children: "API Documentation Agent \u2014 deterministic API change analysis for FastAPI backends" }),
      /* @__PURE__ */ jsx3("span", { children: "OpenAPI 3.0.3 \xB7 SQLite" })
    ] }) })
  ] });
}

// src/components/Splash.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function Splash({ fading }) {
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: `fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas transition-opacity duration-500 ease-out ${fading ? "opacity-0" : "opacity-100"}`,
      children: [
        /* @__PURE__ */ jsx4("div", { className: "animate-splash-icon", children: /* @__PURE__ */ jsx4(LogoMark, {}) }),
        /* @__PURE__ */ jsx4("h1", { className: "animate-splash-title mt-6 text-2xl font-semibold tracking-tight text-ink sm:text-3xl", children: "API Documentation Agent" }),
        /* @__PURE__ */ jsx4("p", { className: "animate-splash-sub mt-2 text-sm text-ink-soft", children: "Keeping APIs and documentation in sync." }),
        /* @__PURE__ */ jsx4("div", { className: "animate-splash-bar mt-9 h-[3px] w-44 overflow-hidden rounded-full bg-gray-200", children: /* @__PURE__ */ jsx4("div", { className: "h-full w-1/3 rounded-full bg-blue-600 animate-load-bar" }) })
      ]
    }
  );
}

// src/pages/Landing.tsx
import { useEffect, useState as useState2 } from "react";

// src/components/ui.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function Card({
  children,
  className = "",
  delay = 0,
  hover = false
}) {
  return /* @__PURE__ */ jsx5(
    "div",
    {
      className: `rounded-2xl border border-gray-200 bg-surface shadow-card transition-shadow duration-200 ${hover ? "hover:shadow-card-hover" : ""} animate-rise-in ${className}`,
      style: delay ? { animationDelay: `${delay}ms` } : void 0,
      children
    }
  );
}
function SectionHeader({
  title,
  count,
  action
}) {
  return /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5", children: [
    /* @__PURE__ */ jsxs4("h2", { className: "flex items-center gap-2 text-sm font-semibold text-ink", children: [
      title,
      count !== void 0 && /* @__PURE__ */ jsx5("span", { className: "rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500", children: count })
    ] }),
    action
  ] });
}
function PageHeader({
  title,
  description,
  actions,
  meta
}) {
  return /* @__PURE__ */ jsxs4("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
    /* @__PURE__ */ jsxs4("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx5("h1", { className: "text-[22px] font-semibold leading-tight tracking-tight text-ink", children: title }),
      description && /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm text-ink-soft", children: description }),
      meta && /* @__PURE__ */ jsx5("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-mute", children: meta })
    ] }),
    actions && /* @__PURE__ */ jsx5("div", { className: "flex flex-wrap items-center gap-2", children: actions })
  ] });
}
function EmptyState({ message, action }) {
  return /* @__PURE__ */ jsxs4("div", { className: "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center", children: [
    /* @__PURE__ */ jsx5("p", { className: "text-sm text-ink-mute", children: message }),
    action
  ] });
}
function Spinner({ label }) {
  return /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-center gap-2 text-sm text-ink-mute", children: [
    /* @__PURE__ */ jsxs4("svg", { className: "h-4 w-4 animate-spin text-blue-600", viewBox: "0 0 24 24", fill: "none", children: [
      /* @__PURE__ */ jsx5("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
      /* @__PURE__ */ jsx5("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
    ] }),
    label && /* @__PURE__ */ jsx5("span", { children: label })
  ] });
}
function ErrorBanner({ message }) {
  return /* @__PURE__ */ jsxs4("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in", children: [
    /* @__PURE__ */ jsx5("span", { className: "font-semibold", children: "Error:" }),
    " ",
    message
  ] });
}
function InfoBanner({ message }) {
  return /* @__PURE__ */ jsx5("div", { className: "rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 animate-fade-in", children: message });
}
var BUTTON_VARIANTS = {
  primary: "bg-blue-600 text-white shadow-btn hover:bg-blue-700 hover:shadow-btn-hover active:bg-blue-700",
  secondary: "border border-gray-300 bg-surface text-ink shadow-panel hover:border-gray-400 hover:bg-gray-50 hover:shadow-btn",
  ghost: "text-blue-700 hover:bg-blue-50"
};
function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  title
}) {
  return /* @__PURE__ */ jsx5(
    "button",
    {
      type,
      title,
      onClick,
      disabled,
      className: `inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none ${BUTTON_VARIANTS[variant]} ${className}`,
      children
    }
  );
}
var SEVERITY_STYLES = {
  BREAKING: "bg-red-50 text-red-800 ring-red-200",
  WARNING: "bg-amber-50 text-amber-800 ring-amber-200",
  SAFE: "bg-emerald-50 text-emerald-700 ring-emerald-200"
};
var SEVERITY_LABELS = {
  BREAKING: "BREAKING CHANGE",
  WARNING: "WARNING",
  SAFE: "SAFE"
};
function SeverityBadge({ severity }) {
  return /* @__PURE__ */ jsx5(
    "span",
    {
      className: `inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${SEVERITY_STYLES[severity]}`,
      children: SEVERITY_LABELS[severity]
    }
  );
}
function SeverityBadgeHigh({ severity }) {
  const labels = {
    BREAKING: "Severity: HIGH",
    WARNING: "Severity: MEDIUM",
    SAFE: "Severity: LOW"
  };
  return /* @__PURE__ */ jsx5(
    "span",
    {
      className: `inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${SEVERITY_STYLES[severity]}`,
      children: labels[severity]
    }
  );
}
var METHOD_STYLES = {
  GET: "bg-blue-50 text-blue-800 ring-blue-200",
  POST: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PUT: "bg-amber-50 text-amber-800 ring-amber-200",
  DELETE: "bg-red-50 text-red-800 ring-red-200",
  PATCH: "bg-violet-50 text-violet-700 ring-violet-200"
};
function MethodBadge({ method }) {
  return /* @__PURE__ */ jsx5(
    "span",
    {
      className: `inline-flex w-[62px] shrink-0 justify-center rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ring-1 ring-inset ${METHOD_STYLES[method.toUpperCase()] ?? "bg-gray-100 text-gray-600 ring-gray-200"}`,
      children: method.toUpperCase()
    }
  );
}
function Tag({ children, title }) {
  return /* @__PURE__ */ jsx5(
    "span",
    {
      title,
      className: "inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600",
      children
    }
  );
}
function StatusPill({
  color,
  children
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    red: "bg-red-50 text-red-800 ring-red-200",
    gray: "bg-gray-100 text-gray-600 ring-gray-200",
    blue: "bg-blue-50 text-blue-800 ring-blue-200"
  };
  const dots = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    gray: "bg-gray-400",
    blue: "bg-blue-500"
  };
  return /* @__PURE__ */ jsxs4(
    "span",
    {
      className: `inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tones[color]}`,
      children: [
        /* @__PURE__ */ jsx5("span", { className: `h-1.5 w-1.5 rounded-full ${dots[color]}` }),
        children
      ]
    }
  );
}
var tableClasses = {
  wrapper: "overflow-x-auto",
  table: "w-full text-left text-sm",
  head: "border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500",
  th: "px-4 py-2.5 font-medium",
  body: "divide-y divide-gray-100",
  row: "transition-colors duration-150 hover:bg-gray-50/80"
};
function CodeBlock({ code, className = "" }) {
  return /* @__PURE__ */ jsx5(
    "pre",
    {
      className: `overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-800 ${className}`,
      children: code
    }
  );
}

// src/services/api.ts
var BASE = "/api";
async function handle(res) {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
    }
    throw new Error(detail);
  }
  return res.json();
}
var api = {
  getDashboard: () => fetch(`${BASE}/dashboard`).then(handle),
  getEndpoints: () => fetch(`${BASE}/endpoints`).then(handle),
  getChanges: () => fetch(`${BASE}/changes`).then(handle),
  getChange: (id) => fetch(`${BASE}/changes/${id}`).then(handle),
  getRepository: () => fetch(`${BASE}/repository`).then(handle),
  getSnapshots: () => fetch(`${BASE}/snapshots`).then(handle),
  getOpenApi: () => fetch(`${BASE}/openapi`).then(handle),
  validateOpenApi: () => fetch(`${BASE}/openapi/validate`).then(handle),
  scan: (repoPath) => fetch(`${BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(repoPath ? { repo_path: repoPath } : {})
  }).then(handle),
  runDemo: () => fetch(`${BASE}/demo/run`, { method: "POST" }).then(handle)
};

// src/pages/Landing.tsx
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var BENEFITS = [
  "Monitor code changes",
  "Detect API drift",
  "Identify breaking changes",
  "Keep documentation synchronized"
];
function Landing({
  onLaunch,
  onDemo
}) {
  const [stats, setStats] = useState2(null);
  const [offline, setOffline] = useState2(false);
  useEffect(() => {
    let cancelled = false;
    api.getDashboard().then((d) => {
      if (!cancelled) setStats(d.stats);
    }).catch(() => {
      if (!cancelled) setOffline(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const total = stats?.endpoints ?? 0;
  const synchronized = stats?.synchronized ?? 0;
  const syncPercent = total > 0 ? Math.round(synchronized / total * 100) : 0;
  const show = (n) => n === void 0 ? "\u2014" : String(n);
  const metrics = [
    { label: "Endpoints", value: show(stats?.endpoints), tone: "text-ink" },
    { label: "Synchronized", value: show(stats?.synchronized), tone: "text-emerald-600" },
    { label: "Changed", value: show(stats?.changed), tone: "text-amber-600" },
    { label: "Breaking", value: show(stats?.breaking), tone: "text-red-600" }
  ];
  return /* @__PURE__ */ jsxs5("div", { className: "relative flex min-h-screen flex-col overflow-hidden bg-canvas", children: [
    /* @__PURE__ */ jsxs5("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx6("div", { className: "absolute left-1/2 top-[-38%] h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" }),
      /* @__PURE__ */ jsx6("div", { className: "absolute bottom-[-28%] left-[-8%] h-[360px] w-[520px] rounded-full bg-gray-200/40 blur-3xl" }),
      /* @__PURE__ */ jsx6("div", { className: "absolute inset-x-0 top-0 h-px bg-gray-200" })
    ] }),
    /* @__PURE__ */ jsxs5("header", { className: "relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx6(ThemeToggle, {}),
        /* @__PURE__ */ jsx6(LogoMark, { small: true }),
        /* @__PURE__ */ jsx6("span", { className: "text-sm font-semibold text-ink", children: "API Documentation Agent" })
      ] }),
      offline ? /* @__PURE__ */ jsx6(StatusPill, { color: "gray", children: "Backend offline" }) : /* @__PURE__ */ jsx6("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsx6(StatusPill, { color: stats ? "green" : "blue", children: stats ? "Repository connected" : "Connecting\u2026" }) })
    ] }),
    /* @__PURE__ */ jsxs5("main", { className: "relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-14 pt-6 text-center sm:px-8", children: [
      /* @__PURE__ */ jsxs5("div", { className: "animate-fade-up inline-flex items-center gap-2 rounded-full border border-gray-200 bg-surface px-3 py-1 text-[11px] font-medium text-ink-soft shadow-panel", children: [
        /* @__PURE__ */ jsx6(IconPulse, { className: "h-3.5 w-3.5 text-blue-600" }),
        "API documentation synchronization for FastAPI"
      ] }),
      /* @__PURE__ */ jsx6("h1", { className: "animate-fade-up mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl", children: "API Documentation Agent" }),
      /* @__PURE__ */ jsx6("p", { className: "animate-fade-up mt-4 max-w-xl text-base leading-relaxed text-ink-soft", children: "Automatically keep your APIs and documentation in sync." }),
      /* @__PURE__ */ jsx6("div", { className: "animate-fade-up mt-8 grid w-full max-w-2xl gap-2.5 text-left sm:grid-cols-2", children: BENEFITS.map((benefit) => /* @__PURE__ */ jsxs5(
        "div",
        {
          className: "flex items-center gap-2.5 rounded-xl border border-gray-200 bg-surface px-4 py-3 shadow-panel transition-shadow duration-200 hover:shadow-card",
          children: [
            /* @__PURE__ */ jsx6(IconCheckCircle, { className: "h-4 w-4 shrink-0 text-blue-600" }),
            /* @__PURE__ */ jsx6("span", { className: "text-sm text-ink-soft", children: benefit })
          ]
        },
        benefit
      )) }),
      /* @__PURE__ */ jsxs5("div", { className: "animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row", children: [
        /* @__PURE__ */ jsxs5(Button, { onClick: onLaunch, className: "px-5 py-2.5", children: [
          "Launch Dashboard",
          /* @__PURE__ */ jsx6(IconArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxs5(Button, { variant: "secondary", onClick: onDemo, className: "px-5 py-2.5", children: [
          /* @__PURE__ */ jsx6(IconPlay, { className: "h-4 w-4 text-blue-600" }),
          "View Demo"
        ] })
      ] }),
      /* @__PURE__ */ jsxs5(Card, { className: "mt-12 w-full max-w-2xl p-5 text-left", hover: true, children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsx6("div", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute", children: "API Health" }),
            /* @__PURE__ */ jsx6("div", { className: "mt-1 font-mono text-sm text-ink-soft", children: stats?.repository ?? "demo-fastapi" })
          ] }),
          offline ? /* @__PURE__ */ jsx6(StatusPill, { color: "gray", children: "No live data" }) : stats ? /* @__PURE__ */ jsx6(StatusPill, { color: "green", children: "Monitoring active" }) : /* @__PURE__ */ jsx6(StatusPill, { color: "blue", children: "Loading" })
        ] }),
        /* @__PURE__ */ jsx6("div", { className: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4", children: metrics.map((m) => /* @__PURE__ */ jsxs5("div", { className: "rounded-xl border border-gray-200 bg-canvas px-3 py-2.5", children: [
          /* @__PURE__ */ jsx6("div", { className: "text-[11px] font-medium uppercase tracking-wide text-ink-mute", children: m.label }),
          /* @__PURE__ */ jsx6("div", { className: `mt-1 text-xl font-semibold ${m.tone}`, children: m.value })
        ] }, m.label)) }),
        /* @__PURE__ */ jsxs5("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between text-[11px] text-ink-mute", children: [
            /* @__PURE__ */ jsx6("span", { children: "Documentation coverage" }),
            /* @__PURE__ */ jsxs5("span", { className: "font-mono", children: [
              syncPercent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx6("div", { className: "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100", children: /* @__PURE__ */ jsx6(
            "div",
            {
              className: "h-full rounded-full bg-emerald-500/80 transition-all duration-700 ease-out",
              style: { width: `${syncPercent}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "mt-5 flex items-center gap-2 border-t border-gray-100 pt-3 text-[11px] text-ink-mute", children: [
          /* @__PURE__ */ jsx6(IconPulse, { className: "h-3.5 w-3.5 text-blue-600" }),
          offline ? "Live snapshot unavailable \u2014 start the backend API to load repository data." : "Live snapshot from the connected repository, refreshed after every scan."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx6("footer", { className: "relative border-t border-gray-200 bg-surface", children: /* @__PURE__ */ jsxs5("div", { className: "mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 py-4 text-[11px] text-ink-mute sm:px-8", children: [
      /* @__PURE__ */ jsx6("span", { children: "Deterministic change detection" }),
      /* @__PURE__ */ jsx6("span", { "aria-hidden": true, children: "\xB7" }),
      /* @__PURE__ */ jsx6("span", { children: "Breaking-change classification" }),
      /* @__PURE__ */ jsx6("span", { "aria-hidden": true, children: "\xB7" }),
      /* @__PURE__ */ jsx6("span", { children: "OpenAPI 3.0.3 generation" })
    ] }) })
  ] });
}

// src/pages/Dashboard.tsx
import { useCallback, useEffect as useEffect2, useRef, useState as useState3 } from "react";
import { Link as Link2, useSearchParams } from "react-router-dom";
import { Fragment, jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "text-ink",
  delay = 0
}) {
  return /* @__PURE__ */ jsxs6(Card, { hover: true, delay, className: "group p-5", children: [
    /* @__PURE__ */ jsxs6("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsx7("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: label }),
      /* @__PURE__ */ jsx7("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-ink-mute ring-1 ring-inset ring-gray-200 transition-colors duration-200 group-hover:text-blue-600", children: icon })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: `mt-3 text-3xl font-semibold tracking-tight ${tone}`, children: value }),
    sub && /* @__PURE__ */ jsx7("div", { className: "mt-1.5 text-xs text-ink-mute", children: sub })
  ] });
}
function Dashboard() {
  const [data, setData] = useState3(null);
  const [error, setError] = useState3(null);
  const [runningDemo, setRunningDemo] = useState3(false);
  const [demoResult, setDemoResult] = useState3(null);
  const [demoError, setDemoError] = useState3(null);
  const [params, setParams] = useSearchParams();
  const demoTriggered = useRef(false);
  const load = useCallback(() => {
    api.getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);
  useEffect2(load, [load]);
  const runDemo = useCallback(async () => {
    setRunningDemo(true);
    setDemoError(null);
    setDemoResult(null);
    try {
      const result = await api.runDemo();
      setDemoResult(result);
      load();
    } catch (e) {
      setDemoError(e.message);
    } finally {
      setRunningDemo(false);
    }
  }, [load]);
  useEffect2(() => {
    if (params.get("demo") !== "1" || demoTriggered.current) return;
    demoTriggered.current = true;
    const next = new URLSearchParams(params);
    next.delete("demo");
    setParams(next, { replace: true });
    void runDemo();
  }, [params, setParams, runDemo]);
  if (error) {
    return /* @__PURE__ */ jsxs6("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx7(ErrorBanner, { message: error }),
      /* @__PURE__ */ jsxs6("p", { className: "text-sm text-ink-mute", children: [
        "Make sure the backend is running on port 8000 (",
        /* @__PURE__ */ jsx7("code", { className: "font-mono", children: "uvicorn app.main:app" }),
        ")."
      ] })
    ] });
  }
  if (!data) {
    return /* @__PURE__ */ jsx7("div", { className: "py-24 text-center", children: /* @__PURE__ */ jsx7(Spinner, { label: "Loading dashboard\u2026" }) });
  }
  const { stats, recent_activity: recent } = data;
  return /* @__PURE__ */ jsxs6("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx7(
      PageHeader,
      {
        title: "Dashboard",
        description: /* @__PURE__ */ jsxs6(Fragment, { children: [
          "Repository: ",
          /* @__PURE__ */ jsx7("span", { className: "font-mono font-medium text-ink", children: stats.repository })
        ] }),
        meta: /* @__PURE__ */ jsxs6(Fragment, { children: [
          /* @__PURE__ */ jsx7(StatusPill, { color: stats.monitoring ? "green" : "gray", children: stats.monitoring ? "Monitoring active" : "Monitoring paused" }),
          /* @__PURE__ */ jsxs6("span", { children: [
            "Last scan ",
            stats.last_scan ?? "never"
          ] }),
          /* @__PURE__ */ jsxs6("span", { children: [
            "Connection ",
            stats.connection
          ] })
        ] }),
        actions: /* @__PURE__ */ jsx7(Button, { onClick: runDemo, disabled: runningDemo, children: runningDemo ? /* @__PURE__ */ jsxs6(Fragment, { children: [
          /* @__PURE__ */ jsx7(IconRefresh, { className: "h-4 w-4 animate-spin" }),
          "Running demo\u2026"
        ] }) : /* @__PURE__ */ jsxs6(Fragment, { children: [
          /* @__PURE__ */ jsx7(IconPlay, { className: "h-4 w-4" }),
          "Run Demo Change"
        ] }) })
      }
    ),
    demoError && /* @__PURE__ */ jsx7(ErrorBanner, { message: demoError }),
    demoResult && /* @__PURE__ */ jsxs6(Card, { className: "overflow-hidden border-blue-200", delay: 20, children: [
      /* @__PURE__ */ jsx7(
        SectionHeader,
        {
          title: "Demo change complete",
          action: /* @__PURE__ */ jsx7("span", { className: "text-xs text-ink-mute", children: demoResult.message })
        }
      ),
      /* @__PURE__ */ jsxs6("div", { className: "grid gap-4 p-5 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx7("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: "Changes detected" }),
          /* @__PURE__ */ jsx7("div", { className: "mt-1 text-2xl font-semibold text-ink", children: demoResult.changes_count })
        ] }),
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx7("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: "Breaking" }),
          /* @__PURE__ */ jsx7("div", { className: "mt-1 text-2xl font-semibold text-red-600", children: demoResult.breaking_count })
        ] }),
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx7("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: "Endpoints scanned" }),
          /* @__PURE__ */ jsx7("div", { className: "mt-1 text-2xl font-semibold text-ink", children: demoResult.endpoints_count })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "space-y-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4", children: [
        demoResult.changes.map((c) => /* @__PURE__ */ jsxs6(
          Link2,
          {
            to: `/changes/${c.id}`,
            className: "flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm shadow-panel transition-all duration-200 hover:border-blue-200 hover:shadow-card",
            children: [
              /* @__PURE__ */ jsx7(MethodBadge, { method: c.method }),
              /* @__PURE__ */ jsx7("span", { className: "font-mono text-xs text-ink", children: c.path }),
              /* @__PURE__ */ jsx7("span", { className: "min-w-0 flex-1 truncate text-xs text-ink-soft", children: c.description }),
              /* @__PURE__ */ jsx7(SeverityBadge, { severity: c.severity })
            ]
          },
          c.id
        )),
        /* @__PURE__ */ jsxs6(
          Link2,
          {
            to: "/changes",
            className: "inline-flex items-center gap-1 pt-1 text-sm font-medium text-blue-700 transition-colors hover:text-blue-800",
            children: [
              "View all changes ",
              /* @__PURE__ */ jsx7(IconArrowRight, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx7(
        StatCard,
        {
          label: "API Endpoints",
          value: stats.endpoints,
          icon: /* @__PURE__ */ jsx7(IconLayers, { className: "h-4 w-4" }),
          sub: "detected in backend code",
          delay: 0
        }
      ),
      /* @__PURE__ */ jsx7(
        StatCard,
        {
          label: "Synchronized",
          value: stats.synchronized,
          icon: /* @__PURE__ */ jsx7(IconCheckCircle, { className: "h-4 w-4" }),
          tone: "text-emerald-600",
          sub: "documentation matches code",
          delay: 70
        }
      ),
      /* @__PURE__ */ jsx7(
        StatCard,
        {
          label: "Changed",
          value: stats.changed,
          icon: /* @__PURE__ */ jsx7(IconPulse, { className: "h-4 w-4" }),
          tone: "text-amber-600",
          sub: "modified in latest scan",
          delay: 140
        }
      ),
      /* @__PURE__ */ jsx7(
        StatCard,
        {
          label: "Breaking Changes",
          value: stats.breaking,
          icon: /* @__PURE__ */ jsx7(IconAlert, { className: "h-4 w-4" }),
          tone: "text-red-600",
          sub: "may require client updates",
          delay: 210
        }
      )
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs6(Card, { className: "overflow-hidden lg:col-span-2", delay: 280, children: [
        /* @__PURE__ */ jsx7(
          SectionHeader,
          {
            title: "Recent Activity",
            count: recent.length,
            action: /* @__PURE__ */ jsx7(
              Link2,
              {
                to: "/changes",
                className: "text-xs font-medium text-blue-700 transition-colors hover:text-blue-800",
                children: "View all"
              }
            )
          }
        ),
        recent.length === 0 ? /* @__PURE__ */ jsx7(EmptyState, { message: "No changes detected yet. Run the demo or scan a repository." }) : /* @__PURE__ */ jsx7("ul", { className: "divide-y divide-gray-100", children: recent.map((item) => /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsxs6(
          Link2,
          {
            to: `/changes/${item.change_id}`,
            className: "flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-gray-50/80",
            children: [
              /* @__PURE__ */ jsx7(MethodBadge, { method: item.method }),
              /* @__PURE__ */ jsx7("span", { className: "font-mono text-sm text-ink", children: item.path }),
              /* @__PURE__ */ jsxs6("span", { className: "ml-auto flex items-center gap-3", children: [
                /* @__PURE__ */ jsx7("span", { className: "hidden max-w-[240px] truncate font-mono text-xs text-ink-mute sm:block", children: item.summary }),
                /* @__PURE__ */ jsx7(SeverityBadge, { severity: item.severity })
              ] })
            ]
          }
        ) }, `${item.change_id}-${item.path}`)) })
      ] }),
      /* @__PURE__ */ jsxs6(Card, { className: "overflow-hidden", delay: 340, children: [
        /* @__PURE__ */ jsx7(SectionHeader, { title: "Latest Changelog" }),
        data.last_changelog ? /* @__PURE__ */ jsx7(
          CodeBlock,
          {
            code: data.last_changelog,
            className: "max-h-96 whitespace-pre-wrap rounded-none border-0 bg-transparent px-5 py-4"
          }
        ) : /* @__PURE__ */ jsx7(EmptyState, { message: "No changelog generated yet." })
      ] })
    ] })
  ] });
}

// src/pages/ApiExplorer.tsx
import { useEffect as useEffect3, useMemo, useState as useState4 } from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function SchemaView({ schema, title }) {
  if (!schema || Object.keys(schema.fields ?? {}).length === 0) return null;
  const rows = Object.entries(schema.fields);
  return /* @__PURE__ */ jsxs7("div", { children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx8("h4", { className: "text-xs font-semibold uppercase tracking-wide text-ink-mute", children: title }),
      /* @__PURE__ */ jsx8(Tag, { children: schema.model }),
      schema.many && /* @__PURE__ */ jsx8(Tag, { children: "array" })
    ] }),
    /* @__PURE__ */ jsx8("div", { className: "mt-2 overflow-hidden rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs7("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsx8("thead", { className: "bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500", children: /* @__PURE__ */ jsxs7("tr", { children: [
        /* @__PURE__ */ jsx8("th", { className: "px-3 py-2 font-medium", children: "Field" }),
        /* @__PURE__ */ jsx8("th", { className: "px-3 py-2 font-medium", children: "Type" })
      ] }) }),
      /* @__PURE__ */ jsx8("tbody", { className: "divide-y divide-gray-100", children: rows.map(([name, type]) => /* @__PURE__ */ jsxs7("tr", { className: "transition-colors hover:bg-gray-50/80", children: [
        /* @__PURE__ */ jsx8("td", { className: "px-3 py-2 font-mono text-xs text-ink", children: name }),
        /* @__PURE__ */ jsx8("td", { className: "px-3 py-2 text-xs text-ink-soft", children: type })
      ] }, name)) })
    ] }) })
  ] });
}
function ApiExplorer() {
  const [endpoints, setEndpoints] = useState4(null);
  const [error, setError] = useState4(null);
  const [query, setQuery] = useState4("");
  const [selectedId, setSelectedId] = useState4(null);
  useEffect3(() => {
    api.getEndpoints().then((eps) => {
      setEndpoints(eps);
      setSelectedId(eps[0]?.id ?? null);
    }).catch((e) => setError(e.message));
  }, []);
  const filtered = useMemo(() => {
    if (!endpoints) return [];
    const q = query.trim().toLowerCase();
    if (!q) return endpoints;
    return endpoints.filter(
      (e) => e.path.toLowerCase().includes(q) || e.method.toLowerCase().includes(q) || (e.summary ?? "").toLowerCase().includes(q)
    );
  }, [endpoints, query]);
  const selected = useMemo(
    () => endpoints?.find((e) => e.id === selectedId) ?? filtered[0] ?? null,
    [endpoints, filtered, selectedId]
  );
  if (error) return /* @__PURE__ */ jsx8(ErrorBanner, { message: error });
  if (!endpoints) {
    return /* @__PURE__ */ jsx8("div", { className: "py-24 text-center", children: /* @__PURE__ */ jsx8(Spinner, { label: "Loading endpoints\u2026" }) });
  }
  if (endpoints.length === 0) {
    return /* @__PURE__ */ jsxs7(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsx8(SectionHeader, { title: "API Explorer" }),
      /* @__PURE__ */ jsx8(EmptyState, { message: "No endpoints detected. Run a scan from the Repository page." })
    ] });
  }
  return /* @__PURE__ */ jsxs7("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx8(
      PageHeader,
      {
        title: "API Explorer",
        description: "Every endpoint extracted from the repository's FastAPI source.",
        meta: /* @__PURE__ */ jsxs7("span", { children: [
          endpoints.length,
          " endpoints detected"
        ] }),
        actions: /* @__PURE__ */ jsxs7("div", { className: "relative", children: [
          /* @__PURE__ */ jsx8(IconSearch, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Search path, method or summary",
              className: "w-full rounded-lg border border-gray-300 bg-surface py-2 pl-9 pr-3 text-sm text-ink shadow-panel outline-none transition-all duration-150 placeholder:text-ink-mute focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs7("div", { className: "grid gap-6 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxs7(Card, { className: "overflow-hidden lg:col-span-2", delay: 0, children: [
        /* @__PURE__ */ jsx8(SectionHeader, { title: "Endpoints", count: filtered.length }),
        filtered.length === 0 ? /* @__PURE__ */ jsx8(EmptyState, { message: "No endpoints match your search." }) : /* @__PURE__ */ jsx8("ul", { className: "max-h-[640px] divide-y divide-gray-100 overflow-y-auto", children: filtered.map((e) => {
          const active = selected?.id === e.id;
          return /* @__PURE__ */ jsx8("li", { children: /* @__PURE__ */ jsxs7(
            "button",
            {
              type: "button",
              onClick: () => setSelectedId(e.id ?? null),
              className: `flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 ${active ? "bg-blue-50/70" : "hover:bg-gray-50/80"}`,
              children: [
                /* @__PURE__ */ jsx8(MethodBadge, { method: e.method }),
                /* @__PURE__ */ jsxs7("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx8("span", { className: "block truncate font-mono text-xs text-ink", children: e.path }),
                  /* @__PURE__ */ jsx8("span", { className: "mt-0.5 block truncate text-xs text-ink-mute", children: e.summary ?? "No description" })
                ] }),
                /* @__PURE__ */ jsx8(
                  IconChevronRight,
                  {
                    className: `mt-0.5 h-4 w-4 shrink-0 ${active ? "text-blue-600" : "text-gray-300"}`
                  }
                )
              ]
            }
          ) }, e.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx8("div", { className: "space-y-6 lg:col-span-3", children: selected ? /* @__PURE__ */ jsxs7(Card, { className: "overflow-hidden", delay: 40, children: [
        /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-4", children: [
          /* @__PURE__ */ jsx8(MethodBadge, { method: selected.method }),
          /* @__PURE__ */ jsx8("span", { className: "font-mono text-sm text-ink", children: selected.path }),
          selected.status_codes.length > 0 && /* @__PURE__ */ jsx8("span", { className: "ml-auto flex gap-1.5", children: selected.status_codes.map((code) => /* @__PURE__ */ jsx8(Tag, { children: code }, code)) })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "space-y-5 px-5 py-5", children: [
          /* @__PURE__ */ jsxs7("div", { children: [
            /* @__PURE__ */ jsx8("h3", { className: "text-xs font-semibold uppercase tracking-wide text-ink-mute", children: "Description" }),
            /* @__PURE__ */ jsx8("p", { className: "mt-1.5 text-sm text-ink-soft", children: selected.summary ?? "No docstring provided for this endpoint." })
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs7("div", { className: "rounded-xl border border-gray-200 bg-canvas px-3.5 py-3", children: [
              /* @__PURE__ */ jsx8("div", { className: "text-[11px] font-medium uppercase tracking-wide text-ink-mute", children: "Authentication" }),
              /* @__PURE__ */ jsx8("div", { className: "mt-1 text-xs text-ink", children: selected.auth ?? "None detected" })
            ] }),
            /* @__PURE__ */ jsxs7("div", { className: "rounded-xl border border-gray-200 bg-canvas px-3.5 py-3", children: [
              /* @__PURE__ */ jsx8("div", { className: "text-[11px] font-medium uppercase tracking-wide text-ink-mute", children: "Source file" }),
              /* @__PURE__ */ jsx8("div", { className: "mt-1 truncate font-mono text-xs text-ink", children: selected.source_file ?? "\u2014" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs7("div", { children: [
            /* @__PURE__ */ jsx8("h3", { className: "text-xs font-semibold uppercase tracking-wide text-ink-mute", children: "Parameters" }),
            selected.params.length === 0 ? /* @__PURE__ */ jsx8("p", { className: "mt-1.5 text-sm text-ink-mute", children: "No path or query parameters detected." }) : /* @__PURE__ */ jsx8("div", { className: "mt-2 overflow-hidden rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs7("table", { className: "w-full text-left text-sm", children: [
              /* @__PURE__ */ jsx8("thead", { className: "bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500", children: /* @__PURE__ */ jsxs7("tr", { children: [
                /* @__PURE__ */ jsx8("th", { className: "px-3 py-2 font-medium", children: "Name" }),
                /* @__PURE__ */ jsx8("th", { className: "px-3 py-2 font-medium", children: "In" }),
                /* @__PURE__ */ jsx8("th", { className: "px-3 py-2 font-medium", children: "Type" }),
                /* @__PURE__ */ jsx8("th", { className: "px-3 py-2 font-medium", children: "Required" })
              ] }) }),
              /* @__PURE__ */ jsx8("tbody", { className: "divide-y divide-gray-100", children: selected.params.map((p) => /* @__PURE__ */ jsxs7(
                "tr",
                {
                  className: "transition-colors hover:bg-gray-50/80",
                  children: [
                    /* @__PURE__ */ jsx8("td", { className: "px-3 py-2 font-mono text-xs text-ink", children: p.name }),
                    /* @__PURE__ */ jsx8("td", { className: "px-3 py-2 text-xs text-ink-soft", children: p.in }),
                    /* @__PURE__ */ jsx8("td", { className: "px-3 py-2 text-xs text-ink-soft", children: p.type ?? "string" }),
                    /* @__PURE__ */ jsx8("td", { className: "px-3 py-2 text-xs text-ink-mute", children: p.required ? "yes" : "no" })
                  ]
                },
                `${p.in}-${p.name}`
              )) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx8(SchemaView, { schema: selected.request_schema, title: "Request body" }),
          /* @__PURE__ */ jsx8(SchemaView, { schema: selected.response_schema, title: "Response" }),
          /* @__PURE__ */ jsxs7("div", { children: [
            /* @__PURE__ */ jsx8("h3", { className: "text-xs font-semibold uppercase tracking-wide text-ink-mute", children: "OpenAPI definition" }),
            /* @__PURE__ */ jsx8(
              CodeBlock,
              {
                code: JSON.stringify(
                  {
                    [selected.method.toLowerCase()]: {
                      summary: selected.summary ?? "",
                      parameters: selected.params,
                      responses: { "200": { description: "Successful response" } }
                    }
                  },
                  null,
                  2
                ),
                className: "mt-2 max-h-80"
              }
            )
          ] }),
          selected.auth && /* @__PURE__ */ jsx8("div", { className: "rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800", children: selected.auth })
        ] })
      ] }, selected.id) : /* @__PURE__ */ jsx8(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx8(EmptyState, { message: "Select an endpoint to view its documentation." }) }) })
    ] })
  ] });
}

// src/pages/Changes.tsx
import { useCallback as useCallback2, useEffect as useEffect4, useState as useState5 } from "react";
import { Link as Link3, useNavigate } from "react-router-dom";
import { Fragment as Fragment2, jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var CHANGE_TYPE_LABELS = {
  added_endpoint: "New endpoint",
  removed_endpoint: "Endpoint removed",
  method_changed: "HTTP method changed",
  param_added: "Parameter added",
  param_removed: "Parameter removed",
  param_type_changed: "Parameter type changed",
  request_field_added: "Request field added",
  request_field_removed: "Request field removed",
  request_field_renamed: "Request field renamed",
  request_field_type_changed: "Request field type changed",
  response_field_added: "Response field added",
  response_field_removed: "Response field removed",
  response_field_renamed: "Response field renamed",
  response_field_type_changed: "Response field type changed",
  request_schema_changed: "Request schema changed",
  response_schema_changed: "Response schema changed",
  status_code_changed: "Status code changed",
  auth_changed: "Authentication changed"
};
function changeTypeLabel(t) {
  return CHANGE_TYPE_LABELS[t] ?? t.replace(/_/g, " ");
}
var STATUS_LEVEL = {
  BREAKING: "HIGH",
  WARNING: "MEDIUM",
  SAFE: "LOW"
};
function fieldArrow(change) {
  const before = change.before_data;
  const after = change.after_data;
  if (before?.field && after?.field) return `${before.field} \xE2\u2020\u2019 ${after.field}`;
  return null;
}
function Changes() {
  const [changes, setChanges] = useState5(null);
  const [error, setError] = useState5(null);
  const [filter, setFilter] = useState5("ALL");
  const [running, setRunning] = useState5(false);
  const [notice, setNotice] = useState5(null);
  const navigate = useNavigate();
  const load = useCallback2(() => {
    api.getChanges().then(setChanges).catch((e) => setError(e.message));
  }, []);
  useEffect4(load, [load]);
  const runDemo = async () => {
    setRunning(true);
    setNotice(null);
    try {
      const result = await api.runDemo();
      setNotice(result.message);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };
  if (error) return /* @__PURE__ */ jsx9(ErrorBanner, { message: error });
  if (!changes) {
    return /* @__PURE__ */ jsx9("div", { className: "py-24 text-center", children: /* @__PURE__ */ jsx9(Spinner, { label: "Loading changes\xE2\u20AC\xA6" }) });
  }
  const visible = changes.filter((c) => filter === "ALL" || c.severity === filter);
  const counts = {
    ALL: changes.length,
    BREAKING: changes.filter((c) => c.severity === "BREAKING").length,
    WARNING: changes.filter((c) => c.severity === "WARNING").length,
    SAFE: changes.filter((c) => c.severity === "SAFE").length
  };
  return /* @__PURE__ */ jsxs8("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx9(
      PageHeader,
      {
        title: "Changes",
        description: "API drift detected between stored snapshots, classified deterministically.",
        meta: /* @__PURE__ */ jsxs8("span", { children: [
          changes.length,
          " changes recorded"
        ] }),
        actions: /* @__PURE__ */ jsx9(Button, { onClick: runDemo, disabled: running, children: running ? /* @__PURE__ */ jsxs8(Fragment2, { children: [
          /* @__PURE__ */ jsx9(IconRefresh, { className: "h-4 w-4 animate-spin" }),
          "Running demo\xE2\u20AC\xA6"
        ] }) : /* @__PURE__ */ jsxs8(Fragment2, { children: [
          /* @__PURE__ */ jsx9(IconPlay, { className: "h-4 w-4" }),
          "Run Demo Change"
        ] }) })
      }
    ),
    notice && /* @__PURE__ */ jsx9(InfoBanner, { message: notice }),
    /* @__PURE__ */ jsxs8("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx9(SeveritySummary, { label: "All changes", value: counts.ALL, tone: "text-ink" }),
      /* @__PURE__ */ jsx9(SeveritySummary, { label: "Breaking", value: counts.BREAKING, tone: "text-red-600" }),
      /* @__PURE__ */ jsx9(SeveritySummary, { label: "Warnings", value: counts.WARNING, tone: "text-amber-600" }),
      /* @__PURE__ */ jsx9(SeveritySummary, { label: "Safe", value: counts.SAFE, tone: "text-emerald-600" })
    ] }),
    /* @__PURE__ */ jsxs8(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5", children: [
        /* @__PURE__ */ jsxs8("h2", { className: "text-sm font-semibold text-ink", children: [
          "Detected changes",
          /* @__PURE__ */ jsx9("span", { className: "ml-2 rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500", children: visible.length })
        ] }),
        /* @__PURE__ */ jsx9("div", { className: "flex flex-wrap gap-1", children: ["ALL", "BREAKING", "WARNING", "SAFE"].map((f) => /* @__PURE__ */ jsx9(
          "button",
          {
            type: "button",
            onClick: () => setFilter(f),
            className: `rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${filter === f ? "bg-blue-50 text-blue-800 shadow-panel ring-1 ring-inset ring-blue-100" : "text-ink-soft hover:bg-gray-100 hover:text-ink"}`,
            children: f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()
          },
          f
        )) })
      ] }),
      visible.length === 0 ? /* @__PURE__ */ jsx9(
        EmptyState,
        {
          message: changes.length === 0 ? "No changes recorded yet. Run the demo to compare the two built-in API versions." : "No changes match the current filter.",
          action: changes.length === 0 ? /* @__PURE__ */ jsxs8(Button, { onClick: runDemo, disabled: running, children: [
            /* @__PURE__ */ jsx9(IconPlay, { className: "h-4 w-4" }),
            "Run Demo Change"
          ] }) : void 0
        }
      ) : /* @__PURE__ */ jsx9("div", { className: tableClasses.wrapper, children: /* @__PURE__ */ jsxs8("table", { className: tableClasses.table, children: [
        /* @__PURE__ */ jsx9("thead", { className: tableClasses.head, children: /* @__PURE__ */ jsxs8("tr", { children: [
          /* @__PURE__ */ jsx9("th", { className: tableClasses.th, children: "Endpoint" }),
          /* @__PURE__ */ jsx9("th", { className: tableClasses.th, children: "Method" }),
          /* @__PURE__ */ jsx9("th", { className: tableClasses.th, children: "Change" }),
          /* @__PURE__ */ jsx9("th", { className: tableClasses.th, children: "Severity" }),
          /* @__PURE__ */ jsx9("th", { className: tableClasses.th, children: "Status" }),
          /* @__PURE__ */ jsx9("th", { className: tableClasses.th, children: "Detected" }),
          /* @__PURE__ */ jsx9("th", { className: tableClasses.th })
        ] }) }),
        /* @__PURE__ */ jsx9("tbody", { className: tableClasses.body, children: visible.map((c) => {
          const rename = fieldArrow(c);
          return /* @__PURE__ */ jsxs8(
            "tr",
            {
              onClick: () => navigate(`/changes/${c.id}`),
              className: `${tableClasses.row} cursor-pointer`,
              children: [
                /* @__PURE__ */ jsxs8("td", { className: `${tableClasses.th} py-3`, children: [
                  /* @__PURE__ */ jsx9("span", { className: "font-mono text-xs text-ink", children: c.path }),
                  rename && /* @__PURE__ */ jsx9("span", { className: "mt-0.5 block font-mono text-[11px] text-ink-mute", children: rename })
                ] }),
                /* @__PURE__ */ jsx9("td", { className: `${tableClasses.th} py-3`, children: /* @__PURE__ */ jsx9(MethodBadge, { method: c.method }) }),
                /* @__PURE__ */ jsx9("td", { className: `${tableClasses.th} py-3 text-xs text-ink-soft`, children: changeTypeLabel(c.change_type) }),
                /* @__PURE__ */ jsx9("td", { className: `${tableClasses.th} py-3`, children: /* @__PURE__ */ jsx9(SeverityBadge, { severity: c.severity }) }),
                /* @__PURE__ */ jsx9("td", { className: `${tableClasses.th} py-3`, children: /* @__PURE__ */ jsx9(
                  StatusPill,
                  {
                    color: c.severity === "BREAKING" ? "red" : c.severity === "WARNING" ? "amber" : "green",
                    children: STATUS_LEVEL[c.severity]
                  }
                ) }),
                /* @__PURE__ */ jsx9("td", { className: `${tableClasses.th} whitespace-nowrap py-3 text-xs text-ink-mute`, children: c.created_at }),
                /* @__PURE__ */ jsx9("td", { className: `${tableClasses.th} py-3 text-right`, children: /* @__PURE__ */ jsxs8(
                  Link3,
                  {
                    to: `/changes/${c.id}`,
                    className: "inline-flex items-center gap-1 text-xs font-medium text-blue-700 transition-colors hover:text-blue-800",
                    children: [
                      "Details",
                      /* @__PURE__ */ jsx9(IconArrowRight, { className: "h-3.5 w-3.5" })
                    ]
                  }
                ) })
              ]
            },
            c.id
          );
        }) })
      ] }) })
    ] })
  ] });
}
function SeveritySummary({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxs8(Card, { hover: true, className: "p-5", children: [
    /* @__PURE__ */ jsx9("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: label }),
    /* @__PURE__ */ jsx9("div", { className: `mt-2 text-2xl font-semibold tracking-tight ${tone}`, children: value })
  ] });
}

// src/pages/ChangeDetails.tsx
import { useEffect as useEffect5, useState as useState6 } from "react";
import { Link as Link4, useNavigate as useNavigate2, useParams } from "react-router-dom";
import { Fragment as Fragment3, jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
function pretty(value) {
  if (value === null || value === void 0) return "\u2014";
  return JSON.stringify(value, null, 2);
}
function FieldComparison({ change }) {
  const before = change.before_data;
  const after = change.after_data;
  const beforeField = before?.field;
  const afterField = after?.field;
  const beforeType = before?.type;
  const afterType = after?.type;
  if (beforeField || afterField) {
    return /* @__PURE__ */ jsxs9("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-gray-200 bg-gray-50/70 p-4", children: [
        /* @__PURE__ */ jsx10("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: "Before" }),
        /* @__PURE__ */ jsxs9("div", { className: "mt-2 space-y-1 font-mono text-sm text-ink", children: [
          /* @__PURE__ */ jsx10("div", { children: beforeField ?? "\u2014" }),
          beforeType && /* @__PURE__ */ jsx10("div", { className: "text-xs text-ink-mute", children: beforeType })
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-blue-200 bg-blue-50/60 p-4", children: [
        /* @__PURE__ */ jsx10("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-blue-700", children: "After" }),
        /* @__PURE__ */ jsxs9("div", { className: "mt-2 space-y-1 font-mono text-sm text-ink", children: [
          /* @__PURE__ */ jsx10("div", { children: afterField ?? "\u2014" }),
          afterType && /* @__PURE__ */ jsx10("div", { className: "text-xs text-ink-mute", children: afterType })
        ] })
      ] })
    ] });
  }
  if (before || after) {
    return /* @__PURE__ */ jsxs9("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx10("div", { className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: "Before" }),
        /* @__PURE__ */ jsx10(CodeBlock, { code: pretty(before), className: "max-h-72 whitespace-pre-wrap" })
      ] }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx10("div", { className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-blue-700", children: "After" }),
        /* @__PURE__ */ jsx10(CodeBlock, { code: pretty(after), className: "max-h-72 whitespace-pre-wrap" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx10("p", { className: "text-sm text-ink-mute", children: "No before/after payload recorded for this change." });
}
function ChangeDetails() {
  const { id } = useParams();
  const navigate = useNavigate2();
  const [change, setChange] = useState6(null);
  const [error, setError] = useState6(null);
  useEffect5(() => {
    if (!id) return;
    api.getChange(id).then(setChange).catch((e) => setError(e.message));
  }, [id]);
  if (error) {
    return /* @__PURE__ */ jsxs9("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx10(ErrorBanner, { message: error }),
      /* @__PURE__ */ jsxs9(Button, { variant: "secondary", onClick: () => navigate("/changes"), children: [
        /* @__PURE__ */ jsx10(IconArrowLeft, { className: "h-4 w-4" }),
        "Back to changes"
      ] })
    ] });
  }
  if (!change) {
    return /* @__PURE__ */ jsx10("div", { className: "py-24 text-center", children: /* @__PURE__ */ jsx10(Spinner, { label: "Loading change\u2026" }) });
  }
  const affected = change.affected_files ?? [];
  const before = change.before_data;
  const after = change.after_data;
  const rename = before?.field && after?.field ? `${before.field} \u2192 ${after.field}` : null;
  return /* @__PURE__ */ jsxs9("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs9("nav", { className: "flex items-center gap-1.5 text-xs text-ink-mute", children: [
      /* @__PURE__ */ jsx10(Link4, { to: "/changes", className: "transition-colors hover:text-blue-700", children: "Changes" }),
      /* @__PURE__ */ jsx10(IconChevronRight, { className: "h-3.5 w-3.5" }),
      /* @__PURE__ */ jsxs9("span", { className: "font-mono text-ink", children: [
        change.method,
        " ",
        change.path
      ] })
    ] }),
    /* @__PURE__ */ jsx10(
      PageHeader,
      {
        title: `${change.method} ${change.path}`,
        description: change.description,
        meta: /* @__PURE__ */ jsxs9(Fragment3, { children: [
          /* @__PURE__ */ jsxs9(Tag, { children: [
            "Change #",
            change.id
          ] }),
          /* @__PURE__ */ jsx10("span", { children: changeTypeLabel(change.change_type) }),
          /* @__PURE__ */ jsxs9("span", { children: [
            "Detected ",
            change.created_at
          ] })
        ] }),
        actions: /* @__PURE__ */ jsxs9(Button, { variant: "secondary", onClick: () => navigate("/changes"), children: [
          /* @__PURE__ */ jsx10(IconArrowLeft, { className: "h-4 w-4" }),
          "Back to changes"
        ] })
      }
    ),
    /* @__PURE__ */ jsxs9("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs9("div", { className: "space-y-6 lg:col-span-2", children: [
        /* @__PURE__ */ jsxs9(Card, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsx10(SectionHeader, { title: "Change" }),
          /* @__PURE__ */ jsxs9("div", { className: "space-y-4 px-5 py-5", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsx10(MethodBadge, { method: change.method }),
              /* @__PURE__ */ jsx10("span", { className: "font-mono text-sm text-ink", children: change.path }),
              /* @__PURE__ */ jsx10(SeverityBadge, { severity: change.severity }),
              rename && /* @__PURE__ */ jsx10("span", { className: "font-mono text-xs text-ink-mute", children: rename })
            ] }),
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx10("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: "Reason" }),
              /* @__PURE__ */ jsx10("p", { className: "mt-1.5 text-sm text-ink-soft", children: change.description })
            ] }),
            /* @__PURE__ */ jsx10(FieldComparison, { change })
          ] })
        ] }),
        /* @__PURE__ */ jsxs9(Card, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsx10(SectionHeader, { title: "AI Analysis", action: /* @__PURE__ */ jsx10(Tag, { children: change.ai_source ?? "deterministic" }) }),
          /* @__PURE__ */ jsxs9("div", { className: "space-y-4 px-5 py-5", children: [
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: [
                /* @__PURE__ */ jsx10(IconDoc, { className: "h-3.5 w-3.5" }),
                " Explanation"
              ] }),
              /* @__PURE__ */ jsx10("p", { className: "mt-1.5 text-sm leading-relaxed text-ink-soft", children: change.explanation ?? "No explanation available for this change." })
            ] }),
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx10("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-ink-mute", children: "Risk assessment" }),
              /* @__PURE__ */ jsx10("p", { className: "mt-1.5 text-sm leading-relaxed text-ink-soft", children: change.risk_assessment ?? "\u2014" })
            ] }),
            /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3", children: [
              /* @__PURE__ */ jsx10("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-blue-700", children: "Recommendation" }),
              /* @__PURE__ */ jsx10("p", { className: "mt-1.5 text-sm leading-relaxed text-blue-900", children: change.recommendation ?? "\u2014" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs9(Card, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsx10(SectionHeader, { title: "Severity" }),
          /* @__PURE__ */ jsxs9("div", { className: "space-y-3 px-5 py-5", children: [
            /* @__PURE__ */ jsx10(SeverityBadgeHigh, { severity: change.severity }),
            /* @__PURE__ */ jsx10("p", { className: "text-xs text-ink-mute", children: "Determined deterministically from the snapshot diff \u2014 no model inference involved." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs9(Card, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsx10(SectionHeader, { title: "Affected files", count: affected.length }),
          affected.length === 0 ? /* @__PURE__ */ jsx10("p", { className: "px-5 py-5 text-sm text-ink-mute", children: "No referencing files detected." }) : /* @__PURE__ */ jsx10("ul", { className: "divide-y divide-gray-100", children: affected.map((f) => /* @__PURE__ */ jsxs9("li", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsx10("div", { className: "truncate font-mono text-xs text-ink", children: f.file_path }),
            /* @__PURE__ */ jsx10("div", { className: "mt-0.5 text-[11px] text-ink-mute", children: f.reason })
          ] }, f.file_path)) })
        ] })
      ] })
    ] })
  ] });
}

// src/pages/Documentation.tsx
import { useEffect as useEffect6, useMemo as useMemo2, useState as useState7 } from "react";
import { Fragment as Fragment4, jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
function resolveRef(spec, ref) {
  const name = ref?.$ref?.split("/").pop();
  if (!name) return null;
  const schema = spec.components?.schemas?.[name];
  if (!schema) return null;
  return { name, schema };
}
function SchemaTable({ spec, ref }) {
  const resolved = resolveRef(spec, ref);
  if (resolved) {
    const props = resolved.schema.properties ?? {};
    const required = resolved.schema.required ?? [];
    const entries = Object.entries(props);
    return /* @__PURE__ */ jsxs10("div", { className: "overflow-hidden rounded-xl border border-gray-200", children: [
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-3 py-2", children: [
        /* @__PURE__ */ jsx11(Tag, { children: resolved.name }),
        /* @__PURE__ */ jsx11("span", { className: "text-[11px] text-ink-mute", children: "component schema" })
      ] }),
      entries.length === 0 ? /* @__PURE__ */ jsx11("p", { className: "px-3 py-2 text-xs text-ink-mute", children: "No documented fields." }) : /* @__PURE__ */ jsxs10("table", { className: "w-full text-left text-sm", children: [
        /* @__PURE__ */ jsx11("thead", { className: "bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500", children: /* @__PURE__ */ jsxs10("tr", { children: [
          /* @__PURE__ */ jsx11("th", { className: "px-3 py-2 font-medium", children: "Field" }),
          /* @__PURE__ */ jsx11("th", { className: "px-3 py-2 font-medium", children: "Type" }),
          /* @__PURE__ */ jsx11("th", { className: "px-3 py-2 font-medium", children: "Required" })
        ] }) }),
        /* @__PURE__ */ jsx11("tbody", { className: "divide-y divide-gray-100", children: entries.map(([name, def]) => /* @__PURE__ */ jsxs10("tr", { className: "transition-colors hover:bg-gray-50/80", children: [
          /* @__PURE__ */ jsx11("td", { className: "px-3 py-2 font-mono text-xs text-ink", children: name }),
          /* @__PURE__ */ jsx11("td", { className: "px-3 py-2 text-xs text-ink-soft", children: def.type === "array" && def.items ? `array<${def.items.type ?? "object"}>` : def.type ?? "object" }),
          /* @__PURE__ */ jsx11("td", { className: "px-3 py-2 text-xs text-ink-mute", children: required.includes(name) ? "yes" : "no" })
        ] }, name)) })
      ] })
    ] });
  }
  const inner = ref?.type === "array" && ref.items ? resolveRef(spec, ref.items) : null;
  if (inner) {
    return /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs10("div", { className: "text-[11px] text-ink-mute", children: [
        "Array of ",
        inner.name
      ] }),
      /* @__PURE__ */ jsx11(SchemaTable, { spec, ref: { $ref: `#/components/schemas/${inner.name}` } })
    ] });
  }
  if (ref?.type) return /* @__PURE__ */ jsx11(Tag, { children: ref.type });
  return /* @__PURE__ */ jsx11("span", { className: "text-xs text-ink-mute", children: "\u2014" });
}
function OperationCard({
  spec,
  path,
  method,
  op
}) {
  const bodyRef = op.requestBody ? Object.values(op.requestBody.content)[0]?.schema : void 0;
  const responses = Object.entries(op.responses ?? {});
  return /* @__PURE__ */ jsxs10(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-3.5", children: [
      /* @__PURE__ */ jsx11(MethodBadge, { method }),
      /* @__PURE__ */ jsx11("span", { className: "font-mono text-sm text-ink", children: path }),
      op.operationId && /* @__PURE__ */ jsx11(Tag, { children: op.operationId })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "space-y-5 px-5 py-5", children: [
      op.summary && /* @__PURE__ */ jsx11("p", { className: "text-sm text-ink-soft", children: op.summary }),
      op.description && op.description !== op.summary && /* @__PURE__ */ jsx11("p", { className: "whitespace-pre-wrap text-sm text-ink-soft", children: op.description }),
      op.parameters && op.parameters.length > 0 && /* @__PURE__ */ jsxs10("div", { children: [
        /* @__PURE__ */ jsx11("h4", { className: "text-xs font-semibold uppercase tracking-wide text-ink-mute", children: "Parameters" }),
        /* @__PURE__ */ jsx11("div", { className: "mt-2 overflow-hidden rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs10("table", { className: "w-full text-left text-sm", children: [
          /* @__PURE__ */ jsx11("thead", { className: "bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500", children: /* @__PURE__ */ jsxs10("tr", { children: [
            /* @__PURE__ */ jsx11("th", { className: "px-3 py-2 font-medium", children: "Name" }),
            /* @__PURE__ */ jsx11("th", { className: "px-3 py-2 font-medium", children: "In" }),
            /* @__PURE__ */ jsx11("th", { className: "px-3 py-2 font-medium", children: "Type" }),
            /* @__PURE__ */ jsx11("th", { className: "px-3 py-2 font-medium", children: "Required" })
          ] }) }),
          /* @__PURE__ */ jsx11("tbody", { className: "divide-y divide-gray-100", children: op.parameters.map((p) => /* @__PURE__ */ jsxs10("tr", { className: "transition-colors hover:bg-gray-50/80", children: [
            /* @__PURE__ */ jsx11("td", { className: "px-3 py-2 font-mono text-xs text-ink", children: p.name }),
            /* @__PURE__ */ jsx11("td", { className: "px-3 py-2 text-xs text-ink-soft", children: p.in }),
            /* @__PURE__ */ jsx11("td", { className: "px-3 py-2 text-xs text-ink-soft", children: p.schema?.type ?? "string" }),
            /* @__PURE__ */ jsx11("td", { className: "px-3 py-2 text-xs text-ink-mute", children: p.required ? "yes" : "no" })
          ] }, `${p.in}-${p.name}`)) })
        ] }) })
      ] }),
      bodyRef && /* @__PURE__ */ jsxs10("div", { children: [
        /* @__PURE__ */ jsx11("h4", { className: "text-xs font-semibold uppercase tracking-wide text-ink-mute", children: "Request body" }),
        /* @__PURE__ */ jsx11("div", { className: "mt-2", children: /* @__PURE__ */ jsx11(SchemaTable, { spec, ref: bodyRef }) })
      ] }),
      /* @__PURE__ */ jsxs10("div", { children: [
        /* @__PURE__ */ jsx11("h4", { className: "text-xs font-semibold uppercase tracking-wide text-ink-mute", children: "Responses" }),
        /* @__PURE__ */ jsx11("div", { className: "mt-2 space-y-3", children: responses.map(([code, res]) => {
          const resRef = res.content ? Object.values(res.content)[0]?.schema : void 0;
          return /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx11(Tag, { children: code }),
              /* @__PURE__ */ jsx11("span", { className: "text-xs text-ink-soft", children: res.description })
            ] }),
            resRef && /* @__PURE__ */ jsx11(SchemaTable, { spec, ref: resRef })
          ] }, code);
        }) })
      ] })
    ] })
  ] });
}
function Documentation() {
  const [spec, setSpec] = useState7(null);
  const [validation, setValidation] = useState7(null);
  const [error, setError] = useState7(null);
  const [query, setQuery] = useState7("");
  useEffect6(() => {
    api.getOpenApi().then(setSpec).catch((e) => setError(e.message));
    api.validateOpenApi().then(setValidation).catch(() => setValidation(null));
  }, []);
  const operations = useMemo2(() => {
    if (!spec) return [];
    const list = [];
    for (const [path, methods] of Object.entries(spec.paths ?? {})) {
      for (const [method, op] of Object.entries(methods ?? {})) {
        list.push({ path, method: method.toUpperCase(), op });
      }
    }
    return list;
  }, [spec]);
  const filtered = useMemo2(() => {
    const q = query.trim().toLowerCase();
    if (!q) return operations;
    return operations.filter(
      (o) => o.path.toLowerCase().includes(q) || o.method.toLowerCase().includes(q) || (o.op.summary ?? "").toLowerCase().includes(q)
    );
  }, [operations, query]);
  const download = () => {
    if (!spec) return;
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "openapi.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  if (error) return /* @__PURE__ */ jsx11(ErrorBanner, { message: error });
  if (!spec) {
    return /* @__PURE__ */ jsx11("div", { className: "py-24 text-center", children: /* @__PURE__ */ jsx11(Spinner, { label: "Loading specification\u2026" }) });
  }
  const schemaCount = Object.keys(spec.components?.schemas ?? {}).length;
  return /* @__PURE__ */ jsxs10("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx11(
      PageHeader,
      {
        title: "Documentation",
        description: /* @__PURE__ */ jsxs10(Fragment4, { children: [
          "Generated OpenAPI specification:",
          " ",
          /* @__PURE__ */ jsx11("span", { className: "font-medium text-ink", children: spec.info.title }),
          " v",
          spec.info.version
        ] }),
        meta: /* @__PURE__ */ jsxs10(Fragment4, { children: [
          /* @__PURE__ */ jsx11(Tag, { children: spec.openapi }),
          /* @__PURE__ */ jsxs10("span", { children: [
            operations.length,
            " operations"
          ] }),
          /* @__PURE__ */ jsxs10("span", { children: [
            schemaCount,
            " schemas"
          ] }),
          validation && /* @__PURE__ */ jsx11(StatusPill, { color: validation.valid ? "green" : "red", children: validation.valid ? "Specification valid" : `${validation.errors.length} errors` })
        ] }),
        actions: /* @__PURE__ */ jsxs10(Fragment4, { children: [
          /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
            /* @__PURE__ */ jsx11(IconSearch, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" }),
            /* @__PURE__ */ jsx11(
              "input",
              {
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Filter endpoints",
                className: "w-full rounded-lg border border-gray-300 bg-surface py-2 pl-9 pr-3 text-sm text-ink shadow-panel outline-none transition-all duration-150 placeholder:text-ink-mute focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs10(
            "button",
            {
              type: "button",
              onClick: download,
              className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-surface px-3.5 py-2 text-sm font-semibold text-ink shadow-panel transition-all duration-150 hover:border-gray-400 hover:bg-gray-50 hover:shadow-btn active:scale-[0.985]",
              children: [
                /* @__PURE__ */ jsx11(IconCheckCircle, { className: "h-4 w-4 text-blue-600" }),
                "Download openapi.json"
              ]
            }
          )
        ] })
      }
    ),
    filtered.length === 0 ? /* @__PURE__ */ jsx11(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx11(EmptyState, { message: "No operations match the current filter." }) }) : /* @__PURE__ */ jsx11("div", { className: "space-y-5", children: filtered.map(({ path, method, op }) => /* @__PURE__ */ jsx11(OperationCard, { spec, path, method, op }, `${method}-${path}`)) })
  ] });
}

// src/pages/Repository.tsx
import { useCallback as useCallback3, useEffect as useEffect7, useState as useState8 } from "react";
import { Fragment as Fragment5, jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
function InfoRow({ label, value, mono }) {
  return /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3 last:border-b-0", children: [
    /* @__PURE__ */ jsx12("span", { className: "text-xs font-medium uppercase tracking-wide text-ink-mute", children: label }),
    /* @__PURE__ */ jsx12("span", { className: `text-sm text-ink ${mono ? "font-mono text-xs" : ""}`, children: value })
  ] });
}
function Repository() {
  const [repo, setRepo] = useState8(null);
  const [snapshots, setSnapshots] = useState8([]);
  const [latestChange, setLatestChange] = useState8(null);
  const [error, setError] = useState8(null);
  const [scanning, setScanning] = useState8(false);
  const [notice, setNotice] = useState8(null);
  const load = useCallback3(() => {
    api.getRepository().then(setRepo).catch((e) => setError(e.message));
    api.getSnapshots().then(setSnapshots).catch(() => setSnapshots([]));
    api.getChanges().then((cs) => setLatestChange(cs[0] ?? null)).catch(() => setLatestChange(null));
  }, []);
  useEffect7(load, [load]);
  const runScan = async () => {
    setScanning(true);
    setNotice(null);
    try {
      const result = await api.scan();
      setNotice(
        `Scan complete \u2014 ${result.endpoints_count} endpoints, ${result.changes_count} changes (${result.breaking_count} breaking).`
      );
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setScanning(false);
    }
  };
  if (error) return /* @__PURE__ */ jsx12(ErrorBanner, { message: error });
  if (!repo) {
    return /* @__PURE__ */ jsx12("div", { className: "py-24 text-center", children: /* @__PURE__ */ jsx12(Spinner, { label: "Loading repository\u2026" }) });
  }
  return /* @__PURE__ */ jsxs11("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx12(
      PageHeader,
      {
        title: "Repository",
        description: "Source repository monitored by the agent.",
        meta: /* @__PURE__ */ jsxs11(Fragment5, { children: [
          /* @__PURE__ */ jsx12(StatusPill, { color: repo.monitoring ? "green" : "gray", children: repo.monitoring ? "Monitoring active" : "Monitoring paused" }),
          /* @__PURE__ */ jsxs11("span", { children: [
            "Connection ",
            repo.connection
          ] })
        ] }),
        actions: /* @__PURE__ */ jsx12(Button, { onClick: runScan, disabled: scanning, children: scanning ? /* @__PURE__ */ jsxs11(Fragment5, { children: [
          /* @__PURE__ */ jsx12(IconRefresh, { className: "h-4 w-4 animate-spin" }),
          "Scanning\u2026"
        ] }) : /* @__PURE__ */ jsxs11(Fragment5, { children: [
          /* @__PURE__ */ jsx12(IconPlay, { className: "h-4 w-4" }),
          "Run Scan"
        ] }) })
      }
    ),
    notice && /* @__PURE__ */ jsx12(InfoBanner, { message: notice }),
    /* @__PURE__ */ jsxs11("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs11(Card, { className: "overflow-hidden lg:col-span-2", children: [
        /* @__PURE__ */ jsx12(
          SectionHeader,
          {
            title: "Repository details",
            action: /* @__PURE__ */ jsx12(IconRepo, { className: "h-4 w-4 text-ink-mute" })
          }
        ),
        /* @__PURE__ */ jsxs11("div", { children: [
          /* @__PURE__ */ jsx12(InfoRow, { label: "Repository", value: repo.name ?? "Not connected", mono: true }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Monitoring", value: repo.monitoring ? "ACTIVE" : "PAUSED" }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Status", value: repo.status }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Connection", value: repo.connection }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Last scan", value: repo.last_scan ?? "never" }),
          /* @__PURE__ */ jsx12(
            InfoRow,
            {
              label: "Last change",
              value: latestChange ? `${latestChange.method} ${latestChange.path}` : "none detected",
              mono: true
            }
          ),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Last change detected", value: repo.last_change ?? "never" }),
          repo.last_change_summary && /* @__PURE__ */ jsx12(InfoRow, { label: "Change summary", value: repo.last_change_summary })
        ] })
      ] }),
      /* @__PURE__ */ jsxs11(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsx12(SectionHeader, { title: "Latest scan" }),
        repo.last_scan_detail ? /* @__PURE__ */ jsxs11("div", { children: [
          /* @__PURE__ */ jsx12(InfoRow, { label: "Source", value: repo.last_scan_detail.source }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Status", value: repo.last_scan_detail.status }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Endpoints", value: String(repo.last_scan_detail.endpoints_count) }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Changes", value: String(repo.last_scan_detail.changes_count) }),
          /* @__PURE__ */ jsx12(InfoRow, { label: "Completed", value: repo.last_scan_detail.created_at }),
          /* @__PURE__ */ jsx12("div", { className: "border-t border-gray-100 px-5 py-3 text-xs text-ink-soft", children: repo.last_scan_detail.message })
        ] }) : /* @__PURE__ */ jsx12(EmptyState, { message: "No scan has been recorded yet." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs11(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsx12(SectionHeader, { title: "Snapshots", count: snapshots.length }),
      snapshots.length === 0 ? /* @__PURE__ */ jsx12(EmptyState, { message: "No API snapshots stored yet. Run a scan or the demo." }) : /* @__PURE__ */ jsx12("div", { className: tableClasses.wrapper, children: /* @__PURE__ */ jsxs11("table", { className: tableClasses.table, children: [
        /* @__PURE__ */ jsx12("thead", { className: tableClasses.head, children: /* @__PURE__ */ jsxs11("tr", { children: [
          /* @__PURE__ */ jsx12("th", { className: tableClasses.th, children: "Version" }),
          /* @__PURE__ */ jsx12("th", { className: tableClasses.th, children: "Repository" }),
          /* @__PURE__ */ jsx12("th", { className: tableClasses.th, children: "Endpoints" }),
          /* @__PURE__ */ jsx12("th", { className: tableClasses.th, children: "Created" }),
          /* @__PURE__ */ jsx12("th", { className: tableClasses.th, children: "Snapshot" })
        ] }) }),
        /* @__PURE__ */ jsx12("tbody", { className: tableClasses.body, children: snapshots.map((s) => /* @__PURE__ */ jsxs11("tr", { className: tableClasses.row, children: [
          /* @__PURE__ */ jsxs11("td", { className: `${tableClasses.th} font-mono text-xs text-ink`, children: [
            "v",
            s.version
          ] }),
          /* @__PURE__ */ jsx12("td", { className: `${tableClasses.th} font-mono text-xs text-ink-soft`, children: s.repo_name }),
          /* @__PURE__ */ jsx12("td", { className: tableClasses.th, children: s.endpoints_count }),
          /* @__PURE__ */ jsx12("td", { className: `${tableClasses.th} whitespace-nowrap text-xs text-ink-mute`, children: s.created_at }),
          /* @__PURE__ */ jsx12("td", { className: tableClasses.th, children: /* @__PURE__ */ jsxs11(Tag, { children: [
            "snapshot #",
            s.id
          ] }) })
        ] }, s.id)) })
      ] }) })
    ] })
  ] });
}

// src/App.tsx
import { Fragment as Fragment6, jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
function Shell() {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsx13(Layout, { children: /* @__PURE__ */ jsx13("div", { className: "animate-fade-up", children: /* @__PURE__ */ jsx13(Outlet, {}) }, pathname) });
}
function App() {
  const [splash, setSplash] = useState9("showing");
  const location = useLocation();
  const navigate = useNavigate3();
  useEffect8(() => {
    const fadeTimer = setTimeout(() => setSplash("fading"), 1250);
    const doneTimer = setTimeout(() => setSplash("gone"), 1750);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);
  useEffect8(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
  const launch = /* @__PURE__ */ jsx13(Landing, { onLaunch: () => navigate("/dashboard"), onDemo: () => navigate("/dashboard?demo=1") });
  return /* @__PURE__ */ jsxs12(Fragment6, { children: [
    splash !== "gone" && /* @__PURE__ */ jsx13(Splash, { fading: splash === "fading" }),
    /* @__PURE__ */ jsx13("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxs12(Routes, { children: [
      /* @__PURE__ */ jsx13(Route, { path: "/", element: launch }),
      /* @__PURE__ */ jsxs12(Route, { element: /* @__PURE__ */ jsx13(Shell, {}), children: [
        /* @__PURE__ */ jsx13(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx13(Dashboard, {}) }),
        /* @__PURE__ */ jsx13(Route, { path: "/explorer", element: /* @__PURE__ */ jsx13(ApiExplorer, {}) }),
        /* @__PURE__ */ jsx13(Route, { path: "/changes", element: /* @__PURE__ */ jsx13(Changes, {}) }),
        /* @__PURE__ */ jsx13(Route, { path: "/changes/:id", element: /* @__PURE__ */ jsx13(ChangeDetails, {}) }),
        /* @__PURE__ */ jsx13(Route, { path: "/documentation", element: /* @__PURE__ */ jsx13(Documentation, {}) }),
        /* @__PURE__ */ jsx13(Route, { path: "/repository", element: /* @__PURE__ */ jsx13(Repository, {}) }),
        /* @__PURE__ */ jsx13(Route, { path: "*", element: launch })
      ] })
    ] }) }, location.pathname === "/" ? "landing" : "app")
  ] });
}
export {
  App as default
};
