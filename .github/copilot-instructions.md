# HKube UI Automation Guidelines

## Purpose

These instructions are for developers who write and refactor Playwright tests in this repository.
Use project helpers and API lifecycle utilities instead of raw codegen output.

## Primary Sources

Follow the patterns in these files first:

- tests/algorithms/actions/edit/edit.spec.ts
- tests/algorithms/actions/run/run.spec.ts
- docsHelp/HowAddTest.md

## Required Test Patterns

- Use static test titles only, for example: test("edit algorithm", ...).
- Use deterministic resource names via generateTestName from helpers/testDataFactory.ts.
- Use API-first setup and cleanup for disposable resources.
- Wrap resource lifecycle with try/finally and delete in finally using .catch(console.error).
- Prefer gotoRoot or gotoRootSection from helpers/global.ts for entry navigation.
- Prefer sidebar navigation via getSideBarLeftLink and NamesLeftLink from helpers/sideBarLeft.ts.

## Forbidden Codegen Leftovers

Remove or avoid these patterns when converting codegen output:

- Local login flow when global auth is already configured.
- test.use viewport blocks that override repository defaults.
- Hardcoded Keycloak or app URLs in tests.
- Ad-hoc random naming logic in test files.

## Selector And Table Conventions

- For HK Grid (ag-grid style), use hkGridFindRowByColumnText and HkGridRow helpers from helpers/tableHkGrid.ts.
- For ANTD table screens, use antTableFindRowByText and AntTableRow helpers from helpers/tableAntd.ts.
- Prefer row action helper methods over deeply chained locator filters.

## API Lifecycle Conventions

- Algorithms: use createAlgorithm and deleteAlgorithm from api/algorithmApi.ts.
- Pipelines: use createPipeline, createPipelineWithAlgorithm, and deletePipeline from api/pipelineApi.ts.
- Keep UI assertions focused on behavior under test, not data creation mechanics.

## Structure And Policy Guards

Generated or edited tests must satisfy existing repository checks:

- scripts/check-empty-spec-files.mjs
- scripts/check-test-folder-naming.mjs
- scripts/check-test-title-policy.mjs

## Hybrid Decision Rule

- If mapping is deterministic, auto-transform to repository conventions.
- If mapping is ambiguous, ask one targeted clarification question.
- Never silently keep brittle codegen patterns when a known helper exists.
