import type { ReactNode } from "react";
import type { Severity } from "../types";

/* ------------------------------------------------------------------ *
 * Layout primitives
 * ------------------------------------------------------------------ */

export function Card({
  children,
  className = "",
  delay = 0,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Adds a soft elevation on hover — used for interactive/stat surfaces. */
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-surface shadow-card transition-shadow duration-200 ${
        hover ? "hover:shadow-card-hover" : ""
      } animate-rise-in ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  count,
  action,
}: {
  title: string;
  count?: number | string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
        {title}
        {count !== undefined && (
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
            {count}
          </span>
        )}
      </h2>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
        {meta && <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-mute">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <p className="text-sm text-ink-mute">{message}</p>
      {action}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-ink-mute">
      <svg className="h-4 w-4 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
      <span className="font-semibold">Error:</span> {message}
    </div>
  );
}

export function InfoBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 animate-fade-in">
      {message}
    </div>
  );
}
/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-btn hover:bg-blue-700 hover:shadow-btn-hover active:bg-blue-700",
  secondary:
    "border border-gray-300 bg-surface text-ink shadow-panel hover:border-gray-400 hover:bg-gray-50 hover:shadow-btn",
  ghost: "text-blue-700 hover:bg-blue-50",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  title?: string;
}) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Badges
 * ------------------------------------------------------------------ */

const SEVERITY_STYLES: Record<Severity, string> = {
  BREAKING: "bg-red-50 text-red-800 ring-red-200",
  WARNING: "bg-amber-50 text-amber-800 ring-amber-200",
  SAFE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  BREAKING: "BREAKING CHANGE",
  WARNING: "WARNING",
  SAFE: "SAFE",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${SEVERITY_STYLES[severity]}`}
    >
      {SEVERITY_LABELS[severity]}
    </span>
  );
}

export function SeverityBadgeHigh({ severity }: { severity: Severity }) {
  const labels: Record<Severity, string> = {
    BREAKING: "Severity: HIGH",
    WARNING: "Severity: MEDIUM",
    SAFE: "Severity: LOW",
  };
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${SEVERITY_STYLES[severity]}`}
    >
      {labels[severity]}
    </span>
  );
}

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-blue-50 text-blue-800 ring-blue-200",
  POST: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PUT: "bg-amber-50 text-amber-800 ring-amber-200",
  DELETE: "bg-red-50 text-red-800 ring-red-200",
  PATCH: "bg-violet-50 text-violet-700 ring-violet-200",
};

export function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={`inline-flex w-[62px] shrink-0 justify-center rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ring-1 ring-inset ${
        METHOD_STYLES[method.toUpperCase()] ?? "bg-gray-100 text-gray-600 ring-gray-200"
      }`}
    >
      {method.toUpperCase()}
    </span>
  );
}

export function Tag({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600"
    >
      {children}
    </span>
  );
}

export function StatusDot({ color }: { color: "green" | "amber" | "red" | "gray" }) {
  const colors = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    gray: "bg-gray-300",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[color]}`} />;
}

export function StatusPill({
  color,
  children,
}: {
  color: "green" | "amber" | "red" | "gray" | "blue";
  children: ReactNode;
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    red: "bg-red-50 text-red-800 ring-red-200",
    gray: "bg-gray-100 text-gray-600 ring-gray-200",
    blue: "bg-blue-50 text-blue-800 ring-blue-200",
  };
  const dots = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    gray: "bg-gray-400",
    blue: "bg-blue-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tones[color]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[color]}`} />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Tables & code
 * ------------------------------------------------------------------ */

export const tableClasses = {
  wrapper: "overflow-x-auto",
  table: "w-full text-left text-sm",
  head: "border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500",
  th: "px-4 py-2.5 font-medium",
  body: "divide-y divide-gray-100",
  row: "transition-colors duration-150 hover:bg-gray-50/80",
};

export function CodeBlock({ code, className = "" }: { code: string; className?: string }) {
  return (
    <pre
      className={`overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-800 ${className}`}
    >
      {code}
    </pre>
  );
}