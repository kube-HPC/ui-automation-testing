# Edit Algorithm Test

## What the test does

1. Creates a new algorithm named `edit-algorithm` through the API.
2. Navigates to the dashboard and opens the Algorithms screen from the left sidebar.
3. Finds the algorithm row in the table by algorithm name.
4. Clicks the Edit action button in that row.
5. Updates the `Description` field with the value `test edit`.
6. Clicks `Save`.
7. Reopens the edit popup for the same algorithm.
8. Verifies that the `Description` field contains the saved value `test edit`.

## Expected result

The algorithm is updated successfully, and when the edit popup is opened again, the `Description` field still contains `test edit`.
