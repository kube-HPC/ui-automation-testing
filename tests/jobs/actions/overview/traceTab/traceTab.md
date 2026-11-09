# Job Trace Interactions

## What the test does

1. Creates a pipeline and its algorithm through the API using generated names.
2. Runs the pipeline and opens the corresponding job overview.
3. Switches to the trace tab, searches for a value, and clears the search.
4. Uses the trace minimap and controls to select roots, toggle spans, and open a span's zoom view.
5. Searches within the zoom view, clears the search, and closes the view.
6. Opens the span logs and waits up to three minutes for a log copy button.
7. If logs are available, copies a log and verifies the copy confirmation. If no logs appear, adds a note to the Playwright report and continues.
8. Opens the span in Kibana and verifies that the new page URL matches `kibana`.
9. Cleans up by deleting the pipeline and algorithm through the API.

## Expected result

Trace search, span controls, zoom, and Kibana navigation work. Available logs can be copied; if no logs are found within three minutes, the report notes their absence and the test continues.
