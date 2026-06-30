# Validation Methodology

> Phase 31 · Research Source Registry
> How rules are validated **before** earning weight/confidence in production.

## Core Principle

Validation uses **synthetic dummy charts** and **explicit opt-in user data
only**. No real identifiable birth data is ever committed or used to identify a
real person in any stored artifact.

## Validation Tiers

| Tier | Data | Purpose | Commit policy |
|---|---|---|---|
| **T1 — Synthetic** | Hand-authored dummy charts with known expected outcomes. | Unit-test rule triggers/weights deterministically. | ✅ Synthetic fixtures may be committed (dummy names, fake dates). |
| **T2 — Developer-local reference** | Developer's own private copy of public datasets (Astro-Databank, TkAstroDb). | Cross-check rule outputs. | ❌ Never committed. Held locally only. Marked `USE_WITH_CAUTION`. |
| **T3 — Opt-in user** | Real user charts, **explicit opt-in** only. | Real-world accuracy over time. | ❌ Never committed. Stored privately/encrypted; PII separated from chart math (see Privacy below). |

## Synthetic Dummy Chart Convention

Fixtures live in `data/research/validation-charts/` and follow these rules:

- Fictional names (e.g., "Test User A", "Demo Chart 1").
- No real birth dates / locations of identifiable people.
- Each fixture includes: `id`, `lagna`, `planets[]`, `houses[]`, `dasha`, and
  an `expected[]` list of rule ids that should trigger (deterministic assertion).
- These are the **only** validation data committed to the repo.

See `data/research/validation-charts/README.md`.

## Privacy Model (Correction #5)

Do **not** mask coordinates for calculation records. Instead:

- **Separate PII from chart data.** Chart math (longitudes, rashi, houses) is
  non-identifying and may be processed/stored for prediction.
- **PII** (name, exact DOB/time, birthplace, contact) is stored **separately**,
  encrypted at rest, and linked to the chart only by an opaque id.
- Calculation records (the math) can be retained for accuracy work without
  retaining the human identity behind them.

## Accuracy Scoring

For T1 synthetic charts, each rule's accuracy is measured as:

- **Trigger correctness:** did the expected rule ids fire?
- **Weight sanity:** is the blended confidence within the expected band?
- **Conflict surface:** are expected conflicts surfaced, not hidden?

Tuning decisions are recorded in `decision-log.md`.

## What Validation Never Does

- ❌ Never uses real identifiable charts as committed fixtures.
- ❌ Never reports a real person's name/details in any stored test output.
- ❌ Never treats Astro-Databank / TkAstroDb as production-truth (they are
  `USE_WITH_CAUTION` developer references only).
- ❌ Never scrapes live data (see `research-workflow.md`).
