# KinetixFitt — API Reliability Skill

## Purpose
Keep internal and external API contracts stable, validated and resilient.

## Boundary discipline
Validate request input at the boundary and validate important provider responses before use. Keep canonical response/error shapes.

## Reliability controls
For network-dependent calls use bounded timeouts, cancellation, safe retries with exponential backoff and jitter where appropriate, rate-limit handling, idempotency and provider-aware fallback.

Never retry unsafe non-idempotent operations blindly.

## Compatibility
Before changing a route or payload, search every known consumer. Prefer backward-compatible evolution or explicit versioning.

## Failure handling
Exercise invalid input, unauthorized access, provider timeout, quota exhaustion, malformed response, partial failure and duplicate requests.

## Observability
Capture safe timing, status and correlation information without logging secrets or sensitive payloads.