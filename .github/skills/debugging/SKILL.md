# KinetixFitt — Systematic Debugging Skill

## Purpose
Diagnose the real cause of failures instead of patching symptoms.

## Workflow
`OBSERVE → REPRODUCE → LOCALIZE → HYPOTHESIZE → FALSIFY → FIX → REGRESSION TEST → BROAD VERIFY`

## Evidence
Capture the exact error, stack, route, input class, environment, commit and reproduction conditions. Distinguish product bug, test bug, environment issue, flaky/concurrency issue and external dependency failure.

## Rules
- Change one causal variable at a time when practical.
- Prefer the smallest fix that explains the observed failure.
- Search for the same failure pattern elsewhere after fixing it.
- Do not mask symptoms with retries, catch-all handlers, disabled checks or arbitrary delays.
- Do not rewrite a subsystem until the evidence shows the subsystem itself is the cause.

## Verification
Add a regression test when practical, rerun affected checks and review the diff for unrelated changes.