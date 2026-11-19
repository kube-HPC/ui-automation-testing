# Algorithm Build From Code Test

## What the test does

1. Generates a unique algorithm name with the prefix `buildAlgorithm`.
2. Navigates to the Algorithms screen.
3. Opens the `New Algorithm` dialog.
4. Fills the algorithm name and selects the `File` (code upload) build type.
5. Fills the description and selects the `Python` environment.
6. Sets the code entry point to `algoTestRun.py`.
7. Uploads the algorithm code archive from `api/mocks/Algorithms/algoTest.zip`.
8. Clicks `Save` to start the build.
9. Opens the `Builds` tab in the algorithm overview.
10. Waits (up to 5 minutes) for a build row with status `completed` in the ANTD table.
11. Expands the completed build row.
12. Clicks `copy` on the build log/details.
13. Clicks `download` and verifies a file is downloaded.
14. Opens the `Information` tab and verifies the `buildId` starts with the algorithm full name.
15. Clicks `redo` to trigger a rebuild, then closes the overview.
16. Returns to the Algorithms list.
17. Finds the created algorithm row in the HK Grid and verifies it is listed.
18. Cleans up by deleting the created algorithm in a `finally` block.

## Expected result

The algorithm is created from the uploaded code archive, its build completes successfully, the build details can be copied, downloaded and inspected (with a `buildId` matching the algorithm name), a rebuild can be triggered, and the algorithm appears in the Algorithms HK Grid.
