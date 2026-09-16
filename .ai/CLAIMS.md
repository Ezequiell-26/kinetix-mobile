# KinetixFitt — Active Agent Claims

This file coordinates concurrent AI/human work. It is a lightweight registry, not a replacement for Git branches, PR review, or CI.

## Rules

1. Claim one primary domain per active session.
2. Do not claim a domain already actively owned unless the owner releases it or coordination is explicit.
3. Claims must expire when the session ends.
4. Never treat a stale claim as permanent ownership.
5. Hot files may still require coordination even when domain ownership differs.

## Domains

| Domain | Owner/session | Branch | Status | Started | Notes |
|---|---|---|---|---|---|
| web-ui | available | — | available | — | — |
| mobile-ui | available | — | available | — | — |
| backend-api | available | — | available | — | — |
| database | available | — | available | — | one schema owner at a time |
| auth-security | available | — | available | — | high risk |
| payments | available | — | available | — | high risk |
| storage | available | — | available | — | high risk |
| nutrition | available | — | available | — | — |
| recovery | available | — | available | — | — |
| training | available | — | available | — | — |
| analytics | available | — | available | — | — |
| ai | available | — | available | — | provider abstraction |
| 3d | available | — | available | — | GPU/memory sensitive |
| native | available | — | available | — | Android/iOS/desktop |
| rust-wasm | available | — | available | — | shared core |
| testing | available | — | available | — | — |
| infra-deploy | available | — | available | — | high risk |
| documentation | available | — | available | — | — |

Update the row when claiming or releasing a domain. Keep entries concise and factual.
