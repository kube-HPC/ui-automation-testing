# Algorithm Details Copy JSON

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Navigates to the Pipelines screen and runs the created pipeline.
3. Opens the Jobs screen and locates the job for that pipeline.
4. Opens the job overview and switches to the "Algorithm Details" tab.
5. Switches the details view to JSON and clicks "Copy".
6. Verifies that the "JSON Copied to Clipboard" message is visible.
7. Switches back to the table view and verifies that the "version" field is visible.
8. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

The algorithm details of a job can be copied as JSON, and the table view shows the algorithm version.
