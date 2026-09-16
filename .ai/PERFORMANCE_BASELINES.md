# KinetixFitt — Performance Baselines

**Purpose:** protect performance continuously across web, PWA, Android, iOS and desktop without inventing a fake "100% performance" score.

## Rule

Performance claims require measurements. Never report a qualitative performance improvement without a before/after observation when measurement is available.

## Baseline dimensions

| Surface | Device class | Network | Startup/TTFB | LCP | INP | CLS | JS | Requests | API latency | DB queries | Memory | Battery/CPU | Status | Last measured |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Web | Desktop | Fast | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | UNMEASURED | 2026-09-16 |
| Web | Mid-range mobile | 4G | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | UNMEASURED | 2026-09-16 |
| PWA | Low-end mobile | 4G | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | UNMEASURED | 2026-09-16 |
| Android | Low-end | 4G | TBD | N/A | N/A | N/A | TBD | TBD | TBD | TBD | TBD | TBD | UNMEASURED | 2026-09-16 |
| iOS | Mid-range | 4G | TBD | N/A | N/A | N/A | TBD | TBD | TBD | TBD | TBD | TBD | UNMEASURED | 2026-09-16 |
| Desktop | Windows/macOS | Fast | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | UNMEASURED | 2026-09-16 |

## Required critical journeys

Measure at minimum:

- app launch;
- authentication;
- dashboard;
- workout loading;
- workout completion;
- check-in submission;
- messaging;
- media/exercise content;
- AI interaction;
- payment checkout initiation;
- offline → reconnect synchronization where implemented.

## Performance budget policy

Targets must be established from real measurements and product requirements. A budget is a release gate only after it is defined and validated against supported devices.

When a regression occurs:

```text
measure
→ identify dominant cost
→ isolate change
→ fix smallest cause
→ remeasure
→ record result
```

## Mobile-specific controls

Continuously check:

- cold start;
- warm start;
- memory growth;
- frame drops during scrolling;
- image decoding;
- video playback;
- 3D usage;
- background work;
- network retries;
- battery-sensitive operations;
- crash-free sessions.

## Quality principle

Do not optimize everything at once. Protect critical user journeys first, then the next measured bottleneck.
