# KinetixFitt — Database & Migration Safety Skill

## Purpose
Protect production data and schema compatibility while evolving Prisma/PostgreSQL.

## Before editing
Inspect current schema, migration history, indexes, constraints, relations, nullability, uniqueness, cascade behavior, seed behavior, connection pooling and all consumers of changed fields.

## Migration policy
- Never rewrite historical production migrations.
- Prefer additive migrations.
- For risky changes use add → backfill → dual compatibility → switch → cleanup.
- Never add destructive SQL without a data-impact and recovery plan.
- Validate migration ordering against a clean ephemeral database.

## Application compatibility
Code must tolerate both pre-migration and post-migration states when deployment requires it.

## Verification
Run schema generation, migration validation and affected integration tests. Check for N+1 queries, missing indexes and accidental full-table operations.

## Rollback
Document application rollback separately from database rollback. Never assume reverting application code reverses a migration.