# KinetixFitt — Architecture Safety Skill

## Purpose
Preserve architectural coherence while continuously evolving the product.

## Before change
- Map the affected dependency graph.
- Search for existing implementations and public contracts.
- Identify canonical boundaries for auth, API clients, state, storage, AI, payments and notifications.
- Determine whether web/mobile/native/server share the changed code.
- Identify migration, deployment and rollback implications.

## Rules
- Prefer additive, incremental changes.
- Do not introduce parallel systems without an ADR.
- Do not move files or rename public contracts casually.
- Do not couple product domains directly to provider-specific SDK objects.
- Keep browser-only, server-only and native-only code behind explicit boundaries.
- Preserve stable interfaces while implementation evolves.

## Validation
Review imports/exports, dependency direction, cycles, package boundaries, runtime compatibility and affected consumers before approval.

## Output
State the architectural decision, affected boundaries, preserved contracts, migration needs and rollback path.