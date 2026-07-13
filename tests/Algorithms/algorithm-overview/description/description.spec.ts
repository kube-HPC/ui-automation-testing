import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";

test("check readme on tab description algorithm", async ({ page }) => {
  const textReadme = "Test Algorithm Readme Example";
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
    await page.locator("textarea").fill(textReadme);
    await page.getByRole("button", { name: "Apply Markdown" }).click();

    await gotoRoot(page);
    await getSideBarLeftLink(page, "algorithms").click();

    const algorithmRow2 = hkGridFindRowByColumnText(
      page,
      "name",
      algorithmName,
    );
    let overviewButtonInRowStep2 = algorithmRow2.hkGridGetActionButton(
      page,
      "overview",
    );
    await overviewButtonInRowStep2.click();

    await page.getByRole("tab", { name: "Description" }).click();
    await expect(page.getByText(textReadme)).toBeVisible();
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
