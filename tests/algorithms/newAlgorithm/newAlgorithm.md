# New Algorithm Test

## What the test does

1. Generates a unique algorithm name with the prefix `new-algorithm`.
2. Navigates to the root page and opens the Algorithms screen from the left sidebar.
3. Clicks `New Algorithm` to open the creation form.
4. Fills `* Algorithm Name :` with the generated name.
5. Fills `Description :` with `Description test`.
6. Opens the `Docker image` tab and fills `* Algorithm Image :` with `hkube/algorithm-example-python`.
7. Expands the resources section and sets `CPU Usage :` to `0.2`.
8. Clicks `Save` to create the algorithm.
9. Returns to the Algorithms list and verifies a row exists with the created algorithm name.
10. Cleans up by deleting the created algorithm through the API.

## Expected result

The algorithm is created successfully, appears in the algorithms table with its generated name, and is removed in cleanup.
