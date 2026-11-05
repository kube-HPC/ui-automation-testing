# Job Info And Results

## What the test does

1. Generates unique names and creates an algorithm with a single-node pipeline through the API.
2. Opens the Pipelines screen, runs the pipeline with "Run check", and navigates to Jobs.
3. Finds the job associated with the pipeline and waits for its status to be either `completed` or `failed` (up to 120 seconds).
4. Opens the job overview and selects the "Info & Results" tab.
5. Checks the completed task status filter, verifies it is selected, clears the filters, and verifies it is no longer selected.
6. Expands the results if the right-arrow control is present.
7. Downloads the node results and verifies the download succeeds and has a filename.
8. Switches to the JSON view, copies the results, and verifies the clipboard confirmation appears.
9. Switches back to the table view and verifies the task status is `completed` or `failed`.
10. Deletes the pipeline and algorithm in a `finally` block, including when setup or assertions fail.

## Expected result

The job overview's Info & Results tab supports filtering task status, downloading node results, and copying results as JSON. The table view displays a `completed` or `failed` status, and the test removes its created resources afterward.
