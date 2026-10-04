# Pipeline Versions Test

## What the test does

1. Generates unique resource names for a pipeline and algorithm.
2. Creates a pipeline with an algorithm through the API.
3. Navigates to the Pipelines screen.
4. Finds the created pipeline row in the HK Grid and opens the `edit` action.
5. Updates the pipeline description and submits the edit flow.
6. Opens the same pipeline `overview` action.
7. Switches to the `Versions` tab.
8. Opens a version row and switches to the `JSON` tab.
9. Verifies the updated description value appears in the JSON view.
10. Cleans up created resources in a `finally` block (pipeline and algorithm).

## Expected result

After editing the pipeline description, the new description is persisted and visible in the pipeline Versions JSON view.
