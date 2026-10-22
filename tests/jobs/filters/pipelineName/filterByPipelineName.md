# Filter Jobs by Pipeline Name

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Navigates to the Pipelines screen and runs the created pipeline.
3. Opens the Jobs screen and filters jobs by the pipeline name.
4. Verifies that the matching job row contains the pipeline name.
5. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

The Jobs screen shows a job for the created pipeline after filtering by its name.
