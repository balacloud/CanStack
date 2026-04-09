type TaxBracket = {
  upTo: number;
  rate: number;
};

export const provinces = [
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

// BPA 2025 — non-refundable federal credit (CRA)
const BPA_2025_FULL = 16129; // full amount for income ≤ $173,205
const BPA_2025_MIN = 14538; // minimum at income ≥ $253,414
const BPA_2025_FULL_THRESHOLD = 173205;
const BPA_2025_MIN_THRESHOLD = 253414;
const FEDERAL_LOWEST_RATE_2025 = 0.15; // CRA BPA credit rate

// RRSP 2025 — 18% of prior-year earned income, capped at CRA annual limit
const RRSP_CONTRIBUTION_RATE = 0.18;
const RRSP_2025_CAP = 32490;

function calculateBpaCredit(income: number): number {
  let bpa: number;
  if (income <= BPA_2025_FULL_THRESHOLD) {
    bpa = BPA_2025_FULL;
  } else if (income >= BPA_2025_MIN_THRESHOLD) {
    bpa = BPA_2025_MIN;
  } else {
    const phaseoutRange = BPA_2025_MIN_THRESHOLD - BPA_2025_FULL_THRESHOLD;
    const incomeOver = income - BPA_2025_FULL_THRESHOLD;
    const reduction =
      ((BPA_2025_FULL - BPA_2025_MIN) * incomeOver) / phaseoutRange;
    bpa = BPA_2025_FULL - reduction;
  }
  return bpa * FEDERAL_LOWEST_RATE_2025;
}

const federalBrackets2025: TaxBracket[] = [
  { upTo: 57375, rate: 0.145 },
  { upTo: 114750, rate: 0.205 },
  { upTo: 177882, rate: 0.26 },
  { upTo: 253414, rate: 0.29 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.33 },
];

const provincialBrackets2025: Record<string, TaxBracket[]> = {
  AB: [
    { upTo: 151234, rate: 0.1 },
    { upTo: 181481, rate: 0.12 },
    { upTo: 241974, rate: 0.13 },
    { upTo: 362961, rate: 0.14 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.15 },
  ],
  BC: [
    { upTo: 49279, rate: 0.0506 },
    { upTo: 98560, rate: 0.077 },
    { upTo: 113158, rate: 0.105 },
    { upTo: 137407, rate: 0.1229 },
    { upTo: 186306, rate: 0.147 },
    { upTo: 259829, rate: 0.168 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.205 },
  ],
  MB: [
    { upTo: 47000, rate: 0.108 },
    { upTo: 100000, rate: 0.1275 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.174 },
  ],
  NB: [
    { upTo: 51306, rate: 0.094 },
    { upTo: 102614, rate: 0.14 },
    { upTo: 190060, rate: 0.16 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.195 },
  ],
  NL: [
    { upTo: 44292, rate: 0.087 },
    { upTo: 88584, rate: 0.145 },
    { upTo: 157792, rate: 0.158 },
    { upTo: 220910, rate: 0.178 },
    { upTo: 282214, rate: 0.198 },
    { upTo: 564429, rate: 0.208 },
    { upTo: 1128858, rate: 0.213 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.218 },
  ],
  NS: [
    { upTo: 30507, rate: 0.0879 },
    { upTo: 61015, rate: 0.1495 },
    { upTo: 95883, rate: 0.1667 },
    { upTo: 154650, rate: 0.175 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.21 },
  ],
  NT: [
    { upTo: 51964, rate: 0.059 },
    { upTo: 103930, rate: 0.086 },
    { upTo: 168967, rate: 0.122 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.1405 },
  ],
  NU: [
    { upTo: 54707, rate: 0.04 },
    { upTo: 109413, rate: 0.07 },
    { upTo: 177881, rate: 0.09 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.115 },
  ],
  ON: [
    { upTo: 52886, rate: 0.0505 },
    { upTo: 105775, rate: 0.0915 },
    { upTo: 150000, rate: 0.1116 },
    { upTo: 220000, rate: 0.1216 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.1316 },
  ],
  PE: [
    { upTo: 32656, rate: 0.0965 },
    { upTo: 64313, rate: 0.1363 },
    { upTo: 105000, rate: 0.1665 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.18 },
  ],
  QC: [
    { upTo: 53255, rate: 0.14 },
    { upTo: 106495, rate: 0.19 },
    { upTo: 129590, rate: 0.24 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.2575 },
  ],
  SK: [
    { upTo: 53463, rate: 0.105 },
    { upTo: 152750, rate: 0.125 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.145 },
  ],
  YT: [
    { upTo: 57375, rate: 0.064 },
    { upTo: 114750, rate: 0.09 },
    { upTo: 177882, rate: 0.109 },
    { upTo: 500000, rate: 0.128 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.15 },
  ],
};

export function incomeRangeToMidpoint(range: string) {
  switch (range) {
    case "0-50000":
      return 40000;
    case "50001-90000":
      return 70000;
    case "90001-140000":
      return 115000;
    case "140001-220000":
      return 180000;
    case "220001+":
      return 260000;
    default:
      return 70000;
  }
}

export function calculateProgressiveTax(income: number, brackets: TaxBracket[]) {
  let previous = 0;
  let total = 0;

  for (const bracket of brackets) {
    const taxable = Math.min(income, bracket.upTo) - previous;
    if (taxable > 0) {
      total += taxable * bracket.rate;
      previous = bracket.upTo;
    }
    if (income <= bracket.upTo) {
      break;
    }
  }

  return Math.max(0, total);
}

export function calculateCombinedTaxEstimate(income: number, province: string) {
  const federalTaxBeforeCredits = calculateProgressiveTax(income, federalBrackets2025);
  const bpaCredit = calculateBpaCredit(income);
  const federalTax = Math.max(0, federalTaxBeforeCredits - bpaCredit);
  const provincialTax = calculateProgressiveTax(
    income,
    provincialBrackets2025[province] ?? provincialBrackets2025.ON,
  );
  const totalTax = federalTax + provincialTax;

  return {
    federalTax,
    provincialTax,
    totalTax,
    netIncome: Math.max(0, income - totalTax),
  };
}

export function calculateRrspRoom(previousYearIncome: number) {
  return Math.min(
    Math.max(0, previousYearIncome * RRSP_CONTRIBUTION_RATE),
    RRSP_2025_CAP,
  );
}
