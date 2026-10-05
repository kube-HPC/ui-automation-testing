# Pipeline Versions Test

## What the test does

1. Generates unique resource names for a pipeline and algorithm.
2. Creates a pipeline with an algorithm through the API.
3. Navigates to the Pipelines screen.
4. Finds the created pipeline row in the HK Grid and opens the `edit` action.
5. Updates the pipeline description and submits the edit flow.
6. Returns to Pipelines and opens the same pipeline `overview` action.
7. Switches to the `Versions` tab and expands the first version row.
8. Verifies the updated description value appears in the version details.
9. Clicks `save-current-version`, enters a new pipeline name, and saves a copied pipeline.
10. Returns to Pipelines and opens `overview` again for the original pipeline.
11. Switches to `Versions` and triggers `update-current-version` (Change Version).
12. Triggers `delete-current-version` and confirms deletion.
13. Verifies only one `delete-current-version` control remains and that it is disabled.
14. Cleans up created resources in a `finally` block (copied pipeline, original pipeline, and algorithm).

## Expected result

The edited pipeline description is persisted and visible in Versions, saving the current version creates a new pipeline copy, change-version action succeeds, and delete-version action updates the version controls as expected.
