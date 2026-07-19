import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";
import { buildUniqueTestName } from "../../../../helpers/testDataFactory";

test("delete algorithm", async ({ page }) => {
  const algorithmName = buildUniqueTestName("deleteAlgorithm");
  let shouldCleanup = false;

  // create algorithm to delete
  await createAlgorithm(algorithmName);
  shouldCleanup = true;

  try {
    // link to algorithms page
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.ALGORITHMS).click();

    // find the algorithm row by name and click delete
    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    const deleteButtonInRow = algorithmRow.hkGridGetActionButton("delete");
    await deleteButtonInRow.click();

    // confirm delete
    const confirmButtonInPopup = page
      .getByTestId("delete-algorithm-modal")
      .locator("button")
      .filter({ hasText: "Confirm" })
      .first();
    await confirmButtonInPopup.click();

    // assert algorithm is deleted
    await page.waitForTimeout(1000); // wait for deletion to complete

    const deletedAlgorithmRow = hkGridFindRowByColumnText(
      page,
      "name",
      algorithmName,
    );

    await expect(deletedAlgorithmRow.getLocator()).toBeHidden();
    shouldCleanup = false;
  } finally {
    if (shouldCleanup) {
      await deleteAlgorithm(algorithmName).catch(console.error);
    }
  }
});
