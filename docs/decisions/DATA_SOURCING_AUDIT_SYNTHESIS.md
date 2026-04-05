# Data Sourcing Audit — Synthesis

Last updated: April 4, 2026

## Status

This document synthesizes findings from multi-LLM research on the accuracy of CanStack's hardcoded tax, compliance, and payroll data. Final conclusion pending — waiting on additional LLM audit results.

## Source: Perplexity (LLM 1 of 3)

---

## CRITICAL BUGS FOUND IN CURRENT CODEBASE

### Bug 1 — Nova Scotia HST is WRONG

**File:** `lib/compliance-rules.ts` line ~166
**Current value:** HST 15% (`hst: 0.15`)
**Correct value:** HST 14% (`hst: 0.14`)
**Effective since:** April 1, 2025

**Source:** CRA GST/HST calculator page — direct quote: *"As of April 1, 2025, the HST rate has decreased to 14% in Nova Scotia."*
**CRA URL:** `https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html`

**Severity:** HIGH — any Nova Scotia user gets wrong sales tax calculations right now.
**Perplexity confidence:** VERIFIED with CRA source.
**Cross-check needed:** Confirm with LLM 2 and LLM 3 before patching.

---

### Bug 2 — RRSP Room Has No Annual Dollar Cap

**File:** `lib/canadian-tax.ts` line 171
**Current logic:** `previousYearIncome * 0.18` (unbounded)
**Correct logic:** `min(previousYearIncome * 0.18, ANNUAL_CAP)`

**Caps confirmed:**
- 2025: $32,490 (income ceiling: $180,500)
- 2026: $33,810 (income ceiling: $187,833)

**Source:** CRA RRSP contributions page, confirmed by H&R Block, Questrade.
**Severity:** MEDIUM — overestimates RRSP room for anyone earning over ~$180K.
**Perplexity confidence:** VERIFIED with CRA source.

**Additional finding:** The 18% applies to **earned income** (net self-employment income after expenses), not gross revenue. Our app should clarify this in the UI. For contractors, this is net self-employment income minus business expenses.

---

### Bug 3 — 20% Second-Offence Penalty Overstated

**File:** `lib/compliance-rules.ts` line ~127-136
**Current description:** Implies 20% is automatic for a second late payment in the same year.
**Correct behavior:** 20% only applies if CRA determines the failure was **knowing or under circumstances of gross negligence**. The default for a second ordinary late remittance is still the standard tier penalty.

**Source:** CRA T4001 direct quote: *"If you are assessed this penalty more than once in a calendar year, we will assess a 20% penalty on the second or later failures if they were made knowingly or under circumstances of gross negligence."*
**CRA T4001 URL:** `https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4001/employers-guide-payroll-deductions-remittances.html`

**Severity:** MEDIUM — misleads users about penalty exposure.
**Perplexity confidence:** VERIFIED with CRA source.

---

## DATA GAPS — Missing From Current Codebase

### Gap 1 — CRA Payroll Penalty: $500 Floor Exception

The standard tiered penalties (3%–10%) generally apply only to the portion exceeding $500. Amounts under $500 may not trigger the penalty unless the failure was knowing or grossly negligent.

**Source:** CRA T4001
**Action:** Add this note to the penalty forecaster output.

### Gap 2 — Daily Compound Interest on Overdue Amounts

CRA charges daily compound interest (Bank of Canada rate + 4 percentage points) on both the unpaid remittance and the penalty itself. We don't mention this.

**Source:** CRA T4001, confirmed by francesfs.ca compliance guide.
**Action:** Add disclaimer about interest accrual to penalty forecaster.

### Gap 3 — Gross Negligence Penalty (ITA Section 163)

A separate 50% penalty under the Income Tax Act s.163 can apply in willful evasion cases. This is distinct from remittance penalties.

**Source:** CRA T4001
**Action:** Not required to model this, but should be mentioned as a disclaimer.

### Gap 4 — Basic Personal Amount (BPA) Not Applied

Our tax estimator does not apply the BPA non-refundable credit. For 2025:
- Full BPA: $16,129 (for income ≤ lower threshold)
- Minimum BPA: $14,538 (for income ≥ $253,414)
- Reduces federal tax by ~$2,336–$2,339 for low-income earners

**Impact:** Our estimator overstates federal tax for ALL income levels, especially low-income.
**Severity:** HIGH — affects every tax estimate.
**Action:** Implement BPA credit in `calculateCombinedTaxEstimate`.

### Gap 5 — 2026 Federal Brackets Are Published But Not In Our Code

Our code uses 2025 brackets. 2026 brackets are confirmed published:

| Taxable Income | 2026 Rate |
|---|---|
| $0 – $58,523 | 14% |
| $58,523 – $117,045 | 20.5% |
| $117,045 – $181,440 | 26% |
| $181,440 – $258,482 | 29% |
| Over $258,482 | 33% |

**Source:** CRA announcement, confirmed by Harvest Portfolios.
**Action:** Add 2026 brackets and make tax year selectable or auto-detect.

---

## RATE VERIFICATIONS — Confirmed Correct

| Data Point | Status | Source |
|---|---|---|
| Federal 2025 bracket thresholds ($57,375 / $114,750 / $177,882 / $253,414) | CORRECT | CRA |
| Federal 2025 first bracket rate (14.5% blended) | CORRECT — our code has 0.145 | CRA via H&R Block |
| CRA payroll penalty tiers 1–4 days late (3%, 5%, 7%, 10%) | CORRECT | CRA T4001 |
| GST/HST rates for 12 of 13 provinces/territories | CORRECT | CRA |
| QST 9.975% for Quebec | CORRECT | CRA / Revenu Quebec |
| Quebec QST administered separately by Revenu Quebec | CORRECT — already in our code | CRA |
| T5018 threshold ($500) and construction applicability | CORRECT | CRA T5018 guide |
| GST/HST small supplier threshold ($30,000) | CONFIRMED | CRA RC4022 |

---

## WCB/WSIB VERIFICATION STATUS

| Province | Our Data | Perplexity Finding | Status |
|---|---|---|---|
| BC construction (4.11%) | sourceYear: 2026 | **Could NOT verify** — must check WorkSafeBC directly | UNVERIFIED |
| BC IT (0.17%) | sourceYear: 2026 | **Could NOT verify** — must check WorkSafeBC directly | UNVERIFIED |
| AB construction (3.51%) | sourceYear: 2025 | AB 2026 rate is $1.81/$100 (industrial/commercial) | STALE — need update |
| AB IT (0.25%) | sourceYear: 2025 | AB 2026 range is $0.18–$0.30/$100 depending on code | STALE — need update |
| ON WSIB construction | verified: true | Confirmed correct | VERIFIED |
| ON WSIB IT | verified: false | IT sole proprietors generally NOT required to register | CONFIRMED EXEMPT |

### Critical WCB Finding — Sole Proprietor Exemptions

Our app should NOT show WCB premiums as required for sole proprietors in many cases:
- **BC:** Owner coverage is voluntary; only hired workers are mandatory
- **AB:** Owner coverage is opt-out; hired worker coverage is mandatory
- **ON:** Construction independents generally required; IT independents generally NOT required unless they have employees
- **QC (CNESST):** Self-employed without employees can opt-in voluntarily
- **Atlantic:** Mandatory for self-employed in construction, but IT/professional sole proprietors may be exempt

**This means our compliance dashboard may be showing WCB obligations to users who have none.** This is a display logic gap.

---

## AUTHORITATIVE SOURCE REGISTRY (from Perplexity)

### Primary CRA Sources

| Document | URL | What It Covers |
|---|---|---|
| Federal tax rates | `canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rate.html` | Federal brackets |
| CRA Rates index | `canada.ca/en/revenue-agency/services/tax/rates.html` | All tax rates index |
| T4001 Employers Guide | `canada.ca/en/revenue-agency/services/forms-publications/publications/t4001/employers-guide-payroll-deductions-remittances.html` | Payroll penalties, remitter types |
| T4032 Payroll Tables | `canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables.html` | Worked payroll examples |
| RC4022 GST/HST Guide | `canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html` | GST/HST rates, small supplier threshold |
| PDOC Calculator | `canada.ca/en/revenue-agency/services/e-services/e-services-businesses/payroll-deductions-online-calculator.html` | Generate test vectors |
| RRSP Contributions | `canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/contributing-a-rrsp-prpp/contributions-you-can-deduct.html` | RRSP limits |

### Provincial WCB Sources

| Province | URL |
|---|---|
| BC (WorkSafeBC) | `worksafebc.com/en/insurance/know-coverage-costs/industry-premium-rates/2026-rates` |
| AB (WCB Alberta) | `rm.wcb.ab.ca/WCB.RateManual.WebServer/AllRates` |
| ON (WSIB) | `wsib.ca/en/2026premiumrates` |
| SK (WCB Saskatchewan) | `wcbsask.com` |

### Cross-Reference Sources (Non-Government, Reliably Maintained)

| Source | URL | Value |
|---|---|---|
| KPMG Tax Tables | `kpmg.com/ca/en/services/tax/tax-facts/canadian-personal-tax-tables.html` | Annual audited provincial bracket PDF |
| TaxTips.ca | `taxtips.ca/taxrates/canada.htm` | Most detailed single aggregation of confirmed rates |

---

## TESTING ARCHITECTURE (from Perplexity)

### Recommended Unit Test Strategy

**Bracket boundary testing** — for each bracket, test at exactly the boundary, $1 below, and $1 above.

Minimum federal test cases:
```
income = 0           → tax = 0
income = 57,374      → tax = 57,374 × 0.145
income = 57,375      → tax = 57,375 × 0.145
income = 57,376      → tax = (57,375 × 0.145) + (1 × 0.205)
income = 114,749     → verify full second bracket
income = 114,750     → verify at exact boundary
income = 177,882     → verify third bracket boundary
income = 253,414     → verify fourth bracket boundary
income = 253,415     → verify top bracket kicks in
income = 500,000     → full top-bracket stress test
```

**Target:** ~70–90 test cases for federal + one province (ON) = full bracket boundary coverage.

### Annual Audit Process

**Pass 1 — January (CRA trigger check):**
- Check CRA "What's new" for bracket/BPA index changes
- Check T4032 new year tables
- Check CRA GST/HST calculator for rate changes

**Pass 2 — February (provincial spot-check):**
- Pull KPMG Tax Tables PDF
- Cross-reference TaxTips.ca
- Check provincial WCB "what's new" announcements (most release rates Sept/Oct)

**Estimated time:** 4–8 hours annually.

### Open-Source Libraries

**Finding: None exist.** No well-maintained, production-quality open-source Canadian tax calculation library was findable as of April 2026. The ecosystem (TurboTax, Wealthsimple Tax, H&R Block) is proprietary. CanStack would be maintaining its own authoritative dataset.

---

## SYNTHESIS — WHAT THIS MEANS FOR THE DATA SOURCING SYSTEM

### The Core Problem

All official CRA, provincial, and WCB data is:
- Publicly available (no paywall)
- Published at known, stable URLs
- Updated on predictable annual cycles (December–February for tax brackets, September–October for WCB)
- Available in HTML/PDF (not API) format

But we have no system to:
1. Track which sources we've checked and when
2. Detect when a source has been updated
3. Validate our hardcoded values against the source
4. Alert when a value is stale

### What Needs To Be Built (Architectural Thinking — Pending Final Synthesis)

Holding this section until LLM 2 and LLM 3 results are in. The direction is clear:

> We need a **source registry** (which URLs to check), a **freshness tracker** (when each value was last verified), a **validation layer** (automated comparison where possible, manual checklist where not), and a **refresh cadence** (weekly for rate changes during announcement season, monthly otherwise).

This is not a data pipeline. It's a **verification and confidence system** for hardcoded data.

---

## Source: ChatGPT (LLM 2 of 3)

---

## CROSS-LLM COMPARISON: Perplexity vs ChatGPT

### Full Agreement (Both LLMs Align)

| Claim | Perplexity | ChatGPT | Confidence |
|---|---|---|---|
| Federal 2025 brackets (thresholds + 14.5% blended) | VERIFIED | VERIFIED | HIGH |
| 2026 federal brackets published | VERIFIED | VERIFIED | HIGH |
| RRSP 2025 cap $32,490, 2026 cap $33,810 | VERIFIED | VERIFIED | HIGH |
| RRSP income ceiling $180,500 (2025) | VERIFIED | VERIFIED | HIGH |
| 18% applies to earned income, not gross | VERIFIED | VERIFIED | HIGH |
| Payroll penalty tiers (3%, 5%, 7%, 10%) | VERIFIED | VERIFIED | HIGH |
| 20% second offence requires "knowing or gross negligence" | VERIFIED | VERIFIED | HIGH |
| BPA is $16,129 full / $14,538 minimum | VERIFIED | VERIFIED | HIGH |
| GST/HST small supplier threshold $30,000 | VERIFIED | VERIFIED | HIGH |
| QST administered by Revenu Quebec | VERIFIED | VERIFIED | HIGH |
| No open-source Canadian tax library exists | VERIFIED | VERIFIED | HIGH |
| T4001, RC4022, T4032 URLs | SAME | SAME | HIGH |

### CRITICAL DISAGREEMENT — Nova Scotia HST

| | Perplexity | ChatGPT |
|---|---|---|
| NS HST rate | **14%** — explicitly flagged as changed April 1, 2025 | **15%** — did NOT catch the change |
| Source cited | CRA GST/HST calculator page (direct quote) | CRA RC4022 (general registrant guide) |

**Assessment:** Perplexity is almost certainly correct. It cited a direct CRA quote: *"As of April 1, 2025, the HST rate has decreased to 14% in Nova Scotia."* ChatGPT appears to have pulled from a general guide that may not have been updated at the URL it checked, or it missed the change. This needs Gemini (LLM 3) as tiebreaker, but Perplexity's citation is more specific.

### ChatGPT Additions Not In Perplexity

1. **Province-by-province official URLs for income tax brackets** — ChatGPT provided direct URLs for AB, BC, MB, NB, NL, NS, ON, PE, QC, SK. This is significantly more detailed than Perplexity's general reference to KPMG/TaxTips.

2. **"Failure to deduct" penalty** — 10% of CPP, EI, and income tax NOT deducted (separate from late remittance). 20% on second/later failures if knowing/grossly negligent. We don't model this at all.

3. **Summary convictions** — T4001 says non-compliance can lead to prosecution, fines of $1,000–$25,000, or fines plus imprisonment up to 12 months. Worth mentioning as a disclaimer.

4. **BC PST expanding to professional services** — At the existing 7% rate, effective October 1, 2026. Tax-base expansion, not rate change. CanStack should flag this for BC-based professional services contractors.

5. **BPA threshold detail** — ChatGPT provided the exact income threshold where BPA starts reducing: $177,882 (same as third bracket boundary). Full BPA below that, linearly reduced to $14,538 at $253,414.

6. **WCB Alberta 2026 rates (more granular):**
   - Industrial/Commercial Construction: $1.84/$100 (vs Perplexity's $1.81 — minor discrepancy, need direct verification)
   - Residential General Contractor: $1.38–$1.41/$100
   - Software/Architects/Design: **Exempt**, premium rate $0.13/$100
   - Engineering: **Compulsory**, $0.15/$100
   - Much more granular than Perplexity's range estimate

7. **Saskatchewan WCB URL** — ChatGPT found the specific 2026 policy URL: `wcbsask.com/policy-and-procedure/industry-premium-rates-2026-pol-422025`

8. **New Brunswick WorkSafeNB** — 2026 Industry Assessment Rates and Premium Rate Guide confirmed at `worksafenb.ca/employers/insurance/understanding-your-rate/`

### ChatGPT Was More Cautious On

- Manitoba PST 7% — flagged as "not fully sourced from official Manitoba page"
- Saskatchewan PST 6% — flagged as "should be re-checked directly"
- PEI WCB — "not findable in this pass"
- NL WCB — "not findable in this pass"
- Province-by-province WCB sole-proprietor exemption matrix — "would not hardcode yet without another pass"

This caution is actually valuable — it identifies exactly which data points need manual verification.

### WCB Alberta Rate Discrepancy

| Source | AB Construction Rate 2026 |
|---|---|
| Perplexity | $1.81/$100 |
| ChatGPT | $1.84/$100 |

Both cite WCB Alberta Rate Manual at `rm.wcb.ab.ca`. The discrepancy likely comes from different construction sub-classifications. **Neither is wrong — "construction" maps to multiple WCB rate codes.** This reinforces that we need classification-code-level mapping, not a single "construction" rate.

### Ontario WSIB — Both Agree

IT consultants who are sole proprietors with no employees are generally NOT required to register with WSIB. Both LLMs agree. This confirms our code should not show WSIB premiums for ON IT contractors without employees.

---

## UPDATED SOURCE REGISTRY (Combined from Both LLMs)

### Provincial Income Tax — Official URLs

| Province | Official URL | Verified |
|---|---|---|
| AB | `alberta.ca/personal-income-tax` | 2026-04-04 |
| BC | `gov.bc.ca/gov/content/taxes/income-taxes/personal/tax-rates` | 2026-04-04 |
| MB | `gov.mb.ca/finance/personal/ptaxes.html` | 2026-04-04 |
| NB | `gnb.ca/content/gnb/en/departments/finance/taxes/personal.html` | 2026-04-04 |
| NL | `gov.nl.ca/fin/tax-programs-incentives/personal/personalincometax/` | 2026-04-04 |
| NS | `novascotia.ca/personal-income-tax-rates-and-indexation` | 2026-04-04 |
| ON | `data.ontario.ca/en/dataset/personal-income-tax-rates-and-credits` | 2026-04-04 |
| PE | `princeedwardisland.ca/en/information/finance/provincial-personal-income-tax` | 2026-04-04 |
| QC | `revenuquebec.ca/en/citizens/income-tax-return/completing-your-income-tax-return/income-tax-rates/` | 2026-04-04 |
| SK | `saskatchewan.ca/residents/taxes-and-investments/personal-income-tax/` | 2026-04-04 |

### WCB — Official URLs (Combined)

| Province | Board | URL | Status |
|---|---|---|---|
| BC | WorkSafeBC | `worksafebc.com/en/insurance/know-coverage-costs/industry-premium-rates/2026-rates` | Public table |
| AB | WCB Alberta | `rm.wcb.ab.ca/WCB.RateManual.WebServer/AllRates` | Public searchable |
| SK | WCB Saskatchewan | `wcbsask.com/policy-and-procedure/industry-premium-rates-2026-pol-422025` | Public table |
| MB | WCB Manitoba | `wcb.mb.ca/how-premiums-are-calculated` | No standalone table found |
| ON | WSIB | `wsib.ca/en/2026premiumrates` | Public class-level rates |
| NB | WorkSafeNB | `worksafenb.ca/employers/insurance/understanding-your-rate/` | Public guide + rates |
| NS | WCB Nova Scotia | `wcb.ns.ca` (2026 rates in MyAccount) | Partial public |
| QC | CNESST | `cnesst.gouv.qc.ca` | Portal lookup |
| PE | WCB PEI | `wcb.pe.ca` | Not verified |
| NL | WorkplaceNL | `workplacenl.ca` | Not verified |

---

## Source: Gemini (LLM 3 of 3)

---

## GEMINI UNIQUE FINDINGS (Not In Perplexity or ChatGPT)

### 1. 2027 RRSP Limit Already Announced: $35,390

Neither Perplexity nor ChatGPT mentioned this. Gemini cites CRA announcement from 2025-10-30.

### 2. 2026 BPA Updated Values

- Maximum BPA for 2026: **$16,452** (up from $16,129 in 2025)
- Minimum BPA at income ≥ $258,482: **$14,829**
- Phase-out begins at $181,440
- This gives us concrete numbers to implement for 2026.

### 3. Provincial 2026 Bracket Details (Granular)

Gemini provided much more detailed provincial bracket info:
- **BC Budget 2026:** Proposed increasing lowest rate from 5.06% to 5.60%, pausing indexation 2027–2030
- **Ontario surtax:** 20% on provincial tax > $5,818, additional 36% on provincial tax > $7,446 — effectively raises top marginal rate to 20.53%
- **Nova Scotia:** Indexation introduced for the first time in 2026
- **Manitoba:** Indexation paused for 2025 and 2026

### 4. Incorporated Contractors and RRSP — Critical Distinction

**Dividends are NOT earned income for RRSP purposes.** Only salary reported on a T4 creates RRSP room. This means an incorporated contractor who pays themselves dividends gets ZERO RRSP room from those payments.

This is a significant gap in our app — we don't ask about business structure (sole prop vs incorporated) or payment method (salary vs dividends) when showing RRSP estimates.

### 5. Director's Liability for Corporations

If a corporation fails to remit payroll deductions, directors can be held **personally, jointly, and severally liable** for the amount due including interest and penalties. Important for incorporated contractors.

### 6. "Unregistered Contractor" WCB Trigger

In BC and Ontario, if a contractor hires an unregistered subcontractor, that subcontractor is **deemed the contractor's "worker"** for WCB/health-and-safety and premium purposes. This is a compliance trap our app should warn about.

### 7. Open-Source Canadian Tax Libraries — CONTRADICTS Other LLMs

Gemini claims three libraries exist:
- **`tax-ca`** by Kronos/Equisoft Technologies (TypeScript) — `github.com/kronostechnologies/tax-ca`
- **`canadian-income-tax`** (Haskell) — `github.com/blamario/canadian-income-tax`
- **`cad-capital-gains`** (Python) — `github.com/EmilMaric/cad-capital-gains`

**AUDIT NOTE:** Both Perplexity and ChatGPT explicitly stated no well-maintained library exists. Gemini's claim needs manual verification — check if these repos exist, are actively maintained, and cover our scope. Gemini may have hallucinated or named stale/abandoned projects.

### 8. T4127 CSV Files for Automated Diffing

CRA provides CSV files for federal/provincial claim codes, CPP rates, and tax constants alongside the T4127-JAN publication. This enables automated annual diffing against hardcoded values — a concrete sourcing system building block.

### 9. Nova Scotia WCB Rate Book

Specific URL for downloadable rate book: `wcb.ns.ca/media/2026-rate-book`. Neither other LLM found this.

### 10. QST Calculation Rule Clarification

QST is calculated on the selling price **excluding GST**. Since 2013, QST is no longer compounded by the federal tax. Our code should verify this is implemented correctly.

---

## FINAL CROSS-LLM AGREEMENT ANALYSIS (All 3)

### UNANIMOUS AGREEMENT — High Confidence

| Claim | P | G | C | Action |
|---|---|---|---|---|
| Federal 2025 brackets (thresholds + 14.5% blended) | ✅ | ✅ | ✅ | Our code is correct |
| Federal 2026 brackets published (14% flat) | ✅ | ✅ | ✅ | Need to add to code |
| RRSP 2025 cap $32,490 | ✅ | ✅ | ✅ | Need to add cap to code |
| RRSP 2026 cap $33,810 | ✅ | ✅ | ✅ | Need to add cap to code |
| RRSP income ceiling $180,500 (2025) | ✅ | ✅ | ✅ | — |
| 18% applies to earned income (not gross) | ✅ | ✅ | ✅ | Clarify in UI |
| Payroll penalties: 3%, 5%, 7%, 10% | ✅ | ✅ | ✅ | Our code is correct |
| 20% penalty requires "knowing or gross negligence" | ✅ | ✅ | ✅ | Fix description in code |
| BPA is income-dependent, ~$16,129 for 2025 | ✅ | ✅ | ✅ | Need to implement |
| Small supplier threshold $30,000 | ✅ | ✅ | ✅ | — |
| ON WSIB: IT sole props without employees exempt | ✅ | ✅ | ✅ | Fix display logic |
| ON WSIB: Construction independents must register | ✅ | ✅ | ✅ | — |
| QST administered by Revenu Quebec | ✅ | ✅ | ✅ | Already in code |
| No broadly announced GST/HST rate changes for 2027 | ✅ | ✅ | ✅ | — |

### DISPUTED — Requires Manual Verification

#### Nova Scotia HST Rate

| LLM | NS HST | Source Quality |
|---|---|---|
| **Perplexity** | **14%** | Direct CRA quote from GST/HST calculator page |
| ChatGPT | 15% | CRA RC4022 (general guide — may not reflect April 2025 change) |
| Gemini | 15% | Listed without special note |

**Ruling:** 2-vs-1, but Perplexity has the most specific citation with a direct quote. The NS HST reduction from 15% to 14% effective April 1, 2025 is a documented legislative change. ChatGPT and Gemini likely pulled from sources that hadn't been updated or from general reference data. **MUST be manually verified at the CRA GST/HST calculator URL before patching code.**

#### Open-Source Canadian Tax Libraries

| LLM | Finding |
|---|---|
| Perplexity | "None exist" |
| ChatGPT | "None verified" |
| Gemini | Names 3 repos: `tax-ca`, `canadian-income-tax`, `cad-capital-gains` |

**Ruling:** 2-vs-1 saying none exist. Gemini's claims need manual verification. Check GitHub for repo existence, last commit date, and scope coverage. Gemini has a known tendency to name plausible-sounding repos. If `tax-ca` by Kronos is real and maintained, it could be a valuable cross-reference source even if not a direct dependency.

#### Alberta WCB Construction Rate 2026

| LLM | Rate | Sub-Classification |
|---|---|---|
| Perplexity | $1.81/$100 | "Industrial/Commercial Construction" |
| ChatGPT | $1.84/$100 | "Industrial/Commercial Construction" |
| Gemini | $3.02/$100 | "Horizontal Boring" (Code 42103) |

**Ruling:** Not a true disagreement — different construction sub-classifications. This confirms that a single "construction" rate is meaningless. We need classification-code-level mapping or must show ranges with a disclaimer.

---

## PRIORITY-RANKED BUG FIX LIST

### P0 — Fix Before Any User Sees This

| # | Bug | Impact | Files |
|---|---|---|---|
| 1 | **Nova Scotia HST: 15% → likely 14%** | Wrong sales tax for all NS users | `lib/compliance-rules.ts` |
| 2 | **BPA not applied to tax estimates** | Every tax estimate overstated (all users) | `lib/canadian-tax.ts` |

### P1 — Fix Before Launch

| # | Bug | Impact | Files |
|---|---|---|---|
| 3 | **RRSP room has no annual dollar cap** | Overestimates for income >$180K | `lib/canadian-tax.ts` |
| 4 | **20% penalty description misleading** | Users think 20% is automatic | `lib/compliance-rules.ts` |
| 5 | **WCB shown for exempt sole proprietors** | Users see obligations they don't have | `components/compliance-dashboard.tsx` |
| 6 | **2026 federal brackets not in code** | App shows outdated 2025 brackets | `lib/canadian-tax.ts` |

### P2 — Important Improvements

| # | Gap | Impact | Files |
|---|---|---|---|
| 7 | Add $500 floor exception to penalty display | Minor accuracy gap | `components/compliance-dashboard.tsx` |
| 8 | Add daily compound interest disclaimer | Missing compliance context | `components/compliance-dashboard.tsx` |
| 9 | Clarify RRSP uses "earned income" not gross | Contractor-specific confusion | UI copy |
| 10 | Add incorporated vs sole prop distinction for RRSP | Dividends ≠ earned income | `lib/canadian-tax.ts` + UI |
| 11 | Alberta WCB rates stale (2025 → 2026) | Wrong rate estimates for AB | `lib/compliance-rules.ts` |
| 12 | BC WCB rates unverified for 2026 | May be inaccurate | `lib/compliance-rules.ts` |

### P3 — Future Enhancements

| # | Item | Source |
|---|---|---|
| 13 | BC PST expanding to professional services Oct 1, 2026 | ChatGPT |
| 14 | Director's liability warning for incorporated contractors | Gemini |
| 15 | "Unregistered subcontractor" WCB trigger warning | Gemini |
| 16 | Ontario surtax modeling | Gemini |
| 17 | 2027 RRSP cap ($35,390) pre-staging | Gemini |

---

## COMPLETE AUTHORITATIVE SOURCE REGISTRY

### Federal — CRA Primary Sources

| Document | URL | Covers | Update Cycle |
|---|---|---|---|
| Federal tax rates | `canada.ca/en/revenue-agency/services/tax/individuals/.../canadian-income-tax-rates-individuals-current-previous-years.html` | Federal brackets | Annual (Dec/Jan) |
| BPA (Line 30000) | `canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/.../line-30000-basic-personal-amount.html` | BPA values | Annual |
| T4001 Employers Guide | `canada.ca/en/revenue-agency/services/forms-publications/publications/t4001/employers-guide-payroll-deductions-remittances.html` | Payroll penalties, remitter types | Annual |
| T4032 Payroll Tables | `canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables.html` | Worked payroll examples | Annual (Jan) |
| T4127 Payroll Formulas + CSV | `canada.ca/en/revenue-agency/services/forms-publications/publications/t4127.html` | Algebraic formulas, CSV data files | Annual (Jan) |
| RC4022 GST/HST Guide | `canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html` | GST/HST rates, registration | Annual |
| GST/HST Rate Calculator | `canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html` | Quick rate check | Live |
| PDOC Calculator | `canada.ca/en/revenue-agency/services/e-services/e-services-businesses/payroll-deductions-online-calculator.html` | Test vector generation | Live |
| RRSP Limits | `canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html` | RRSP/TFSA/YMPE caps | Annual (Oct) |
| CRA Rates Index | `canada.ca/en/revenue-agency/services/tax/rates.html` | Master rates index | Ongoing |

### Provincial Income Tax — Official URLs

| Province | Official URL |
|---|---|
| AB | `alberta.ca/personal-income-tax` |
| BC | `gov.bc.ca/gov/content/taxes/income-taxes/personal/tax-rates` |
| MB | `gov.mb.ca/finance/taxation/taxes/personal.html` |
| NB | `gnb.ca/content/gnb/en/departments/finance/taxes/personal.html` |
| NL | `gov.nl.ca/fin/tax-programs-and-administration/personal-income-tax/` |
| NS | `novascotia.ca/personal-income-tax-rates-and-indexation` |
| NT | `fin.gov.nt.ca/en/services/income-tax` |
| NU | `gov.nu.ca/finance/information/personal-income-tax` |
| ON | `ontario.ca/page/personal-income-tax` |
| PE | `princeedwardisland.ca/en/information/finance-and-affordability/provincial-personal-income-tax` |
| QC | `revenuquebec.ca/en/citizens/income-tax-return/.../income-tax-rates/` |
| SK | `saskatchewan.ca/residents/taxes-and-investments/personal-income-tax/tax-brackets` |
| YT | `yukon.ca/en/personal-income-tax-rates` |

### Provincial WCB — Official URLs

| Province | Board | URL | Format |
|---|---|---|---|
| AB | WCB Alberta | `rm.wcb.ab.ca/WCB.RateManual.WebServer/AllRates` | Searchable table |
| BC | WorkSafeBC | `worksafebc.com/en/insurance/industry-premium-rates/2026-rates` | Downloadable PDF |
| SK | WCB Saskatchewan | `wcbsask.com/policy-and-procedure/industry-premium-rates-2026-pol-422025` | Downloadable PDF |
| MB | WCB Manitoba | `wcb.mb.ca/how-premiums-are-calculated` | No standalone table |
| ON | WSIB | `wsib.ca/en/2026premiumrates` | Web table / PDF |
| NB | WorkSafeNB | `worksafenb.ca/employers/insurance/understanding-your-rate/` | Public guide |
| NS | WCB Nova Scotia | `wcb.ns.ca/media/2026-rate-book` | Downloadable PDF |
| QC | CNESST | `cnesst.gouv.qc.ca` | Portal lookup |
| PE | WCB PEI | `wcb.pe.ca` | Not verified |
| NL | WorkplaceNL | `workplacenl.ca` | Not verified |

### Cross-Reference Sources

| Source | URL | Value | Update Cycle |
|---|---|---|---|
| KPMG Tax Tables | `kpmg.com/ca/en/services/tax/tax-facts/canadian-personal-tax-tables.html` | Audited provincial bracket PDF | Annual (Feb) |
| TaxTips.ca | `taxtips.ca/taxrates/canada.htm` | Most detailed rate aggregation | Ongoing |
| CRA Mailing Lists | `canada.ca/en/revenue-agency/news/e-services.html` | Mid-year change alerts | Real-time |

---

## ARCHITECTURAL RECOMMENDATION — DATA SOURCING SYSTEM

### The Problem We're Solving

CanStack hardcodes Canadian tax and compliance data. All source data is:
- **Publicly available** (no paywall, no API key)
- **Published at known, stable URLs** (CRA, provincial ministries, WCB boards)
- **Updated on predictable cycles** (brackets: Dec–Feb; WCB: Sep–Oct; RRSP/TFSA: Oct)
- **Available in HTML/PDF/CSV** (not via API)

We have **no system** to track freshness, detect source changes, validate our hardcoded values, or alert on staleness.

### What We Need (3 Layers)

#### Layer 1 — Source Registry (`lib/data-sources.ts`)

A typed registry of every data source we depend on:

```
{
  id: "federal-brackets-2026",
  jurisdiction: "federal",
  sourceUrl: "https://www.canada.ca/en/...",
  documentRef: "T4127-JAN 122nd Edition",
  dataType: "income-tax-brackets",
  effectiveDate: "2026-01-01",
  lastVerified: "2026-04-04",
  verifiedBy: "multi-llm-audit",
  updateCycle: "annual-january",
  nextExpectedUpdate: "2027-01-01"
}
```

Every hardcoded value in the app traces back to a registry entry. If the source can't be identified, the value shouldn't be in the app.

#### Layer 2 — Freshness Tracker + Automated Checks

**Weekly automated check (script or scheduled task):**
1. For each source in the registry, fetch the URL and compute a content hash
2. Compare against last-known hash
3. If changed → flag for manual review
4. If source returns error → flag as potentially moved/broken

**Annual structured audit (January + February):**
1. Download new T4127 CSV files → automated diff against hardcoded values
2. Run 20 "user personas" through CRA PDOC → compare against our calculations
3. Pull KPMG Tax Tables PDF → cross-reference provincial brackets
4. Check each provincial WCB "what's new" page

**Subscription-based alerts:**
- Subscribe to CRA Electronic Mailing Lists for mid-year change notifications

#### Layer 3 — Unit Tests as the Last Line of Defense

**Bracket boundary tests:** Every bracket boundary ±$1, for every federal and provincial bracket
**BPA tests:** Verify zero tax at BPA income level, phase-out at threshold
**RRSP cap tests:** Verify cap applied at ceiling income
**Cross-validation tests:** Lock in expected outputs from CRA PDOC for 3+ income scenarios per province
**Regression tests:** Pin expected outputs per tax year so data updates don't silently break prior-year calculations

**Target:** 70–90 test cases minimum for federal + ON provincial coverage.

### What This Is NOT

- Not a live data pipeline
- Not an API integration with CRA
- Not a web scraper that auto-updates values

It's a **confidence and verification system** for human-maintained hardcoded data. The data stays hardcoded. The system tells us when to check and whether our values still match the source.

### Implementation Priority

1. **Source registry file** — immediate, no dependencies
2. **Unit tests for existing calculations** — immediate, catches current bugs
3. **Content-hash monitoring script** — after registry exists
4. **Annual audit checklist template** — once, then reuse each January
5. **CRA mailing list subscription** — manual, one-time setup

---

## ITEMS REQUIRING MANUAL VERIFICATION BEFORE CODE CHANGES

| # | Item | What To Check | URL |
|---|---|---|---|
| 1 | NS HST 14% vs 15% | Open CRA GST/HST calculator, check NS rate | `canada.ca/.../calculator.html` |
| 2 | `tax-ca` TypeScript library | Check if repo exists and is maintained | `github.com/kronostechnologies/tax-ca` |
| 3 | `canadian-income-tax` Haskell library | Check if repo exists | `github.com/blamario/canadian-income-tax` |
| 4 | BC WCB rates (4.11% construction, 0.17% IT) | Check WorkSafeBC 2026 rate table | `worksafebc.com/.../2026-rates` |
| 5 | MB PST 7% official source | Check Manitoba Finance RST page | `gov.mb.ca` |
| 6 | SK PST 6% official source | Check Saskatchewan Finance page | `saskatchewan.ca` |

---

## PENDING

- [x] LLM 1 (Perplexity) audit results — synthesized
- [x] LLM 2 (ChatGPT) audit results — synthesized
- [x] LLM 3 (Gemini) audit results — synthesized
- [x] Cross-LLM agreement analysis — complete
- [x] Architectural recommendation for sourcing system — complete
- [x] Priority-ranked bug fix list — complete
- [ ] Manual verification of disputed items (NS HST, open-source libs, BC WCB)
- [ ] Implementation of sourcing system
- [ ] Implementation of bug fixes
