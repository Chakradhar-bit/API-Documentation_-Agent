import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { ApiChange } from "../types";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  InfoBanner,
  MethodBadge,
  PageHeader,
  SeverityBadge,
  Spinner,
  StatusPill,
  tableClasses,
} from "../components/ui";
import { IconArrowRight, IconPlay, IconRefresh } from "../components/icons";

const CHANGE_TYPE_LABELS: Record<string, string> = {
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
  auth_changed: "Authentication changed",
};

export function changeTypeLabel(t: string): string {
  return CHANGE_TYPE_LABELS[t] ?? t.replace(/_/g, " ");
}

const STATUS_LEVEL: Record<string, string> = {
  BREAKING: "HIGH",
  WARNING: "MEDIUM",
  SAFE: "LOW",
};

function fieldArrow(change: ApiChange): string | null {
  const before = change.before_data as { field?: string } | null;
  const after = change.after_data as { field?: string } | null;
  if (before?.field && after?.field) return `${before.field} â†’ ${after.field}`;
  return null;
}

export function methodPathLabel(change: ApiChange): string {
  return `${change.method} ${change.path}`;
}

type Filter = "ALL" | "BREAKING" | "WARNING" | "SAFE";

export default function Changes() {
  const [changes, setChanges] = useState<ApiChange[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = useCallback(() => {
    api
      .getChanges()
      .then(setChanges)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const runDemo = async () => {
    setRunning(true);
    setNotice(null);
    try {
      const result = await api.runDemo();
      setNotice(result.message);
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  if (error) return <ErrorBanner message={error} />;
  if (!changes) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading changesâ€¦" />
      </div>
    );
  }

  const visible = changes.filter((c) => filter === "ALL" || c.severity === filter);

  const counts = {
    ALL: changes.length,
    BREAKING: changes.filter((c) => c.severity === "BREAKING").length,
    WARNING: changes.filter((c) => c.severity === "WARNING").length,
    SAFE: changes.filter((c) => c.severity === "SAFE").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Changes"
        description="API drift detected between stored snapshots, classified deterministically."
        meta={<span>{changes.length} changes recorded</span>}
        actions={
          <Button onClick={runDemo} disabled={running}>
            {running ? (
              <>
                <IconRefresh className="h-4 w-4 animate-spin" />
                Running demoâ€¦
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

      {notice && <InfoBanner message={notice} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SeveritySummary label="All changes" value={counts.ALL} tone="text-ink" />
        <SeveritySummary label="Breaking" value={counts.BREAKING} tone="text-red-600" />
        <SeveritySummary label="Warnings" value={counts.WARNING} tone="text-amber-600" />
        <SeveritySummary label="Safe" value={counts.SAFE} tone="text-emerald-600" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-ink">
            Detected changes
            <span className="ml-2 rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
              {visible.length}
            </span>
          </h2>
          <div className="flex flex-wrap gap-1">
            {(["ALL", "BREAKING", "WARNING", "SAFE"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                  filter === f
                    ? "bg-blue-50 text-blue-800 shadow-panel ring-1 ring-inset ring-blue-100"
                    : "text-ink-soft hover:bg-gray-100 hover:text-ink"
                }`}
              >
                {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            message={
              changes.length === 0
                ? "No changes recorded yet. Run the demo to compare the two built-in API versions."
                : "No changes match the current filter."
            }
            action={
              changes.length === 0 ? (
                <Button onClick={runDemo} disabled={running}>
                  <IconPlay className="h-4 w-4" />
                  Run Demo Change
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.head}>
                <tr>
                  <th className={tableClasses.th}>Endpoint</th>
                  <th className={tableClasses.th}>Method</th>
                  <th className={tableClasses.th}>Change</th>
                  <th className={tableClasses.th}>Severity</th>
                  <th className={tableClasses.th}>Status</th>
                  <th className={tableClasses.th}>Detected</th>
                  <th className={tableClasses.th} />
                </tr>
              </thead>
              <tbody className={tableClasses.body}>
                {visible.map((c) => {
                  const rename = fieldArrow(c);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/changes/${c.id}`)}
                      className={`${tableClasses.row} cursor-pointer`}
                    >
                      <td className={`${tableClasses.th} py-3`}>
                        <span className="font-mono text-xs text-ink">{c.path}</span>
                        {rename && (
                          <span className="mt-0.5 block font-mono text-[11px] text-ink-mute">
                            {rename}
                          </span>
                        )}
                      </td>
                      <td className={`${tableClasses.th} py-3`}>
                        <MethodBadge method={c.method} />
                      </td>
                      <td className={`${tableClasses.th} py-3 text-xs text-ink-soft`}>
                        {changeTypeLabel(c.change_type)}
                      </td>
                      <td className={`${tableClasses.th} py-3`}>
                        <SeverityBadge severity={c.severity} />
                      </td>
                      <td className={`${tableClasses.th} py-3`}>
                        <StatusPill
                          color={
                            c.severity === "BREAKING"
                              ? "red"
                              : c.severity === "WARNING"
                                ? "amber"
                                : "green"
                          }
                        >
                          {STATUS_LEVEL[c.severity]}
                        </StatusPill>
                      </td>
                      <td className={`${tableClasses.th} whitespace-nowrap py-3 text-xs text-ink-mute`}>
                        {c.created_at}
                      </td>
                      <td className={`${tableClasses.th} py-3 text-right`}>
                        <Link
                          to={`/changes/${c.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 transition-colors hover:text-blue-800"
                        >
                          Details
                          <IconArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function SeveritySummary({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <Card hover className="p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${tone}`}>{value}</div>
    </Card>
  );
}