import {
  CRA_PAYROLL_PENALTY_SCHEDULE,
  CRA_PAYROLL_REMITTER_TYPES,
  CRA_PORTAL_URL,
  GST_HST_FILING_DEADLINES,
  PROVINCIAL_MINIMUM_WAGES,
  PROVINCIAL_SALES_TAX_RATES,
  QST_QUICK_METHOD,
  REVENU_QUEBEC_PORTAL_URL,
  T5018_RULE,
  WCB_PREMIUM_RATES,
  WSIB_ONTARIO_2026_RATES,
  type ComplianceIndustry,
  type FilingFrequency,
  type Province,
  type RemitterType,
} from "@/lib/compliance-rules";

export type ContractorProfile = {
  province: Province;
  workType: "sole-prop" | "incorporated" | "gig";
  industry: ComplianceIndustry;
  hasEmployees: boolean;
  employeeCount: number;
  annualRevenue: number;
  gstHstRegistered: boolean;
  filingFrequency: FilingFrequency;
  remitterType: RemitterType;
  fiscalYearStart: Date;
};

export type ComplianceDeadline = {
  id: string;
  category: "payroll" | "sales-tax" | "wcb" | "regulatory" | "min-wage";
  label: string;
  dueDate: Date;
  urgency: "overdue" | "urgent" | "upcoming" | "future";
  penaltyIfMissed?: string;
  actionUrl?: string;
  notes?: string;
  disclaimer?: string;
};

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getUrgency(dueDate: Date): ComplianceDeadline["urgency"] {
  const today = startOfDay(new Date());
  const target = startOfDay(dueDate);
  const diff = Math.floor((target.getTime() - today.getTime()) / 86400000);

  if (diff < 0) {
    return "overdue";
  }
  if (diff <= 7) {
    return "urgent";
  }
  if (diff <= 30) {
    return "upcoming";
  }
  return "future";
}

function buildDeadline(
  id: string,
  category: ComplianceDeadline["category"],
  label: string,
  dueDate: Date,
  penaltyIfMissed?: string,
  actionUrl?: string,
  notes?: string,
  disclaimer?: string,
): ComplianceDeadline {
  return {
    id,
    category,
    label,
    dueDate,
    urgency: getUrgency(dueDate),
    penaltyIfMissed,
    actionUrl,
    notes,
    disclaimer,
  };
}

function getQuarterSequence(start: Date, months: number) {
  const dates: Date[] = [];
  for (let offset = 0; offset < months; offset += 3) {
    dates.push(addMonths(start, offset));
  }
  return dates;
}

export function generatePayrollCalendar(
  remitterType: RemitterType,
  fiscalYearStart: Date,
  months = 12,
): ComplianceDeadline[] {
  const penaltyNote =
    "Estimate only — not tax advice. CRA late remittance penalties can apply.";
  const deadlines: ComplianceDeadline[] = [];

  if (remitterType === "regular") {
    for (let month = 0; month < months; month += 1) {
      const periodDate = addMonths(fiscalYearStart, month);
      const dueDate = new Date(
        periodDate.getFullYear(),
        periodDate.getMonth() + 1,
        15,
      );
      deadlines.push(
        buildDeadline(
          `payroll-regular-${month}`,
          "payroll",
          `Payroll remittance for ${periodDate.toLocaleString("en-CA", {
            month: "long",
            year: "numeric",
          })}`,
          dueDate,
          penaltyNote,
          CRA_PORTAL_URL,
          CRA_PAYROLL_REMITTER_TYPES.regular.dueRule,
          "Estimate only — not tax advice.",
        ),
      );
    }
    return deadlines;
  }

  if (remitterType === "quarterly") {
    getQuarterSequence(fiscalYearStart, months).forEach((periodDate, index) => {
      const quarterEnd = addMonths(periodDate, 2);
      const dueDate = new Date(
        quarterEnd.getFullYear(),
        quarterEnd.getMonth() + 1,
        15,
      );
      deadlines.push(
        buildDeadline(
          `payroll-quarterly-${index}`,
          "payroll",
          `Quarterly payroll remittance ending ${quarterEnd.toLocaleString("en-CA", {
            month: "short",
            year: "numeric",
          })}`,
          dueDate,
          penaltyNote,
          CRA_PORTAL_URL,
          CRA_PAYROLL_REMITTER_TYPES.quarterly.dueRule,
          "Estimate only — not tax advice.",
        ),
      );
    });
    return deadlines;
  }

  if (remitterType === "accelerated-t1") {
    for (let month = 0; month < months; month += 1) {
      const periodDate = addMonths(fiscalYearStart, month);
      deadlines.push(
        buildDeadline(
          `payroll-at1-25-${month}`,
          "payroll",
          `Accelerated payroll remittance (first half of ${periodDate.toLocaleString(
            "en-CA",
            { month: "long", year: "numeric" },
          )})`,
          new Date(periodDate.getFullYear(), periodDate.getMonth(), 25),
          penaltyNote,
          CRA_PORTAL_URL,
          CRA_PAYROLL_REMITTER_TYPES["accelerated-t1"].dueRule,
          "Estimate only — not tax advice.",
        ),
      );
      deadlines.push(
        buildDeadline(
          `payroll-at1-10-${month}`,
          "payroll",
          `Accelerated payroll remittance (second half of ${periodDate.toLocaleString(
            "en-CA",
            { month: "long", year: "numeric" },
          )})`,
          new Date(periodDate.getFullYear(), periodDate.getMonth() + 1, 10),
          penaltyNote,
          CRA_PORTAL_URL,
          CRA_PAYROLL_REMITTER_TYPES["accelerated-t1"].dueRule,
          "Estimate only — not tax advice.",
        ),
      );
    }
    return deadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  for (let week = 0; week < Math.max(1, Math.ceil((months * 30) / 7)); week += 1) {
    const dueDate = addDays(fiscalYearStart, week * 7);
    deadlines.push(
      buildDeadline(
        `payroll-at2-${week}`,
        "payroll",
        `Weekly accelerated payroll remittance #${week + 1}`,
        dueDate,
        penaltyNote,
        CRA_PORTAL_URL,
        CRA_PAYROLL_REMITTER_TYPES["accelerated-t2"].notes,
        "Estimate only — not tax advice.",
      ),
    );
  }

  return deadlines;
}

export function calculatePayrollPenalty(
  overdueAmount: number,
  daysLate: number,
  isRepeatOffence: boolean,
) {
  const selectedBracket = isRepeatOffence
    ? CRA_PAYROLL_PENALTY_SCHEDULE.find((bracket) => bracket.id === "tier-repeat")
    : CRA_PAYROLL_PENALTY_SCHEDULE.find(
        (bracket) =>
          bracket.id !== "tier-repeat" &&
          daysLate >= bracket.daysMin &&
          daysLate <= bracket.daysMax,
      );

  const penaltyRate = selectedBracket?.rate ?? 0;

  return {
    penaltyRate,
    penaltyAmount: overdueAmount * penaltyRate,
    description:
      selectedBracket?.description ?? "No CRA late-remittance penalty bracket matched.",
    disclaimer:
      "CRA penalty estimate only. Actual penalty assessed by CRA may differ. Source: CRA T4001. This is not tax advice.",
  };
}

export function generateSalesTaxCalendar(
  province: Province,
  filingFrequency: FilingFrequency,
  fiscalYearStart: Date,
): ComplianceDeadline[] {
  const deadlines: ComplianceDeadline[] = [];
  const actionUrl = province === "QC" ? REVENU_QUEBEC_PORTAL_URL : CRA_PORTAL_URL;
  const taxRate = PROVINCIAL_SALES_TAX_RATES[province];
  const commonNote =
    province === "QC"
      ? "Quebec registrants remit GST and QST through Revenu Quebec. QST is separate from GST."
      : taxRate.pst
        ? "Provincial PST/RST filing deadlines vary and should be verified separately."
        : "Estimate only — not tax advice.";

  if (filingFrequency === "annual") {
    const fiscalYearEnd = addMonths(fiscalYearStart, 12);
    const dueDate = addMonths(fiscalYearEnd, 3);
    deadlines.push(
      buildDeadline(
        `sales-tax-annual-${province}`,
        "sales-tax",
        province === "QC" ? "GST/QST annual filing and remittance" : "GST/HST annual filing and remittance",
        dueDate,
        "Estimate only — not tax advice. Late filing can trigger interest and penalties.",
        actionUrl,
        GST_HST_FILING_DEADLINES.annual.dueRule,
        commonNote,
      ),
    );
    return deadlines;
  }

  const periodMonths = filingFrequency === "quarterly" ? 3 : 1;
  const totalPeriods = filingFrequency === "quarterly" ? 4 : 12;

  for (let period = 0; period < totalPeriods; period += 1) {
    const periodStart = addMonths(fiscalYearStart, period * periodMonths);
    const periodEnd =
      filingFrequency === "monthly"
        ? endOfMonth(periodStart)
        : addDays(addMonths(periodStart, periodMonths), -1);
    const dueDate = addMonths(
      new Date(periodEnd.getFullYear(), periodEnd.getMonth(), periodEnd.getDate()),
      1,
    );

    deadlines.push(
      buildDeadline(
        `sales-tax-${filingFrequency}-${province}-${period}`,
        "sales-tax",
        province === "QC"
          ? `GST/QST ${filingFrequency} filing period #${period + 1}`
          : `GST/HST ${filingFrequency} filing period #${period + 1}`,
        dueDate,
        "Estimate only — not tax advice. Late filing can trigger interest and penalties.",
        actionUrl,
        commonNote,
        commonNote,
      ),
    );
  }

  return deadlines;
}

export function calculateQSTQuickMethod(annualSales: number, province: Province) {
  const eligible = province === "QC" && annualSales <= QST_QUICK_METHOD.annualTaxableSalesThreshold;

  return {
    eligible,
    estimatedRemittance: eligible
      ? annualSales * (1 + PROVINCIAL_SALES_TAX_RATES.ON.hst!) * QST_QUICK_METHOD.serviceRateOnHstIncludedSalesOntario
      : 0,
    disclaimer: "This is an estimate only. Verify with your accountant or Revenu Quebec.",
  };
}

export function generateWCBCalendar(
  province: Province,
  industry: string,
  annualPayroll: number,
) {
  if (province === "ON") {
    const ontarioKey =
      industry === "construction"
        ? "construction-specialty-trades"
        : industry === "it-professional"
          ? "it-professional-services"
          : industry === "other"
            ? "ontario-average"
            : null;

    const ontarioRate = ontarioKey ? WSIB_ONTARIO_2026_RATES[ontarioKey] : null;

    if (!ontarioRate || !ontarioRate.verified) {
      return {
        premiumEstimate: null,
        dueDate: `January 31, ${new Date().getFullYear() + 1}`,
        disclaimer:
          "Rate for this industry not yet confirmed. Visit wsib.ca to find your rate class.",
        verified: false,
      };
    }

    return {
      premiumEstimate: (annualPayroll / 100) * ontarioRate.ratePerHundred,
      dueDate: `January 31, ${new Date().getFullYear() + 1}`,
      disclaimer: ontarioRate.disclaimer,
      verified: true,
    };
  }

  const industryRate = WCB_PREMIUM_RATES[province][industry as ComplianceIndustry];
  const rate = industryRate?.rate ?? 0;
  const sourceYear = industryRate?.sourceYear ?? 2025;

  return {
    premiumEstimate: annualPayroll * rate,
    dueDate: `January 31, ${new Date().getFullYear() + 1}`,
    disclaimer: `Estimate based on published rates. Actual assessment may differ. Verify with your provincial WCB. Estimate based on ${sourceYear} published rates. Actual WCB assessment may differ based on your claims history.`,
    verified: Boolean(industryRate),
  };
}

export function generateComplianceCalendar(profile: ContractorProfile) {
  const deadlines: ComplianceDeadline[] = [];

  if (profile.hasEmployees) {
    deadlines.push(
      ...generatePayrollCalendar(profile.remitterType, profile.fiscalYearStart),
    );

    const wcb = generateWCBCalendar(
      profile.province,
      profile.industry,
      profile.annualRevenue,
    );
    deadlines.push(
      buildDeadline(
        `wcb-${profile.province}-${profile.industry}`,
        "wcb",
        `${profile.province} WCB / workers' compensation reporting reminder`,
        new Date(new Date().getFullYear() + 1, 0, 31),
        "Estimate only — not legal or tax advice.",
        undefined,
        wcb.premiumEstimate !== null
          ? `Estimated premium: ${wcb.premiumEstimate.toFixed(2)} CAD using available published class rates.`
          : "Rate for this industry not yet confirmed. Visit wsib.ca to find your rate class.",
        wcb.disclaimer,
      ),
    );
  }

  if (profile.gstHstRegistered) {
    deadlines.push(
      ...generateSalesTaxCalendar(
        profile.province,
        profile.filingFrequency,
        profile.fiscalYearStart,
      ),
    );
  }

  const minWage = PROVINCIAL_MINIMUM_WAGES[profile.province];
  if (minWage.rate !== null && minWage.nextReviewDate) {
    deadlines.push(
      buildDeadline(
        `min-wage-${profile.province}`,
        "min-wage",
        `${profile.province} minimum wage review checkpoint`,
        new Date(minWage.nextReviewDate),
        "Estimate only — not legal advice.",
        undefined,
        `${profile.province} minimum wage is currently ${minWage.rate.toFixed(2)} CAD/hour effective ${minWage.effectiveDate}.`,
        "Estimate only — verify current provincial employment standards before payroll changes.",
      ),
    );
  }

  deadlines.push(
    buildDeadline(
      `business-license-${profile.province}`,
      "regulatory",
      `${profile.province} business licence renewal review`,
      addMonths(profile.fiscalYearStart, 12),
      "Estimate only — not legal advice.",
      undefined,
      "Municipal and provincial business licence renewal deadlines vary. Verify your local issuing authority.",
      "Estimate only — verify exact renewal deadlines with your municipality or licensing body.",
    ),
  );

  if (profile.industry === "construction") {
    deadlines.push(
      buildDeadline(
        "t5018",
        "regulatory",
        T5018_RULE.label,
        addMonths(profile.fiscalYearStart, 18),
        "Estimate only — not tax advice.",
        CRA_PORTAL_URL,
        profile.workType === "sole-prop"
          ? `${T5018_RULE.appliesTo} As a sole proprietor in construction, you may need to file a T5018 (Statement of Contract Payments) if you paid subcontractors $500 or more this year. Verify with your accountant.`
          : T5018_RULE.appliesTo,
        "Estimate only — verify filing obligation with your accountant.",
      ),
    );
  }

  return deadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
