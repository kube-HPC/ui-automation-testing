import { Page } from "@playwright/test";

const pad = (value: number): string => value.toString().padStart(2, "0");

/**
 * Parses a timestamp displayed in HKube tables.
 *
 * @param value - Timestamp in "DD/MM/YY HH:mm:ss" format (e.g. "26/11/26 10:43:26").
 * @returns A Date in local time.
 * @throws Error if the value does not match the expected format.
 */
export function parseTableTimestamp(value: string): Date {
  const match = value
    .trim()
    .match(/^(\d{2})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Unexpected timestamp format: "${value}"`);
  }
  const [, day, month, year, hours, minutes, seconds] = match.map(Number);
  return new Date(2000 + year, month - 1, day, hours, minutes, seconds);
}

/**
 * Selects a date, hour and minute in the currently open ANTD date picker
 * (with showTime) and confirms with OK.
 * The picker must be opened (clicked) before calling this function.
 *
 * @param page - The Playwright page instance.
 * @param date - The date and time to select.
 */
export async function antPickerSelectDateTime(
  page: Page,
  date: Date,
): Promise<void> {
  const dropdown = page.locator(".ant-picker-dropdown:visible");
  const dateTitle = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  // in-view skips the previous/next month filler cells
  await dropdown
    .locator(`td.ant-picker-cell-in-view[title="${dateTitle}"]`)
    .first()
    .click();

  const timeColumns = dropdown.locator(".ant-picker-time-panel-column");
  await timeColumns
    .nth(0)
    .getByText(pad(date.getHours()), { exact: true })
    .click();
  await timeColumns
    .nth(1)
    .getByText(pad(date.getMinutes()), { exact: true })
    .click();

  await dropdown.locator(".ant-picker-ok button").click();
}
