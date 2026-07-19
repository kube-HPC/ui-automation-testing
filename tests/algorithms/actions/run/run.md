# Run Algorithm Test

## What the test does

1. Creates a new algorithm named `run-algorithm` through the API.
2. Navigates to the dashboard and opens the Algorithms screen from the left sidebar.
3. Finds the algorithm row in the table by algorithm name.
4. Clicks the `Run` action button in that row.
5. Opens the Jobs screen from the left sidebar.
6. Finds the created job in the Jobs table by the `pipeline.name` column.
7. Verifies that the job row contains the algorithm name `run-algorithm`.

## Expected result

Running the algorithm creates a job, and the new job appears in the Jobs table with the algorithm name `run-algorithm`.
