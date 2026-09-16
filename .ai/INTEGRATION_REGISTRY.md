# KinetixFitt — External Integration Registry

**Purpose:** one canonical inventory for external APIs, SDKs, services and MIT repositories integrated into KinetixFitt.

## Non-negotiable rules

1. Every external dependency must have an owner boundary.
2. Provider-specific payloads must stop at the adapter boundary.
3. Never add the same capability through multiple providers without documenting why.
4. License and commercial-use requirements must be verified before adoption.
5. Runtime capability is not considered verified because an SDK compiles.
6. External failure must degrade safely and must not crash unrelated product domains.
7. Remove credentials, tokens and private endpoints from this registry.

## Verification states

- `DISCOVERED`
- `REVIEWED`
- `INTEGRATED`
- `AUTOMATED_VERIFIED`
- `RUNTIME_VERIFIED`
- `DEPRECATED`
- `REJECTED`

## Registry

| Integration | Kind | Repository/provider | Capability | License | Adapter/boundary | Auth/config | Limits/cost | Timeout/retry | Fallback | Platforms | Security review | Tests | Runtime | Last verified | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

_No external integration is automatically considered verified. Add a row when the integration is actually introduced or when a future audit discovers one that is already present._

## Required review for a new API

Before integrating:

```text
purpose
→ existing-equivalent search
→ official docs verification
→ license/terms
→ security/privacy
→ limits/cost
→ platform compatibility
→ adapter design
→ schema validation
→ timeout/retry/fallback
→ tests
→ observability
→ runtime verification
```

## Required review for a new repository

For an external Git repository record:

```text
source repository
→ exact version/commit
→ license
→ maintenance/activity
→ dependency graph
→ security advisories where available
→ capability actually reused
→ bundle/runtime impact
→ supported platforms
→ removal strategy
```

Prefer using a dependency or narrowly extracting a capability over copying an entire repository.

## Adapter boundary

The application must depend on a KinetixFitt interface where practical:

```text
feature/domain
   ↓
KinetixFitt interface
   ↓
provider adapter
   ↓
external API/SDK
```

Provider-specific errors should be normalized before reaching the domain layer.

## Failure taxonomy

Each provider should classify:

- authentication failure;
- quota/rate-limit failure;
- timeout;
- transient network failure;
- invalid response;
- provider outage;
- unsupported capability;
- policy/data rejection.

Use structured errors and safe fallback behavior.
