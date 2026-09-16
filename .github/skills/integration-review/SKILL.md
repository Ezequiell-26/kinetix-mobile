# KinetixFitt — External Integration Review Skill

## Purpose

Safely evaluate and integrate external APIs, SDKs, GitHub repositories, models and services without creating architectural sprawl.

## Mandatory sequence

`DISCOVER → VERIFY → COMPARE → REVIEW → ADAPT → VALIDATE → TEST → MEASURE → REGISTER → ENABLE`

## Discover

Identify the exact capability required and search KinetixFitt for an existing implementation first.

## Verify

For external projects/services verify from authoritative sources where possible:

- repository ownership;
- exact version/commit;
- license and commercial-use terms;
- official API/SDK documentation;
- support lifecycle;
- known security advisories;
- rate limits and quotas;
- data-processing behavior.

Do not infer these from package names or README claims alone.

## Compare

Compare the candidate against the current KinetixFitt solution. Prefer reuse of existing infrastructure when it already satisfies the requirement.

## Review

Check:

- dependency graph;
- bundle size;
- runtime compatibility;
- browser/server boundaries;
- Android/iOS/Desktop support;
- maintenance risk;
- failure modes;
- privacy/security;
- cost/quota risk;
- lockfile impact.

## Adapt

Use a KinetixFitt interface/adapter. Provider-specific payloads and SDK objects must not leak across the application.

## Validate

Validate all inbound and outbound schemas. Handle malformed provider responses explicitly.

## Test

Test success, provider errors, timeout, retry, quota exhaustion, malformed response and fallback behavior.

## Measure

Measure latency, memory, CPU, bundle/network impact and database effects when relevant.

## Register

Record the integration in `.ai/INTEGRATION_REGISTRY.md` with exact version, license, adapter, tests, fallback and verification state.

## Enable

Prefer feature flags/configuration or staged rollout for risky integrations. Keep removal possible.
