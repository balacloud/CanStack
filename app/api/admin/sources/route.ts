import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return auth.response;

  const db = createAdminClient();

  // Fetch all sources with their latest snapshot joined
  const { data: sources, error } = await db
    .from("data_sources")
    .select("*")
    .order("jurisdiction")
    .order("category");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!sources || sources.length === 0) {
    return NextResponse.json({ sources: [] });
  }

  // Get the latest snapshot for each source
  const sourceIds = sources.map((s) => s.id);
  const { data: snapshots, error: snapError } = await db
    .from("source_snapshots")
    .select("*")
    .in("source_id", sourceIds)
    .order("fetched_at", { ascending: false });

  if (snapError) {
    return NextResponse.json({ error: snapError.message }, { status: 500 });
  }

  // Build a map of source_id → latest snapshot
  const latestBySource = new Map<string, typeof snapshots[0]>();
  for (const snap of snapshots ?? []) {
    if (!latestBySource.has(snap.source_id)) {
      latestBySource.set(snap.source_id, snap);
    }
  }

  const enriched = sources.map((source) => {
    const latest = latestBySource.get(source.id) ?? null;
    const now = new Date();

    let status: "green" | "yellow" | "red" = "green";
    if (!latest || latest.http_status !== 200) {
      status = "red";
    } else if (latest.hash_changed) {
      status = "yellow";
    } else if (source.next_expected && new Date(source.next_expected) < now) {
      // Overdue — past expected update date with no recent check this cycle
      status = "red";
    }

    return {
      ...source,
      latest_snapshot: latest,
      status,
    };
  });

  return NextResponse.json({ sources: enriched });
}

export async function POST(request: Request) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const {
    slug,
    jurisdiction,
    category,
    source_url,
    document_ref,
    effective_date,
    update_cycle,
    next_expected,
    ts_file,
    ts_constant,
    notes,
  } = body;

  if (!slug || !jurisdiction || !category || !source_url || !update_cycle || !ts_file || !ts_constant) {
    return NextResponse.json(
      { error: "Missing required fields: slug, jurisdiction, category, source_url, update_cycle, ts_file, ts_constant" },
      { status: 400 }
    );
  }

  const db = createAdminClient();

  const { data, error } = await db
    .from("data_sources")
    .insert({
      slug,
      jurisdiction,
      category,
      source_url,
      document_ref: document_ref ?? null,
      effective_date: effective_date ?? null,
      update_cycle,
      next_expected: next_expected ?? null,
      ts_file,
      ts_constant,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await db.from("audit_log").insert({
    action: "source_added",
    source_id: data.id,
    details: { slug, source_url },
    actor: "admin",
  });

  return NextResponse.json({ source: data }, { status: 201 });
}
