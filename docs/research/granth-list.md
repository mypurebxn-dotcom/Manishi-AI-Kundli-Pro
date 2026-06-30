# Granth List — Classical Jyotish Texts

> Phase 31 · Research Source Registry
> Status: **REFERENCE_ONLY** — pointers to the classical literature we cite.
> **No copyrighted translations, scans, or verbatim text are stored in this repo.**

## Scope Priority

| School | Role | Phase-31 scope |
|---|---|---|
| **Parashari** | **Primary** | ✅ Foundation for rule engine. |
| **Jaimini** | **Supporting** | ✅ Secondary techniques (karaka, arudha) layered after Parashari base. |
| **Lal Kitab** | **Remedy-only** | ✅ Remedies only; no prediction rules from Lal Kitab in this phase. |
| **KP (Krishnamurti)** | Separate advanced module | ⏸ Not in Phase 31. See `rule-priority-policy.md`. |
| **Nadi** | Premium-only advanced | ⏸ Not in Phase 31. See `rule-priority-policy.md`. |

## Primary Texts (Parashari)

| Granth | Author/Era | Reference scope | License note |
|---|---|---|---|
| Brihat Parashara Hora Shastra (BPHS) | Sage Parashara | Foundation: rashi, bhava, lordship, yogas, dasha (Vimshottari), aspects. | Sanskrit public domain; **modern translations copyrighted** → cite principles, not translation text. |
| Brihat Jataka | Varahamihira | Rashi/bhava definitions, avasthas, planetary combinations. | Sanskrit public domain; translation licenses vary → `LEGAL_REVIEW_REQUIRED` for any specific English translation. |
| Phaladeepika | Mantreswara | Bhava/phala interpretation, yogas, dasha phala. | Principles referenceable; no verbatim text. |
| Saravali | Kalyanavarman | Detailed planetary placements and yogas. | `LEGAL_REVIEW_REQUIRED` for specific translations. |
| Uttara Kalamrita | Kalidasa | Lordship significations (karakatwa) reference. | Principles referenceable. |

## Supporting Texts (Jaimini)

| Granth | Author/Era | Reference scope | License note |
|---|---|---|---|
| Jaimini Sutras | Sage Jaimini | Karakamsa, Arudha, Chara dasha, Raja yoga (Jaimini). **Supporting only.** | Principles referenceable; translations `LEGAL_REVIEW_REQUIRED`. |

## Remedy Texts (Lal Kitab — remedy scope only)

| Granth | Scope | License note |
|---|---|---|
| Lal Kitab | **Remedies only** (upayas): gem/ratna, daan, anushthan disclaimers. | `LEGAL_REVIEW_REQUIRED` for any specific published edition. |

## Out-of-Scope Texts (noted for future phases)

| School | Texts | Future status |
|---|---|---|
| KP | Readers / publications of K.S. Krishnamurti | Separate advanced module. |
| Nadi | Nadi Nadi literature (various traditions) | Premium-only advanced. |

## Citation Rule

Every implemented rule should trace its principle to one of these texts and
record the citation in the rule's `evidence[].reference` field. Citations are
**text pointers** (e.g., "BPHS, Ch. on Bhava") — never quoted translation text.
