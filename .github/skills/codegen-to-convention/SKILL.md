---
name: codegen-to-convention
description: "Convert raw Playwright codegen snippets into HKube repository conventions. Use for removing login and viewport boilerplate, adding helper-based navigation and table access, and applying test lifecycle cleanup."
argument-hint: "Paste codegen snippet or path to a spec file that needs conversion"
user-invocable: true
---

# Codegen To Convention

## Use When

- You have Playwright codegen output that is verbose or brittle.
- A test includes login and viewport setup that should rely on repository defaults.
- A test uses raw locators and does not use project helpers.

## Procedure

1. Remove codegen-only boilerplate:

- Remove local login steps if global auth setup is active.
- Remove local viewport overrides unless explicitly required by scenario.
- Remove hardcoded auth or app URLs.

2. Normalize test skeleton:

- Keep static test title.
- Add imports aligned to repository examples.
- Generate resource names with generateTestName from helpers/testDataFactory.ts.

3. Add lifecycle contract:

- Use API create helpers before UI steps when setup data is disposable.
- Wrap test body in try/finally.
- Cleanup in finally with delete helper and .catch(console.error).

4. Normalize navigation and selectors:

- Replace direct section clicks with getSideBarLeftLink and NamesLeftLink.
- Replace direct root goto with gotoRoot or gotoRootSection.
- Delegate table mapping to selector-mapper when needed.

5. Verify parity against golden references:

- tests/algorithms/actions/edit/edit.spec.ts
- tests/algorithms/actions/run/run.spec.ts

## Output Requirements

- Provide transformed code.
- Explain removed codegen leftovers.
- List one clarification question only if conversion confidence is low.
