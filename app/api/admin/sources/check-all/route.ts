import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { checkAdminAuth } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BATCH_SIZE = 20;

interface CheckResult {
  id: string;
  slug: string;
  action: "source_checked" | "hash_changed" | "source_error";
  http_status: number | null;
  hash_changed: boolean;
  error: string | null;
}

async function checkSource(
  source: { id: string; slug: string; source_url: string },
  previousHash: string | null
): Promise<CheckResult> {
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

      if (previousHash && previousHash !== contentHash) {
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

  const action: CheckResult["action"] =
    errorMessage || !httpStatus || httpStatus >= 400
      ? "source_error"
      : hashChanged
      ? "hash_changed"
      : "source_checked";

  return {
    id: source.id,
    slug: source.slug,
    action,
    http_status: httpStatus,
    hash_changed: hashChanged,
    error: errorMessage,
    // Internal fields for DB writes below
    _contentHash: contentHash,
    _contentLength: contentLength,
  } as CheckResult & {
    _contentHash: string | null;
    _contentLength: number | null;
  };
}

export async function POST() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return auth.response;

  const db = createAdminClient();

  // Fetch all active sources
  const { data: sources, error: sourcesError } = await db
    .from("data_sources")
    .select("id, slug, source_url")
    .eq("is_active", true)
    .order("jurisdiction")
    .order("category");

  if (sourcesError) {
    return NextResponse.json({ error: sourcesError.message }, { status: 500 });
  }

  if (!sources || sources.length === 0) {
    return NextResponse.json({ checked: 0, changed: 0, errored: 0 });
  }

  // Build a map of latest content_hash per source (to detect changes)
  const sourceIds = sources.map((s) => s.id);
  const { data: latestSnaps } = await db
    .from("source_snapshots")
    .select("source_id, content_hash")
    .in("source_id", sourceIds)
    .order("fetched_at", { ascending: false });

  const previousHashBySource = new Map<string, string | null>();
  for (const snap of latestSnaps ?? []) {
    if (!previousHashBySource.has(snap.source_id)) {
      previousHashBySource.set(snap.source_id, snap.content_hash);
    }
  }

  const results: (CheckResult & {
    _contentHash: string | null;
    _contentLength: number | null;
  })[] = [];

  // Process in batches of BATCH_SIZE sequentially (avoid hammering servers)
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);

    for (const source of batch) {
      const prevHash = previousHashBySource.get(source.id) ?? null;
      const result = await checkSource(source, prevHash);
      results.push(
        result as CheckResult & {
          _contentHash: string | null;
          _contentLength: number | null;
        }
      );
    }
  }

  // Bulk insert snapshots
  const snapshotRows = results.map((r) => ({
    source_id: r.id,
    http_status: r.http_status,
    content_hash: r._contentHash,
    content_length: r._contentLength,
    hash_changed: r.hash_changed,
    error_message: r.error,
  }));

  await db.from("source_snapshots").insert(snapshotRows);

  // Bulk insert audit log entries
  const auditRows = results.map((r) => ({
    action: r.action,
    source_id: r.id,
    details: {
      http_status: r.http_status,
      hash_changed: r.hash_changed,
      error: r.error,
    },
    actor: "cron",
  }));

  await db.from("audit_log").insert(auditRows);

  const summary = {
    checked: results.length,
    changed: results.filter((r) => r.action === "hash_changed").length,
    errored: results.filter((r) => r.action === "source_error").length,
    results: results.map(({ id, slug, action, http_status, hash_changed, error }) => ({
      id,
      slug,
      action,
      http_status,
      hash_changed,
      error,
    })),
  };

  return NextResponse.json(summary);
}
