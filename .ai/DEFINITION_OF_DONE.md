# KinetixFitt — Definition of Done

**Version:** 3.0.0  
**Status:** Mandatory  
**Purpose:** prevent incomplete, unverified, or regression-prone work from being treated as finished.

## 1. A TASK IS NOT DONE BECAUSE CODE EXISTS

A task is complete only when the relevant behavior is implemented, integrated, verified, and documented.

Minimum chain:

`IMPLEMENT → INTEGRATE → TEST → BUILD → REVIEW → VERIFY`

## 2. UNIVERSAL CHECKLIST

### Implementation
- [ ] Existing implementation was searched before creating a new one.
- [ ] No unnecessary duplicate system was introduced.
- [ ] Files actually exist and contain the intended implementation.
- [ ] Imports/exports compile.
- [ ] No unrelated functionality was removed.

### Integration
- [ ] UI/API/domain/data boundaries are respected.
- [ ] All known consumers were checked.
- [ ] Shared contracts/types were updated where necessary.
- [ ] Database changes use tracked migrations.
- [ ] External integrations use the real server-side flow when claimed as real.

### Correctness
- [ ] Happy path works.
- [ ] Empty state works.
- [ ] Loading state works.
- [ ] Error state works.
- [ ] Invalid input is handled.
- [ ] Important edge cases are handled.
- [ ] No known regression remains.

### Security
- [ ] Inputs are validated.
- [ ] Server-side authorization is enforced.
- [ ] Secrets are not exposed.
- [ ] Sensitive logs are avoided.
- [ ] Webhooks are verified where applicable.
- [ ] Cross-user/cross-trainer access tests pass where applicable.

### Persistence
- [ ] Data survives refresh when expected.
- [ ] Data survives logout/login when expected.
- [ ] Source of truth is the intended database/service.
- [ ] No fake in-memory or local-only success path is presented as production behavior.

### Quality
- [ ] Lint passes for affected project(s).
- [ ] Typecheck passes for affected project(s).
- [ ] Relevant tests pass.
- [ ] Security tests pass for security-sensitive changes.
- [ ] Build passes.
- [ ] E2E passes for affected critical user journeys when applicable.

### UX / Accessibility
- [ ] Responsive behavior verified.
- [ ] Keyboard/focus behavior verified where applicable.
- [ ] Accessible labels/semantics are present.
- [ ] Motion does not block usability.
- [ ] Existing KinetixFitt design system is respected.

### Performance
- [ ] No obvious N+1 queries introduced.
- [ ] No unnecessary client-side work introduced.
- [ ] Heavy features are lazy loaded where appropriate.
- [ ] No obvious memory/resource leak introduced.
- [ ] Meaningful performance changes were measured where applicable.

### Documentation
- [ ] User-facing documentation updated if behavior changed.
- [ ] `.ai/PROJECT_STATE.md` updated for material architectural/state changes.
- [ ] Relevant contract updated.
- [ ] ADR added for architectural decisions.

## 3. HIGH-RISK CHANGE GATES

### Auth / Security
Require dedicated auth/security tests and regression coverage.

### Database
Require migration review, compatibility review, and DB integration testing.

### Payments
Require provider verification, webhook tests, idempotency tests, and persisted state verification.

### Storage
Require authorization, file validation, private access, and lifecycle tests.

### API
Require contract tests and consumer review.

### Native / Platform
Require platform-specific verification for affected targets.

## 4. RELEASE-BLOCKING CONDITIONS

A task or release is NOT complete when any applicable condition exists:

- known critical security issue;
- data-loss risk;
- broken production build;
- failing required test;
- failing required deployment;
- unauthorized data access;
- fake production integration presented as real;
- untracked/destructive database change;
- committed secret;
- unresolved incompatible API/schema change.

## 5. BUG FIX RULE

Every critical bug follows:

`REPRODUCE → FIX → REGRESSION TEST → RE-VERIFY`

A fix without a regression test is incomplete when automated regression coverage is feasible.

## 6. FEATURE RULE

Every new feature must identify:

- owner/domain;
- data source;
- auth requirements;
- persistence requirements;
- failure behavior;
- test strategy;
- rollback considerations if risky.

## 7. COMPLETENESS LEVELS

### COMPLETE
All applicable criteria are verified.

### PARTIAL
Useful implementation exists but one or more required verification/integration criteria remain.

### BLOCKED_EXTERNAL
Code is ready but requires external credentials, provider setup, device testing, store approval, or another dependency outside the repository.

### BROKEN
Behavior exists but fails required validation or runtime expectations.

### NOT_IMPLEMENTED
No meaningful implementation exists.

## 8. EVIDENCE STANDARD

A completion claim should point to concrete evidence:

- command result;
- test result;
- build result;
- deployment/preview result;
- file/diff reviewed;
- documented external limitation.

Do not infer successful runtime behavior merely because TypeScript compiles.

## 9. FINAL SIGN-OFF

Before declaring COMPLETE:

```text
[ ] Implementation
[ ] Integration
[ ] Correctness
[ ] Security
[ ] Persistence
[ ] Tests
[ ] Build
[ ] UX/A11y
[ ] Performance
[ ] Documentation
[ ] Diff reviewed
[ ] No known blocker
```

**Honest PARTIAL is always preferable to false COMPLETE.**
