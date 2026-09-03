# Delete Pipeline Test

## What the test does

1. Generates a unique base name for test resources.
2. Creates a new pipeline and its algorithm through the API.
3. Navigates to the dashboard and opens the Pipelines screen from the left sidebar.
4. Finds the pipeline row in the grid by the `name` column.
5. Clicks the Delete action button in that pipeline row.
6. In the confirmation dialog, clicks `Confirm` to approve deletion.
7. Verifies that the deleted pipeline row is no longer visible in the grid (`toBeHidden`).
8. Cleans up by deleting the pipeline and algorithm via API in `finally`.

## Expected result

The pipeline is deleted successfully and no longer appears in the pipelines list.
