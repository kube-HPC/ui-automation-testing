import { expect, test } from "@playwright/test";
import { createAlgorithm } from "../../../../api/algorithmApi";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";

test("delete algorithm", async ({ page }) => {
  const algorithmName = "delete-algorithm";

  // create algorithm to delete
  const algo = await createAlgorithm(algorithmName);

  // link to algorithms page
  await page.goto("/");
  await page.getByTestId("left-sidebar-link-algorithms").click();

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
