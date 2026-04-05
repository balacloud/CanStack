export type IncomeRangeValue =
  | "0-50000"
  | "50001-90000"
  | "90001-140000"
  | "140001-220000"
  | "220001+";

export type FamilySizeValue = "solo" | "couple" | "family";
export type WorkTypeValue =
  | "sole-prop"
  | "incorporated"
  | "freelance-tech"
  | "trades";

export type QuizInput = {
  province: string;
  incomeRange: IncomeRangeValue;
  familySize: FamilySizeValue;
  workType: WorkTypeValue;
};

export const incomeRanges = [
  { value: "0-50000", label: { en: "Up to $50k", fr: "Jusqu'a 50 k$" } },
  { value: "50001-90000", label: { en: "$50k to $90k", fr: "50 k$ a 90 k$" } },
  { value: "90001-140000", label: { en: "$90k to $140k", fr: "90 k$ a 140 k$" } },
  { value: "140001-220000", label: { en: "$140k to $220k", fr: "140 k$ a 220 k$" } },
  { value: "220001+", label: { en: "$220k+", fr: "220 k$ et plus" } },
] as const;

export const familySizes = [
  { value: "solo", label: { en: "Just me", fr: "Moi seulement" } },
  { value: "couple", label: { en: "Couple", fr: "Couple" } },
  { value: "family", label: { en: "Family", fr: "Famille" } },
] as const;

export const workTypes = [
  { value: "sole-prop", label: { en: "Sole proprietor", fr: "Travailleur autonome" } },
  {
    value: "incorporated",
    label: { en: "Incorporated contractor", fr: "Entrepreneur incorpore" },
  },
  { value: "freelance-tech", label: { en: "Freelance tech", fr: "Pigiste techno" } },
  { value: "trades", label: { en: "Trades / field work", fr: "Metiers / terrain" } },
] as const;

type Recommendation = {
  category: string;
  providerName: string;
  affiliateLink: string;
  priority: "High" | "Medium";
  reason: string;
};

export function generateRecommendations(input: QuizInput): Recommendation[] {
  const items: Recommendation[] = [];
  const highIncome =
    input.incomeRange === "140001-220000" || input.incomeRange === "220001+";
  const familyCoverage =
    input.familySize === "family" || input.familySize === "couple";

  items.push({
    category: "Health + Dental",
    providerName: "GreenShield",
    affiliateLink: "https://www.greenshield.ca/en-ca",
    priority: familyCoverage ? "High" : "Medium",
    reason: familyCoverage
      ? "Family coverage and prescription spend usually make a flexible health plan the first priority."
      : "A core health and dental plan offsets out-of-pocket costs without depending on an employer plan.",
  });

  items.push({
    category: "Disability / Income Protection",
    providerName: "Edge Benefits",
    affiliateLink: "https://www.edgebenefits.com/",
    priority:
      input.workType === "trades" || input.workType === "sole-prop"
        ? "High"
        : "Medium",
    reason:
      input.workType === "trades"
        ? "Field work increases interruption risk, so disability coverage matters earlier."
        : "Independent income usually needs a replacement layer if illness stops billable work.",
  });

  items.push({
    category: "Business Insurance",
    providerName: "Zensurance",
    affiliateLink: "https://www.zensurance.com/",
    priority:
      input.workType === "incorporated" || highIncome ? "High" : "Medium",
    reason:
      input.workType === "incorporated"
        ? "Incorporated contractors often need liability and E&O coverage before signing larger contracts."
        : "Growing revenue typically comes with more client-driven insurance requirements.",
  });

  if (highIncome) {
    items.push({
      category: "Supplemental Health Spending",
      providerName: "GreenShield",
      affiliateLink: "https://www.greenshield.ca/en-ca",
      priority: "Medium",
      reason:
        "Higher earnings make it easier to pair health coverage with tax-aware reimbursement planning.",
    });
  }

  return items;
}
