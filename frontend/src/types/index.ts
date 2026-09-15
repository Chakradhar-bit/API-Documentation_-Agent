// Shared types mirroring the backend Pydantic schemas.

export type Severity = "SAFE" | "WARNING" | "BREAKING";

export interface Param {
  name: string;
  in: string;
  type: string;
  required: boolean;
}

export interface SchemaDef {
  model: string;
  fields: Record<string, string>;
  many?: boolean;
}

export interface Endpoint {
  id?: number;
  method: string;
  path: string;
  summary?: string | null;
  description?: string | null;
  params: Param[];
  request_schema?: SchemaDef | null;
  response_schema?: SchemaDef | null;
  status_codes: number[];
  auth?: string | null;
  source_file?: string | null;
}

export interface AffectedFile {
  file_path: string;
  reason: string;
}

export interface ApiChange {
  id: number;
  method: string;
  path: string;
  change_type: string;
  severity: Severity;
  description: string;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  created_at: string;
  affected_files: AffectedFile[];
  explanation?: string | null;
  risk_assessment?: string | null;
  recommendation?: string | null;
  ai_source?: string | null;
}

export interface DashboardStats {
  repository: string;
  endpoints: number;
  synchronized: number;
  changed: number;
  breaking: number;
  last_scan: string | null;
  monitoring: boolean;
  connection: string;
}

export interface RecentActivity {
  method: string;
  path: string;
  severity: Severity;
  summary: string;
  created_at: string;
  change_id: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_activity: RecentActivity[];
  last_changelog: string | null;
}

export interface RepositoryInfo {
  id?: number;
  name: string | null;
  status: string;
  monitoring: boolean;
  last_scan: string | null;
  last_change: string | null;
  connection: string;
  scan_count?: number;
  last_scan_detail?: {
    source: string;
    status: string;
    message: string;
    endpoints_count: number;
    changes_count: number;
    created_at: string;
  } | null;
  last_change_summary?: string | null;
}

export interface ScanResult {
  scan_id: number;
  status: string;
  message: string;
  endpoints_count: number;
  changes_count: number;
  breaking_count: number;
  changes: ApiChange[];
  changelog?: string;
}

export interface SnapshotInfo {
  id: number;
  repo_id: number;
  version: number;
  created_at: string;
  repo_name: string;
  endpoints_count: number;
}

export interface OpenApiSpec {
  openapi: string;
  info: { title: string; version: string; description?: string };
  paths: Record<string, Record<string, OpenApiOperation>>;
  components: {
    schemas: Record<string, OpenApiSchema>;
    securitySchemes?: Record<string, unknown>;
  };
}

export interface OpenApiOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: { name: string; in: string; required: boolean; schema: { type: string } }[];
  requestBody?: { content: Record<string, { schema: OpenApiSchemaRef }> };
  responses: Record<string, { description: string; content?: Record<string, { schema: OpenApiSchemaRef }> }>;
  security?: unknown[];
}

export interface OpenApiSchemaRef {
  $ref?: string;
  type?: string;
  properties?: Record<string, { type: string }>;
  items?: unknown;
}

export interface OpenApiSchema {
  type?: string;
  properties?: Record<string, { type: string; items?: unknown }>;
  required?: string[];
  items?: OpenApiSchemaRef;
  $ref?: string;
}

export const severityLabels: Record<Severity, string> = {
  SAFE: "Safe",
  WARNING: "Warning",
  BREAKING: "Breaking Change",
};
