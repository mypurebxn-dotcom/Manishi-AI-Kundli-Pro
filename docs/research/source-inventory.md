# Source Inventory — Research & Implementation References

> Phase 31 · Research Source Registry
> Status: **PLANNING** — inventory only. No datasets committed, no copyrighted material committed.

> **Cross-reference:** Rejected and low-value source types are tracked
> separately in `docs/research/rejected-sources.md`. This prevents weak, noisy,
> black-box, illegal, or non-verifiable sources from entering the prediction
> validation pipeline.

## Purpose

Catalog every external source we considered for building the Prediction Engine
rule library. Each source is tagged with a **status** and a **license/usage**
flag so engineers know what may be implemented, what requires review, and what
is forbidden in the repository.

This is a **pointer** document, not a data dump. No source text, no PDFs, no
raw datasets live in this repo. See `legal-risk-register.md` and
`research-workflow.md`.

## Status Tags

| Tag | Meaning |
|---|---|
| `REFERENCE_ONLY` | Concept reference; do not copy text or code verbatim |
| `USE_WITH_CAUTION` | Useful but license/PII/quality requires review before any use |
| `LEGAL_REVIEW_REQUIRED` | License uncertain — must be cleared before any reuse |
| `IMPLEMENTABLE` | Public-domain principle or original logic; safe to reimplement |
| `FORBIDDEN` | Must not be stored or reused (copyright / PII / ToS) |

## Classical Texts (Granth)

See `granth-list.md` for the full list. Summary status:

| Source | Status | Notes |
|---|---|---|
| Brihat Parashara Hora Shastra (BPHS) | `REFERENCE_ONLY` | Parashari core. Modern translations are copyrighted; principles only. |
| Brihat Jataka (Varahamihira) | `REFERENCE_ONLY` | Public-domain Sanskrit; English translations vary in license → `LEGAL_REVIEW_REQUIRED` for any specific translation. |
| Phaladeepika (Mantreswara) | `REFERENCE_ONLY` | Principles referenceable; no verbatim translation text. |
| Jaimini Sutras | `REFERENCE_ONLY` | Jaimini = **supporting**, not primary. See `rule-priority-policy.md`. |
| Lal Kitab | `REFERENCE_ONLY` | **Remedy-only** approved scope for now. Prediction rules out of scope. |

## Modern Software / Libraries

| Source | Status | Notes |
|---|---|---|
| Swiss Ephemeris (`swisseph`) | `IMPLEMENTABLE` | AGPL dual-licensed. We already use it via `swe_bridge.py`. Math, not rules. |
| `pyswisseph` | `IMPLEMENTABLE` | Python binding. Used in calculation layer. |

## Astrological Datasets / Databanks

| Source | Status | Notes |
|---|---|---|
| Astro-Databank (astro.com) | `USE_WITH_CAUTION` | Contains real identifiable birth data → **PII risk**. Not for production. Do not commit raw data. |
| TkAstroDb / community rodatas | `USE_WITH_CAUTION` | Quality + licensing inconsistent → `LEGAL_REVIEW_REQUIRED` for any specific subset. Not for production. |
| Any scraped web horoscope data | `FORBIDDEN` | Live scraping is **not recommended** (ToS + rate + freshness). See `research-workflow.md`. |

These datasets may only ever be used as **offline, opt-in, locally-held
validation references** for a developer's own testing — never shipped, never
committed, never used to identify a real person in production output.

## LLM / AI Sources

| Source | Status | Notes |
|---|---|---|
| Any LLM / OpenAI / Claude / Gemini output | `REFERENCE_ONLY` | The Google AI Step 1–5 research is treated as **a brainstorm reference, not a source of truth**. The engine is deterministic and **never** calls an LLM at runtime (enforced by `qa:prediction:arch`). |

## What This Repo Will Never Contain

- Raw datasets (Astro-Databank, TkAstroDb, rodata files)
- Copyrighted PDFs / book scans / verbatim translation text
- Real identifiable validation charts (names, exact birth details of real people)
- Scraped horoscope content

See `data/research/*/README.md` for the intended (empty) data folder policy.
