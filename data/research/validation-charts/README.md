# Validation Charts — Data Folder

> Phase 31 · Research Source Registry
> Status: **Synthetic dummy charts only.** No real or identifiable data.

## What lives here

Only **synthetic dummy validation charts** may be committed here. These are
hand-authored fixtures with fictional identities used to unit-test rule
triggers deterministically.

## Fixture rules

Each committed fixture must:

- Use a **fictional** name (e.g., "Test User A", "Demo Chart 1").
- Use **no** real birth date/time/place of an identifiable person.
- Include: `id`, `lagna`, `planets[]`, `houses[]`, `dasha`, and an
  `expected[]` list of rule ids that should trigger.
- Be deterministic (same input → same expected triggers).

## Forbidden in this folder (and the whole repo)

- ❌ Real identifiable birth charts (names, exact DOB/time/place of real people).
- ❌ Raw dumps from Astro-Databank / TkAstroDb / rodata (always `USE_WITH_CAUTION`,
  developer-local only — never committed).
- ❌ Scraped horoscope data.

## Privacy model

See `docs/research/validation-methodology.md` and `docs/research/decision-log.md`
(D-03, D-05, D-06). User data (when used at all) requires **explicit opt-in**
and is stored privately/encrypted, separated from chart math — never committed.
