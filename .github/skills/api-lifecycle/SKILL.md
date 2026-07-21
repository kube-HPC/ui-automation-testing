---
name: api-lifecycle
description: "Apply HKube API-based test data lifecycle patterns for algorithms and pipelines. Use when tests need deterministic setup and guaranteed cleanup without UI residue."
argument-hint: "Describe scenario resource needs, for example algorithm edit or pipeline run"
user-invocable: true
---

# API Lifecycle

## Use When

- Test setup currently creates data via UI but can be done via API.
- Disposable algorithm or pipeline entities are required.
- Cleanup reliability is needed for repeatable runs.

## Procedure

1. Choose setup primitive:

- Algorithm-only scenarios: createAlgorithm and deleteAlgorithm.
- Pipeline scenarios with dependency: createPipelineWithAlgorithm or createPipeline plus algorithm management.

2. Generate deterministic names:

- Use generateTestName with semantic base name.

3. Apply lifecycle:

- Create entities before UI interaction.
- Use try/finally around UI flow.
- Delete all created entities in finally, each with .catch(console.error).

4. Keep assertions meaningful:

- Assert user-visible outcomes.
- Do not over-assert internals of API payloads unless scenario requires it.

## Golden Patterns

- tests/algorithms/actions/edit/edit.spec.ts
- tests/algorithms/actions/run/run.spec.ts

## Output Requirements

- Return setup and cleanup plan.
- Return transformed test code block.
- Explicitly list created entities and matching cleanup calls.
