# Run Algorithm Params Test

## What the test does

1. Creates a new algorithm through the API.
2. Navigates to the dashboard and opens the Algorithms screen from the left sidebar.
3. Finds the algorithm row in the table by algorithm name.
4. Hovers over the row action area and opens the run flow for that algorithm.
5. Fills the first input with the array value `[1,2,3]`.
6. Clicks `Add Input` to add another input field.
7. Fills the second input with the JSON value `{"key":"pwkeytest"}`.
8. Clicks `Run` to start the algorithm.
9. Opens the Jobs screen from the left sidebar.
10. Finds the created job in the Jobs table by the `pipeline.name` column.
11. Hovers over the job row and clicks the `Overview` action button.
12. Opens the `extended pipeline` tab.
13. Verifies that the value `pwkeytest` is visible in the run details.

## Expected result

Running the algorithm with custom inputs creates a job successfully, and the extended pipeline view shows the submitted input value `pwkeytest`.
