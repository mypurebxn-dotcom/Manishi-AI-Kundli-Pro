# User Rules — Data Folder

> Phase 31 · Research Source Registry
> Status: **EMPTY BY POLICY.** Opt-in user-supplied rules are never committed.

## What lives here

**Nothing is committed here.** This folder documents the policy for
user-supplied rule data. User rules live only in the user's own private,
encrypted store at runtime — never in the repository.

## Policy

- User-provided rule definitions / corrections require **explicit opt-in**
  before they are stored or used.
- Stored user data is **encrypted at rest**, with PII separated from chart
  math (see `docs/research/validation-methodology.md`).
- No user data is ever committed to the repository.
- User rules may only **augment** confidence within the framework's contract —
  they cannot override the never-LLM / no-fear / no-100% hard constraints in
  `docs/research/rule-priority-policy.md`.

## Forbidden

- ❌ Committing any real user's rule data or birth chart.
- ❌ Identifying a real user in any committed artifact.

See `docs/research/decision-log.md` (D-05, D-06) and
`docs/research/legal-risk-register.md` (L-03, L-09).
