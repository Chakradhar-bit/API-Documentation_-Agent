import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { Endpoint, SchemaDef } from "../types";
import {
  Card,
  CodeBlock,
  EmptyState,
  ErrorBanner,
  MethodBadge,
  PageHeader,
  SectionHeader,
  Spinner,
  Tag,
} from "../components/ui";
import { IconChevronRight, IconSearch } from "../components/icons";

function SchemaView({ schema, title }: { schema?: SchemaDef | null; title: string }) {
  if (!schema || Object.keys(schema.fields ?? {}).length === 0) return null;
  const rows = Object.entries(schema.fields);
  return (
    <div>
      <div className="flex items-center gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">{title}</h4>
        <Tag>{schema.model}</Tag>
        {schema.many && <Tag>array</Tag>}
      </div>
      <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">Field</th>
              <th className="px-3 py-2 font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(([name, type]) => (
              <tr key={name} className="transition-colors hover:bg-gray-50/80">
                <td className="px-3 py-2 font-mono text-xs text-ink">{name}</td>
                <td className="px-3 py-2 text-xs text-ink-soft">{type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ApiExplorer() {
  const [endpoints, setEndpoints] = useState<Endpoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    api
      .getEndpoints()
      .then((eps) => {
        setEndpoints(eps);
        setSelectedId(eps[0]?.id ?? null);
      })
      .catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    if (!endpoints) return [];
    const q = query.trim().toLowerCase();
    if (!q) return endpoints;
    return endpoints.filter(
      (e) =>
        e.path.toLowerCase().includes(q) ||
        e.method.toLowerCase().includes(q) ||
        (e.summary ?? "").toLowerCase().includes(q),
    );
  }, [endpoints, query]);

  const selected = useMemo(
    () => endpoints?.find((e) => e.id === selectedId) ?? filtered[0] ?? null,
    [endpoints, filtered, selectedId],
  );

  if (error) return <ErrorBanner message={error} />;
  if (!endpoints) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading endpoints…" />
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <Card className="overflow-hidden">
        <SectionHeader title="API Explorer" />
        <EmptyState message="No endpoints detected. Run a scan from the Repository page." />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Explorer"
        description="Every endpoint extracted from the repository's FastAPI source."
        meta={<span>{endpoints.length} endpoints detected</span>}
        actions={
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search path, method or summary"
              className="w-full rounded-lg border border-gray-300 bg-surface py-2 pl-9 pr-3 text-sm text-ink shadow-panel outline-none transition-all duration-150 placeholder:text-ink-mute focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
            />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="overflow-hidden lg:col-span-2" delay={0}>
          <SectionHeader title="Endpoints" count={filtered.length} />
          {filtered.length === 0 ? (
            <EmptyState message="No endpoints match your search." />
          ) : (
            <ul className="max-h-[640px] divide-y divide-gray-100 overflow-y-auto">
              {filtered.map((e) => {
                const active = selected?.id === e.id;
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(e.id ?? null)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                        active ? "bg-blue-50/70" : "hover:bg-gray-50/80"
                      }`}
                    >
                      <MethodBadge method={e.method} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-mono text-xs text-ink">{e.path}</span>
                        <span className="mt-0.5 block truncate text-xs text-ink-mute">
                          {e.summary ?? "No description"}
                        </span>
                      </span>
                      <IconChevronRight
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          active ? "text-blue-600" : "text-gray-300"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-3">
          {selected ? (
            <Card className="overflow-hidden" key={selected.id} delay={40}>
              <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-4">
                <MethodBadge method={selected.method} />
                <span className="font-mono text-sm text-ink">{selected.path}</span>
                {selected.status_codes.length > 0 && (
                  <span className="ml-auto flex gap-1.5">
                    {selected.status_codes.map((code) => (
                      <Tag key={code}>{code}</Tag>
                    ))}
                  </span>
                )}
              </div>

              <div className="space-y-5 px-5 py-5">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                    Description
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-soft">
                    {selected.summary ?? "No docstring provided for this endpoint."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-canvas px-3.5 py-3">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-ink-mute">
                      Authentication
                    </div>
                    <div className="mt-1 text-xs text-ink">{selected.auth ?? "None detected"}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-canvas px-3.5 py-3">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-ink-mute">
                      Source file
                    </div>
                    <div className="mt-1 truncate font-mono text-xs text-ink">
                      {selected.source_file ?? "—"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                    Parameters
                  </h3>
                  {selected.params.length === 0 ? (
                    <p className="mt-1.5 text-sm text-ink-mute">
                      No path or query parameters detected.
                    </p>
                  ) : (
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
                          {selected.params.map((p) => (
                            <tr
                              key={`${p.in}-${p.name}`}
                              className="transition-colors hover:bg-gray-50/80"
                            >
                              <td className="px-3 py-2 font-mono text-xs text-ink">{p.name}</td>
                              <td className="px-3 py-2 text-xs text-ink-soft">{p.in}</td>
                              <td className="px-3 py-2 text-xs text-ink-soft">{p.type ?? "string"}</td>
                              <td className="px-3 py-2 text-xs text-ink-mute">
                                {p.required ? "yes" : "no"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <SchemaView schema={selected.request_schema} title="Request body" />
                <SchemaView schema={selected.response_schema} title="Response" />

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                    OpenAPI definition
                  </h3>
                  <CodeBlock
                    code={JSON.stringify(
                      {
                        [selected.method.toLowerCase()]: {
                          summary: selected.summary ?? "",
                          parameters: selected.params,
                          responses: { "200": { description: "Successful response" } },
                        },
                      },
                      null,
                      2,
                    )}
                    className="mt-2 max-h-80"
                  />
                </div>

                {selected.auth && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                    {selected.auth}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <EmptyState message="Select an endpoint to view its documentation." />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}