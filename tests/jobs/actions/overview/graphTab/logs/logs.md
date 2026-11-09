# Job Logs Search in Kibana

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Navigates to the Pipelines screen and runs the created pipeline.
3. Opens the Jobs screen and locates the job for that pipeline.
4. Opens the job overview, switches to the graph tab, and selects the run and debug nodes.
5. Sets the log source to "All" and applies the "online" and "saved" log filters.
6. Searches the logs for "run" and clicks the search-in-Kibana action.
7. Verifies that a Kibana popup opens with a URL matching `kibana`.
8. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

Searching job logs for a term and choosing "search in Kibana" opens a Kibana page in a new window.
