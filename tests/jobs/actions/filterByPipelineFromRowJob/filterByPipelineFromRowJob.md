# Filter Jobs by Pipeline from a Job Row

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Navigates to the Pipelines screen and runs the created pipeline.
3. Opens the Jobs screen and locates the job for that pipeline.
4. Clicks the pipeline-name filter control in the job row.
5. Verifies that the pipeline-name filter is populated with the created pipeline's name.
6. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

Clicking the pipeline-name filter in the job row populates the Jobs pipeline-name filter with the created pipeline's name.
