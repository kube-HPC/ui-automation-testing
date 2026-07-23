# Search Pipeline Test

## What the test does

1. Generates a unique base name for test resources.
2. Creates a new pipeline and its algorithm through the API.
3. Navigates to the dashboard and opens the Pipelines screen from the left sidebar.
4. Fills the pipeline name search input with the created pipeline name.
5. Presses `Enter` to run the search.
6. Verifies that exactly one data row is shown in the grid.
7. Finds the pipeline row by the `name` column and verifies it contains the pipeline name.
8. Cleans up by deleting the created pipeline and algorithm via API in `finally`.

## Expected result

Searching by the created pipeline name returns exactly one matching row, and that row is the created pipeline.