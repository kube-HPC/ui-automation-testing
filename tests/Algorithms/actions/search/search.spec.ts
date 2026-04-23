import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";

test("search algorithm", async ({ page }) => {
  const algorithmName = "search-algorithm";

  // create an algorithm to search for
  await createAlgorithm(algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, "algorithms").click();

    // search for the algorithm using the search input
    await page.locator("#qAlgorithmName").click();
    await page.locator("#qAlgorithmName").fill(algorithmName);
    await page.locator("#qAlgorithmName").press("Enter");

    // verify that the algorithm is displayed in the search results
    const dataRows = page
      .getByTestId("hk-grid")
      .locator('[role="row"][row-index]');

    // there should be only one result in the search results
    await expect(dataRows).toHaveCount(1);

    // verify that the algorithm name is displayed in the search results
    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    await expect(algorithmRow.getLocator()).toContainText(algorithmName);
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
