# Reorder queued job

## Overview

This test verifies that a job waiting in the queue can be moved from the Managed queue table to the Preferred table using drag and drop in the Queue edit screen.

## Flow

1. Generate a unique test resource name with `generateTestName("reorderQueuedJob")`.
2. Create a pipeline with a long-running algorithm through the API (`LONG_RUNNING_ALGORITHM_IMAGE`).
3. Open the Pipelines section and run the pipeline, confirming via the "Run check" dialog.
4. Navigate to Jobs and verify the first job is visible in the jobs grid.
5. Return to Pipelines and run the pipeline a second time, so the second job waits in the queue.
6. Navigate to Queue and click `queue-edit-toggle` to open the edit (reorder) view.
7. Locate the queued pipeline row in the `queue-table` (Managed) table.
8. Drag the row into the `preferred-table` (Preferred) table.
9. Verify the pipeline row now appears in the Preferred table.

## Key implementation details

- Queue tables are identified by `data-testid="queue-table"` and `data-testid="preferred-table"` (not `tableAntd`).
- Rows are matched by the full prefixed pipeline name via `getNamePrefix(pipelineName)`.
- The queue uses native HTML5 drag and drop (`<tr draggable>`), so `dragTo` is unreliable. The test dispatches the events explicitly with a shared `DataTransfer`:
  - `dragstart` on the queued row
  - `dragenter`, `dragover`, `drop` on the Preferred table `tbody`
  - `dragend` on the queued row (this triggers the move in the app)

## Assertions

- The queued pipeline row is visible in the Managed table before the drag.
- The pipeline row is visible in the Preferred table after the drop.

## Cleanup

In a `finally` block, the test navigates to Jobs and stops any running job of the pipeline, then deletes the pipeline and algorithm with `deletePipeline` and `deleteAlgorithm`, swallowing errors with `.catch(console.error)`.
