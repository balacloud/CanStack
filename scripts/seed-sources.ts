/**
 * Seed data_sources table with all authoritative government URLs we monitor.
 *
 * Run with: npx tsx scripts/seed-sources.ts
 *
 * Requires environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Safe to re-run: uses upsert on slug (no duplicates).
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local"
  );
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface SourceRow {
  slug: string;
  jurisdiction: string;
  category: string;
  source_url: string;
  document_ref?: string;
  effective_date?: string;
  update_cycle: string;
  next_expected?: string;
  ts_file: string;
  ts_constant: string;
  notes?: string;
}

const SOURCES: SourceRow[] = [
  // ── Federal income tax ────────────────────────────────────────────────────
  {
    slug: "federal-income-tax-rates",
    jurisdiction: "federal",
    category: "income-tax-brackets",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html",
    document_ref: "CRA Individual Tax Rates",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "federalBrackets2025",
  },
  {
    slug: "federal-bpa",
    jurisdiction: "federal",
    category: "tax-credits",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-30000-basic-personal-amount.html",
    document_ref: "CRA Line 30000 Basic Personal Amount",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "BASIC_PERSONAL_AMOUNT",
    notes: "P0 bug: BPA not currently applied in tax estimator",
  },
  {
    slug: "federal-t4127",
    jurisdiction: "federal",
    category: "payroll",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4127.html",
    document_ref: "T4127 Payroll Deductions Formulas",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "federalBrackets2025",
  },
  {
    slug: "federal-t4001",
    jurisdiction: "federal",
    category: "payroll-penalties",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4001/employers-guide-payroll-deductions-remittances.html",
    document_ref: "T4001 Payroll Deductions and Remittances",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "PAYROLL_PENALTY_SCHEDULE",
    notes: "P1: 20% penalty description needs correction (gross negligence condition)",
  },
  {
    slug: "federal-rrsp-limits",
    jurisdiction: "federal",
    category: "rrsp",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html",
    document_ref: "CRA RRSP/TFSA/YMPE Limits",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "RRSP_CONTRIBUTION_LIMIT",
    notes: "P1: RRSP room uncapped — need min(income * 0.18, annual cap). 2025 cap: $32,490. 2026 cap: $33,810",
  },
  {
    slug: "federal-gst-hst-calculator",
    jurisdiction: "federal",
    category: "sales-tax",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html",
    document_ref: "CRA GST/HST Rate Calculator",
    update_cycle: "varies",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "PROVINCIAL_SALES_TAX_RATES",
    notes: "P0: NS HST is 14% since April 1 2025 — confirmed on this page",
  },
  {
    slug: "federal-rc4022",
    jurisdiction: "federal",
    category: "sales-tax",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html",
    document_ref: "RC4022 GST/HST General Information",
    update_cycle: "varies",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "PROVINCIAL_SALES_TAX_RATES",
  },
  {
    slug: "federal-t4032",
    jurisdiction: "federal",
    category: "payroll",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables.html",
    document_ref: "T4032 Payroll Deductions Tables",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "federalBrackets2025",
  },
  {
    slug: "federal-pdoc",
    jurisdiction: "federal",
    category: "payroll",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/e-services/e-services-businesses/payroll-deductions-online-calculator.html",
    document_ref: "CRA PDOC Payroll Deductions Calculator",
    update_cycle: "annual-january",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "federalBrackets2025",
    notes: "Use for test vector generation: run 3+ income scenarios per province",
  },
  {
    slug: "federal-cra-rates-index",
    jurisdiction: "federal",
    category: "general",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/rates.html",
    document_ref: "CRA Rates Master Index",
    update_cycle: "ongoing",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "federalBrackets2025",
  },

  // ── Provincial income tax ─────────────────────────────────────────────────
  {
    slug: "ab-income-tax",
    jurisdiction: "AB",
    category: "income-tax-brackets",
    source_url: "https://www.alberta.ca/personal-income-tax",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "bc-income-tax",
    jurisdiction: "BC",
    category: "income-tax-brackets",
    source_url: "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal/tax-rates",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "mb-income-tax",
    jurisdiction: "MB",
    category: "income-tax-brackets",
    source_url: "https://www.gov.mb.ca/finance/taxation/taxes/personal.html",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "nb-income-tax",
    jurisdiction: "NB",
    category: "income-tax-brackets",
    source_url:
      "https://www2.gnb.ca/content/gnb/en/departments/finance/taxes/personal.html",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "nl-income-tax",
    jurisdiction: "NL",
    category: "income-tax-brackets",
    source_url:
      "https://www.gov.nl.ca/fin/tax-programs-and-administration/personal-income-tax/",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "ns-income-tax",
    jurisdiction: "NS",
    category: "income-tax-brackets",
    source_url: "https://novascotia.ca/finance/en/home/taxation/tax101/personalincometax/",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "on-income-tax",
    jurisdiction: "ON",
    category: "income-tax-brackets",
    source_url: "https://www.ontario.ca/page/personal-income-tax",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "pe-income-tax",
    jurisdiction: "PE",
    category: "income-tax-brackets",
    source_url:
      "https://www.princeedwardisland.ca/en/information/finance-and-affordability/provincial-personal-income-tax",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "qc-income-tax",
    jurisdiction: "QC",
    category: "income-tax-brackets",
    source_url: "https://www.revenuquebec.ca/en/citizens/income-tax-return/completing-your-income-tax-return/",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },
  {
    slug: "sk-income-tax",
    jurisdiction: "SK",
    category: "income-tax-brackets",
    source_url:
      "https://www.saskatchewan.ca/residents/taxes-and-investments/personal-income-tax/tax-brackets",
    update_cycle: "annual-january",
    next_expected: "2027-01-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
  },

  // ── Provincial sales tax / HST ────────────────────────────────────────────
  {
    slug: "ns-hst",
    jurisdiction: "NS",
    category: "sales-tax",
    source_url:
      "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html",
    document_ref: "CRA GST/HST Calculator — NS rate",
    effective_date: "2025-04-01",
    update_cycle: "varies",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "PROVINCIAL_SALES_TAX_RATES",
    notes: "P0 BUG: code has 0.15 but correct value is 0.14 since April 1 2025",
  },

  // ── Provincial WCB ────────────────────────────────────────────────────────
  {
    slug: "ab-wcb",
    jurisdiction: "AB",
    category: "wcb",
    source_url: "https://www.wcb.ab.ca/rates-and-payments/rate-manual",
    document_ref: "WCB Alberta Rate Manual 2026",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "WCB_RATES",
    notes: "P1: 2025 rates in code, need 2026 update",
  },
  {
    slug: "bc-wcb",
    jurisdiction: "BC",
    category: "wcb",
    source_url: "https://www.worksafebc.com/en/insurance/industry-premium-rates",
    document_ref: "WorkSafeBC 2026 Premium Rates",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "WCB_RATES",
    notes: "P1: 2026 rates unverified",
  },
  {
    slug: "sk-wcb",
    jurisdiction: "SK",
    category: "wcb",
    source_url: "https://www.wcbsask.com/industry-classification-and-rates",
    document_ref: "WCB Saskatchewan 2026 Premium Rates",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "WCB_RATES",
  },
  {
    slug: "on-wsib",
    jurisdiction: "ON",
    category: "wcb",
    source_url: "https://www.wsib.ca/en/businesses/premium-rates-and-payments",
    document_ref: "WSIB 2026 Premium Rates",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "WCB_RATES",
  },
  {
    slug: "ns-wcb",
    jurisdiction: "NS",
    category: "wcb",
    source_url: "https://www.wcb.ns.ca/employers/rates-and-claims-costs",
    document_ref: "WCB Nova Scotia 2026 Rate Book",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "WCB_RATES",
  },
  {
    slug: "nb-wcb",
    jurisdiction: "NB",
    category: "wcb",
    source_url:
      "https://www.worksafenb.ca/employers/insurance/understanding-your-rate/",
    document_ref: "WorkSafeNB 2026 Premium Rates",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "WCB_RATES",
  },

  // ── Minimum wage ─────────────────────────────────────────────────────────
  {
    slug: "federal-minimum-wage",
    jurisdiction: "federal",
    category: "minimum-wage",
    source_url:
      "https://www.canada.ca/en/employment-social-development/programs/employment-standards/federal-minimum-wage.html",
    update_cycle: "annual-april",
    next_expected: "2027-04-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "MINIMUM_WAGES",
  },
  {
    slug: "on-minimum-wage",
    jurisdiction: "ON",
    category: "minimum-wage",
    source_url: "https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage",
    update_cycle: "annual-october",
    next_expected: "2026-10-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "MINIMUM_WAGES",
  },
  {
    slug: "bc-minimum-wage",
    jurisdiction: "BC",
    category: "minimum-wage",
    source_url:
      "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/wages/minimum-wage",
    update_cycle: "annual-june",
    next_expected: "2026-06-01",
    ts_file: "lib/compliance-rules.ts",
    ts_constant: "MINIMUM_WAGES",
  },

  // ── Cross-reference sources ───────────────────────────────────────────────
  {
    slug: "kpmg-tax-tables",
    jurisdiction: "federal",
    category: "cross-reference",
    source_url:
      "https://kpmg.com/ca/en/home/services/tax/tax-facts/canadian-personal-tax-tables.html",
    document_ref: "KPMG Canadian Personal Tax Tables",
    update_cycle: "annual-february",
    next_expected: "2027-02-15",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
    notes: "Cross-reference only — use to validate provincial brackets against KPMG audit PDF",
  },
  {
    slug: "taxtips-rates",
    jurisdiction: "federal",
    category: "cross-reference",
    source_url: "https://www.taxtips.ca/taxrates/canada.htm",
    document_ref: "TaxTips.ca — Canadian Tax Rates",
    update_cycle: "ongoing",
    ts_file: "lib/canadian-tax.ts",
    ts_constant: "provincialBrackets",
    notes: "Cross-reference only — most detailed rate aggregation. Monitor for mid-year changes",
  },
];

async function main() {
  console.log(`Seeding ${SOURCES.length} data sources...`);

  const { data, error } = await db
    .from("data_sources")
    .upsert(SOURCES, { onConflict: "slug" })
    .select("id, slug");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Done. Upserted ${data?.length ?? 0} sources.`);

  for (const row of data ?? []) {
    console.log(`  ✓ ${row.slug}`);
  }
}

main();
