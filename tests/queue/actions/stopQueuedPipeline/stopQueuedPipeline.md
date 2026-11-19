# Stop queued pipeline

## Overview

This test verifies cancelling and confirming the stop action for a pipeline with a queued job.

## Flow

1. Create a uniquely named pipeline and long-running algorithm with a concurrency limit of one.
2. Run the pipeline and verify its first job appears in Jobs.
3. Run the pipeline again and navigate to Queue.
4. Open the pipeline stop confirmation, cancel it, and verify the stop action remains visible.
5. Open the confirmation again, confirm the stop, and verify the pipeline stop action disappears.

## Cleanup

The test attempts to stop visible, enabled job actions belonging to the test pipeline, then deletes the pipeline and algorithm through the API. Job cleanup is limited to rows loaded in the Jobs grid and does not assert that jobs reach a terminal state.
