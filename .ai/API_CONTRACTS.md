# KinetixFitt API Contracts

This is the canonical contract checklist for every HTTP API route. The implementation remains the source of truth until an OpenAPI schema and contract tests are generated from it.

## Required contract fields

Every production route must document:

- Method and path
- Authentication requirement
- Allowed roles
- Resource ownership rule
- Request schema (Zod or equivalent)
- Response schema
- Error codes and HTTP status meanings
- Rate-limit policy
- Idempotency requirement
- Timeout/retry behavior for external providers
- Sensitive-data handling
- Audit/observability event where applicable
- Tests covering success, validation failure, authorization failure, and provider failure

## Contract rules

1. Do not change a public response shape without an explicit migration.
2. Never trust client-provided ownership or role fields.
3. Authorization must be checked before returning resource data.
4. Validation belongs at the HTTP boundary; internal functions may assume validated types only when their contract states this.
5. External provider errors must be normalized into stable application errors.
6. Mutating endpoints that can be retried must define idempotency semantics.
7. File/upload endpoints must validate both identity and resource ownership.

## Required route inventory fields

When a route is added or changed, update the generated/evidence registry with: route, owner, auth, roles, schema, mutation/read behavior, side effects, idempotency, external dependencies, tests, and last verification commit.

## Contract-test minimum

For critical routes, tests must cover:

```text
valid request -> expected response
invalid request -> 4xx + stable error shape
unauthenticated -> 401
wrong role -> 403
foreign resource -> 403/404 according to contract
provider timeout/429/5xx -> normalized failure
retry of mutation -> no duplicate side effect
```
