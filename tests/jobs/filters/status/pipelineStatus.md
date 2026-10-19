# Filter Jobs by Pipeline Status

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Runs the created pipeline and opens the Jobs screen.
3. Selects the stopped status and closes its filter control.
4. Verifies that the matching job row contains the pipeline name.
5. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

The Jobs screen shows the created pipeline's job after the status selection interaction.
