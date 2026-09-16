# KinetixFitt — AI Evaluation & Anti-Hallucination Protocol

## Purpose

Prevent an AI coding agent from validating its own assumptions without independent evidence.

AI-generated code and AI-generated tests can share the same blind spots. Therefore KinetixFitt uses layered evaluation: deterministic checks, regression tests, adversarial review, runtime verification and human control for high-risk actions.

## Evaluation layers

### Layer 1 — Static grounding

Verify repository structure, symbols, imports/exports, routes, schemas, configuration, dependencies and documentation references.

### Layer 2 — Deterministic quality gates

Run lint, typecheck, unit tests, integration tests, migration checks and builds applicable to the change.

### Layer 3 — Adversarial regression review

A separate review pass attempts to falsify the implementation and searches for unintended side effects.

### Layer 4 — Critical journey tests

Exercise real user journeys such as authentication, coach/athlete ownership boundaries, training execution, progress, messaging, payments, uploads and account lifecycle where implemented.

### Layer 5 — Runtime/provider/device verification

For capabilities depending on external providers, deployment infrastructure or native devices, verify against the real target whenever credentials/environment/device access is available.

### Layer 6 — Production observation

After rollout, monitor errors, latency, resource usage and important state transitions. Production observation is stronger evidence than static inspection but still must be scoped to the observed population/time window.

## Evaluation principles

1. Never allow the implementing agent to be the only evaluator of a high-risk change.
2. Prefer deterministic checks over subjective confidence.
3. Test failure paths, not only success paths.
4. Re-run protected regression suites after fixing a bug.
5. Preserve historical regression cases.
6. Record exact environment and evidence level.
7. Treat flaky tests as an engineering problem, not as a reason to ignore failures.
8. Never inflate confidence when runtime evidence is unavailable.

## Required regression corpus

Maintain cases for:

- login/session lifecycle;
- role isolation;
- cross-trainer authorization;
- client ownership;
- payment webhook authenticity and duplicate delivery;
- upload path/type/size/ownership;
- account deletion boundaries;
- API validation/error shapes;
- database migration compatibility;
- offline stale-write/conflict behavior when implemented;
- critical mobile responsive flows;
- provider timeout/quota/fallback behavior;
- previous production bugs.

## Change-evaluation record

For every substantial AI change record:

```text
CHANGE_ID:
TASK:
RISK_CLUSTER:
INVARIANTS:
PROTECTED_TESTS:
NEW_TESTS:
STATIC_CHECKS:
AUTOMATED_CHECKS:
ADVERSARIAL_REVIEW:
RUNTIME_CHECK:
DEVICE/COVERAGE:
RESULT:
KNOWN_UNVERIFIED:
```

## Confidence rule

Never use percentages such as "99% safe" unless the percentage comes from an explicitly defined, reproducible metric and population.

Prefer factual statements such as:

`E3_AUTOMATED — 42/42 targeted tests passed in CI run <id>`

or:

`E2_STATIC — implementation inspected; external provider not runtime verified.`

## Human-controlled actions

Require explicit human oversight for destructive/irreversible actions, production data modification, secret rotation, financial changes and changes that bypass repository safety controls.

## Anti-self-approval rule

A green test suite is necessary, not sufficient. Review whether the tests actually exercise the claimed behavior and whether the implementation and tests were generated from the same unsupported assumption.
