# KinetixFitt — AI Agent Handoff Protocol

## Purpose

Make every AI session leave durable, machine-readable knowledge for the next agent without treating previous claims as truth.

## Session start

Read:

`AGENTS.md`
`.ai/AI_CONTROL_CENTER.md`
`.ai/AI_ENGINEERING_SYSTEM.md`
`.ai/AI_EVALUATION_PROTOCOL.md`
`.ai/PROJECT_STATE.md`
`.ai/FEATURE_LEDGER.md`
`.ai/INTEGRATION_REGISTRY.md`
`.ai/PERFORMANCE_BASELINES.md`

Run:

`npm run ai:audit:json`

## Session state

Before changing code establish:

```text
BASE_COMMIT
CURRENT_BRANCH
WORKTREE_STATE
TASK
RISK_CLUSTER
KNOWN_GOOD
KNOWN_BROKEN
UNKNOWN
AFFECTED_SURFACES
PROTECTED_TESTS
```

## After change

Record:

```text
CHANGE_SUMMARY
FILES_CHANGED
NEW_BEHAVIOR
PRESERVED_BEHAVIOR
TESTS_RUN
BUILD_RUN
RUNTIME_CHECKS
PERFORMANCE_DELTA
SECURITY_REVIEW
KNOWN_UNKNOWN
ROLLBACK
FINAL_COMMIT
```

## Handoff rules

- Never write speculative completion claims into project state.
- Never erase previous evidence because it is inconvenient.
- Downgrade stale evidence instead of preserving a false green state.
- Preserve links to regression tests and exact commands used.
- Record blockers with a concrete reason and next verification step.

## Context recovery

If the task is interrupted, the next agent must reconstruct state from repository files, Git history, tests and CI rather than relying on conversational memory.
