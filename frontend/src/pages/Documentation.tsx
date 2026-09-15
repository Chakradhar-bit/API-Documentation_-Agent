import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { OpenApiOperation, OpenApiSchemaRef, OpenApiSpec } from "../types";
import {
  Card,
  EmptyState,
  ErrorBanner,
  MethodBadge,
  PageHeader,
  Spinner,
  StatusPill,
  Tag,
} from "../components/ui";
import { IconCheckCircle, IconSearch } from "../components/icons";

function resolveRef(spec: OpenApiSpec, ref?: OpenApiSchemaRef | null) {
  const name = ref?.$ref?.split("/").pop();
  if (!name) return null;
  const schema = spec.components?.schemas?.[name];
  if (!schema) return null;
  return { name, schema };
}

function SchemaTable({ spec, ref }: { spec: OpenApiSpec; ref?: OpenApiSchemaRef | null }) {
  const resolved = resolveRef(spec, ref);
  if (resolved) {
    const props = resolved.schema.properties ?? {};
    const required = resolved.schema.required ?? [];
    const entries = Object.entries(props);
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-3 py-2">
          <Tag>{resolved.name}</Tag>
          <span className="text-[11px] text-ink-mute">component schema</span>
        </div>
        {entries.length === 0 ? (
          <p className="px-3 py-2 text-xs text-ink-mute">No documented fields.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">Field</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map(([name, def]) => (
                <tr key={name} className="transition-colors hover:bg-gray-50/80">
                  <td className="px-3 py-2 font-mono text-xs text-ink">{name}</td>
                  <td className="px-3 py-2 text-xs text-ink-soft">
                    {def.type === "array" && def.items
                      ? `array<${(def.items as OpenApiSchemaRef).type ?? "object"}>`
                      : def.type ?? "object"}
                  </td>
                  <td className="px-3 py-2 text-xs text-ink-mute">
                    {required.includes(name) ? "yes" : "no"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  const inner =
    ref?.type === "array" && ref.items ? resolveRef(spec, ref.items as OpenApiSchemaRef) : null;
  if (inner) {
    return (
      <div className="space-y-2">
        <div className="text-[11px] text-ink-mute">Array of {inner.name}</div>
        <SchemaTable spec={spec} ref={{ $ref: `#/components/schemas/${inner.name}` }} />
      </div>
    );
  }
  if (ref?.type) return <Tag>{ref.type}</Tag>;
  return <span className="text-xs text-ink-mute">—</span>;
}

function OperationCard({
  spec,
  path,
  method,
  op,
}: {
  spec: OpenApiSpec;
  path: string;
  method: string;
  op: OpenApiOperation;
}) {
  const bodyRef = op.requestBody ? Object.values(op.requestBody.content)[0]?.schema : undefined;
  const responses = Object.entries(op.responses ?? {});

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-3.5">
        <MethodBadge method={method} />
        <span className="font-mono text-sm text-ink">{path}</span>
        {op.operationId && <Tag>{op.operationId}</Tag>}
      </div>
      <div className="space-y-5 px-5 py-5">
        {op.summary && <p className="text-sm text-ink-soft">{op.summary}</p>}
        {op.description && op.description !== op.summary && (
          <p className="whitespace-pre-wrap text-sm text-ink-soft">{op.description}</p>
        )}

        {op.parameters && op.parameters.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
              Parameters
            </h4>
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">In</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {op.parameters.map((p) => (
                    <tr key={`${p.in}-${p.name}`} className="transition-colors hover:bg-gray-50/80">
                      <td className="px-3 py-2 font-mono text-xs text-ink">{p.name}</td>
                      <td className="px-3 py-2 text-xs text-ink-soft">{p.in}</td>
                      <td className="px-3 py-2 text-xs text-ink-soft">{p.schema?.type ?? "string"}</td>
                      <td className="px-3 py-2 text-xs text-ink-mute">{p.required ? "yes" : "no"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {bodyRef && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
              Request body
            </h4>
            <div className="mt-2">
              <SchemaTable spec={spec} ref={bodyRef} />
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Responses</h4>
          <div className="mt-2 space-y-3">
            {responses.map(([code, res]) => {
              const resRef = res.content ? Object.values(res.content)[0]?.schema : undefined;
              return (
                <div key={code} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag>{code}</Tag>
                    <span className="text-xs text-ink-soft">{res.description}</span>
                  </div>
                  {resRef && <SchemaTable spec={spec} ref={resRef} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function Documentation() {
  const [spec, setSpec] = useState<OpenApiSpec | null>(null);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .getOpenApi()
      .then(setSpec)
      .catch((e) => setError(e.message));
    api
      .validateOpenApi()
      .then(setValidation)
      .catch(() => setValidation(null));
  }, []);

  const operations = useMemo(() => {
    if (!spec) return [];
    const list: { path: string; method: string; op: OpenApiOperation }[] = [];
    for (const [path, methods] of Object.entries(spec.paths ?? {})) {
      for (const [method, op] of Object.entries(methods ?? {})) {
        list.push({ path, method: method.toUpperCase(), op });
      }
    }
    return list;
  }, [spec]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return operations;
    return operations.filter(
      (o) =>
        o.path.toLowerCase().includes(q) ||
        o.method.toLowerCase().includes(q) ||
        (o.op.summary ?? "").toLowerCase().includes(q),
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

  if (error) return <ErrorBanner message={error} />;
  if (!spec) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading specification…" />
      </div>
    );
  }

  const schemaCount = Object.keys(spec.components?.schemas ?? {}).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentation"
        description={
          <>
            Generated OpenAPI specification:{" "}
            <span className="font-medium text-ink">{spec.info.title}</span> v{spec.info.version}
          </>
        }
        meta={
          <>
            <Tag>{spec.openapi}</Tag>
            <span>{operations.length} operations</span>
            <span>{schemaCount} schemas</span>
            {validation && (
              <StatusPill color={validation.valid ? "green" : "red"}>
                {validation.valid ? "Specification valid" : `${validation.errors.length} errors`}
              </StatusPill>
            )}
          </>
        }
        actions={
          <>
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter endpoints"
                className="w-full rounded-lg border border-gray-300 bg-surface py-2 pl-9 pr-3 text-sm text-ink shadow-panel outline-none transition-all duration-150 placeholder:text-ink-mute focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              />
            </div>
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-surface px-3.5 py-2 text-sm font-semibold text-ink shadow-panel transition-all duration-150 hover:border-gray-400 hover:bg-gray-50 hover:shadow-btn active:scale-[0.985]"
            >
              <IconCheckCircle className="h-4 w-4 text-blue-600" />
              Download openapi.json
            </button>
          </>
        }
      />

      {filtered.length === 0 ? (
        <Card className="overflow-hidden">
          <EmptyState message="No operations match the current filter." />
        </Card>
      ) : (
        <div className="space-y-5">
          {filtered.map(({ path, method, op }) => (
            <OperationCard key={`${method}-${path}`} spec={spec} path={path} method={method} op={op} />
          ))}
        </div>
      )}
    </div>
  );
}