# Runtime Verification Skill

Use this skill for UI changes, critical journeys, provider integrations, platform-specific behavior, and changes that cannot be proven by static analysis.

## Verification ladder

1. Static audit and typecheck.
2. Focused unit/contract tests.
3. Build the affected application.
4. Start the real application server.
5. Exercise the critical user journey with a real browser/device harness.
6. Capture console/network/runtime failures.
7. Repeat on the affected viewport/platform where practical.
8. Record evidence and leave unsupported states as `UNKNOWN` or `BLOCKED_EXTERNAL`.

## Browser checks

For web/PWA work, verify at least:

- page loads without uncaught console errors;
- expected navigation and primary controls are present;
- no horizontal overflow at mobile widths;
- loading, empty, error, and success states render;
- network failures do not leave the UI permanently stuck;
- authenticated routes reject unauthenticated access;
- critical mutations show a deterministic result.

Do not claim visual correctness from source inspection alone.
