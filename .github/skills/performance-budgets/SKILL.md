# Performance Budgets Skill

Performance changes must be measured, not inferred.

## Budgets to establish with evidence

Track separately for Web desktop, Web mobile 4G, PWA low-end mobile, Android low-end, iOS mid-range, Windows, and macOS:

- startup/TTFB
- LCP/INP/CLS where applicable
- transferred JavaScript
- request count
- API latency
- database query count/latency
- memory/CPU where the platform exposes it
- battery impact for long-running mobile workflows

## Rules

- Keep baseline history in `.ai/PERFORMANCE_BASELINES.md`.
- Do not invent baseline values.
- A regression budget must be compared against the same route, viewport, device class, and build mode.
- Large dependency additions require bundle-impact evidence.
- 3D/media features should load lazily and have a degraded path for constrained devices.

A source-code optimization without before/after measurement is a hypothesis, not a verified performance improvement.
