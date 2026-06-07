# Go To Jobs Test

## What the test does

1. Uses the fixed algorithm name `pw-goto-algorithm`.
2. Creates the algorithm through the API.
3. Navigates to the root page and opens the Algorithms screen from the left sidebar.
4. Finds the algorithm row and clicks the `run` action.
5. In the run popup, clicks the `Jobs` link.
6. Verifies the browser is redirected to the Jobs page by asserting the URL ends with `/jobs`.

## Expected result

The algorithm run is triggered successfully, clicking `Jobs` opens the Jobs screen, and the final URL ends with `/jobs`.
