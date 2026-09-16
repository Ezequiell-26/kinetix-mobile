# Contract Testing Skill

Use this skill whenever an API route, shared DTO, schema, database-backed response, or frontend API client changes.

## Required workflow

- Locate the existing route and any equivalent client/service before editing.
- Identify authentication, authorization, ownership, request validation, response shape, and side effects.
- Add or update a deterministic contract test for valid and invalid inputs.
- Add negative authorization coverage for anonymous, wrong-role, and foreign-resource access where relevant.
- For mutations, test retries/idempotency when the operation can be repeated by clients, queues, or webhook delivery.
- For provider-backed routes, test timeout, rate-limit, and provider-failure normalization.
- Run the affected route tests, typecheck, lint, and the relevant E2E journey.

## Contract compatibility

Breaking a response or request contract requires one of:

1. backward-compatible additive change;
2. explicit version/migration path;
3. coordinated client migration with tests proving old clients are handled or intentionally unsupported.

Do not use snapshots as the only contract test for security-sensitive responses; assert the fields and authorization semantics explicitly.
