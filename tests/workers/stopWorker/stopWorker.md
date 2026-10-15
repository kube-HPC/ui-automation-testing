# Stop a worker

## Overview

This test verifies that a running pipeline worker can be stopped from the UI and that the stop action completes successfully.

## Flow

1. Generate a unique test resource name.
2. Create a pipeline with an associated algorithm using the API helpers.
3. Open the root page and navigate to the Pipelines section.
4. Locate the newly created pipeline row and trigger the Run action.
5. Confirm the run action via the "Run check" dialog.
6. Navigate to the Workers screen (or Observability if the Workers link is not visible).
7. Click the first "stop-worker" control and confirm the stop in the confirmation dialog.
8. Assert that the confirmation dialog is hidden after the stop is processed.
9. Clean up the pipeline and algorithm in a finally block.

## Key implementation details

- Uses `generateTestName("stopAWorker")` to ensure unique naming.
- Creates resources with `createPipelineWithAlgorithm` and deletes them with `deletePipeline` and `deleteAlgorithm`.
- Uses `gotoRoot` and `getSideBarLeftLink` to navigate the UI consistently.
- Selects the specific pipeline row using `hkGridFindRowByColumnText(page, "name", pipelineName)`.
- Handles the Workers navigation fallback when the Workers entry is hidden under Observability.
- Uses `try/finally` cleanup so resource teardown runs even if the test fails.

## Assertions

- Verifies the stop confirmation button is hidden after the stop action is acknowledged.

## Cleanup

The test always attempts to delete the created pipeline and algorithm in the `finally` block, swallowing cleanup errors with `.catch(console.error)` to keep the test output readable.
