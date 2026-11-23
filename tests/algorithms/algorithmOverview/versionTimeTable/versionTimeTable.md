# Algorithm Overview Version Time Table Test

## What the test does

1. Generates a unique algorithm name with the prefix `versionTimeTableAlgorithm`.
2. Creates the algorithm through the API.
3. Navigates to the Algorithms screen.
4. Finds the created algorithm row in the HK Grid and opens the `overview` action.
5. Opens the `Version Time Table` tab and verifies that the `Timestamp` column is visible.
6. Clicks the `Timestamp` column header.
7. Verifies that `Edit` is enabled and clicks it.
8. Cleans up by deleting the created algorithm in a `finally` block.

## Expected result

The Version Time Table tab displays a Timestamp column and allows the Edit button to be clicked. The test does not assert what opens after Edit.
