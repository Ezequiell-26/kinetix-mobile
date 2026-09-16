# Change Governance Skill

Use this skill before editing KinetixFitt.

## Procedure

1. Read `.ai/AI_CONTROL_CENTER.md`, `.ai/AI_ENGINEERING_SYSTEM.md`, and `.ai/AI_AGENT_HANDOFF.md`.
2. Run `npm run ai:audit:json` and inspect the affected domain.
3. Read `.ai/CHANGE_MANIFEST.json` and update it before expanding scope.
4. Search for existing implementations before adding new files, hooks, services, adapters, or routes.
5. Identify high-risk paths: auth, authorization, Prisma/migrations, payments, uploads/storage, middleware, secrets, and security tests.
6. Keep the change inside the declared scope. If scope expands, update the manifest and explain why.
7. Run the smallest relevant checks first, then the full verification ladder required by the control center.
8. Re-run `npm run ai:evidence:compare` and review the diff for accidental deletions or unrelated changes.

## Required final record

Report: base commit, changed surfaces, preserved behavior, tests run, build state, runtime state, security state, performance evidence, external dependencies, known unknowns, rollback, and final commit SHA.

## Prohibited shortcuts

- Do not treat compilation as runtime proof.
- Do not mark a feature complete from source inspection alone.
- Do not silently change public API contracts.
- Do not add an external integration without license/security/compatibility review.
- Do not weaken a gate simply to obtain a green build.
