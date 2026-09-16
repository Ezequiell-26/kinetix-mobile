# KinetixFitt Platform Matrix

This matrix records implementation and verification state without assuming feature parity.

| Capability | Web | PWA | Android | iOS | Windows | macOS | Evidence required |
|---|---|---|---|---|---|---|---|
| Auth/session | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Runtime login + logout |
| Dashboard | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Critical-journey E2E |
| Workout execution | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Complete workout journey |
| Check-ins/tracking | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Create/read/update journey |
| Messaging | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Send/receive journey |
| Private files | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Upload + authorized download |
| Push notifications | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Device/platform runtime test |
| Voice/coaching | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Audio playback/runtime test |
| Offline/reconnect | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Offline mutation + sync test |
| Payments | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL | Provider sandbox + webhook test |
| AI providers | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | Provider sandbox/fallback test |

## State rules

`COMPLETE` requires runtime evidence on the supported platform. `PARTIAL` means some pieces exist but parity or runtime evidence is missing. `MOCK` is allowed only when intentionally isolated from production behavior. `BLOCKED_EXTERNAL` means provider credentials/infrastructure prevent verification. `UNKNOWN` is not a failure; it is an explicit lack of evidence.

Never replace `UNKNOWN` with `COMPLETE` based solely on source-code inspection or compilation.
