# Agent Orchestration Skill

## Purpose
Coordinate specialized KinetixFitt agents into safe, repeatable improvement loops.

## Routing
Select exactly one primary risk cluster per iteration:

`architecture | security | reliability | performance | ux | ai | mobile | testing | release`

Use supporting agents only when the primary cluster genuinely crosses a boundary.

## Loop

`AUDIT → SELECT → IMPLEMENT → FOCUSED PROOF → ADVERSARIAL REVIEW → RE-AUDIT → MERGE → HANDOFF`

## Selection heuristics

1. Release/security blockers before cosmetic work.
2. Known broken behavior before unknown opportunities.
3. Regression-prone core flows before secondary features.
4. User-critical journey failures before internal cleanup.
5. Performance work only with a measurable hypothesis.

## Preservation
Before changing a surface, record known-good behavior and protected tests. Afterward, rerun the same proof.

## Parallelism
Agents may investigate in parallel, but writes to the same file or schema are serialized. Never allow multiple agents to modify the same architectural boundary simultaneously.

## Stop conditions
Stop an iteration when:
- the focused change is proven;
- the change introduces a new unresolved high-risk regression;
- an external dependency prevents verification;
- the requested work would require destructive migration without an approved plan.

## Handoff
Persist the outcome in the durable `.ai` registries and identify the next highest-risk item. Never rely on conversational state as the sole memory between iterations.
