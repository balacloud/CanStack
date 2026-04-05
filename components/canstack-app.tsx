"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Calculator,
  Check,
  Globe2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceDashboard } from "@/components/compliance-dashboard";
import { ComplianceWizard } from "@/components/compliance-wizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { type ContractorProfile } from "@/lib/compliance-engine";
import { createClient } from "@/lib/supabase/client";
import { cn, formatCurrency } from "@/lib/utils";
import {
  calculateCombinedTaxEstimate,
  calculateRrspRoom,
  incomeRangeToMidpoint,
  provinces,
} from "@/lib/canadian-tax";
import {
  familySizes,
  generateRecommendations,
  incomeRanges,
  workTypes,
  type QuizInput,
} from "@/lib/recommendations";
import { pricingPlans, type PlanTier } from "@/lib/pricing";
import { providerLinks } from "@/lib/providers";

type Props = {
  title: string;
  subtitle: string;
};

const initialQuiz: QuizInput = {
  province: "ON",
  incomeRange: incomeRanges[2].value,
  familySize: familySizes[0].value,
  workType: workTypes[0].value,
};

export function CanStackApp({ title, subtitle }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const [quiz, setQuiz] = useState<QuizInput>(initialQuiz);
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState(initialQuiz.province);
  const [activeTab, setActiveTab] = useState<"overview" | "compliance">("overview");
  const [selectedTier, setSelectedTier] = useState<PlanTier>(pricingPlans[1].tier);
  const [isPending, startTransition] = useTransition();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [complianceProfile, setComplianceProfile] =
    useState<ContractorProfile | null>(null);
  const [isComplianceLoaded, setIsComplianceLoaded] = useState(false);

  const normalizedQuiz = useMemo(() => ({ ...quiz, province }), [province, quiz]);
  const recommendations = useMemo(
    () => generateRecommendations(normalizedQuiz),
    [normalizedQuiz],
  );
  const income = incomeRangeToMidpoint(normalizedQuiz.incomeRange);
  const taxEstimate = calculateCombinedTaxEstimate(income, province);
  const rrspRoom = calculateRrspRoom(income);
  const localeSwitch = locale === "en" ? "fr" : "en";
  const activeWorkspaceTitle =
    activeTab === "overview"
      ? t("Home.workspaceBenefitsTitle")
      : t("Home.workspaceComplianceTitle");
  const activeWorkspaceBody =
    activeTab === "overview"
      ? t("Home.workspaceBenefitsBody")
      : t("Home.workspaceComplianceBody");

  useEffect(() => {
    let cancelled = false;

    async function loadComplianceProfile() {
      if (typeof window === "undefined") {
        return;
      }

      try {
        const stored = sessionStorage.getItem("canstack-profile");
        if (stored && !cancelled) {
          const parsed = JSON.parse(stored) as ContractorProfile & {
            fiscalYearStart: string;
          };
          setComplianceProfile({
            ...parsed,
            fiscalYearStart: new Date(parsed.fiscalYearStart),
          });
        }
      } catch {
        // Ignore invalid session data and continue to remote lookup.
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || cancelled) {
          setIsComplianceLoaded(true);
          return;
        }

        const { data } = await supabase
          .from("contractor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !cancelled) {
          setComplianceProfile({
            province: data.province,
            workType: data.work_type,
            industry: data.industry,
            hasEmployees: data.has_employees,
            employeeCount: data.employee_count ?? 0,
            annualRevenue: revenueRangeToAmount(data.annual_revenue_range),
            gstHstRegistered: data.gst_hst_registered,
            filingFrequency: data.filing_frequency,
            remitterType: data.remitter_type,
            fiscalYearStart: data.fiscal_year_start
              ? new Date(data.fiscal_year_start)
              : new Date(new Date().getFullYear(), 0, 1),
          });
        }
      } catch {
        // Session storage remains the fallback when Supabase is unavailable.
      } finally {
        if (!cancelled) {
          setIsComplianceLoaded(true);
        }
      }
    }

    loadComplianceProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCheckout() {
    setCheckoutError(null);

    startTransition(async () => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier, locale }),
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      setCheckoutError(payload.error ?? t("Checkout.error"));
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col gap-8 px-4 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <header className="rounded-[1.75rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,248,239,0.9),rgba(237,252,249,0.88))] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-6 md:rounded-[2rem] md:p-8 xl:p-10 2xl:p-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.35em] text-primary">
                CanStack
              </p>
              <p className="text-sm text-slate-500">
                Platform for self-employed business owners
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href={`/${localeSwitch}`}>{t("Nav.switchLanguage")}</a>
              </Button>
              <Button asChild variant="outline">
                <a href={`/${locale}/pricing`}>{t("Nav.pricing")}</a>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)] lg:items-start xl:grid-cols-[minmax(0,1.25fr)_minmax(460px,0.75fr)] 2xl:grid-cols-[minmax(0,1.32fr)_minmax(520px,0.68fr)] 2xl:gap-10">
            <div className="space-y-6 xl:space-y-7">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-primary">
                  Self-employed Canada
                </p>
                <h1 className="max-w-5xl font-[family-name:var(--font-display)] text-4xl leading-[0.95] text-slate-900 sm:text-5xl md:text-6xl lg:text-[5.25rem] xl:text-[6rem] 2xl:text-[6.75rem]">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg xl:max-w-4xl xl:text-[1.05rem]">
                  {subtitle}
                </p>
              </div>

              <div className="grid max-w-2xl gap-2 text-sm text-slate-600 xl:max-w-3xl xl:grid-cols-3 xl:gap-3">
                <TrustBullet>{t("Home.trustOne")}</TrustBullet>
                <TrustBullet>{t("Home.trustTwo")}</TrustBullet>
                <TrustBullet>{t("Home.trustThree")}</TrustBullet>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-primary">{t("Nav.workspaceLabel")}</p>
                <div className="grid gap-3 sm:grid-cols-2 xl:max-w-4xl">
                  <StageChoiceCard
                    active={activeTab === "overview"}
                    body={t("Home.workspaceBenefitsBody")}
                    icon={ShieldCheck}
                    onClick={() => setActiveTab("overview")}
                    title={t("Home.workspaceBenefitsTitle")}
                  />
                  <StageChoiceCard
                    active={activeTab === "compliance"}
                    body={t("Home.workspaceComplianceBody")}
                    icon={ShieldAlert}
                    onClick={() => setActiveTab("compliance")}
                    title={t("Home.workspaceComplianceTitle")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:pt-1">
                <Button
                  className="min-h-12 w-full sm:w-auto"
                  onClick={() => setActiveTab("compliance")}
                  type="button"
                >
                  {t("Home.primaryCta")}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  className="min-h-12 w-full sm:w-auto"
                  onClick={() => setActiveTab("overview")}
                  type="button"
                  variant="outline"
                >
                  {t("Home.secondaryCta")}
                </Button>
              </div>
            </div>

            <Card className="border-slate-900/10 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white shadow-[0_24px_60px_rgba(2,6,23,0.25)] xl:sticky xl:top-8">
              <CardHeader className="space-y-3">
                <p className="text-sm uppercase tracking-[0.28em] text-amber-300">
                  {t("Home.previewEyebrow")}
                </p>
                <CardTitle className="text-2xl !text-white">
                  {activeWorkspaceTitle}
                </CardTitle>
                <p className="text-sm text-slate-300">
                  {activeWorkspaceBody}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:gap-4">
                <MetricCard
                  label={t("Snapshot.estimatedTax")}
                  value={formatCurrency(taxEstimate.totalTax)}
                />
                <MetricCard
                  label={t("Snapshot.rrspRoom")}
                  value={formatCurrency(rrspRoom)}
                />
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:col-span-2">
                  <p className="text-sm text-slate-300">{t("Home.previewLabel")}</p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">
                        {activeWorkspaceTitle}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                        {activeTab === "overview"
                          ? t("Home.previewModePlanning")
                          : t("Home.previewModeCompliance")}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {activeTab === "overview"
                        ? t("Home.previewPlanningBody")
                        : t("Home.previewComplianceBody")}
                    </p>
                    <div className="mt-4 grid gap-2">
                      {(activeTab === "overview"
                        ? [
                            t("Home.previewPlanningPointOne"),
                            t("Home.previewPlanningPointTwo"),
                            t("Home.previewPlanningPointThree"),
                          ]
                        : [
                            t("Home.previewCompliancePointOne"),
                            t("Home.previewCompliancePointTwo"),
                            t("Home.previewCompliancePointThree"),
                          ]).map((item) => (
                        <PreviewListItem key={item}>{item}</PreviewListItem>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {activeTab === "compliance" ? (
        isComplianceLoaded ? (
          complianceProfile ? (
            <ComplianceDashboard
              onReset={() => {
                sessionStorage.removeItem("canstack-profile");
                setComplianceProfile(null);
              }}
              profile={complianceProfile}
            />
          ) : (
            <ComplianceWizard onComplete={setComplianceProfile} />
          )
        ) : (
          <Card className="border-white/50 bg-white/90">
            <CardContent className="p-6 text-sm text-slate-600">
              Loading Compliance Hub...
            </CardContent>
          </Card>
        )
      ) : (
        <>
          <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] 2xl:grid-cols-[1.12fr_0.88fr]">
            <Card className="border-white/40 bg-white/88">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <ShieldCheck className="size-6 text-primary" />
                  {t("Quiz.title")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t("Quiz.body")}</p>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("Quiz.email")}</Label>
                  <Input
                    id="email"
                    inputMode="email"
                    placeholder="you@company.ca"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{t("Quiz.emailHint")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">{t("Quiz.province")}</Label>
                  <Select
                    id="province"
                    value={province}
                    onChange={(event) => setProvince(event.target.value)}
                  >
                    {provinces.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">{t("Quiz.incomeRange")}</Label>
                  <Select
                    id="income"
                    value={quiz.incomeRange}
                    onChange={(event) =>
                      setQuiz((current) => ({
                        ...current,
                        incomeRange: event.target.value as QuizInput["incomeRange"],
                      }))
                    }
                  >
                    {incomeRanges.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label[locale as "en" | "fr"]}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family">{t("Quiz.familySize")}</Label>
                  <Select
                    id="family"
                    value={quiz.familySize}
                    onChange={(event) =>
                      setQuiz((current) => ({
                        ...current,
                        familySize: event.target.value as QuizInput["familySize"],
                      }))
                    }
                  >
                    {familySizes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label[locale as "en" | "fr"]}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="workType">{t("Quiz.workType")}</Label>
                  <Select
                    id="workType"
                    value={quiz.workType}
                    onChange={(event) =>
                      setQuiz((current) => ({
                        ...current,
                        workType: event.target.value as QuizInput["workType"],
                      }))
                    }
                  >
                    {workTypes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label[locale as "en" | "fr"]}
                      </option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-900/10 bg-slate-950 text-white">
              <CardHeader>
                <CardTitle className="text-2xl !text-white">
                  {t("Snapshot.title")}
                </CardTitle>
                <p className="text-sm text-slate-300">{t("Snapshot.body")}</p>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  label={t("Snapshot.taxableIncome")}
                  value={formatCurrency(income)}
                />
                <MetricCard
                  label={t("Snapshot.estimatedTax")}
                  value={formatCurrency(taxEstimate.totalTax)}
                />
                <MetricCard
                  label={t("Snapshot.netIncome")}
                  value={formatCurrency(taxEstimate.netIncome)}
                />
                <MetricCard
                  label={t("Snapshot.rrspRoom")}
                  value={formatCurrency(rrspRoom)}
                />
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr] 2xl:grid-cols-[1.05fr_1.05fr_0.9fr]">
            <Card className="border-white/40 bg-white/88 xl:col-span-2">
              <CardHeader>
                <CardTitle>{t("Recommendations.title")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("Recommendations.body")}
                </p>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {recommendations.map((item) => (
                  <div
                    key={`${item.category}-${item.providerName}`}
                    className="rounded-3xl border border-slate-900/10 bg-amber-50/60 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-primary">
                          {item.category}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                          {item.providerName}
                        </h3>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          item.priority === "High"
                            ? "bg-teal-100 text-teal-900"
                            : "bg-amber-100 text-amber-900",
                        )}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{item.reason}</p>
                    <a
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      href={item.affiliateLink}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t("Recommendations.cta")}
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/40 bg-white/88">
              <CardHeader>
                <CardTitle>{t("Resources.title")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("Resources.body")}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {providerLinks.map((provider) => (
                  <a
                    key={provider.name}
                    className="block rounded-3xl border border-slate-900/10 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                    href={provider.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                        <p className="text-sm text-slate-600">{provider.description}</p>
                      </div>
                      <Globe2 className="size-4 text-primary" />
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-white/40 bg-white/88">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="size-5 text-primary" />
                  {t("Tax.title")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t("Tax.body")}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <TaxLine label={t("Tax.federal")} value={formatCurrency(taxEstimate.federalTax)} />
                <TaxLine
                  label={t("Tax.provincial")}
                  value={formatCurrency(taxEstimate.provincialTax)}
                />
                <TaxLine
                  label={t("Tax.total")}
                  value={formatCurrency(taxEstimate.totalTax)}
                  strong
                />
                <p className="text-xs text-muted-foreground">{t("Tax.disclaimer")}</p>
              </CardContent>
            </Card>

            <Card className="border-white/40 bg-white/88">
              <CardHeader>
                <CardTitle>{t("Rrsp.title")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("Rrsp.body")}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl bg-emerald-50 p-5">
                  <p className="text-sm text-slate-600">{t("Rrsp.prevIncome")}</p>
                  <p className="mt-2 text-4xl font-semibold text-slate-900">
                    {formatCurrency(income)}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <p className="text-sm text-slate-300">{t("Rrsp.room")}</p>
                  <p className="mt-2 text-4xl font-semibold">
                    {formatCurrency(rrspRoom)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{t("Rrsp.disclaimer")}</p>
              </CardContent>
            </Card>
          </section>

          <section className="rounded-[2rem] border border-teal-950/10 bg-slate-950 p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                  {t("Checkout.eyebrow")}
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-4xl">
                  {t("Checkout.title")}
                </h2>
                <p className="mt-3 max-w-2xl text-slate-300">{t("Checkout.body")}</p>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-4 md:grid-cols-3">
                {pricingPlans.map((plan) => (
                  <button
                    key={plan.tier}
                    className={cn(
                      "rounded-[1.5rem] border p-5 text-left transition",
                      selectedTier === plan.tier
                        ? "border-amber-300 bg-white/10"
                        : "border-white/10 bg-white/5",
                    )}
                    onClick={() => setSelectedTier(plan.tier)}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">{plan.name}</p>
                      {selectedTier === plan.tier ? (
                        <Check className="size-4 text-amber-300" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-3xl font-semibold">{plan.priceCad}</p>
                    <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-300">{t("Checkout.selectedPlan")}</p>
                <p className="mt-2 text-2xl font-semibold">
                  {pricingPlans.find((plan) => plan.tier === selectedTier)?.name}
                </p>
                <p className="mt-4 text-sm text-slate-300">{t("Checkout.includes")}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {pricingPlans
                    .find((plan) => plan.tier === selectedTier)
                    ?.features.map((feature) => <li key={feature}>• {feature}</li>)}
                </ul>
                <Button
                  className="mt-6 w-full"
                  disabled={isPending}
                  onClick={handleCheckout}
                >
                  {isPending ? t("Checkout.loading") : t("Checkout.cta")}
                </Button>
                {checkoutError ? (
                  <p className="mt-3 text-sm text-amber-300">{checkoutError}</p>
                ) : null}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function revenueRangeToAmount(range: string | null) {
  switch (range) {
    case "lt-30":
      return 25000;
    case "30-100":
      return 65000;
    case "100-250":
      return 175000;
    case "250-plus":
      return 300000;
    default:
      return 65000;
  }
}

function TrustBullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 size-2 rounded-full bg-primary" />
      <span>{children}</span>
    </div>
  );
}

function StageChoiceCard({
  active,
  body,
  icon: Icon,
  onClick,
  title,
}: {
  active: boolean;
  body: string;
  icon: typeof ShieldCheck;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={cn(
        "min-h-12 rounded-[1.5rem] border px-4 py-4 text-left transition sm:px-5",
        active
          ? "border-primary bg-teal-50 text-teal-950 shadow-[0_12px_30px_rgba(13,148,136,0.12)]"
          : "border-slate-900/10 bg-white/80 text-slate-800",
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 rounded-full p-2",
            active ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600",
          )}
        >
          <Icon className="size-4" />
        </span>
        <span className="block">
          <span className="block text-base font-semibold">{title}</span>
          <span className="mt-1 block text-sm text-slate-600">{body}</span>
        </span>
      </div>
    </button>
  );
}

function PreviewListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
      <span className="mt-1 size-2 rounded-full bg-amber-300" />
      <span>{children}</span>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-3 text-2xl font-semibold sm:text-3xl">{value}</p>
    </div>
  );
}

function TaxLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-900/10 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={cn("text-lg text-slate-900", strong && "font-semibold")}>
        {value}
      </span>
    </div>
  );
}
