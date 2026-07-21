---
name: selector-mapper
description: "Map raw Playwright selectors and row action flows to HKube helper abstractions for HK Grid and ANTD tables. Use for replacing brittle locator chains with helper APIs."
argument-hint: "Provide selector snippet and intended action like edit, run, delete, search"
user-invocable: true
---

# Selector Mapper

## Use When

- A test uses direct row filters, nested locators, or icon button chains.
- You need to convert table operations into helper-based operations.
- It is unclear whether the page uses HK Grid or ANTD.

## Mapping Rules

- HK Grid:
- Use hkGridFindRowByColumnText(page, columnId, text).
- Use row.hkGridGetActionButton(actionLabel, optionalContainerTestId) for actions.
- ANTD:
- Use antTableFindRowByText(page, text).
- Use row.antTableGetActionButton(actionTestId, optionalContainerTestId) for actions.
- Sidebar:
- Use getSideBarLeftLink(page, NamesLeftLink.<SECTION>) instead of ad-hoc selectors.

## Decision Rules

1. If selectors reference HK Grid patterns such as col-id and row role behavior, map to HK Grid helpers.
2. If selectors clearly target ANTD table test ids and row model, map to ANTD helpers.
3. If not inferable with high confidence, ask one focused question:

- Is this screen implemented with HK Grid or ANTD table?

## Output Requirements

- Return before and after mapping summary.
- Return transformed selector logic with helper calls.
- Highlight any unresolved ambiguity in one question.
