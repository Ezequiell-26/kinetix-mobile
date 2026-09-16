# KinetixFitt database instructions

Apply to Prisma schema, migrations, data access and persistence changes.

## Source of truth

Inspect the current schema and migration history before changing models. Never invent relations or fields.

## Safe migration protocol

`schema change → migration → compatibility review → ephemeral migration test → affected integration tests → rollback analysis`

Never edit or delete an old production migration to repair history. Prefer additive, backward-compatible changes.

## Data integrity

Review indexes, uniqueness, nullability, foreign keys, cascading, transaction boundaries, connection pooling and concurrent writes.

## Query quality

Check query count, pagination, indexes and N+1 risk. Do not trade correctness for micro-optimizations without measurement.

## Verification

A schema compiling is not enough. Validate migration behavior against a real test database when possible and keep data-loss risk explicit.
