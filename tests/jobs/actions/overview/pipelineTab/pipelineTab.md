# Job Pipeline Tab

## What the test does

1. Generates unique names and creates an algorithm and pipeline through the API.
2. Opens the Pipelines screen, runs the pipeline with "Run check", and navigates to Jobs.
3. Finds the corresponding job and waits up to 120 seconds for its status to be `completed` or `failed`.
4. Opens the job overview and selects the "pipeline" tab.
5. Downloads the pipeline input and verifies that the download succeeds and has a filename.
6. Copies the JSON and verifies that the clipboard confirmation appears.
7. Switches to the table view and verifies that the name value contains the generated pipeline name.
8. Deletes the pipeline and algorithm in a `finally` block, including when setup or assertions fail.

## Expected result

The job overview's pipeline tab supports downloading the pipeline input and copying its JSON. The table view displays the pipeline name, and the test removes its created resources afterward.
