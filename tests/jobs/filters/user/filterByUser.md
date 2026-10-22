# Filter Jobs by User

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Navigates to the Pipelines screen and runs the created pipeline.
3. Opens the Jobs screen and filters jobs by the configured Keycloak username.
4. Verifies that the matching job row belongs to the created pipeline.
5. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

The Jobs screen shows the created pipeline's job after filtering by the user who ran it.
