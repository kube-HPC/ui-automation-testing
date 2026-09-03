# Run Pipeline Test

## What the test does

1. Creates a new algorithm and a new pipeline through the API (both with a unique random suffix to avoid conflicts).
2. Navigates to the dashboard and opens the Pipelines screen from the left sidebar.
3. Finds the pipeline row in the table by pipeline name.
4. Clicks the Run action button in that row.
5. Clicks the `Run check` button in the confirmation dialog.
6. Clicks the `Jobs` link that appears in the toast notification.
7. Verifies that the triggered job row is visible in the Jobs screen.

## Expected result

The pipeline runs successfully and a corresponding job appears in the Jobs screen.
