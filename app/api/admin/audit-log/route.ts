import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("source_id");
  const action = searchParams.get("action");
  const limitParam = searchParams.get("limit");
  const limit = Math.min(parseInt(limitParam ?? "100", 10), 500);

  const db = createAdminClient();

  let query = db
    .from("audit_log")
    .select(
      `
      id,
      action,
      source_id,
      details,
      actor,
      created_at,
      data_sources ( slug, jurisdiction, category )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (sourceId) {
    query = query.eq("source_id", sourceId);
  }

  if (action) {
    query = query.eq("action", action);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data ?? [] });
}
