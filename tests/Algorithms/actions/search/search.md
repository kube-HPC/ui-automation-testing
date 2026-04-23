# Search Algorithm Test

## What the test does

1. Creates a new algorithm named `search-algorithm` through the API.
2. Navigates to the application and opens the Algorithms screen from the left sidebar.
3. Searches for the algorithm using the search input (`#qAlgorithmName`) and presses Enter.
4. Verifies that the grid contains exactly one data row after filtering.
5. Verifies that the single row contains the searched algorithm name.
6. Cleans up by deleting the algorithm through the API.

## Expected result

After searching by name, only one matching algorithm appears in the table, and that row contains `search-algorithm`.
