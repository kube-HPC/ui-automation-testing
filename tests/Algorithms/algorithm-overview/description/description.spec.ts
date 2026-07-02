import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";

test("check readme on tab description algorithm", async ({ page }) => {
  const algorithmName = "readme-algorithm";

  await createAlgorithm(algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, "algorithms").click();

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    let overviewButtonInRow = algorithmRow.hkGridGetActionButton(
      page,
      "overview",
    );
    await overviewButtonInRow.click();

    await page.getByRole("tab", { name: "Description" }).click();

    await page
      .getByRole("heading", { name: "Algorithm Readme Example" })
      .click();
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    await page.getByRole("button", { name: "Edit Read Me" }).click();

    await page.locator("textarea").press("ControlOrMeta+a");
    await page.locator("textarea").fill("#test algo");
    await page.getByRole("button", { name: "Apply Markdown" }).click();

    overviewButtonInRow = algorithmRow.hkGridGetActionButton(page, "overview");

    await page.getByRole("tab", { name: "Description" }).click();
    await expect(page.getByText("#test algo")).toBeVisible();
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
