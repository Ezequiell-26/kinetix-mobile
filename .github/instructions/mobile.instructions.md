# KinetixFitt mobile instructions

Apply to mobile, Capacitor and native-related changes.

## Device matrix

Treat low-end Android, mid-range Android, recent iPhone, tablets/foldables and desktop wrappers as distinct targets.

Test responsive behavior from 320px upward and avoid assuming desktop performance represents mobile performance.

## Performance

Prefer lazy loading, pagination, small payloads, bounded caches, adaptive media quality and event-driven updates over aggressive polling.

Protect battery, memory and CPU. Clean up timers, listeners, observers, subscriptions, object URLs, WebGL resources and media contexts.

## Offline

Every queued operation needs an operation ID, retry/backoff policy, deduplication and explicit conflict behavior. Never silently overwrite newer server state.

## Native boundaries

Keep browser-only, server-only and native-only APIs behind explicit boundaries. Web behavior does not prove native behavior.

## Verification

Native changes require the appropriate platform build/smoke checks when available. Do not claim iOS/Android behavior was verified from a web build alone.
