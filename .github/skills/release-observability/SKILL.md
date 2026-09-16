# KinetixFitt — Release & Observability Skill

## Purpose
Prevent a change from being called finished before repository, deployment and runtime evidence support that claim.

## Pre-release gates
Verify applicable lint, typecheck, unit/integration tests, security tests, migrations, builds, critical E2E, dependency integrity and deployment configuration.

## Post-change review
Inspect the exact diff, branch and commit. Confirm only intended files changed and no safety controls were weakened.

## Runtime verification
For external or device-dependent behavior distinguish static, automated, runtime and production-observed evidence. Never infer deployment success from configuration files.

## Observability
Use safe structured logs, error tracking, timing and state-transition telemetry. Never emit secrets, tokens, passwords or unnecessary private payloads.

## Rollback
For production-sensitive changes record application rollback, database rollback implications, configuration rollback and feature-flag disablement where available.

## Incident rule
If a release introduces unexpected errors, elevated latency, crashes, data anomalies or provider failures, stop feature expansion and investigate the smallest responsible change first.