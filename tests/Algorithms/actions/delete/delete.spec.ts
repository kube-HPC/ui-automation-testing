import { expect, test } from "@playwright/test";
import { createAlgorithm } from "../../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";

test("delete algorithm", async ({ page }) => {
  const algorithmName = "delete-algorithm";

  // create algorithm to delete
  const algo = await createAlgorithm(algorithmName);

  // link to algorithms page
  await gotoRoot(page);
  await getSideBarLeftLink(page, "algorithms").click();

  // find the algorithm row by name and click delete
  const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
  const deleteButtonInRow = algorithmRow.hkGridGetActionButton(page, "delete");
  await deleteButtonInRow.click();

  // confirm delete
  const ConfirmButtonInPopup = page
    .getByTestId("delete-algorithm-modal")
    .locator("button")
    .filter({ hasText: "Confirm" })
    .first();
  await ConfirmButtonInPopup.click();

  // assert algorithm is deleted
  await page.waitForTimeout(1000); // wait for deletion to complete

  const deletedAlgorithmRow = hkGridFindRowByColumnText(
    page,
    "name",
    algorithmName,
  );

  await expect(deletedAlgorithmRow.getLocator()).toBeHidden();
});
