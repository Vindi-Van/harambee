# Complexity Rubric v1 (1–5)

## C1 — Tiny
- Scope: trivial, isolated
- Risk: very low
- Dependencies: none
- Example: copy fix, minor config tweak

## C2 — Small
- Scope: single component or simple bugfix
- Risk: low
- Dependencies: light
- Example: add field + unit test update

## C3 — Moderate
- Scope: multi-file change across module boundaries
- Risk: medium
- Dependencies: moderate
- Example: endpoint + UI wiring + tests

## C4 — Large
- Scope: subsystem-level effort
- Risk: medium-high
- Dependencies: multiple linked tasks
- Requirement: decomposition into child tasks
- Example: authentication flow migration

## C5 — Initiative
- Scope: program/epic level with broad impact
- Risk: high
- Dependencies: many parallel streams
- Requirement: roadmap + recursive decomposition
- Example: introducing Harambee orchestration framework

## Rules

- C1/C2 may use accelerated flow with fewer gates.
- C3+ requires full artifact-gated transitions.
- C4/C5 parent task is blocked until child completion criteria are met.
