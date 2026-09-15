import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import type { DashboardData, ScanResult } from "../types";
import {
  Button,
  Card,
  CodeBlock,
  EmptyState,
  ErrorBanner,
  MethodBadge,
  PageHeader,
  SectionHeader,
  SeverityBadge,
  Spinner,
  StatusPill,
} from "../components/ui";
import {
  IconAlert,
  IconArrowRight,
  IconCheckCircle,
  IconLayers,
  IconPlay,
  IconPulse,
  IconRefresh,
} from "../components/icons";

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "text-ink",
  delay = 0,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: ReactNode;
  tone?: string;
  delay?: number;
}) {
  return (
    <Card hover delay={delay} className="group p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">{label}</div>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-ink-mute ring-1 ring-inset ring-gray-200 transition-colors duration-200 group-hover:text-blue-600">
          {icon}
        </span>
      </div>
      <div className={`mt-3 text-3xl font-semibold tracking-tight ${tone}`}>{value}</div>
      {sub && <div className="mt-1.5 text-xs text-ink-mute">{sub}</div>}
    </Card>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runningDemo, setRunningDemo] = useState(false);
  const [demoResult, setDemoResult] = useState<ScanResult | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [params, setParams] = useSearchParams();
  const demoTriggered = useRef(false);

  const load = useCallback(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const runDemo = useCallback(async () => {
    setRunningDemo(true);
    setDemoError(null);
    setDemoResult(null);
    try {
      const result = await api.runDemo();
      setDemoResult(result);
      load();
    } catch (e) {
      setDemoError((e as Error).message);
    } finally {
      setRunningDemo(false);
    }
  }, [load]);

  // "View Demo" on the launch page deep-links here with ?demo=1 (runs once).
  useEffect(() => {
    if (params.get("demo") !== "1" || demoTriggered.current) return;
    demoTriggered.current = true;
    const next = new URLSearchParams(params);
    next.delete("demo");
    setParams(next, { replace: true });
    void runDemo();
  }, [params, setParams, runDemo]);

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={error} />
        <p className="text-sm text-ink-mute">
          Make sure the backend is running on port 8000 (
          <code className="font-mono">uvicorn app.main:app</code>).
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading dashboard…" />
      </div>
    );
  }

  const { stats, recent_activity: recent } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={
          <>
            Repository: <span className="font-mono font-medium text-ink">{stats.repository}</span>
          </>
        }
        meta={
          <>
            <StatusPill color={stats.monitoring ? "green" : "gray"}>
              {stats.monitoring ? "Monitoring active" : "Monitoring paused"}
            </StatusPill>
            <span>Last scan {stats.last_scan ?? "never"}</span>
            <span>Connection {stats.connection}</span>
          </>
        }
        actions={
          <Button onClick={runDemo} disabled={runningDemo}>
            {runningDemo ? (
              <>
                <IconRefresh className="h-4 w-4 animate-spin" />
                Running demo…
              </>
            ) : (
              <>
                <IconPlay className="h-4 w-4" />
                Run Demo Change
              </>
            )}
          </Button>
        }
      />

      {demoError && <ErrorBanner message={demoError} />}

      {demoResult && (
        <Card className="overflow-hidden border-blue-200" delay={20}>
          <SectionHeader
            title="Demo change complete"
            action={<span className="text-xs text-ink-mute">{demoResult.message}</span>}
          />
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                Changes detected
              </div>
              <div className="mt-1 text-2xl font-semibold text-ink">{demoResult.changes_count}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                Breaking
              </div>
              <div className="mt-1 text-2xl font-semibold text-red-600">
                {demoResult.breaking_count}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                Endpoints scanned
              </div>
              <div className="mt-1 text-2xl font-semibold text-ink">{demoResult.endpoints_count}</div>
            </div>
          </div>
          <div className="space-y-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4">
            {demoResult.changes.map((c) => (
              <Link
                key={c.id}
                to={`/changes/${c.id}`}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm shadow-panel transition-all duration-200 hover:border-blue-200 hover:shadow-card"
              >
                <MethodBadge method={c.method} />
                <span className="font-mono text-xs text-ink">{c.path}</span>
                <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">{c.description}</span>
                <SeverityBadge severity={c.severity} />
              </Link>
            ))}
            <Link
              to="/changes"
              className="inline-flex items-center gap-1 pt-1 text-sm font-medium text-blue-700 transition-colors hover:text-blue-800"
            >
              View all changes <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="API Endpoints"
          value={stats.endpoints}
          icon={<IconLayers className="h-4 w-4" />}
          sub="detected in backend code"
          delay={0}
        />
        <StatCard
          label="Synchronized"
          value={stats.synchronized}
          icon={<IconCheckCircle className="h-4 w-4" />}
          tone="text-emerald-600"
          sub="documentation matches code"
          delay={70}
        />
        <StatCard
          label="Changed"
          value={stats.changed}
          icon={<IconPulse className="h-4 w-4" />}
          tone="text-amber-600"
          sub="modified in latest scan"
          delay={140}
        />
        <StatCard
          label="Breaking Changes"
          value={stats.breaking}
          icon={<IconAlert className="h-4 w-4" />}
          tone="text-red-600"
          sub="may require client updates"
          delay={210}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2" delay={280}>
          <SectionHeader
            title="Recent Activity"
            count={recent.length}
            action={
              <Link
                to="/changes"
                className="text-xs font-medium text-blue-700 transition-colors hover:text-blue-800"
              >
                View all
              </Link>
            }
          />
          {recent.length === 0 ? (
            <EmptyState message="No changes detected yet. Run the demo or scan a repository." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((item) => (
                <li key={`${item.change_id}-${item.path}`}>
                  <Link
                    to={`/changes/${item.change_id}`}
                    className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-gray-50/80"
                  >
                    <MethodBadge method={item.method} />
                    <span className="font-mono text-sm text-ink">{item.path}</span>
                    <span className="ml-auto flex items-center gap-3">
                      <span className="hidden max-w-[240px] truncate font-mono text-xs text-ink-mute sm:block">
                        {item.summary}
                      </span>
                      <SeverityBadge severity={item.severity} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="overflow-hidden" delay={340}>
          <SectionHeader title="Latest Changelog" />
          {data.last_changelog ? (
            <CodeBlock
              code={data.last_changelog}
              className="max-h-96 whitespace-pre-wrap rounded-none border-0 bg-transparent px-5 py-4"
            />
          ) : (
            <EmptyState message="No changelog generated yet." />
          )}
        </Card>
      </div>
    </div>
  );
}