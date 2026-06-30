# Rejected and Low-Value Research Sources

> Phase 31 · Research Source Registry
> Status: **POLICY** — permanent record of rejected / low-value / unsafe sources.
> This prevents weak, noisy, black-box, illegal, or non-verifiable sources from
> entering the prediction validation pipeline.

## Purpose

Manishi AI Kundli Pro requires **exact birth time**, **birth place**,
**timezone/source**, **event dates**, **verification rating**, and **legal
usability** for any source used in prediction validation.

A source is **rejected for prediction validation** if it lacks:

- exact birth time
- birth place
- event dates
- verification source
- legal permission
- raw calculation transparency

## Rejected / Low-Value Table

| Source Type | Status | Why Rejected / Limited | Allowed Use | Forbidden Use | Replacement / Better Source |
|---|---|---|---|---|---|
| **Generic Horoscope APIs** (e.g., Aistro, DivineAPI, black-box horoscope APIs) | `REJECTED` | Generate text, hide calculation logic, no raw validation data. | None for prediction validation. | Using as source of truth. | Internal deterministic engine + Swiss Ephemeris + source-backed rules. |
| **Wikipedia "Births in [Year]"** | `LOW_VALUE` | Usually lacks exact time of birth. | Broad biographical lookup only. | Ascendant, house, dasha timing validation. | Astro-Databank AA/A, verified birth records. |
| **Celebrity Birthday Sites** | `REJECTED` | Often fake/estimated birth times, 12:00 PM defaults, no verification. | None except manual lead discovery. | Validation dataset. | Rodden-rated profiles. |
| **Twitter/X API** | `REJECTED` | Account creation time is not biological birth. | Social trend research only, not astrology validation. | Natal prediction validation. | Verified birth chart datasets. |
| **Stock Daily OHLC** | `LIMITED` | Daily data lacks minute precision for high-resolution event timing. | Macro financial trend research. | Prana Dasha / minute-level event validation. | Official exchange intraday data, IPO listing time, incorporation records. |
| **Vedic Sample Charts in Books Without Date/Time** | `LOW_VALUE` | Positions without DOB/time/place are unverifiable. | Qualitative rule explanation only. | Engine validation. | Full birth data + event dates. |
| **Astrology Forums** (e.g., Reddit, Lindy, anonymous forum posts) | `REJECTED` | Dirty data, memory-based birth time, unverifiable. | Idea discovery only. | Validation dataset. | Opt-in verified user charts. |
| **Ancestry.com / Genealogy Platforms** | `LEGAL_RISK` | Paid/private data, scraping unethical, often lacks birth hour. | None unless user-owned/exported with consent. | Scraping or bulk import. | User-submitted consent-based data. |
| **Hospital Records** | `PROHIBITED` | Medical/privacy protected data. | None. | Access, scraping, import, storage. | User voluntarily submitted birth certificate metadata only. |
| **Synthetic / Random Data** | `QA_ONLY` | No real planetary-event correlation. | Software QA, schema tests, UI tests, regression edge cases. | Astrology prediction validation. | Verified real charts for prediction validation. |
| **Kaggle Celebrity Birthday Datasets** | `REJECTED` | No exact birth time/place/event timeline. | None for prediction validation. | Dasha/transit validation. | Astro-Databank AA/A or verified charts. |
| **General Biographical APIs** | `LOW_VALUE` | Often DOB only, no exact time or event timeline. | Candidate discovery. | Direct validation. | Manually verified chart sources. |
| **Black-box AI Astrology Apps** | `REJECTED` | No provenance, no deterministic rules, hallucination risk. | Competitor feature comparison only. | Rule source, prediction source. | Source-backed deterministic rules. |
| **Scraped Living-Person Data Without Consent** | `PROHIBITED` | Privacy and consent risk. | None. | Storage, training, validation. | Explicit opt-in beta validation funnel. |
| **Raw Astro-Databank Live Scraping** | `USE_WITH_CAUTION` / `NO_LIVE_SCRAPING` | Legal/robots/terms risk. | Manual review or legally obtained offline research snapshot only. | Production scraper, public redistribution. | Isolated internal research validation with legal review. |

## Synthetic Data Rule

Synthetic data is allowed **only for**:

- UI tests
- schema tests
- regression tests
- edge-case software tests

Synthetic data is **forbidden for**:

- astrology rule validation
- prediction confidence scoring
- dasha/transit event correlation
