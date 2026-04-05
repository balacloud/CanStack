export type Province =
  | "AB"
  | "BC"
  | "MB"
  | "NB"
  | "NL"
  | "NS"
  | "NT"
  | "NU"
  | "ON"
  | "PE"
  | "QC"
  | "SK"
  | "YT";

export type RemitterType =
  | "regular"
  | "quarterly"
  | "accelerated-t1"
  | "accelerated-t2";

export type FilingFrequency = "monthly" | "quarterly" | "annual";
export type ComplianceIndustry =
  | "construction"
  | "it-professional"
  | "retail"
  | "other";

export const PROVINCE_OPTIONS: ReadonlyArray<{ code: Province; name: string }> = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
] as const;

export const CRA_PORTAL_URL =
  "https://www.canada.ca/en/revenue-agency/services/e-services/e-services-businesses/business-account.html" as const;
export const REVENU_QUEBEC_PORTAL_URL =
  "https://www.revenuquebec.ca/en/online-services/" as const;

export const CRA_PAYROLL_REMITTER_TYPES: Readonly<
  Record<
    RemitterType,
    {
      label: string;
      dueRule: string;
      notes: string;
      source: string;
    }
  >
> = {
  regular: {
    label: "Regular remitter",
    dueRule: "15th of the following month",
    notes: "CRA T4001 regular remitters remit source deductions monthly.",
    source: "CRA T4001",
  },
  quarterly: {
    label: "Quarterly remitter",
    dueRule: "15th of April, July, October, and January",
    notes:
      "For eligible new or small employers with average monthly withholding below the CRA threshold.",
    source: "CRA T4001",
  },
  "accelerated-t1": {
    label: "Accelerated remitter threshold 1",
    dueRule: "25th of the current month and 10th of the following month",
    notes: "Twice-monthly accelerated remittance schedule.",
    source: "CRA T4001",
  },
  "accelerated-t2": {
    label: "Accelerated remitter threshold 2",
    dueRule: "Weekly schedule",
    notes:
      "Weekly accelerated remitters follow payroll-period-based due dates under CRA T4001.",
    source: "CRA T4001",
  },
} as const;

export const CRA_PAYROLL_PENALTY_SCHEDULE = [
  {
    id: "tier-1",
    label: "1–3 days late",
    daysMin: 1,
    daysMax: 3,
    rate: 0.03,
    description: "3% of the amount owing",
    source: "CRA T4001",
  },
  {
    id: "tier-2",
    label: "4–5 days late",
    daysMin: 4,
    daysMax: 5,
    rate: 0.05,
    description: "5% of the amount owing",
    source: "CRA T4001",
  },
  {
    id: "tier-3",
    label: "6–7 days late",
    daysMin: 6,
    daysMax: 7,
    rate: 0.07,
    description: "7% of the amount owing",
    source: "CRA T4001",
  },
  {
    id: "tier-4",
    label: "8+ days late or no remittance",
    daysMin: 8,
    daysMax: Infinity,
    rate: 0.10,
    description: "10% of the amount owing",
    source: "CRA T4001",
  },
  {
    id: "tier-repeat",
    label: "Second offence in same year",
    daysMin: 0,
    daysMax: Infinity,
    rate: 0.20,
    description:
      "20% — only applies if CRA issued a penalty earlier in the same calendar year",
    source: "CRA T4001",
  },
] as const;

export const PROVINCIAL_SALES_TAX_RATES: Readonly<
  Record<Province, { gst: number; hst?: number; qst?: number; pst?: number }>
> = {
  AB: { gst: 0.05 },
  BC: { gst: 0.05, pst: 0.07 },
  MB: { gst: 0.05, pst: 0.07 },
  NB: { gst: 0.05, hst: 0.15 },
  NL: { gst: 0.05, hst: 0.15 },
  NS: { gst: 0.05, hst: 0.15 },
  NT: { gst: 0.05 },
  NU: { gst: 0.05 },
  ON: { gst: 0.05, hst: 0.13 },
  PE: { gst: 0.05, hst: 0.15 },
  QC: { gst: 0.05, qst: 0.09975 },
  SK: { gst: 0.05, pst: 0.06 },
  YT: { gst: 0.05 },
} as const;

export const GST_HST_FILING_DEADLINES: Readonly<
  Record<FilingFrequency, { label: string; dueRule: string; source: string }>
> = {
  annual: {
    label: "Annual filer",
    dueRule: "3 months after fiscal year end",
    source: "CRA RC4022",
  },
  quarterly: {
    label: "Quarterly filer",
    dueRule: "1 month after quarter end",
    source: "CRA RC4022",
  },
  monthly: {
    label: "Monthly filer",
    dueRule: "1 month after month end",
    source: "CRA RC4022",
  },
} as const;

export const QST_QUICK_METHOD: Readonly<{
  annualTaxableSalesThreshold: number;
  serviceRateOnHstIncludedSalesOntario: number;
  source: string;
}> = {
  annualTaxableSalesThreshold: 400000,
  serviceRateOnHstIncludedSalesOntario: 0.088,
  source: "CRA RC4058 / Revenu Quebec public guidance",
} as const;

export const WCB_PREMIUM_RATES: Readonly<
  Record<
    Province,
    Partial<
      Record<
        ComplianceIndustry,
        { rate: number; sourceYear: 2025 | 2026; source: string; note?: string }
      >
    >
  >
> = {
  AB: {
    construction: {
      rate: 0.0351,
      sourceYear: 2025,
      source: "WCB Alberta industry rates",
      note: "TODO: confirm 2026 Alberta construction rate.",
    },
    "it-professional": {
      rate: 0.0025,
      sourceYear: 2025,
      source: "WCB Alberta industry rates",
      note: "TODO: confirm 2026 Alberta professional services rate.",
    },
  },
  BC: {
    construction: {
      rate: 0.0411,
      sourceYear: 2026,
      source: "WorkSafeBC 2026 classification rate table",
    },
    "it-professional": {
      rate: 0.0017,
      sourceYear: 2026,
      source: "WorkSafeBC 2026 classification rate table",
    },
  },
  MB: {},
  NB: {},
  NL: {},
  NS: {},
  NT: {},
  NU: {},
  ON: {
  },
  PE: {},
  QC: {},
  SK: {},
  YT: {},
} as const;

export const WSIB_ONTARIO_2026_RATES: Record<
  string,
  {
    classCode: string;
    className: string;
    ratePerHundred: number;
    year: number;
    verified: boolean;
    source: string;
    disclaimer: string;
  }
> = {
  "construction-non-residential": {
    classCode: "G6",
    className: "Non-Residential Construction",
    ratePerHundred: 1.61,
    year: 2026,
    verified: true,
    source: "WSIB 2026 Premium Rates — wsib.ca/en/2026premiumrates",
    disclaimer:
      "Rate per $100 of insurable payroll. Actual WSIB assessment depends on your claims history and experience rating.",
  },
  "construction-specialty-trades": {
    classCode: "G5",
    className: "Specialty Trade Contractors",
    ratePerHundred: 2.15,
    year: 2026,
    verified: true,
    source: "WSIB 2026 Premium Rates — wsib.ca/en/2026premiumrates",
    disclaimer:
      "Rate per $100 of insurable payroll. Actual WSIB assessment depends on your claims history and experience rating.",
  },
  "construction-building-equipment": {
    classCode: "G4",
    className: "Building Equipment Operators",
    ratePerHundred: 1.54,
    year: 2026,
    verified: true,
    source: "WSIB 2026 Premium Rates — wsib.ca/en/2026premiumrates",
    disclaimer:
      "Rate per $100 of insurable payroll. Actual WSIB assessment depends on your claims history and experience rating.",
  },
  "it-professional-services": {
    classCode: "TODO",
    className: "IT and Professional Services",
    ratePerHundred: 0,
    year: 2026,
    verified: false,
    source:
      "UNCONFIRMED — requires manual lookup at wsib.ca/en/operational-policy-manual/table-rates",
    disclaimer: "Rate not yet confirmed. Do not display to users until verified.",
  },
  "ontario-average": {
    classCode: "AVG",
    className: "Ontario Average (all industries)",
    ratePerHundred: 1.23,
    year: 2026,
    verified: true,
    source:
      "WSIB news release Sept 25 2025 — wsib.ca/en/news-release/wsib-reduces-average-premium-rate",
    disclaimer:
      "Average rate only. Your actual rate depends on your industry class.",
  },
};

export const PROVINCIAL_MINIMUM_WAGES: Readonly<
  Record<
    Province,
    {
      rate: number | null;
      effectiveDate: string;
      nextReviewDate?: string;
      note?: string;
    }
  >
> = {
  AB: {
    rate: 15,
    effectiveDate: "2018-10-01",
    note: "Frozen. No scheduled increase confirmed as of March 11, 2026.",
  },
  BC: {
    rate: 17.4,
    effectiveDate: "2025-06-01",
    nextReviewDate: "2026-06-01",
  },
  MB: {
    rate: 15.8,
    effectiveDate: "2025-10-01",
    nextReviewDate: "2026-10-01",
  },
  NB: {
    rate: 15.65,
    effectiveDate: "2025-04-01",
    nextReviewDate: "2026-04-01",
  },
  NL: {
    rate: 16,
    effectiveDate: "2025-04-01",
    nextReviewDate: "2026-04-01",
  },
  NS: {
    rate: 15.7,
    effectiveDate: "2025-04-01",
    nextReviewDate: "2026-04-01",
  },
  NT: {
    rate: null,
    effectiveDate: "TODO",
    note: "TODO: confirm 2026 Northwest Territories minimum wage before surfacing.",
  },
  NU: {
    rate: null,
    effectiveDate: "TODO",
    note: "TODO: confirm 2026 Nunavut minimum wage before surfacing.",
  },
  ON: {
    rate: 17.2,
    effectiveDate: "2025-10-01",
    nextReviewDate: "2026-10-01",
    note: "TODO: confirm whether any interim 2026 Ontario update is published.",
  },
  PE: {
    rate: 16,
    effectiveDate: "2025-10-01",
    nextReviewDate: "2026-10-01",
  },
  QC: {
    rate: 16.1,
    effectiveDate: "2025-05-01",
    nextReviewDate: "2026-05-01",
    note: "TODO: confirm 2026 Quebec update once published.",
  },
  SK: {
    rate: 15,
    effectiveDate: "2025-10-01",
    nextReviewDate: "2026-10-01",
  },
  YT: {
    rate: null,
    effectiveDate: "TODO",
    note: "TODO: confirm 2026 Yukon minimum wage before surfacing.",
  },
} as const;

export const T5018_RULE: Readonly<{
  label: string;
  dueRule: string;
  thresholdAmountPaid: number;
  appliesTo: string;
  source: string;
}> = {
  label: "T5018 return",
  dueRule: "6 months after fiscal year end",
  thresholdAmountPaid: 500,
  appliesTo:
    "Construction businesses, including sole proprietors, that paid more than $500 to a subcontractor in the calendar year.",
  source: "CRA T5018 guide",
} as const;
