# Algorithm Overview Information Test

## What the test does

1. Generates a unique algorithm name with the prefix `infoAlgorithm`.
2. Creates the algorithm through the API.
3. Navigates to the Algorithms screen.
4. Finds the created algorithm row in the HK Grid and opens the `overview` action.
5. Opens the `Information` tab and verifies the algorithm name appears in the JSON view.
6. Switches to the table view and verifies the `name` value matches the algorithm name.
7. Cleans up by deleting the created algorithm in a `finally` block.

## Expected result

The Information tab displays the algorithm details in both JSON and table views, including the correct algorithm name.
