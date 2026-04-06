"use server";

import { redirect } from "next/navigation";
import Link from "next/link";
import { checkAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";

interface AuditEntry {
  id: string;
  action: string;
  source_id: string | null;
  details: Record<string, unknown> | null;
  actor: string;
  created_at: string;
  data_sources: { slug: string; jurisdiction: string; category: string } | null;
}

const ACTION_COLORS: Record<string, string> = {
  source_checked: "bg-slate-100 text-slate-600",
  hash_changed: "bg-amber-100 text-amber-700",
  source_error: "bg-red-100 text-red-700",
  source_added: "bg-emerald-100 text-emerald-700",
  value_updated: "bg-blue-100 text-blue-700",
};

export default async function AuditLogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const auth = await checkAdminAuth();

  if (!auth.authorized) {
    redirect(`/${locale}`);
  }

  const db = createAdminClient();

  const { data: entries } = await db
    .from("audit_log")
    .select("id, action, source_id, details, actor, created_at, data_sources ( slug, jurisdiction, category )")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (entries ?? []) as unknown as AuditEntry[];

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">CanStack Admin</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-slate-900">
            Audit Log
          </h1>
          <p className="mt-1 text-sm text-slate-500">Last 200 entries, newest first.</p>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/${locale}/admin`}>← Dashboard</Link>
        </Button>
      </div>

      <section className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Timestamp</th>
              <th className="px-4 py-3 font-medium text-slate-600">Action</th>
              <th className="px-4 py-3 font-medium text-slate-600">Source</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actor</th>
              <th className="px-4 py-3 font-medium text-slate-600">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No audit entries yet.
                </td>
              </tr>
            )}
            {rows.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                  {new Date(entry.created_at).toLocaleString("en-CA", {
                    timeZone: "America/Toronto",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {entry.data_sources?.slug ?? (
                    <span className="text-slate-400">—</span>
                  )}
                  {entry.data_sources && (
                    <span className="ml-1 text-slate-400">
                      ({entry.data_sources.jurisdiction})
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{entry.actor}</td>
                <td className="max-w-xs px-4 py-3">
                  {entry.details ? (
                    <details>
                      <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
                        Show
                      </summary>
                      <pre className="mt-1 overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-700">
                        {JSON.stringify(entry.details, null, 2)}
                      </pre>
                    </details>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
