# Algorithm Versions Compare Test

## What the test does

1. Generates unique name for an algorithm.
2. Creates an algorithm through the API.
3. Navigates to Algorithms and verifies the created algorithm row is visible in HK Grid.
4. Opens algorithm Edit, updates description, and submits the edit.
5. Returns to Algorithms and opens the same algorithm Overview.
6. Opens the Versions tab.
7. Selects two version rows using version checkboxes.
8. Clicks Compare and closes the compare dialog.
9. Opens the Version Time Table tab.
10. Finds a row containing the Keycloak username from environment settings.
11. Verifies that the matching row is visible.
12. Cleans up created resources in finally (copied algorithm and original algorithm).

## Expected result

The compare flow opens successfully for two selected versions, and the Version Time Table shows at least one visible row containing the current environment username.
