# KinetixFitt API instructions

Apply to API routes, server actions, controllers and backend integration code.

## Boundary contract

Every endpoint must have:

`input validation → authentication → authorization → domain logic → persistence/external call → stable response → safe error handling`

## Ownership

Never trust client-supplied userId, trainerId, clientId, role, ownership, plan, price or subscription state.

## Reliability

For external calls implement bounded timeout, retry only when safe, backoff, idempotency where required and explicit failure behavior.

## Response safety

Never return password hashes, session secrets, provider credentials or unnecessary private fields.

Keep error responses predictable and avoid leaking internal implementation details.

## Compatibility

Before changing a contract, search every known consumer and tests. Prefer additive changes or versioned compatibility over breaking replacements.

## Verification

Add success, validation, authorization-denied and dependency-failure coverage for critical endpoints.
