# GitHub Repositories v2 — Deep Analysis (Phase 31)

> Phase 31 · Research Source Registry
> Generated: 2026-06-29 (metadata fetched live from GitHub API).
> **Evidence-based.** No code copied from any repository. Classifications are
> `PRELIMINARY` pending the audit stages in `github-repos.md`.

## Method

Each repository's stars/forks/license/last-update were fetched from the GitHub
REST API. Usefulness scores (0–10) are research judgements. Legal status follows
`source-inventory.md` tags. No repository is vendored or depended on for
prediction logic — all prediction rules are reimplemented from classical
principles (see `granth-list.md`).

---

## Classification Key

| Class | Meaning |
|---|---|
| **A+** | Core Reference — essential, high-precision, commercial-safe, validation-critical. |
| **A** | Reference — strong architecture/calculation reference, commercial-safe. |
| **B** | Research Only — useful ideas but license limits code reuse. |
| **C** | Specific Reference — niche/regional/non-Vedic; ideas only. |
| **Reject** | Abandoned, empty, no license, or irrelevant. |

---

## Per-Repository Analysis

### 1. aloistr/swisseph
| Field | Value |
|---|---|
| Owner | aloistr (Astrodienst mirror) |
| Stars / Forks | 678 / 234 |
| Last push | 2026-06-19 |
| Language | C |
| License | Other (Swiss Ephemeris dual: GPL + commercial) — `NOASSERTION` |
| Maintained | YES |
| Commercial-safe | YES (via the AGPL/commercial dual licence; we already use it) |
| Pred / Calc / Valid / Arch / Res | 0 / 10 / 10 / 5 / 8 |
| Legal Risk | Low — dual-licensed; we comply via existing `swe_bridge.py` use. |
| Code reuse? | Already used as the calculation core. |
| Ideas only? | n/a — it is the math layer. |
| **Classification** | **A+ Core Reference** |
| **Why** | Official Swiss Ephemeris source; the gold-standard planetary calculation engine we already depend on. Indispensable for calculation accuracy. |

### 2. jannikmi/timezonefinder
| Field | Value |
|---|---|
| Owner | jannikmi |
| Stars / Forks | 533 / 68 |
| Last push | 2026-06-22 |
| Language | Python |
| License | MIT |
| Maintained | YES |
| Commercial-safe | YES |
| Pred / Calc / Valid / Arch / Res | 0 / 7 / 9 / 6 / 7 |
| Legal Risk | None (MIT). |
| Code reuse? | Candidate dependency for offline timezone resolution. |
| Ideas only? | Could be a direct dependency. |
| **Classification** | **A+ Core Reference** |
| **Why** | Pure-offline, MIT-licensed timezone-from-coordinates utility — exactly what birth-time validation needs without network calls. Actively maintained, widely adopted. |

### 3. VedAstro/VedAstro
| Field | Value |
|---|---|
| Owner | VedAstro (org, non-profit) |
| Stars / Forks | 574 / 251 |
| Last push | 2026-04-23 |
| Language | C# |
| License | MIT |
| Maintained | YES |
| Commercial-safe | YES |
| Pred / Calc / Valid / Arch / Res | 9 / 7 / 7 / 9 / 9 |
| Legal Risk | Low (MIT); note: topics include `chatgpt-api`/`ai` — we treat AI features as reference only, never runtime LLM. |
| Code reuse? | Ideas only — C# vs our Node stack; we reimplement architecture. |
| Ideas only? | YES — rule-engine layout, prediction pipeline, event modelling. |
| **Classification** | **A Reference** |
| **Why** | The single best open, MIT-licensed Vedic astrology architecture reference: a real rule engine, prediction pipeline, and event model. Non-profit, transparent. We study structure, we do not copy. |

### 4. g-battaglia/libephemeris
| Field | Value |
|---|---|
| Owner | g-battaglia |
| Stars / Forks | 13 / 7 |
| Last push | 2026-06-29 (today) |
| Language | Python |
| License | Apache-2.0 |
| Maintained | YES (very active) |
| Commercial-safe | YES |
| Pred / Calc / Valid / Arch / Res | 0 / 9 / 10 / 7 / 8 |
| Legal Risk | None (Apache-2.0). |
| Code reuse? | Ideas / validation reference; pure-Python pyswisseph-compatible API. |
| Ideas only? | Independent cross-validation of calculations against NASA JPL DE440/441. |
| **Classification** | **A Reference** |
| **Why** | NASA-JPL-powered, pyswisseph-compatible, independently validated against pyswisseph + JPL Horizons. Ideal independent oracle to cross-check our Swiss Ephemeris output. Low stars but exactly on-target and commercial-safe. |

### 5. northtara/jyotishganit
| Field | Value |
|---|---|
| Owner | northtara (org) |
| Stars / Forks | 36 / 16 |
| Last push | 2026-06-02 |
| Language | Python |
| License | MIT |
| Maintained | YES (new, created 2025-10) |
| Commercial-safe | YES |
| Pred / Calc / Valid / Arch / Res | 6 / 9 / 8 / 7 / 8 |
| Legal Risk | Low (MIT). |
| Code reuse? | Ideas only — reimplement ayanamsha/dasha math. |
| Ideas only? | YES — Vedic calc using NASA JPL; cross-check ayanamsha + dasha. |
| **Classification** | **A Reference** |
| **Why** | Fresh, MIT-licensed Vedic calculation library on NASA JPL ephemeris — directly relevant for ayanamsha and dasha cross-validation. |

### 6. naturalstupid/PyJHora
| Field | Value |
|---|---|
| Owner | naturalstupid |
| Stars / Forks | 196 / 108 |
| Last push | 2026-06-07 |
| Language | Python |
| License | AGPL-3.0 |
| Maintained | YES |
| Commercial-safe | NO (AGPL-3.0 strong copyleft) |
| Pred / Calc / Valid / Arch / Res | 8 / 8 / 6 / 6 / 8 |
| Legal Risk | High for code reuse — AGPL-3.0 is infectious to network services. |
| Code reuse? | NO. |
| Ideas only? | YES — feature taxonomy from PVR Narasimha Rao's integrated approach. |
| **Classification** | **B Research Only** |
| **Why** | Rich Vedic feature coverage, but AGPL-3.0 forbids code copying into our codebase. Study the feature list (D1–D60, events), reimplement from classical sources. |

### 7. astrorigin/pyswisseph
| Field | Value |
|---|---|
| Owner | astrorigin |
| Stars / Forks | 378 / 100 |
| Last push | 2026-04-01 |
| Language | C |
| License | AGPL-3.0 |
| Maintained | YES |
| Commercial-safe | NO (AGPL-3.0) |
| Pred / Calc / Valid / Arch / Res | 0 / 8 / 7 / 5 / 6 |
| Legal Risk | High — AGPL-3.0; we already use Swiss Ephemeris via a different path. |
| Code reuse? | NO. |
| Ideas only? | YES — alternative binding approach. |
| **Classification** | **B Research Only** |
| **Why** | A respected Python Swiss Ephemeris binding, but AGPL-3.0 and redundant with our existing `swe_bridge.py`. Reference only. |

### 8. flatangle/flatlib
| Field | Value |
|---|---|
| Owner | flatangle (org) |
| Stars / Forks | 388 / 131 |
| Last push | 2026-04-30 |
| Language | Python |
| License | MIT |
| Maintained | YES |
| Commercial-safe | YES |
| Pred / Calc / Valid / Arch / Res | 3 / 6 / 4 / 7 / 5 |
| Legal Risk | None (MIT). |
| Code reuse? | Ideas only — Western/traditional astrology, not Vedic. |
| Ideas only? | YES — data-model and object-relationship architecture. |
| **Classification** | **C Specific Reference** |
| **Why** | Clean MIT architecture (chart/planet/house object model), but it is **traditional/Western** astrology, not Vedic. Useful only for data-modelling ideas. |

### 9. g-battaglia/AstrologerStudio
| Field | Value |
|---|---|
| Owner | g-battaglia |
| Stars / Forks | 28 / 8 |
| Last push | 2026-05-13 |
| Language | TypeScript |
| License | Other (`NOASSERTION`) |
| Maintained | YES (new, 2026-01) |
| Commercial-safe | UNKNOWN |
| Pred / Calc / Valid / Arch / Res | 2 / 2 / 2 / 6 / 4 |
| Legal Risk | Medium — unclear license; `LEGAL_REVIEW_REQUIRED`. |
| Code reuse? | NO. |
| Ideas only? | YES — client/workspace UI architecture only. |
| **Classification** | **C Specific Reference** |
| **Why** | Client-side workspace ideas only; Western astrology + AI interpretations (we forbid runtime LLM). License unclear → ideas only. |

### 10. dimmastro/openastro2
| Field | Value |
|---|---|
| Owner | dimmastro |
| Stars / Forks | 24 / 9 |
| Last push | 2026-05-13 |
| Language | Python |
| License | GPL-3.0 |
| Maintained | YES |
| Commercial-safe | NO (GPL-3.0 copyleft) |
| Pred / Calc / Valid / Arch / Res | 3 / 6 / 4 / 5 / 4 |
| Legal Risk | Medium — GPL-3.0; chart interchange format ideas only. |
| Code reuse? | NO. |
| Ideas only? | YES — import/export chart format. |
| **Classification** | **C Specific Reference** |
| **Why** | OpenAstro successor; GPL-3.0 and Western-leaning. Chart interchange format ideas only. |

### 11. g-battaglia/Astrologer-API
| Field | Value |
|---|---|
| Owner | g-battaglia |
| Stars / Forks | 114 / 38 |
| Last push | 2026-06-17 |
| Language | Python |
| License | **None** (null — all rights reserved by default) |
| Maintained | YES |
| Commercial-safe | NO |
| Pred / Calc / Valid / Arch / Res | 3 / 5 / 3 / 6 / 4 |
| Legal Risk | **High** — no license = no permission to reuse code. |
| Code reuse? | NO. |
| Ideas only? | Borderline — API surface design only. |
| **Classification** | **Reject** |
| **Why** | No license file. Default copyright means code cannot be reused legally. Western astrology on top of that. Rejected per "reject repositories with unclear licenses." |

### 12. geopython/geopython
| Field | Value |
|---|---|
| Owner | geopython (org) |
| Stars / Forks | 0 / 0 |
| Last push | 2023-04-27 (3+ years stale) |
| Language | Python |
| License | MIT |
| Maintained | NO (abandoned placeholder) |
| Commercial-safe | n/a |
| Pred / Calc / Valid / Arch / Res | 0 / 0 / 0 / 0 / 0 |
| Legal Risk | n/a — empty. |
| Code reuse? | NO. |
| Ideas only? | NO. |
| **Classification** | **Reject** |
| **Why** | A 0-star "vanity package" placeholder, empty and stale since 2023. Not the real geopython tooling (those are separate repos). Abandoned → rejected. |

---

## Ranking (useful repositories only)

| Rank | Repository | Class | License | Composite |
|---|---|---|---|---|
| 1 | aloistr/swisseph | A+ | SE dual | Calculation gold standard (already used) |
| 2 | jannikmi/timezonefinder | A+ | MIT | Offline timezone verification |
| 3 | VedAstro/VedAstro | A | MIT | Best Vedic rule-engine architecture |
| 4 | g-battaglia/libephemeris | A | Apache-2.0 | NASA JPL independent validation oracle |
| 5 | northtara/jyotishganit | A | MIT | MIT Vedic calc (JPL), ayanamsha/dasha |
| 6 | naturalstupid/PyJHora | B | AGPL-3.0 | Vedic features (ideas only) |
| 7 | astrorigin/pyswisseph | B | AGPL-3.0 | Alt binding (ideas only) |
| 8 | flatangle/flatlib | C | MIT | Western architecture ideas |
| 9 | g-battaglia/AstrologerStudio | C | NOASSERTION | Client UI ideas |
| 10 | dimmastro/openastro2 | C | GPL-3.0 | Chart interchange ideas |

**Rejected:** g-battaglia/Astrologer-API (no license), geopython/geopython (abandoned/empty).

---

## Summary Table (governance view)

| Repository | Classification | Purpose | Risk | Allowed use | Forbidden use | Legal status | Recommended action | Evidence | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| aloistr/swisseph | A+ Core | Ephemeris calculation + validation | Low (dual-lic) | Calculation engine; cross-check planetary positions | Replacing without legal review | `IMPLEMENTABLE` | Keep as calculation core | Official Astrodienst source; 678★; we use via swe_bridge | 0.95 |
| jannikmi/timezonefinder | A+ Core | Offline timezone from coordinates | None (MIT) | Timezone resolution for birth-time validation | — | `IMPLEMENTABLE` | Evaluate as dependency | MIT; 533★; pushed 2026-06-22; pure offline | 0.9 |
| VedAstro/VedAstro | A Reference | Vedic rule-engine + prediction pipeline architecture | Low (MIT) | Architecture/pipeline/event-model study | Copying rule tables or LLM integration | `REFERENCE_ONLY` | Study architecture; reimplement | MIT; 574★; C# Vedic engine; non-profit | 0.85 |
| g-battaglia/libephemeris | A Reference | NASA JPL DE440/441 independent calculation validation | None (Apache-2.0) | Independent oracle to cross-check our ephemeris output | — | `IMPLEMENTABLE` | Use as validation oracle | Apache-2.0; pyswisseph-compatible; validated vs pyswisseph+Horizons | 0.8 |
| northtara/jyotishganit | A Reference | Vedic calc (JPL): ayanamsha + dasha | Low (MIT) | Cross-validate ayanamsha/dasha math | — | `REFERENCE_ONLY` | Study + reimplement | MIT; 36★; new Vedic+JPL lib | 0.75 |
| naturalstupid/PyJHora | B Research | Vedic feature taxonomy (D1–D60, events) | High (AGPL-3.0) | Feature-list discovery only | Code copy into our repo | `LEGAL_REVIEW_REQUIRED` | Ideas only; reimplement | AGPL-3.0; 196★; PVR Narasimha Rao features | 0.7 |
| astrorigin/pyswisseph | B Research | Alternative Python swisseph binding | High (AGPL-3.0) | Binding-approach study | Dependency/code copy | `LEGAL_REVIEW_REQUIRED` | Reference only | AGPL-3.0; 378★; redundant with swe_bridge | 0.65 |
| flatangle/flatlib | C Specific | Western astrology data-model architecture | None (MIT) | Object-model ideas | Vedic prediction rules | `REFERENCE_ONLY` | Architecture ideas only | MIT; 388★; Western/traditional, not Vedic | 0.5 |
| g-battaglia/AstrologerStudio | C Specific | Client workspace UI architecture | Medium (NOASSERTION) | UI/UX ideas only | Code copy; LLM integration | `LEGAL_REVIEW_REQUIRED` | Inspect only | NOASSERTION; 28★; Western + AI | 0.45 |
| dimmastro/openastro2 | C Specific | Chart import/export format | Medium (GPL-3.0) | Interchange-format ideas | Code copy/dependency | `LEGAL_REVIEW_REQUIRED` | Format ideas only | GPL-3.0; 24★; Western-leaning | 0.4 |

**Rejected (not in adoption pool):**

| Repository | Reason |
|---|---|
| g-battaglia/Astrologer-API | No license (null) → all rights reserved → no legal reuse. |
| geopython/geopython | Abandoned, 0-star empty vanity placeholder, stale since 2023. |

---

## Governance Note

All classifications above are **PRELIMINARY** per the Repository Classification
Policy in `github-repos.md`. Each must pass audit Stages 1–7 (license, code
quality, prediction relevance) before receiving `FINAL_CLASSIFIED`. No code is
copied from any repository; prediction logic is reimplemented from classical
sources cited in `granth-list.md`.
