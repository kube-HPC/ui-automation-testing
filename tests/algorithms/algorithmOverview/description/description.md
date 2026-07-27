# Algorithm Description Readme Test

## What the test does

1. Generates a unique algorithm name with the prefix `readmeAlgorithm`.
2. Creates the algorithm through the API.
3. Navigates to the Algorithms screen.
4. Finds the created algorithm row in the HK Grid and opens the `overview` action.
5. Opens the `Description` tab.
6. Opens readme editing via `Edit` and then `Edit Read Me`.
7. Replaces the textarea content with `Test Algorithm Readme Example`.
8. Clicks `Apply Markdown` to save the readme content.
9. Returns to the Algorithms list and reopens the same algorithm overview.
10. Opens the `Description` tab again and verifies the updated readme text is visible.
11. Cleans up by deleting the created algorithm in a `finally` block.

## Expected result

The algorithm readme content is updated successfully and remains visible in the Description tab after reopening the algorithm overview.
