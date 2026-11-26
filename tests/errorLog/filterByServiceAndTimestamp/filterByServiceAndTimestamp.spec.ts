import { expect, test } from "@playwright/test";
import {
  antPickerSelectDateTime,
  parseTableTimestamp,
} from "../../../helpers/datePicker";
import { gotoRoot, gotoRootSection } from "../../../helpers/global";
import {
  NamesLeftLink,
  getSideBarLeftLink,
} from "../../../helpers/sideBarLeft";
import {
  antTableFindRowByText,
  antTableGetColumnValues,
} from "../../../helpers/tableAntd";

test("filter error log by service name and timestamp", async ({ page }) => {
  await gotoRoot(page);
  const errorlogLink = getSideBarLeftLink(page, NamesLeftLink.ERROR_LOG);
  if (!(await errorlogLink.isVisible())) {
    await getSideBarLeftLink(page, NamesLeftLink.OBSERVABILITY).click();
  }
  await expect(errorlogLink).toBeVisible();
  await errorlogLink.click();

  // Extract service names from the table
  await expect(
    page.getByTestId("tableAntd").locator("tbody tr.ant-table-row"),
  ).toBeTruthy();
  const serviceNames = await antTableGetColumnValues(page, "Service Name");

  expect(serviceNames.length).toBeGreaterThan(0);

  const firstServiceName = serviceNames[0].toLowerCase().replace(/ /g, "-");

  // Filter by Service Name
  const searchInput = page.getByTestId("service-name-search").locator("input");
  await searchInput.click();
  await searchInput.fill(firstServiceName);

  // Extract timestamps from the table
  const timestamps = await antTableGetColumnValues(page, "Time Stamp");
  expect(timestamps.length).toBeGreaterThan(0);

  const firstTimestamp = timestamps[0];
  const timestampDate = parseTableTimestamp(firstTimestamp);
  const oneHourMs = 60 * 60 * 1000;
  const startTime = new Date(timestampDate.getTime() - oneHourMs);
  const endTime = new Date(timestampDate.getTime() + oneHourMs);

  const rangePickers = page.getByTestId("error-log-time-range-picker");

  const fromDatePicker = rangePickers.nth(0);
  await fromDatePicker.click();
  await antPickerSelectDateTime(page, startTime);
  await expect(fromDatePicker).not.toHaveValue("");

  // ANTD RangePicker moves focus to the "to" input after confirming "from"
  const toDatePicker = rangePickers.nth(1);
  await toDatePicker.click();
  await antPickerSelectDateTime(page, endTime);
  await expect(toDatePicker).not.toHaveValue("");

  // Verify that the first row is visible and contains the filtered service name
  const firstRow = antTableFindRowByText(page, firstServiceName);
  await expect(firstRow.getLocator()).toBeVisible();
  await expect(firstRow.getLocator()).toContainText(firstServiceName);
});
