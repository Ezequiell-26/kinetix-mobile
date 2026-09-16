# KinetixFitt — Performance Audit Skill

## Purpose

Optimize KinetixFitt using measurements, not intuition, with special attention to constrained mobile devices and networks.

## Workflow

`BASELINE → PROFILE → IDENTIFY HOTSPOT → CHANGE → MEASURE → COMPARE → REGRESSION GUARD`

## Required dimensions

Review as applicable:

- startup/boot time;
- TTFB/LCP/INP/CLS;
- JavaScript transferred and parsed;
- request count and payload size;
- API latency and error rate;
- database query count and slow queries;
- memory allocations/leaks;
- CPU usage;
- animation/frame stability;
- image/video/3D weight;
- battery impact;
- offline/cache behavior.

## Mobile-first rules

Never optimize only for the development desktop.

Consider low-end Android first, then mid-range and high-end devices, tablets/foldables and iOS.

Consider 320px+ viewports, high-DPI screens, slow networks and intermittent connectivity.

## Safe optimization

Do not trade correctness, accessibility or security for speed.

Prefer:

- server rendering where appropriate;
- code splitting;
- lazy loading;
- pagination;
- bounded caches;
- request deduplication;
- efficient queries and indexes;
- compressed/responsive media;
- event-driven updates instead of polling;
- resource cleanup.

## Regression rule

An optimization that measurably worsens a protected baseline must be investigated before merge.

Do not claim "100% performance". Report measured metrics and test conditions.
