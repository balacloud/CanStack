"use server";

import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const auth = await checkAdminAuth();

  if (!auth.authorized) {
    redirect(`/${locale}/admin/login`);
  }

  const db = createAdminClient();

  // Fetch sources with latest snapshot
  const { data: sources } = await db
    .from("data_sources")
    .select("*")
    .order("jurisdiction")
    .order("category");

  const sourceIds = (sources ?? []).map((s) => s.id);
  const latestBySource = new Map<string, Record<string, unknown>>();

  if (sourceIds.length > 0) {
    const { data: snapshots } = await db
      .from("source_snapshots")
      .select("*")
      .in("source_id", sourceIds)
      .order("fetched_at", { ascending: false });

    for (const snap of snapshots ?? []) {
      if (!latestBySource.has(snap.source_id)) {
        latestBySource.set(snap.source_id, snap);
      }
    }
  }

  const now = new Date();
  const enriched = (sources ?? []).map((source) => {
    const latest = latestBySource.get(source.id) ?? null;
    let status: "green" | "yellow" | "red" = "green";

    if (!latest || (latest.http_status as number) !== 200) {
      status = "red";
    } else if (latest.hash_changed) {
      status = "yellow";
    } else if (source.next_expected && new Date(source.next_expected) < now) {
      status = "red";
    }

    return { ...source, latest_snapshot: latest, status };
  });

  return <AdminDashboard sources={enriched} locale={locale} />;
}
