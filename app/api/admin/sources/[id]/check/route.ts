import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { checkAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return auth.response;

  const { id } = params;
  const db = createAdminClient();

  // Load the source
  const { data: source, error: sourceError } = await db
    .from("data_sources")
    .select("*")
    .eq("id", id)
    .single();

  if (sourceError || !source) {
    return NextResponse.json({ error: "Source not found." }, { status: 404 });
  }

  // Get the previous snapshot for hash comparison
  const { data: previous } = await db
    .from("source_snapshots")
    .select("content_hash")
    .eq("source_id", id)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch the source URL
  let httpStatus: number | null = null;
  let contentHash: string | null = null;
  let contentLength: number | null = null;
  let errorMessage: string | null = null;
  let hashChanged = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(source.source_url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "CanStack-SourceMonitor/1.0 (compliance data verification; contact@canstack.ca)",
      },
    });

    clearTimeout(timeout);
    httpStatus = response.status;

    if (response.ok) {
      const body = await response.text();
      contentLength = body.length;
      contentHash = createHash("sha256").update(body).digest("hex");

      if (previous?.content_hash && previous.content_hash !== contentHash) {
        hashChanged = true;
      }
    } else {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
  } catch (err) {
    httpStatus = null;
    errorMessage =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Request timed out after 10 seconds."
          : err.message
        : "Unknown fetch error.";
  }

  // Insert snapshot
  const { data: snapshot, error: snapError } = await db
    .from("source_snapshots")
    .insert({
      source_id: id,
      http_status: httpStatus,
      content_hash: contentHash,
      content_length: contentLength,
      hash_changed: hashChanged,
      error_message: errorMessage,
    })
    .select()
    .single();

  if (snapError) {
    return NextResponse.json({ error: snapError.message }, { status: 500 });
  }

  // Write audit log
  const action =
    errorMessage || !httpStatus || httpStatus >= 400
      ? "source_error"
      : hashChanged
      ? "hash_changed"
      : "source_checked";

  await db.from("audit_log").insert({
    action,
    source_id: id,
    details: {
      http_status: httpStatus,
      content_hash: contentHash,
      content_length: contentLength,
      hash_changed: hashChanged,
      error: errorMessage,
      source_url: source.source_url,
    },
    actor: "admin",
  });

  return NextResponse.json({ snapshot, action });
}
