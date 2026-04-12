# Edit Algorithm Test

## What the test does

1. Creates a new algorithm named `edit-algorithm` through the API.
2. Navigates to the dashboard and opens the Algorithms screen from the left sidebar.
3. Finds the algorithm row in the table by algorithm name.
4. Clicks the Edit action button in that row.
5. Verifies that the edit popup drawer contains the algorithm name (`toContainText`).

## Expected result

The edit popup opens for the selected algorithm, and the algorithm name appears in the popup drawer.
