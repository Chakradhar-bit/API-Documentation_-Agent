import { useEffect, useState } from "react";
import { LogoMark } from "../components/Layout";
import { Button, Card, StatusPill } from "../components/ui";
import { ThemeToggle } from "../components/ThemeToggle";
import { IconArrowRight, IconCheckCircle, IconPlay, IconPulse } from "../components/icons";
import { api } from "../services/api";
import type { DashboardStats } from "../types";

const BENEFITS = [
  "Monitor code changes",
  "Detect API drift",
  "Identify breaking changes",
  "Keep documentation synchronized",
];

export default function Landing({
  onLaunch,
  onDemo,
}: {
  onLaunch: () => void;
  onDemo: () => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getDashboard()
      .then((d) => {
        if (!cancelled) setStats(d.stats);
      })
      .catch(() => {
        if (!cancelled) setOffline(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = stats?.endpoints ?? 0;
  const synchronized = stats?.synchronized ?? 0;
  const syncPercent = total > 0 ? Math.round((synchronized / total) * 100) : 0;
  const show = (n?: number) => (n === undefined ? "—" : String(n));

  const metrics: { label: string; value: string; tone: string }[] = [
    { label: "Endpoints", value: show(stats?.endpoints), tone: "text-ink" },
    { label: "Synchronized", value: show(stats?.synchronized), tone: "text-emerald-600" },
    { label: "Changed", value: show(stats?.changed), tone: "text-amber-600" },
    { label: "Breaking", value: show(stats?.breaking), tone: "text-red-600" },
  ];
return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas">
      {/* Subtle matte background structure — low contrast, adds depth only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-38%] h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-[-28%] left-[-8%] h-[360px] w-[520px] rounded-full bg-gray-200/40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gray-200" />
      </div>

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LogoMark small />
          <span className="text-sm font-semibold text-ink">API Documentation Agent</span>
        </div>
        {offline ? (
          <StatusPill color="gray">Backend offline</StatusPill>
        ) : (
          <div className="hidden sm:block">
            <StatusPill color={stats ? "green" : "blue"}>
              {stats ? "Repository connected" : "Connecting…"}
            </StatusPill>
          </div>
        )}
      </header>

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-14 pt-6 text-center sm:px-8">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gray-200 bg-surface px-3 py-1 text-[11px] font-medium text-ink-soft shadow-panel">
          <IconPulse className="h-3.5 w-3.5 text-blue-600" />
          API documentation synchronization for FastAPI
        </div>

        <h1 className="animate-fade-up mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          API Documentation Agent
        </h1>
        <p className="animate-fade-up mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          Automatically keep your APIs and documentation in sync.
        </p>

        <div className="animate-fade-up mt-8 grid w-full max-w-2xl gap-2.5 text-left sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-surface px-4 py-3 shadow-panel transition-shadow duration-200 hover:shadow-card"
            >
              <IconCheckCircle className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="text-sm text-ink-soft">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onLaunch} className="px-5 py-2.5">
            Launch Dashboard
            <IconArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={onDemo} className="px-5 py-2.5">
            <IconPlay className="h-4 w-4 text-blue-600" />
            View Demo
          </Button>
        </div>

        {/* Miniature dashboard preview, fed by the live API. */}
        <Card className="mt-12 w-full max-w-2xl p-5 text-left" hover>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute">
                API Health
              </div>
              <div className="mt-1 font-mono text-sm text-ink-soft">
                {stats?.repository ?? "demo-fastapi"}
              </div>
            </div>
            {offline ? (
              <StatusPill color="gray">No live data</StatusPill>
            ) : stats ? (
              <StatusPill color="green">Monitoring active</StatusPill>
            ) : (
              <StatusPill color="blue">Loading</StatusPill>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-gray-200 bg-canvas px-3 py-2.5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-ink-mute">
                  {m.label}
                </div>
                <div className={`mt-1 text-xl font-semibold ${m.tone}`}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-[11px] text-ink-mute">
              <span>Documentation coverage</span>
              <span className="font-mono">{syncPercent}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-500/80 transition-all duration-700 ease-out"
                style={{ width: `${syncPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-3 text-[11px] text-ink-mute">
            <IconPulse className="h-3.5 w-3.5 text-blue-600" />
            {offline
              ? "Live snapshot unavailable — start the backend API to load repository data."
              : "Live snapshot from the connected repository, refreshed after every scan."}
          </div>
        </Card>
      </main>

      <footer className="relative border-t border-gray-200 bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 py-4 text-[11px] text-ink-mute sm:px-8">
          <span>Deterministic change detection</span>
          <span aria-hidden>·</span>
          <span>Breaking-change classification</span>
          <span aria-hidden>·</span>
          <span>OpenAPI 3.0.3 generation</span>
        </div>
      </footer>
    </div>
  );
}