# Filter Error Log by Service Name and Timestamp

Verifies that filtering the Error Log by service name and by a time range around an existing entry keeps that entry visible.

## Steps

1. Navigate to **Observability → Error Log** (expand Observability in the left sidebar if needed).
2. Read all values of the **Service Name** column using `antTableGetColumnValues` (`helpers/tableAntd.ts`).
3. Take the first service name, convert it to lowercase and replace spaces with `-` (e.g. `API Server` → `api-server`).
4. Type it into the service name search input (`data-testid="service-name-search"` – the wrapping div of the input).
5. Read all values of the **Time Stamp** column and parse the first one with `parseTableTimestamp` (`helpers/datePicker.ts`).
   Table format: `DD/MM/YY HH:mm:ss` (e.g. `26/11/26 10:43:26`).
6. Calculate a range of **1 hour before** to **1 hour after** that timestamp.
7. Set the range in the time range picker (`data-testid="error-log-time-range-picker"`):
   - `nth(0)` – **From**: open it and select the start date/time with `antPickerSelectDateTime`.
   - `nth(1)` – **To**: open it and select the end date/time with `antPickerSelectDateTime`.
   - Verify both inputs are not empty.
8. Verify a row containing the selected service name is still visible in the table.

## Required test IDs in the app

| Test ID                       | Element                                     |
| ----------------------------- | ------------------------------------------- |
| `service-name-search`         | Div wrapping the service name search input  |
| `error-log-time-range-picker` | Time range picker inputs (From = 0, To = 1) |
