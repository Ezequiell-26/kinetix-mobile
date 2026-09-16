# KinetixFitt Authorization Matrix

No endpoint is considered complete until its authorization behavior is explicit and tested.

| Surface | Anonymous | Athlete on own data | Trainer on assigned athlete | Trainer on unassigned athlete | Admin/system |
|---|---|---|---|---|---|
| Authentication/session | Public entry only | Own session | Own session | Own session | Own session |
| Athlete profile | Reject | Read/write own | Read assigned athlete as contract permits | Reject | Administrative contract only |
| Workout/program | Public templates only when documented | Own assigned workout/program | Assigned athletes only | Reject | Administrative contract only |
| Check-ins/logs | Reject | Own records | Assigned athletes only | Reject | Administrative contract only |
| Messages | Reject | Own conversations | Assigned conversations | Reject | Explicit support contract only |
| Files/private assets | Reject | Own/explicitly shared | Assigned/shared resources only | Reject | Explicit administrative contract only |
| Billing/payment data | Reject | Own billing scope | Own billing scope only | Reject | Explicit server-side/admin contract only |
| Account deletion/export | Reject | Own account | Own account | Reject | Support workflow only |

## Mandatory ownership checks

- Never authorize from a client-supplied `trainerId`, `athleteId`, or role field.
- Resolve identity from the authenticated session/token first.
- Resolve resource ownership server-side.
- Treat IDs as references, not proof of permission.
- Private file access requires both authentication and ownership/share validation.
- Cross-tenant access is a security failure even when the requested resource exists.

## Required negative tests

Every protected resource family must include tests proving that:

1. anonymous requests are rejected;
2. an athlete cannot read or mutate another athlete's data;
3. a trainer cannot read or mutate an unassigned athlete's data;
4. a trainer cannot impersonate another trainer through body/query parameters;
5. deleted/deactivated accounts cannot continue to use privileged sessions;
6. exported data contains only the authenticated principal's authorized records.

When a route intentionally differs from this matrix, document the exception next to the route and add a dedicated test.
