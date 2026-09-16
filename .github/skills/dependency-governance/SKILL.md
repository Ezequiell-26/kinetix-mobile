# KinetixFitt — Dependency Governance Skill

## Purpose
Prevent dependency sprawl, accidental incompatibility and unsafe upgrades during continuous AI-assisted development.

## Before adding/upgrading
Search existing package manifests and lockfiles for equivalent functionality. Verify the exact package, version, license, maintenance, security advisories, transitive dependencies, bundle/runtime cost and platform compatibility.

## Rules
- One canonical dependency for one concern unless an ADR justifies multiple.
- Do not opportunistically upgrade unrelated packages.
- Do not update several major frameworks in the same change unless required and separately tested.
- Keep root and app lockfiles consistent with their actual package boundaries.
- Remove unused dependencies only after reference/build verification.

## Validation
Run install/lockfile validation, typecheck, lint, relevant tests and affected builds. For native dependencies also validate target platform compatibility.

## AI rule
Never invent package APIs or assume a package is compatible because its name sounds correct. Read its actual installed/versioned API or authoritative documentation.