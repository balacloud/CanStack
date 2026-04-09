"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculatePayrollPenalty,
  generateWCBCalendar,
  generateComplianceCalendar,
  type ComplianceDeadline,
  type ContractorProfile,
} from "@/lib/compliance-engine";
import { WSIB_ONTARIO_2026_RATES } from "@/lib/compliance-rules";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

const QUICK_LINKS = [
  {
    label: "CRA My Business Account",
    href: "https://www.canada.ca/en/revenue-agency/services/e-services/e-services-businesses/business-account.html",
  },
  {
    label: "Revenu Quebec My Account",
    href: "https://www.revenuquebec.ca/en/online-services/",
  },
  { label: "WSIB Ontario", href: "https://www.wsib.ca" },
  { label: "WorkSafeBC", href: "https://www.worksafebc.com" },
  { label: "WCB Alberta", href: "https://www.wcb.ab.ca" },
] as const;

function urgencyClass(urgency: ComplianceDeadline["urgency"]) {
  if (urgency === "overdue") return "border-red-400";
  if (urgency === "urgent") return "border-orange-400";
  if (urgency === "upcoming") return "border-yellow-400";
  return "border-slate-200";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function downloadIcs(deadlines: ComplianceDeadline[]) {
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CanStack//Compliance Hub//EN",
    ...deadlines.flatMap((deadline) => {
      const start = deadline.dueDate.toISOString().slice(0, 10).replaceAll("-", "");
      const end = new Date(deadline.dueDate);
      end.setDate(end.getDate() + 1);
      const endValue = end.toISOString().slice(0, 10).replaceAll("-", "");
      return [
        "BEGIN:VEVENT",
        `UID:${deadline.id}@canstack`,
        `SUMMARY:${deadline.label}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${endValue}`,
        `DESCRIPTION:${(deadline.notes ?? "").replaceAll("\n", " ")} ${(deadline.penaltyIfMissed ?? "").replaceAll("\n", " ")}`.trim(),
        ...(deadline.actionUrl ? [`URL:${deadline.actionUrl}`] : []),
        "END:VEVENT",
      ];
    }),
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "canstack-compliance-calendar.ics";
  anchor.click();
  URL.revokeObjectURL(href);
}

export function ComplianceDashboard({
  profile,
  onReset,
}: {
  profile: ContractorProfile;
  onReset: () => void;
}) {
  const t = useTranslations("compliance");
  const locale = useLocale();
  const isCalendarUnlocked = process.env.NODE_ENV !== "production";
  const [daysLateBucket, setDaysLateBucket] = useState<"1-3" | "4-5" | "6-7" | "8+">(
    "1-3",
  );
  const [overdueAmount, setOverdueAmount] = useState(5000);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem("canstack-compliance-done");
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  const allDeadlines = useMemo(() => generateComplianceCalendar(profile), [profile]);
  const next30Days = useMemo(
    () =>
      allDeadlines.filter((deadline) => {
        const delta = deadline.dueDate.getTime() - new Date().getTime();
        return delta <= 30 * 86400000;
      }),
    [allDeadlines],
  );
  const penalty = calculatePayrollPenalty(
    overdueAmount,
    daysLateBucket === "1-3"
      ? 3
      : daysLateBucket === "4-5"
        ? 5
        : daysLateBucket === "6-7"
          ? 7
          : 8,
    false,
  );
  const wcbEstimate = useMemo(
    () =>
      profile.hasEmployees
        ? generateWCBCalendar(profile.province, profile.industry, profile.annualRevenue)
        : null,
    [profile],
  );
  const isUnverifiedOntarioWsibRate =
    profile.province === "ON" &&
    profile.industry === "it-professional" &&
    !WSIB_ONTARIO_2026_RATES["it-professional-services"].verified;

  async function markDone(deadlineId: string) {
    const next = Array.from(new Set([...completedIds, deadlineId]));
    setCompletedIds(next);
    sessionStorage.setItem("canstack-compliance-done", JSON.stringify(next));

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from("compliance_acknowledgements").upsert({
        user_id: user.id,
        deadline_id: deadlineId,
        status: "done",
      });
    } catch {
      // Session storage is the fallback for unauthenticated users.
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">{t("title")}</p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-slate-900">
            {t("subtitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Deadlines are generated from your contractor profile and hardcoded public rules.
          </p>
        </div>
        <Button onClick={onReset} type="button" variant="outline">
          Reset / Update my profile
        </Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Card className="border-white/50 bg-white/92">
            <CardHeader>
              <CardTitle>{t("dashboard.next30")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {next30Days.length ? (
                next30Days.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`rounded-3xl border-2 bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.04)] ${urgencyClass(deadline.urgency)}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-primary">
                          {deadline.category}
                        </p>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {deadline.label}
                        </h3>
                        <p className="text-sm text-slate-600">{formatDate(deadline.dueDate)}</p>
                        {deadline.penaltyIfMissed ? (
                          <p className="text-sm text-slate-700">
                            {deadline.penaltyIfMissed}
                          </p>
                        ) : null}
                        {deadline.disclaimer ? (
                          <p className="text-xs text-slate-500">{deadline.disclaimer}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {deadline.urgency}
                        </span>
                        <Button
                          disabled={completedIds.includes(deadline.id)}
                          onClick={() => markDone(deadline.id)}
                          type="button"
                        >
                          {completedIds.includes(deadline.id)
                            ? "Done"
                            : t("dashboard.markDone")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  No upcoming compliance deadlines detected in the next 30 days.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/50 bg-white/92">
            <CardHeader>
              <CardTitle>{t("dashboard.fullCalendar")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200">
                <div
                  className={`space-y-3 bg-white p-4 ${
                    isCalendarUnlocked ? "" : "blur-[2px]"
                  }`}
                >
                  {allDeadlines.map((deadline) => (
                    <div key={deadline.id} className="rounded-2xl border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-900">
                          {deadline.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(deadline.dueDate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {isCalendarUnlocked ? null : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/70 p-6 text-center">
                    <p className="max-w-sm text-sm text-slate-700">{t("dashboard.locked")}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button asChild>
                        <Link href={`/${locale}/pricing`}>{t("dashboard.locked")}</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href={`/${locale}/pricing`}>{t("dashboard.exportIcs")}</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">{t("dashboard.disclaimer")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/50 bg-white/92">
            <CardHeader>
              <CardTitle>{t("dashboard.penaltyForecaster")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Payroll amount: {formatCurrency(overdueAmount)}
                </label>
                <input
                  className="w-full accent-primary"
                  max={50000}
                  min={0}
                  onChange={(event) => setOverdueAmount(Number(event.target.value))}
                  step={500}
                  type="range"
                  value={overdueAmount}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["1-3", "4-5", "6-7", "8+"] as const).map((bucket) => (
                  <button
                    key={bucket}
                    className={`min-h-12 rounded-2xl border px-3 py-3 text-sm transition ${
                      daysLateBucket === bucket
                        ? "border-primary bg-teal-50 text-teal-900"
                        : "border-slate-200 bg-white"
                    }`}
                    onClick={() => setDaysLateBucket(bucket)}
                    type="button"
                  >
                    {bucket}
                  </button>
                ))}
              </div>
              <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm text-slate-600">
                  Penalty rate: {(penalty.penaltyRate * 100).toFixed(0)}%
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {formatCurrency(penalty.penaltyAmount)}
                </p>
                <p className="mt-2 text-xs text-slate-500">{penalty.description}</p>
                <p className="mt-2 text-xs text-slate-500">{penalty.disclaimer}</p>
              </div>
            </CardContent>
          </Card>

          {profile.hasEmployees ? (
            <Card className="border-white/50 bg-white/92">
              <CardHeader>
                <CardTitle>WCB / WSIB Premium</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.workType === "sole-prop" &&
                  profile.province === "BC" && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                      <strong>BC — Owner coverage is voluntary.</strong> As a
                      sole proprietor, you are not automatically covered by
                      WorkSafeBC. The estimate below reflects your employees
                      only. Enrol separately if you want personal coverage.
                    </div>
                  )}
                {profile.workType === "sole-prop" &&
                  profile.province === "AB" && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                      <strong>AB — Owner coverage is opt-out.</strong> Alberta
                      sole proprietors are included in WCB coverage by default
                      but may apply to opt out. The estimate below reflects your
                      employees. Review your coverage status at wcb.ab.ca.
                    </div>
                  )}
                {isUnverifiedOntarioWsibRate || wcbEstimate?.premiumEstimate === null ? (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
                    <strong>WCB Premium Estimate Unavailable</strong>
                    <p className="mt-1">
                      We could not confirm a verified 2026 premium rate for your
                      industry. Visit{" "}
                      <a
                        href="https://www.wsib.ca/en/operational-policy-manual/table-rates"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        wsib.ca — Table of Rates
                      </a>{" "}
                      to find your exact rate class.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-600">
                      Estimated premium: {formatCurrency(wcbEstimate?.premiumEstimate ?? 0)}
                    </p>
                    <p className="text-xs text-slate-500">{wcbEstimate?.disclaimer}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}

          {profile.industry === "construction" && profile.workType === "sole-prop" ? (
            <Card className="border-white/50 bg-white/92">
              <CardHeader>
                <CardTitle>T5018 Note</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  As a sole proprietor in construction, you may need to file a T5018
                  (Statement of Contract Payments) if you paid subcontractors $500 or
                  more this year. Verify with your accountant.
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-white/50 bg-white/92">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
                  href={link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
              {isCalendarUnlocked ? (
                <button
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800"
                  onClick={() => downloadIcs(allDeadlines)}
                  type="button"
                >
                  {t("dashboard.exportIcs")}
                </button>
              ) : (
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/${locale}/pricing`}>{t("dashboard.exportIcs")}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
