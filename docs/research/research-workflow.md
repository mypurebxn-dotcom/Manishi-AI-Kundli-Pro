# Research Workflow

> Phase 31 · Research Source Registry
> The disciplined process for turning external research into implementable,
> validated, legally-safe rules.

## Principles

1. **Evidence first.** No rule is implemented without a cited classical source
   (`granth-list.md`) and a validation plan (`validation-methodology.md`).
2. **Reimplement, don't vendor.** We study references for approach, then write
   original logic from first principles. See `github-repos.md`.
3. **Never-LLM runtime.** LLM/AI research output (e.g., Google AI Steps 1–5)
   is a **brainstorm reference only** — never a source of truth, never called
   at runtime (D-09).
4. **Privacy by default.** PII separated from chart math; raw datasets never
   committed; user data opt-in only (D-03, D-05, D-06).

## Workflow (per rule or rule group)

1. **Source & cite** — Record the classical principle in `granth-list.md` and
   attach a citation pointer in the rule's `evidence[].reference`.
2. **License check** — If any modern translation, edition, or repo is involved,
   tag its status in `source-inventory.md` / `legal-risk-register.md`. Clear
   `LEGAL_REVIEW_REQUIRED` items in `decision-log.md` before reuse.
3. **Author the rule** — Register via the Rule Engine Core
   (`backend/prediction/rule.js` + `registry.js`): id, category, priority,
   weight, requires, conflictsWith, validate, evaluate.
4. **Synthetic fixture** — Add a dummy chart + expected triggers in
   `data/research/validation-charts/`. Assert deterministically.
5. **Weight tuning** — Tune `weight` within the band in
   `rule-priority-policy.md`; log the decision in `decision-log.md`.
6. **Safety gate** — Confirm domain constraints (health → doctor first;
   remedies → premium + disclaimer; no 100% claims; no fear language).
7. **Guard** — Ensure `qa:prediction:arch` still passes (architecture,
   contract shape, never-LLM).

## What this workflow forbids

- ❌ Live scraping (D-04).
- ❌ Committing raw datasets / copyrighted text / identifiable charts.
- ❌ Copying rule tables from other apps verbatim.
- ❌ Treating Astro-Databank / TkAstroDb as production truth.
- ❌ Using an LLM call as the prediction source at runtime.

## Reference status flow

```
REFERENCE_ONLY  ──study──▶  (reimplement from principle)
                              │
USE_WITH_CAUTION ──review──▶ LEGAL_REVIEW_REQUIRED ──clear──▶ MITIGATED (decision-log)
                              │ (if not cleared)
                              └─▶ FORBIDDEN (not used)
```
