# Reorder queued job

## Overview

This test verifies moving a queued job from Managed to Preferred using simulated HTML5 drag events, returning it to Managed through the row action, and clearing the queue. It also exercises Tag and Jobid grouping.

## Flow

1. Generate a unique test resource name with `generateTestName("reorderQueuedJob")`.
2. Create a pipeline and a long-running algorithm through `createPipelineWithAlgorithm`, using `LONG_RUNNING_ALGORITHM_IMAGE` and a concurrency limit of 1.
3. Open the Pipelines section and run the pipeline, confirming via the "Run check" dialog.
4. Navigate to Jobs and verify the first job is visible in the jobs grid.
5. Return to Pipelines and run the pipeline a second time, so the second job waits in the queue.
6. Navigate to Queue and select Tag grouping through `queue-all-filter`.
7. Open edit mode with `queue-edit-toggle`, then select Jobid grouping through `queue-filter` for the Managed table.
8. Locate the queued job by its prefixed pipeline name and simulate dragging it into the Preferred table.
9. Verify the pipeline appears in Preferred, then select Jobid grouping through `preferred-filter`.
10. Read the job ID from the Preferred row's `data-testid`.
11. Click that job's move-to-queue action and confirm the move.
12. Verify the same job appears in Managed and no longer appears in Preferred.
13. Exit edit mode and select Jobid grouping in the consolidated queue table.
14. Verify the test pipeline appears and none of the loaded job rows belongs to another pipeline.
15. Click `queue-clear-button`, confirm with `queue-clear-confirm`, and verify no job rows remain in the consolidated table.

## Key implementation details

- Queue tables are identified by `data-testid="queue-table"` and `data-testid="preferred-table"` (not `tableAntd`).
- Rows are matched by the full prefixed pipeline name via `getNamePrefix(pipelineName)`.
- Grouping options are selected by exact text inside the visible ANTD dropdown, avoiding generated element IDs and positional selectors.
- Dragging is simulated with a shared `DataTransfer`: `dragstart` on the source row; `dragenter`, `dragover`, and `drop` on the Preferred `tbody`; then `dragend` on the source row. This exercises the application's drag handlers, not a physical mouse gesture.
- The job ID is extracted from `preferred-row-${jobId}` and used to target `preferred-move-to-queue-${jobId}`, `preferred-move-confirm-${jobId}`, and the corresponding queue rows.
- Queue updates are allowed up to 30 seconds for the relevant row assertions.

## Queue clearing scope

The clear action affects the queue, not just the test pipeline. Before clicking it, the test checks that all loaded rows in `queue-all-table` contain the test pipeline name. This check does not cover unloaded or paginated jobs, or jobs added after the check. Run this scenario in an isolated queue.

## Assertions

- The first pipeline run appears in the Jobs grid.
- The queued pipeline row is visible in the Managed table before the drag.
- The pipeline row is visible in the Preferred table after the drop.
- In Jobid grouping, the Preferred row has a `preferred-row-` test ID.
- After the confirmed move back, the same job is visible in Managed and absent from Preferred.
- Before clearing, the consolidated table contains the test pipeline and no loaded rows for other pipelines.
- After clearing, no job rows remain in the consolidated table.

## Cleanup

In `finally`, the test navigates to Jobs, finds rows containing the prefixed pipeline name, and hovers over each row. It clicks `stop` only when the button is both visible and enabled, with a 5-second click timeout. Disabled buttons are skipped; cleanup does not separately assert that each job reaches a terminal status.

A nested `finally` attempts `deletePipeline(pipelineName)` and `deleteAlgorithm(algorithmName)` even if UI cleanup fails. Each deletion logs errors through `.catch(console.error)`.
