# HKube Copilot Agent And Skills Usage

## What Was Added

- Repository instructions: .github/copilot-instructions.md
- Orchestrator agent: .github/agents/hkube-test-authoring.agent.md
- Skills:
- .github/skills/codegen-to-convention/SKILL.md
- .github/skills/selector-mapper/SKILL.md
- .github/skills/api-lifecycle/SKILL.md
- .github/skills/policy-guard/SKILL.md

## When To Use

Use the custom agent when:

- You pasted raw Playwright codegen output.
- You need a new test from a scenario description.
- You need conversion to project conventions and cleanup lifecycle.

## Recommended Workflow

1. Start with the hkube-test-authoring agent.
2. Provide one of these inputs:

- Raw codegen snippet.
- Existing spec file path and requested refactor.
- Scenario description for a new test.

3. Ask for a policy check before final output.
4. Run repository checks before opening PR.

## Prompt Examples

- Convert this codegen snippet to repository conventions and keep only behavior assertions.
- Create a new algorithm run test using API setup and cleanup, then verify job appears in Jobs grid.
- Refactor this test to use hkGridFindRowByColumnText and remove brittle selectors.

## Golden Reference Tests

Use these as expected output shape:

- tests/algorithms/actions/edit/edit.spec.ts
- tests/algorithms/actions/run/run.spec.ts

## Team Notes

- Prefer API setup and cleanup for disposable resources.
- Prefer helper abstractions for table and sidebar interactions.
- Keep test titles static and paths camelCase.
