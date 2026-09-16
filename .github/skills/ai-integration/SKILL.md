# KinetixFitt — AI Integration Skill

## Purpose
Integrate multiple AI providers and models without coupling product logic to any one vendor or allowing model output to become an authority.

## Architecture
Use a canonical AI gateway/interface with provider adapters. Provider-specific SDK types and payloads stay inside adapters.

## Provider lifecycle
`DISCOVER → VERIFY DOCS → VERIFY TERMS → CAPABILITY CHECK → SECURITY/PRIVACY → COST/LIMITS → ADAPTER → VALIDATE → TEST → OBSERVE → RUNTIME VERIFY`

## Reliability
Every provider integration needs bounded timeout, cancellation, safe retry rules, quota handling, deterministic fallback and explicit unavailable behavior.

## Input/output
Bound prompt/input size, validate structured outputs, sanitize tool arguments and reject malformed model output before it reaches privileged application logic.

## Cost control
Apply per-user and provider budgets, rate limits, duplicate suppression, token/output limits and usage accounting where applicable.

## Safety
Model output must never bypass authorization, alter ownership, approve payments, execute unrestricted commands or access arbitrary private data/files.

## Truth
A model responding successfully is not proof that the feature is correct. Verify the complete application flow with tests and runtime evidence.