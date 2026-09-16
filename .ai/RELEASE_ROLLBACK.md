# Release & Rollback Contract

Every release candidate must identify the application commit and database migration state.

## Required release record

```text
application commit:
database migration range:
web deployment:
mobile build/version:
desktop build/version:
external provider changes:
feature flags:
known unknowns:
rollback commit:
database rollback strategy:
```

## Rollback rules

- Application-only changes should be revertible by commit or redeploying the previous immutable build.
- Database migrations must be evaluated for backward compatibility before release.
- Destructive schema changes require an expand/contract migration strategy or an explicitly documented maintenance window.
- Payment/webhook changes must preserve idempotency across mixed old/new application versions.
- Storage changes must not orphan private assets during rollback.
- Never claim a database rollback is safe unless the migration has been reviewed for reversibility and tested in a disposable database.

## Incident evidence

For a failed release, preserve CI artifacts, runtime logs, commit SHA, migration state, and the exact failing journey before changing code again.
