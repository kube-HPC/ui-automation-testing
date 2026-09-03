# How to Start a New Test

Follow these steps to create and record a new test:

## 1. Create a New Folder

Create a new folder in the correct location under `tests/`.
Folder names must use `camelCase` only.

## 2. Add a Markdown File

Inside the folder, create a `filename.md` file that describes the test step by step.

## 3. Add a Test File

Create a `filename.spec.ts` file in the same folder. This file will contain your test code.
File names must use `camelCase` only (name before extension).
Do not commit empty files.

## 4. Use a Unique Name for Test Data

Use `generateTestName` from `helpers/testDataFactory.ts` when creating test resources.

Example:

```ts
import { generateTestName } from "../../../helpers/testDataFactory";

const algorithmName = generateTestName("edit-algorithm");
```

## 5. Always Clean Up Created Resources

Wrap creation and assertions with `try/finally` and delete created entities in `finally`.

## 6. Run Structure Checks Before PR

Run this command before pushing:

```bash
npm run check:test-structure
```

It will fail when:

- any empty file exists under `tests/`
- any non-camelCase folder exists under `tests/`
- any non-camelCase file exists under `tests/`

## 7. Record the Test (Optional)

Run the following command to start recording:

```bash
npm run codegen
```
