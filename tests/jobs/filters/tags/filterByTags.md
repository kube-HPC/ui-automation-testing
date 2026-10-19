# Filter Jobs by Tags

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Navigates to the Pipelines screen and runs the created pipeline with the `testTag` tag.
3. Opens the Jobs screen and filters jobs by `testTag`.
4. Verifies that the matching job row belongs to the created pipeline.
5. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

The Jobs screen shows the tagged pipeline's job after filtering by `testTag`.
