# KinetixFitt — UX & Accessibility Skill

## Purpose
Improve the product without changing behavior accidentally and make every critical interaction usable across devices and accessibility modes.

## Preservation
Before redesigning a component identify its current states, keyboard/touch behavior, analytics, validation, loading, error and success paths.

## Required states
Interactive features should define idle, loading, success, error, empty, disabled, retry, offline and permission-denied states where applicable.

## Accessibility
Check semantic HTML, labels, focus order, focus restoration, keyboard interaction, screen-reader names, contrast, reduced motion, zoom/reflow, touch targets and error messaging.

## Responsive behavior
Review small phones through desktop. Do not rely on hover. Avoid horizontal overflow, clipped controls and dialogs that cannot be used on narrow screens.

## Motion/media
Respect reduced-motion and avoid continuous effects that consume unnecessary CPU/battery. Heavy media and 3D must have loading, error and fallback states.

## Validation
Prefer behavior-level tests and visual/runtime checks for critical journeys. Do not call UI work complete solely because the page renders.