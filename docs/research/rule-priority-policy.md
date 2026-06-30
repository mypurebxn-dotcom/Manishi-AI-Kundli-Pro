# Rule Priority Policy

> Phase 31 · Research Source Registry
> Defines the precedence, weighting, and conflict policy for the Prediction Engine rule library.

## School Priority (what overrides what)

| Priority | School | Role | Notes |
|---|---|---|---|
| 1 (highest) | **Parashari** | Primary foundation | Rashi, bhava, lordship, Vimshottari dasha, yogas, aspects. The base layer. |
| 2 | **Jaimini** | Supporting overlay | Karaka (Atma/Amrita/etc.), Arudha, Chara dasha. Layered **after** Parashari base; never overrides a strong Parashari signal alone. |
| 3 | **Lal Kitab (remedy-only)** | Remedies only | No prediction weight; informs remedy/upaya suggestions only. |
| — (out of scope) | **KP** | Separate advanced module | Not in the Phase-31 engine. Future `kp` category. |
| — (out of scope) | **Nadi** | Premium-only advanced | Not in the Phase-31 engine. Future `nadi` category. |

## Category Weights (default guidance for rule authors)

These are **defaults only**. Each rule's `weight` (0..1) is set at registration
and may be tuned via validation. Categories:

| Category | Default weight band | Rationale |
|---|---|---|
| `lordship` | 0.5–0.8 | Functional benefic/malefic lordship is the core Parashari driver. |
| `bhavesh` | 0.5–0.7 | House-lord placement sets the domain of life. |
| `yoga` | 0.4–0.7 | Yogas (Raja, Dhana, etc.) are high-signal but need lordship context. |
| `dasha` (maha/antar/pratyantar) | 0.3–0.5 | Timing modulator, not a standalone prediction. |
| `dosha` | 0.4–0.6 | Affliction markers; always paired with evidence + remedy pointer. |
| `transit` | 0.2–0.4 | Gochar modulates standing predictions; weakest standalone signal. |
| `jaimini` | 0.3–0.5 | Supporting; never a sole trigger for a high-stakes prediction. |
| `meta` / `legacy` | 0.0–0.2 | Plumbing/adapter rules; no direct confidence contribution. |

## Execution Order (engine-level)

Determined by the Rule Engine Core (`backend/prediction/rule-engine.js`):

1. **Topological by `requires[]`** (dependencies run first).
2. **Priority ascending** (lower numeric priority runs first).
3. **Stable tie-break by `id` ascending.**

`weight` does **not** affect execution order — it affects only confidence
blending in `evidence/confidence-score.js`.

## Conflict Policy

When two triggered rules disagree (declared via `conflictsWith`):

- Both remain in `triggered_rules[]` (no silent suppression).
- The pair is recorded in output `conflicts[]`.
- `evidence/contradiction-detector.js` lowers overall confidence.
- A prediction touching **health, finance, or legal life events** must resolve
  conflicts before any "final" output is unlocked (never auto-resolved).

## Prediction-Domain Safety Tiers

| Domain | Constraint |
|---|---|
| **Health** | Must always say "consult a licensed medical doctor first." Never diagnostic. |
| **Finance/Legal** | Must carry "for entertainment/reflection only" + disclaimer; no guarantees. |
| **Remedy / Gemstone** | **Premium-only** with disclaimer; never fear-based pressure. |
| **General life** | Evidence-gated; no 100% claims; no fear language. |

## No-Override Rules (hard constraints)

These can never be overridden by any rule:

1. A prediction is never generated from an LLM call (enforced by `qa:prediction:arch`).
2. No rule emits fear-based language or pressure to buy remedies.
3. No rule claims 100% certainty.
4. No rule outputs a medical diagnosis.
