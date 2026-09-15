import type {
  ApiChange,
  DashboardData,
  Endpoint,
  OpenApiSpec,
  RepositoryInfo,
  ScanResult,
  SnapshotInfo,
} from "../types";

const BASE = "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* keep default */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getDashboard: () => fetch(`${BASE}/dashboard`).then(handle<DashboardData>),
  getEndpoints: () => fetch(`${BASE}/endpoints`).then(handle<Endpoint[]>),
  getChanges: () => fetch(`${BASE}/changes`).then(handle<ApiChange[]>),
  getChange: (id: number | string) => fetch(`${BASE}/changes/${id}`).then(handle<ApiChange>),
  getRepository: () => fetch(`${BASE}/repository`).then(handle<RepositoryInfo>),
  getSnapshots: () => fetch(`${BASE}/snapshots`).then(handle<SnapshotInfo[]>),
  getOpenApi: () => fetch(`${BASE}/openapi`).then(handle<OpenApiSpec>),
  validateOpenApi: () =>
    fetch(`${BASE}/openapi/validate`).then(handle<{ valid: boolean; errors: string[] }>),
  scan: (repoPath?: string) =>
    fetch(`${BASE}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repoPath ? { repo_path: repoPath } : {}),
    }).then(handle<ScanResult>),
  runDemo: () => fetch(`${BASE}/demo/run`, { method: "POST" }).then(handle<ScanResult>),
};
