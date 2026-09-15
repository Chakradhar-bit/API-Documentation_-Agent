import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { ApiChange } from "../types";
import {
  Button,
  Card,
  CodeBlock,
  ErrorBanner,
  MethodBadge,
  PageHeader,
  SectionHeader,
  SeverityBadge,
  SeverityBadgeHigh,
  Spinner,
  Tag,
} from "../components/ui";
import { IconArrowLeft, IconChevronRight, IconDoc } from "../components/icons";
import { changeTypeLabel } from "./Changes";

function pretty(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return JSON.stringify(value, null, 2);
}

function FieldComparison({ change }: { change: ApiChange }) {
  const before = change.before_data as Record<string, unknown> | null;
  const after = change.after_data as Record<string, unknown> | null;
  const beforeField = before?.field as string | undefined;
  const afterField = after?.field as string | undefined;
  const beforeType = before?.type as string | undefined;
  const afterType = after?.type as string | undefined;

  if (beforeField || afterField) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
            Before
          </div>
          <div className="mt-2 space-y-1 font-mono text-sm text-ink">
            <div>{beforeField ?? "—"}</div>
            {beforeType && <div className="text-xs text-ink-mute">{beforeType}</div>}
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">After</div>
          <div className="mt-2 space-y-1 font-mono text-sm text-ink">
            <div>{afterField ?? "—"}</div>
            {afterType && <div className="text-xs text-ink-mute">{afterType}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (before || after) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
            Before
          </div>
          <CodeBlock code={pretty(before)} className="max-h-72 whitespace-pre-wrap" />
        </div>
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
            After
          </div>
          <CodeBlock code={pretty(after)} className="max-h-72 whitespace-pre-wrap" />
        </div>
      </div>
    );
  }

  return <p className="text-sm text-ink-mute">No before/after payload recorded for this change.</p>;
}

export default function ChangeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [change, setChange] = useState<ApiChange | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getChange(id)
      .then(setChange)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={error} />
        <Button variant="secondary" onClick={() => navigate("/changes")}>
          <IconArrowLeft className="h-4 w-4" />
          Back to changes
        </Button>
      </div>
    );
  }

  if (!change) {
    return (
      <div className="py-24 text-center">
        <Spinner label="Loading change…" />
      </div>
    );
  }

  const affected = change.affected_files ?? [];
  const before = change.before_data as { field?: string } | null;
  const after = change.after_data as { field?: string } | null;
  const rename = before?.field && after?.field ? `${before.field} → ${after.field}` : null;

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-xs text-ink-mute">
        <Link to="/changes" className="transition-colors hover:text-blue-700">
          Changes
        </Link>
        <IconChevronRight className="h-3.5 w-3.5" />
        <span className="font-mono text-ink">
          {change.method} {change.path}
        </span>
      </nav>

      <PageHeader
        title={`${change.method} ${change.path}`}
        description={change.description}
        meta={
          <>
            <Tag>Change #{change.id}</Tag>
            <span>{changeTypeLabel(change.change_type)}</span>
            <span>Detected {change.created_at}</span>
          </>
        }
        actions={
          <Button variant="secondary" onClick={() => navigate("/changes")}>
            <IconArrowLeft className="h-4 w-4" />
            Back to changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden">
            <SectionHeader title="Change" />
            <div className="space-y-4 px-5 py-5">
              <div className="flex flex-wrap items-center gap-3">
                <MethodBadge method={change.method} />
                <span className="font-mono text-sm text-ink">{change.path}</span>
                <SeverityBadge severity={change.severity} />
                {rename && <span className="font-mono text-xs text-ink-mute">{rename}</span>}
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                  Reason
                </div>
                <p className="mt-1.5 text-sm text-ink-soft">{change.description}</p>
              </div>
              <FieldComparison change={change} />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <SectionHeader title="AI Analysis" action={<Tag>{change.ai_source ?? "deterministic"}</Tag>} />
            <div className="space-y-4 px-5 py-5">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                  <IconDoc className="h-3.5 w-3.5" /> Explanation
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {change.explanation ?? "No explanation available for this change."}
                </p>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                  Risk assessment
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {change.risk_assessment ?? "—"}
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                  Recommendation
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-blue-900">
                  {change.recommendation ?? "—"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <SectionHeader title="Severity" />
            <div className="space-y-3 px-5 py-5">
              <SeverityBadgeHigh severity={change.severity} />
              <p className="text-xs text-ink-mute">
                Determined deterministically from the snapshot diff — no model inference involved.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <SectionHeader title="Affected files" count={affected.length} />
            {affected.length === 0 ? (
              <p className="px-5 py-5 text-sm text-ink-mute">No referencing files detected.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {affected.map((f) => (
                  <li key={f.file_path} className="px-5 py-3">
                    <div className="truncate font-mono text-xs text-ink">{f.file_path}</div>
                    <div className="mt-0.5 text-[11px] text-ink-mute">{f.reason}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}