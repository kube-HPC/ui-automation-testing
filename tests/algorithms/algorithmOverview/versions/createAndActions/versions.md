# Algorithm Versions Test

## What the test does

1. Generates unique resource names for an algorithm.
2. Creates an algorithm through the API.
3. Navigates to the Algorithms screen.
4. Finds the created algorithm row in the HK Grid and opens the `edit` action.
5. Updates the algorithm description and submits the edit.
6. Returns to Algorithms and opens the same algorithm `overview` action.
7. Switches to the `Versions` tab and expands the first version row.
8. Verifies the updated description value appears in the version details (react-json-view).
9. Clicks `save-current-version`, enters a new algorithm name, and saves a copied algorithm.
10. Returns to Algorithms and opens `overview` again for the original algorithm.
11. Switches to `Versions` and triggers `update-current-version` (Change Version).
12. Triggers `delete-current-version` and confirms deletion.
13. Verifies only one `delete-current-version` control remains and that it is disabled.
14. Cleans up created resources in a `finally` block (copied algorithm and original algorithm).

## Expected result

The edited algorithm description is persisted and visible in Versions, saving the current version creates a new algorithm copy, change-version action succeeds, and delete-version action updates the version controls as expected.
