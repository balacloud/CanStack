"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SourceStatus = "green" | "yellow" | "red";

interface Snapshot {
  id: string;
  fetched_at: string;
  http_status: number | null;
  hash_changed: boolean;
  error_message: string | null;
}

interface Source {
  id: string;
  slug: string;
  jurisdiction: string;
  category: string;
  source_url: string;
  ts_file: string;
  ts_constant: string;
  next_expected: string | null;
  is_active: boolean;
  latest_snapshot: Snapshot | null;
  status: SourceStatus;
}

const STATUS_COLORS: Record<SourceStatus, string> = {
  green: "bg-emerald-100 text-emerald-800",
  yellow: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<SourceStatus, string> = {
  green: "OK",
  yellow: "Changed",
  red: "Error",
};

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "< 1h ago";
}

export function AdminDashboard({
  sources,
  locale,
}: {
  sources: Source[];
  locale: string;
}) {
  const [rows, setRows] = useState<Source[]>(sources);
  const [checkingAll, setCheckingAll] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [lastCheckSummary, setLastCheckSummary] = useState<string | null>(null);

  const total = rows.length;
  const changed = rows.filter((s) => s.status === "yellow").length;
  const errored = rows.filter((s) => s.status === "red").length;

  async function checkAll() {
    setCheckingAll(true);
    setLastCheckSummary(null);
    try {
      const res = await fetch("/api/admin/sources/check-all", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLastCheckSummary(
          `Checked ${data.checked} sources — ${data.changed} changed, ${data.errored} errored.`
        );
        // Reload page to get fresh data
        window.location.reload();
      } else {
        setLastCheckSummary(`Error: ${data.error}`);
      }
    } catch {
      setLastCheckSummary("Network error during check-all.");
    } finally {
      setCheckingAll(false);
    }
  }

  async function checkOne(id: string) {
    setCheckingId(id);
    try {
      const res = await fetch(`/api/admin/sources/${id}/check`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        // Update this row in state
        setRows((prev) =>
          prev.map((s) => {
            if (s.id !== id) return s;
            const snap = data.snapshot as Snapshot;
            let status: SourceStatus = "green";
            if (!snap || snap.http_status !== 200) status = "red";
            else if (snap.hash_changed) status = "yellow";
            return { ...s, latest_snapshot: snap, status };
          })
        );
      }
    } catch {
      // Silent — row stays as-is
    } finally {
      setCheckingId(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">CanStack Admin</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-slate-900">
            Source Monitor
          </h1>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="ghost">
            <Link href={`/${locale}/admin/audit`}>Audit Log</Link>
          </Button>
          <Button
            onClick={checkAll}
            disabled={checkingAll}
                     >
            {checkingAll ? "Checking..." : "Refresh All Sources"}
          </Button>
        </div>
      </div>

      {lastCheckSummary && (
        <p className="rounded bg-slate-100 px-4 py-2 text-sm text-slate-700">
          {lastCheckSummary}
        </p>
      )}

      {/* Status cards */}
      <section className="grid grid-cols-3 gap-4 sm:grid-cols-3">
        <Card className="border-slate-900/10 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{total}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">
              Hash Changed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-amber-900">{changed}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Errors / Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-red-900">{errored}</p>
          </CardContent>
        </Card>
      </section>

      {/* Source table */}
      <section className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Slug</th>
              <th className="px-4 py-3 font-medium text-slate-600">Jurisdiction</th>
              <th className="px-4 py-3 font-medium text-slate-600">Category</th>
              <th className="px-4 py-3 font-medium text-slate-600">Source URL</th>
              <th className="px-4 py-3 font-medium text-slate-600">Last Checked</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 font-medium text-slate-600">TS Constant</th>
              <th className="px-4 py-3 font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No sources seeded yet.{" "}
                  <Link href="/docs/decisions/DATA_SOURCING_SYSTEM_ARCHITECTURE.md" className="underline">
                    Run seed script
                  </Link>{" "}
                  to add sources.
                </td>
              </tr>
            )}
            {rows.map((source) => (
              <tr key={source.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {source.slug}
                </td>
                <td className="px-4 py-3 text-slate-700">{source.jurisdiction}</td>
                <td className="px-4 py-3 text-slate-500">{source.category}</td>
                <td className="px-4 py-3">
                  <a
                    href={source.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-primary underline underline-offset-2"
                    style={{ maxWidth: 220, display: "inline-block" }}
                    title={source.source_url}
                  >
                    {new URL(source.source_url).hostname}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatRelativeTime(source.latest_snapshot?.fetched_at ?? null)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[source.status]}`}
                  >
                    {STATUS_LABELS[source.status]}
                  </span>
                  {source.latest_snapshot?.error_message && (
                    <span
                      className="ml-1 cursor-help text-xs text-red-500"
                      title={source.latest_snapshot.error_message}
                    >
                      ⚠
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {source.ts_constant}
                </td>
                <td className="px-4 py-3">
                  <Button
                                       variant="ghost"
                    onClick={() => checkOne(source.id)}
                    disabled={checkingId === source.id || checkingAll}
                  >
                    {checkingId === source.id ? "..." : "Check"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
