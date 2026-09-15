import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { ApiChange, RepositoryInfo, SnapshotInfo } from "../types";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  InfoBanner,
  PageHeader,
  SectionHeader,
  Spinner,
  StatusPill,
  Tag,
  tableClasses,
} from "../components/ui";
import { IconPlay, IconRefresh, IconRepo } from "../components/icons";

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3 last:border-b-0">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-mute">{label}</span>
      <span className={`text-sm text-ink ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

export default function Repository() {
  const [repo, setRepo] = useState<RepositoryInfo | null>(null);
  const [snapshots, setSnapshots] = useState<SnapshotInfo[]>([]);
  const [latestChange, setLatestChange] = useState<ApiChange | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .getRepository()
      .then(setRepo)
      .catch((e) => setError(e.message));
    api
      .getSnapshots()
      .then(setSnapshots)
      .catch(() => setSnapshots([]));
    api
      .getChanges()
      .then((cs) => setLatestChange(cs[0] ?? null))
      .catch(() => setLatestChange(null));
  }, []);

  useEffect(load, [load]);

  const runScan = async () => {
    setScanning(true);
    setNotice(null);
    try {
      const result = await api.scan();
      setNotice(
        `Scan complete — ${result.endpoints_count} endpoints, ${result.changes_count} changes (${result.breaking_count} breaking).`,
      );
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setScanning(false);
    }
  };

  if (error) return <ErrorBanner message={error} />;
  if (!repo) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading repository…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repository"
        description="Source repository monitored by the agent."
        meta={
          <>
            <StatusPill color={repo.monitoring ? "green" : "gray"}>
              {repo.monitoring ? "Monitoring active" : "Monitoring paused"}
            </StatusPill>
            <span>Connection {repo.connection}</span>
          </>
        }
        actions={
          <Button onClick={runScan} disabled={scanning}>
            {scanning ? (
              <>
                <IconRefresh className="h-4 w-4 animate-spin" />
                Scanning…
              </>
            ) : (
              <>
                <IconPlay className="h-4 w-4" />
                Run Scan
              </>
            )}
          </Button>
        }
      />

      {notice && <InfoBanner message={notice} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <SectionHeader
            title="Repository details"
            action={<IconRepo className="h-4 w-4 text-ink-mute" />}
          />
          <div>
            <InfoRow label="Repository" value={repo.name ?? "Not connected"} mono />
            <InfoRow label="Monitoring" value={repo.monitoring ? "ACTIVE" : "PAUSED"} />
            <InfoRow label="Status" value={repo.status} />
            <InfoRow label="Connection" value={repo.connection} />
            <InfoRow label="Last scan" value={repo.last_scan ?? "never"} />
            <InfoRow
              label="Last change"
              value={latestChange ? `${latestChange.method} ${latestChange.path}` : "none detected"}
              mono
            />
            <InfoRow label="Last change detected" value={repo.last_change ?? "never"} />
            {repo.last_change_summary && (
              <InfoRow label="Change summary" value={repo.last_change_summary} />
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <SectionHeader title="Latest scan" />
          {repo.last_scan_detail ? (
            <div>
              <InfoRow label="Source" value={repo.last_scan_detail.source} />
              <InfoRow label="Status" value={repo.last_scan_detail.status} />
              <InfoRow label="Endpoints" value={String(repo.last_scan_detail.endpoints_count)} />
              <InfoRow label="Changes" value={String(repo.last_scan_detail.changes_count)} />
              <InfoRow label="Completed" value={repo.last_scan_detail.created_at} />
              <div className="border-t border-gray-100 px-5 py-3 text-xs text-ink-soft">
                {repo.last_scan_detail.message}
              </div>
            </div>
          ) : (
            <EmptyState message="No scan has been recorded yet." />
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <SectionHeader title="Snapshots" count={snapshots.length} />
        {snapshots.length === 0 ? (
          <EmptyState message="No API snapshots stored yet. Run a scan or the demo." />
        ) : (
          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.head}>
                <tr>
                  <th className={tableClasses.th}>Version</th>
                  <th className={tableClasses.th}>Repository</th>
                  <th className={tableClasses.th}>Endpoints</th>
                  <th className={tableClasses.th}>Created</th>
                  <th className={tableClasses.th}>Snapshot</th>
                </tr>
              </thead>
              <tbody className={tableClasses.body}>
                {snapshots.map((s) => (
                  <tr key={s.id} className={tableClasses.row}>
                    <td className={`${tableClasses.th} font-mono text-xs text-ink`}>v{s.version}</td>
                    <td className={`${tableClasses.th} font-mono text-xs text-ink-soft`}>
                      {s.repo_name}
                    </td>
                    <td className={tableClasses.th}>{s.endpoints_count}</td>
                    <td className={`${tableClasses.th} whitespace-nowrap text-xs text-ink-mute`}>
                      {s.created_at}
                    </td>
                    <td className={tableClasses.th}>
                      <Tag>snapshot #{s.id}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}