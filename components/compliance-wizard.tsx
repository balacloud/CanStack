"use client";

import { useReducer, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import {
  PROVINCE_OPTIONS,
  type Province,
} from "@/lib/compliance-rules";
import { type ContractorProfile } from "@/lib/compliance-engine";

type RevenueRange = "lt-30" | "30-100" | "100-250" | "250-plus";

type WizardState = {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  province: Province;
  workType: ContractorProfile["workType"];
  industry: ContractorProfile["industry"];
  hasEmployees: boolean;
  employeeCount: number;
  gstHstRegistered: boolean;
  filingFrequency: ContractorProfile["filingFrequency"];
  revenueRange: RevenueRange;
};

type WizardAction =
  | { type: "next" }
  | { type: "back" }
  | { type: "province"; value: Province }
  | { type: "workType"; value: ContractorProfile["workType"] }
  | { type: "industry"; value: ContractorProfile["industry"] }
  | { type: "hasEmployees"; value: boolean }
  | { type: "employeeCount"; value: number }
  | { type: "gstRegistered"; value: boolean }
  | { type: "filingFrequency"; value: ContractorProfile["filingFrequency"] }
  | { type: "revenueRange"; value: RevenueRange };

const initialState: WizardState = {
  step: 1,
  province: "ON",
  workType: "sole-prop",
  industry: "construction",
  hasEmployees: false,
  employeeCount: 0,
  gstHstRegistered: false,
  filingFrequency: "quarterly",
  revenueRange: "30-100",
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "next":
      return { ...state, step: Math.min(6, state.step + 1) as WizardState["step"] };
    case "back":
      return { ...state, step: Math.max(1, state.step - 1) as WizardState["step"] };
    case "province":
      return { ...state, province: action.value };
    case "workType":
      return { ...state, workType: action.value };
    case "industry":
      return { ...state, industry: action.value };
    case "hasEmployees":
      return {
        ...state,
        hasEmployees: action.value,
        employeeCount: action.value ? Math.max(1, state.employeeCount) : 0,
      };
    case "employeeCount":
      return { ...state, employeeCount: action.value };
    case "gstRegistered":
      return { ...state, gstHstRegistered: action.value };
    case "filingFrequency":
      return { ...state, filingFrequency: action.value };
    case "revenueRange":
      return { ...state, revenueRange: action.value };
    default:
      return state;
  }
}

function revenueRangeToAmount(range: RevenueRange) {
  switch (range) {
    case "lt-30":
      return 25000;
    case "30-100":
      return 65000;
    case "100-250":
      return 175000;
    case "250-plus":
      return 300000;
  }
}

export function ComplianceWizard({
  onComplete,
}: {
  onComplete: (profile: ContractorProfile) => void;
}) {
  const t = useTranslations("compliance");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSaving, setIsSaving] = useState(false);

  async function persistProfile(profile: ContractorProfile) {
    sessionStorage.setItem("canstack-profile", JSON.stringify(profile));

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      await supabase.from("contractor_profiles").upsert({
        user_id: user.id,
        province: profile.province,
        work_type: profile.workType,
        industry: profile.industry,
        has_employees: profile.hasEmployees,
        employee_count: profile.employeeCount,
        annual_revenue_range: state.revenueRange,
        gst_hst_registered: profile.gstHstRegistered,
        filing_frequency: profile.filingFrequency,
        remitter_type: profile.remitterType,
        fiscal_year_start: profile.fiscalYearStart.toISOString().slice(0, 10),
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Local session persistence remains the fallback when Supabase is unavailable.
    }
  }

  async function handleContinue() {
    if (state.step < 6) {
      dispatch({ type: "next" });
      return;
    }

    setIsSaving(true);
    const profile: ContractorProfile = {
      province: state.province,
      workType: state.workType,
      industry: state.industry,
      hasEmployees: state.hasEmployees,
      employeeCount: state.hasEmployees ? state.employeeCount : 0,
      annualRevenue: revenueRangeToAmount(state.revenueRange),
      gstHstRegistered: state.gstHstRegistered,
      filingFrequency: state.filingFrequency,
      remitterType: state.hasEmployees ? "regular" : "quarterly",
      fiscalYearStart: new Date(new Date().getFullYear(), 0, 1),
    };

    await persistProfile(profile);
    onComplete(profile);
    setIsSaving(false);
  }

  return (
    <Card className="mx-auto w-full max-w-lg border-white/50 bg-white/92 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            {t("title")} · {state.step}/6
          </p>
          <Progress value={(state.step / 6) * 100} />
        </div>
        <CardTitle>{t(`wizard.step${state.step}`)}</CardTitle>
        <p className="text-sm text-slate-500">
          We use this profile only to build your deadline calendar and compliance estimates.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {state.step === 1 ? (
          <Select
            value={state.province}
            onChange={(event) =>
              dispatch({ type: "province", value: event.target.value as Province })
            }
          >
            {PROVINCE_OPTIONS.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </Select>
        ) : null}

        {state.step === 2 ? (
            <div className="grid gap-3">
            {([
              ["sole-prop", "Sole Prop"],
              ["incorporated", "Incorporated"],
              ["gig", "Gig Worker"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={`min-h-12 rounded-2xl border px-4 py-3 text-left transition sm:py-4 ${
                  state.workType === value
                    ? "border-primary bg-teal-50 text-teal-900"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => dispatch({ type: "workType", value })}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {state.step === 3 ? (
            <div className="grid gap-3">
            {([
              ["construction", "Construction"],
              ["it-professional", "IT & Professional"],
              ["retail", "Retail"],
              ["other", "Other"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={`min-h-12 rounded-2xl border px-4 py-3 text-left transition sm:py-4 ${
                  state.industry === value
                    ? "border-primary bg-teal-50 text-teal-900"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => dispatch({ type: "industry", value })}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {state.step === 4 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  className={`min-h-12 rounded-2xl border px-4 py-3 transition sm:py-4 ${
                    state.hasEmployees === value
                      ? "border-primary bg-teal-50 text-teal-900"
                      : "border-slate-200 bg-white"
                  }`}
                  onClick={() => dispatch({ type: "hasEmployees", value })}
                  type="button"
                >
                  {value ? "Yes" : "No"}
                </button>
              ))}
            </div>
            {state.hasEmployees ? (
              <div className="space-y-2">
                <input
                  className="w-full accent-primary"
                  max={50}
                  min={1}
                  onChange={(event) =>
                    dispatch({
                      type: "employeeCount",
                      value: Number(event.target.value),
                    })
                  }
                  type="range"
                  value={state.employeeCount || 1}
                />
                <p className="text-sm text-slate-600">
                  Employees: {state.employeeCount || 1}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {state.step === 5 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  className={`min-h-12 rounded-2xl border px-4 py-3 transition sm:py-4 ${
                    state.gstHstRegistered === value
                      ? "border-primary bg-teal-50 text-teal-900"
                      : "border-slate-200 bg-white"
                  }`}
                  onClick={() => dispatch({ type: "gstRegistered", value })}
                  type="button"
                >
                  {value ? "Yes" : "No"}
                </button>
              ))}
            </div>
            {state.gstHstRegistered ? (
              <Select
                value={state.filingFrequency}
                onChange={(event) =>
                  dispatch({
                    type: "filingFrequency",
                    value: event.target.value as ContractorProfile["filingFrequency"],
                  })
                }
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </Select>
            ) : null}
          </div>
        ) : null}

        {state.step === 6 ? (
            <div className="grid gap-3">
            {([
              ["lt-30", "<$30k"],
              ["30-100", "$30k-$100k"],
              ["100-250", "$100k-$250k"],
              ["250-plus", "$250k+"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={`min-h-12 rounded-2xl border px-4 py-3 text-left transition sm:py-4 ${
                  state.revenueRange === value
                    ? "border-primary bg-teal-50 text-teal-900"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => dispatch({ type: "revenueRange", value })}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <Button
            disabled={state.step === 1}
            onClick={() => dispatch({ type: "back" })}
            type="button"
            variant="outline"
          >
            Back
          </Button>
          <Button className="min-h-12" disabled={isSaving} onClick={handleContinue} type="button">
            {state.step === 6 ? (isSaving ? "Saving..." : "View dashboard") : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
