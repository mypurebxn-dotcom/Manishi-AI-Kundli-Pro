# GitHub Repositories — Reference Catalog

> Phase 31 · Research Source Registry
> Status: **REFERENCE_ONLY** — pointers for study. We do **not** vendor or copy code blindly.

## Policy

- These repos are studied for **algorithmic approach and structure only**.
- No code is copied into this repository without (a) license check and
  (b) explicit approval in `decision-log.md`.
- Where a license is uncertain, the entry is tagged `LEGAL_REVIEW_REQUIRED`.
- Astronomy/ephemeris libs are acceptable as dependencies; **prediction rule
  packs from other apps are NOT** copied — we reimplement from first principles
  (Parashari primary, Jaimini supporting) and cite classical sources.

## Astronomy / Ephemeris (calculation layer)

| Repo | License | Status | Use |
|---|---|---|---|
| `astrorigin/swisseph` (Swiss Ephemeris C) | GPL/AGPL + commercial dual | `IMPLEMENTABLE` | Reference for ephemeris accuracy; we already use it via `swe_bridge.py`. |
| `aloistr/swisseph` (Python wheel mirror) | GPL | `LEGAL_REVIEW_REQUIRED` | Packaging reference only; not vendored. |
| `OpenAI?` — N/A | — | — | Not used. |

## Astrology Engine References (study only)

> ⚠️ Many astrology repos on GitHub mix public-domain classical logic with
> original copyrighted code and unverified rodata. Treat ALL as
> `USE_WITH_CAUTION` for **structure study only**. Do not copy rule tables.

| Repo (area) | License | Status | Notes |
|---|---|---|---|
| General Jyotish calculators (various) | Mixed | `USE_WITH_CAUTION` | Study calculation approaches; **do not copy prediction tables**. |
| KP (Krishnamurti Paddhati) repos | Mixed | `LEGAL_REVIEW_REQUIRED` | KP is a **separate advanced module** (see `rule-priority-policy.md`); out of Phase-31 scope. |
| Nadi astrology repos | Mixed | `LEGAL_REVIEW_REQUIRED` | Nadi is **premium-only** and advanced; out of Phase-31 scope. |
| Lal Kitab remedy repos | Mixed | `LEGAL_REVIEW_REQUIRED` | Lal Kitab = **remedy-only** approved scope; prediction rules not copied. |
| Databank/rodata repos | Mixed | `USE_WITH_CAUTION` | Real PII. See `source-inventory.md` — never committed. |

## Specific Repository Inventory (Phase-31 additions)

Three repositories cataloged during Phase-31 research. Classification key:

| Class | Meaning |
|---|---|
| **A** | Reference — architecture/features checklist only. Inspect, no code copy, no dependency. |
| **B** | Research Inventory — book/source discovery only. Metadata only, no PDFs/content copied. |
| **C** | Specific Reference — regional/technique reference. Verify copyright of any bundled material. |

### 1. `ayushman1024/ASTROLOGY-BOOKS-DATABASE`

- **URL:** https://github.com/ayushman1024/ASTROLOGY-BOOKS-DATABASE.git
- **Classification:** **B — Research Inventory**
- **Use:** Book / source discovery only (catalog of titles to trace in `granth-list.md`).
- **Risk:** Copyright risk — **metadata only**, no PDFs/content copied into this repo.
- **Status:** `LEGAL_REVIEW_REQUIRED` (license of the catalog itself and any linked content unclear).
- **Action rule:** Use to discover titles; never clone its content into the workspace.

### 2. `kirankn/panchanga`

- **URL:** https://github.com/kirankn/panchanga.git
- **Classification:** **C — Specific Reference**
- **Use:** Panchanga / Muhurta / **Kannada regional** reference (calendar-element approach).
- **Risk:** Verify copyright of any bundled PDFs/books; **not prediction core**.
- **Status:** `LEGAL_REVIEW_REQUIRED` (potential bundled copyrighted material).
- **Action rule:** Study panchanga element computation only; do not copy bundled media/text.

### 3. `master12coder/daiv-ai`

- **URL:** https://github.com/master12coder/daiv-ai.git
- **Classification:** **A — Reference**
- **Use:** Architecture / features checklist only (compare module boundaries, UX structure).
- **Risk:** **AGPL-3.0** — inspect only, **no code copy**, **no dependency**.
- **Status:** `LEGAL_REVIEW_REQUIRED` (AGPL-3.0 is strong copyleft; any reuse is infectious).
- **Action rule:** Read for ideas; never import code, never add as a dependency.

> ⚠️ All three remain `LEGAL_REVIEW_REQUIRED`. None is adopted as a dependency
> or copied into this repo. They are pointers for **study and discovery only**,
> recorded here for traceability per `research-workflow.md`.

## Evaluation Checklist (before adopting any reference)

1. License read and recorded in `decision-log.md`.
2. Origin of any rule logic traced to a classical text in `granth-list.md`.
3. No verbatim copyrighted code or text imported.
4. No identifiable birth data imported.
5. Reimplementation plan written (we reimplement, not vendor).

## Result

No GitHub repo is a current dependency for **prediction logic**. All prediction
rules are reimplemented from classical principles and validated via the
synthetic-chart methodology in `validation-methodology.md`.

## Repository Classification Policy

Repository classifications are **research metadata only**.

Current classifications are based on:

- publicly available repository contents
- repository documentation
- visible project structure
- license review
- architecture review
- research usefulness

These classifications **MUST NOT be treated as permanent**.

A repository may be **upgraded**, **downgraded**, or **rejected** after a complete technical audit.

### AUDIT STAGES

| Stage | Activity | Status |
|---|---|---|
| Stage 1 | Initial discovery | `PRELIMINARY` Classification |
| Stage 2 | Repository architecture review | `UNDER_REVIEW` |
| Stage 3 | License verification | `LEGAL_REVIEW_REQUIRED` |
| Stage 4 | Code quality review | `UNDER_REVIEW` |
| Stage 5 | Research usefulness review | `UNDER_REVIEW` |
| Stage 6 | Prediction relevance review | `UNDER_REVIEW` |
| Stage 7 | Final classification approval | `FINAL_CLASSIFIED` |

Only after **Stage 7** may a repository receive the status:

```
FINAL_CLASSIFIED
```

### STATUS VALUES

Allowed status values:

- `PRELIMINARY`
- `UNDER_REVIEW`
- `LEGAL_REVIEW_REQUIRED`
- `APPROVED`
- `REJECTED`
- `FINAL_CLASSIFIED`

### IMPORTANT NOTE

Current A/B/C ratings inside this document represent **PRELIMINARY** research classifications only.

They are **NOT permanent**.

Future evidence may change:

- usefulness
- priority
- legal status
- architecture value
- implementation value
