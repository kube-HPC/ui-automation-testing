# Stop All Workers Test

## What the test does

1. Generates deterministic algorithm and pipeline names using `generateTestName("stopAllWorkers")`.
2. Creates the pipeline and its algorithm through the API.
3. Navigates to the dashboard and opens the Pipelines screen from the left sidebar.
4. Finds the pipeline row by name, clicks its `Run` action, and clicks `Run check`.
5. Opens Observability if the Workers sidebar link is not visible, verifies that the Workers link is visible, and opens the Workers screen.
6. Clicks the stop-all-workers control and confirms by clicking `Yes`.
7. Verifies that the `Yes` confirmation button is hidden.
8. Attempts to delete the pipeline and algorithm through the API in a `finally` block, including when a UI step fails.

## Expected result

The stop-all-workers confirmation closes after clicking `Yes`.

The current test does not verify that workers were running before the action or that all workers have stopped afterward.
