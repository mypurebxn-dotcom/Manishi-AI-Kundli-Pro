# Decision Log

> Phase 31 · Research Source Registry
> Architecture Decision Records (ADR-style) for research/usage decisions.

## Format

Each entry: **ID · Date · Decision · Context · Consequence · Status**.
Status: `PROPOSED` | `ACCEPTED` | `SUPERSEDED`.

---

### D-01 — Parashari primary, Jaimini supporting
- **Date:** Phase 31
- **Decision:** Parashari is the primary school; Jaimini is a supporting overlay. KP and Nadi are out of Phase-31 scope.
- **Context:** Need a stable, well-documented foundation; Parashari is the most standardized. See `granth-list.md`, `rule-priority-policy.md`.
- **Consequence:** Engine ships Parashari base first; Jaimini layered later. KP/Nadi deferred.
- **Status:** `ACCEPTED`

### D-02 — Lal Kitab remedy-only
- **Date:** Phase 31
- **Decision:** Lal Kitab is used for **remedies only** in this phase, not prediction rules.
- **Context:** Remedies are lower-risk and premium-eligible; Lal Kitab prediction tables are contested.
- **Status:** `ACCEPTED`

### D-03 — No raw datasets committed
- **Date:** Phase 31
- **Decision:** Astro-Databank, TkAstroDb, rodata, and any identifiable birth data are never committed.
- **Context:** PII + copyright/licensing risk (L-02, L-03). Datasets are `USE_WITH_CAUTION` developer-local references only.
- **Status:** `ACCEPTED`

### D-04 — No live scraping
- **Date:** Phase 31
- **Decision:** We do not build or recommend live scraping of horoscope sites.
- **Context:** ToS, rate-limit, freshness, and legal risk (L-04).
- **Status:** `ACCEPTED`

### D-05 — Separate PII from chart math
- **Date:** Phase 31
- **Decision:** Do not mask coordinates; instead separate PII (identity/contact) from chart math (longitudes/rashi/houses) and store PII encrypted, linked by opaque id.
- **Context:** Masking coordinates corrupts calculation accuracy; separation preserves both privacy and math.
- **Status:** `ACCEPTED`

### D-06 — Synthetic validation only (committed)
- **Date:** Phase 31
- **Decision:** Only synthetic dummy charts are committed as test fixtures. Opt-in user data stays private/encrypted; public datasets stay local.
- **Status:** `ACCEPTED`

### D-07 — Health → doctor first
- **Date:** Phase 31
- **Decision:** Every health-domain prediction must state "consult a licensed medical doctor first" and never be diagnostic.
- **Status:** `ACCEPTED`

### D-08 — Remedies/gemstones premium-only + disclaimer
- **Date:** Phase 31
- **Decision:** Remedies and gemstones are premium features with disclaimers; no fear-based selling pressure.
- **Status:** `ACCEPTED`

### D-09 — Never-LLM runtime
- **Date:** Phase 31
- **Decision:** The Prediction Engine is deterministic and never calls an LLM/OpenAI/fetch/http at runtime. LLM research output (Google AI Steps 1–5) is brainstorm reference only.
- **Context:** Enforced structurally by `qa:prediction:arch`.
- **Status:** `ACCEPTED`

### D-10 — Uncertain licenses → LEGAL_REVIEW_REQUIRED
- **Date:** Phase 31
- **Decision:** Any source with unclear license is tagged `LEGAL_REVIEW_REQUIRED` and must be cleared in this log before reuse.
- **Status:** `ACCEPTED`
