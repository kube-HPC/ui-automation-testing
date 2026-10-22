import { expect, test } from "@playwright/test";
import { gotoRootSection } from "../../../../helpers/global";
import { NamesLeftLink } from "../../../../helpers/sideBarLeft";

test("jobs filter by time", async ({ page }) => {
  await gotoRootSection(page, NamesLeftLink.JOBS);

  const fromDatePicker = page.getByTestId("job-filter-date-picker-from");
  await fromDatePicker.click();
  await page.getByText("6", { exact: true }).first().click();
  await page.getByText("13", { exact: true }).nth(1).click();
  await page.getByText("30", { exact: true }).nth(2).click();
  await page.getByRole("button", { name: "OK" }).click();
  await expect(fromDatePicker).not.toHaveValue("");

  const toDatePicker = page.getByTestId("job-filter-date-picker-to");
  await toDatePicker.click();
  await page.getByRole("table").getByText("14", { exact: true }).click();
  await page.getByText("04", { exact: true }).nth(2).click();
  await page.getByText("05", { exact: true }).nth(3).click();
  await page.getByRole("button", { name: "OK" }).click();
  await expect(toDatePicker).not.toHaveValue("");
});
