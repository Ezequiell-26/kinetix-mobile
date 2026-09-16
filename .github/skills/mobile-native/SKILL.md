# KinetixFitt — Mobile & Native Engineering Skill

## Purpose
Keep Android, iOS, PWA and desktop behavior consistent without assuming that web behavior equals native behavior.

## Before change
Identify platform-specific code, bridges, permissions, lifecycle, storage, background work, deep links, push, media, sensors and native builds affected by the change.

## Device matrix
Consider low-end Android, mid-range Android, high-end Android, iOS, tablets, foldables and desktop where applicable. Test touch, keyboard, orientation, safe areas, notches, high-DPI and reduced-motion.

## Performance
Protect cold/warm startup, memory, battery, frame stability, network usage and media decoding. Avoid unnecessary polling/background work and globally loaded heavy 3D.

## Offline
For network-dependent features define queueing, deduplication, retries, conflict handling and reconnect behavior. Never overwrite newer server data with stale local state.

## Native safety
Never assume a native permission, API or bridge exists because a web equivalent exists. Verify platform support and failure behavior before implementation.

## Release
Validate target platform builds and smoke tests for changes crossing the native boundary.