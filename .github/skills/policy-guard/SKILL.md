---
name: policy-guard
description: "Validate HKube Playwright test structure and policy rules. Use for enforcing static test titles, camelCase path naming, non-empty specs, and convention parity before finalizing changes."
argument-hint: "Provide target test path and candidate code"
user-invocable: true
---

# Policy Guard

## Use When

- Finalizing a transformed or newly generated test.
- Reviewing pull request readiness for test files.
- Checking convention drift against repository scripts.

## Required Checks

1. Test title policy:

- Titles are static string literals.
- No template literals or runtime interpolation.

2. Path and naming policy:

- Test folder and file names follow camelCase rules expected by repository scripts.

3. Spec content policy:

- Spec file is not empty.

4. Convention parity:

- Uses helpers and lifecycle patterns from project conventions.
- Avoids forbidden codegen leftovers.

## Script Alignment

Policies align with:

- scripts/check-empty-spec-files.mjs
- scripts/check-test-folder-naming.mjs
- scripts/check-test-title-policy.mjs

## Output Requirements

- Return pass or fail per check.
- Return concrete fixes for failing checks.
- Return final readiness summary.
