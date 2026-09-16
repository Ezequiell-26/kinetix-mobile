# KinetixFitt — Test & Regression Skill

## Purpose

Prove behavior independently from the implementation so that future AI changes cannot silently remove working functionality.

## Workflow

`REPRODUCE → CHARACTERIZE → TEST → FIX → RE-RUN → EXPAND`

## Test selection

Use the smallest test that can falsify the current hypothesis first, then escalate to broader checks.

- pure logic: unit;
- domain: unit + integration;
- API: API/integration;
- auth/authorization/storage/payments: security + integration;
- critical UX: E2E;
- migration: ephemeral database migration test;
- native: target platform smoke/build;
- performance: benchmark/regression measurement.

## Test quality

Tests must verify observable behavior and important invariants, not merely implementation details.

A generated test is not automatically trustworthy. Ask whether the same hidden assumption was used to create both code and test.

## Regression corpus

Every important fixed bug should produce a reusable regression case. Include edge cases from previous failures, not only the happy path.

## Failure handling

Never delete or weaken a failing test just to make the repository green.

When a test fails, classify the cause:

`PRODUCT BUG | TEST BUG | ENVIRONMENT ISSUE | FLAKY/CONCURRENCY | EXTERNAL DEPENDENCY`

Then address the real cause.
