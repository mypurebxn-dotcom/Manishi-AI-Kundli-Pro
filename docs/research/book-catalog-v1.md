# Book Catalog v1 — Classical Jyotish Texts (Metadata Only)

> Phase 31 · Research Source Registry
> Status: **METADATA ONLY** — this is a discovery index, not a content archive.
> **No book content, PDFs, scans, or verbatim translation text is stored here.**
> All book content remains forbidden in this repo (see `legal-risk-register.md`).

## Purpose

A structured metadata catalog of the classical texts referenced in
`granth-list.md`, for use in tracing rule implementations to their sources.
Every field is **metadata** (title, author, scope, license status). No content
is extracted or quoted.

## Catalog

| ID | Title | Author/Attribution | School | Phase-31 Scope | Reference Topic | License Status | Content in repo? |
|---|---|---|---|---|---|---|---|
| BK-01 | Brihat Parashara Hora Shastra (BPHS) | Sage Parashara | Parashari | Primary | Rashi, bhava, lordship, yogas, Vimshottari dasha, aspects | Sanskrit: public domain. Modern translations: copyrighted. `LEGAL_REVIEW_REQUIRED` for any specific translation. | NO |
| BK-02 | Brihat Jataka | Varahamihira | Parashari | Primary | Rashi/bhava definitions, avasthas, planetary combinations | Sanskrit: public domain. Translations vary. `LEGAL_REVIEW_REQUIRED`. | NO |
| BK-03 | Phaladeepika | Mantreswara | Parashari | Primary | Bhava/phala interpretation, yogas, dasha phala | Principles referenceable; no verbatim text. | NO |
| BK-04 | Saravali | Kalyanavarman | Parashari | Primary | Detailed planetary placements and yogas | `LEGAL_REVIEW_REQUIRED` for specific translations. | NO |
| BK-05 | Uttara Kalamrita | Kalidasa | Parashari | Primary | Lordship significations (karakatwa) reference | Principles referenceable. | NO |
| BK-06 | Jaimini Sutras | Sage Jaimini | Jaimini | Supporting | Karakamsa, Arudha, Chara dasha, Raja yoga (Jaimini) | Principles referenceable; translations `LEGAL_REVIEW_REQUIRED`. | NO |
| BK-07 | Lal Kitab | Various attributions | Lal Kitab | Remedy-only | Remedies / upayas only (gem, daan, anushthan) | `LEGAL_REVIEW_REQUIRED` for any specific published edition. | NO |

## Out-of-Scope (noted for future phases — not in catalog)

| School | Texts | Future Status |
|---|---|---|
| KP | K.S. Krishnamurti readers/publications | Separate advanced module. |
| Nadi | Nadi literature (various traditions) | Premium-only advanced. |

## Rules

1. This catalog records **metadata only** — title, author, school, scope, license.
2. No book content is ever stored in this repo.
3. No copyrighted translation text is quoted anywhere.
4. When a rule is implemented, its `evidence[].reference` points to a catalog
   ID + chapter/topic (e.g., `"BK-01: BPHS, Ch. on Bhava"`), never to quoted text.
5. License status must be `LEGAL_REVIEW_REQUIRED` unless explicitly cleared in
   `decision-log.md`.

## Cross-references

- Full text descriptions: `granth-list.md`
- License/usage status: `source-inventory.md`
- Legal risks: `legal-risk-register.md`
- Book data folder policy: `data/research/books/README.md`
