# KinetixFitt — Security Audit Skill

## Purpose
Find exploitable correctness and security defects before they reach users.

## Audit every affected path
Check authentication, authorization, CSRF, CORS, input validation, output exposure, secrets, uploads, storage, payments, webhooks, rate limits, SSRF, command execution, path traversal, injection, session handling and sensitive logs.

## Multi-tenant rule
For every protected resource prove:
A→A allowed, A→B denied, B→B allowed, B→A denied.

## AI-specific safety
Never allow model output to bypass authorization, execute unrestricted commands, access arbitrary files, approve payments, alter ownership or expose private data.

## External services
Verify signatures, timeouts, quotas, retries, trust boundaries and failure behavior. Do not trust client-side provider state.

## Review method
Prefer evidence from source, tests and runtime. Do not invent vulnerabilities. Classify findings as BLOCKER/HIGH/MEDIUM/LOW/NOTE with evidence and affected surface.

## Release rule
Authentication bypass, cross-tenant access, secret exposure, payment integrity failure or destructive data risk blocks release.