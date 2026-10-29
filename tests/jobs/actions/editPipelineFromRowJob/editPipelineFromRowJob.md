# Edit Pipeline from a Job Row

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Navigates to the Pipelines screen and runs the created pipeline.
3. Opens the Jobs screen and locates the job for that pipeline.
4. Opens the pipeline editor from the job row and updates the description.
5. Returns to the Jobs screen, reopens the editor, and verifies the updated description was saved.
6. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

The pipeline description edited from the job row is persisted and shown when the pipeline editor is reopened.
