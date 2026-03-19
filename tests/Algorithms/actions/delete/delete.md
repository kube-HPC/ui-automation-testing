# Delete Algorithm Test

## What the test does

1. Creates a new algorithm named `delete-algorithm` through the API.
2. Navigates to the Jobs page and then opens the Algorithms screen from the left sidebar.
3. Finds the algorithm row in the table by name.
4. Clicks the Delete button in that algorithm row.
5. In the confirmation modal, clicks `Confirm` to approve deletion.
6. Waits one second to allow the deletion to complete.
7. Verifies that the deleted algorithm row is no longer visible in the table (`toBeHidden`).

## Expected result

The algorithm is deleted successfully and no longer appears in the algorithms list.
