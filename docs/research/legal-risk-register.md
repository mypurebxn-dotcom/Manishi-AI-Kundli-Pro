# Legal Risk Register

> Phase 31 · Research Source Registry
> Tracks legal/licensing/privacy risks and their mitigations. Items marked
> `LEGAL_REVIEW_REQUIRED` must be cleared before any reuse.

## Risk Table

| ID | Risk | Severity | Status | Mitigation |
|---|---|---|---|---|
| L-01 | Copyrighted book translations copied into repo | High | `MITIGATED` | Only cite principles in `granth-list.md`; no verbatim text/PDFs committed. |
| L-02 | Astro-Databank / TkAstroDb raw data committed | High | `MITIGATED` | Raw datasets never committed (`.gitignore` + policy). Marked `USE_WITH_CAUTION`/`LEGAL_REVIEW_REQUIRED`. |
| L-03 | Real identifiable birth data committed | Critical | `MITIGATED` | Only synthetic dummy charts committed. User data opt-in + encrypted (see `validation-methodology.md`). |
| L-04 | Live web scraping of horoscope sites | High | `AVOIDED` | Not recommended. No scraper built. |
| L-05 | Uncertain license on a referenced repo/edition | Medium | `LEGAL_REVIEW_REQUIRED` | Each adoption logged in `decision-log.md` with license + decision before reuse. |
| L-06 | LLM-generated content presented as authoritative | Medium | `MITIGATED` | LLM output is reference brainstorm only; runtime engine never calls an LLM (enforced by `qa:prediction:arch`). |
| L-07 | Medical prediction without disclaimer | High | `MITIGATED` | Health predictions must say "consult a licensed doctor first"; no diagnostics. |
| L-08 | Pressure-based remedy/gemstone selling | High | `MITIGATED` | Remedies/gemstones are **premium-only** with disclaimer; no fear language. |
| L-09 | PII co-located with chart math | High | `MITIGATED` | PII separated from chart data and stored encrypted; calculation records non-identifying. |
| L-10 | Claiming 100% certainty in predictions | High | `MITIGATED` | Engine forbids certainty=1; confidence < 1 always. |

## Status Legend

| Status | Meaning |
|---|---|
| `MITIGATED` | Policy/control in place to reduce risk. |
| `AVOIDED` | The risky activity is not performed at all. |
| `LEGAL_REVIEW_REQUIRED` | Must be cleared by review before reuse; not yet cleared. |

## Review Queue (`LEGAL_REVIEW_REQUIRED`)

Before any item below is reused, it must move to `MITIGATED` via a
`decision-log.md` entry:

- Any specific modern English translation of BPHS / Brihat Jataka / Saravali.
- Any KP or Nadi published edition (both out of Phase-31 scope regardless).
- Any GitHub astrology repo whose license is mixed or unclear.
- Any subset of Astro-Databank / TkAstroDb data.

## Disclaimer Policy

All prediction/report output must carry:

- "For reflection/entertainment purposes only."
- "Not a substitute for professional medical, legal, or financial advice."
- Health → "Consult a licensed doctor first."
- Remedies/gemstones → "Premium feature; effects not guaranteed."
