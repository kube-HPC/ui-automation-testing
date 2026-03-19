import { expect, test } from "@playwright/test";
import { createAlgorithm } from "../../../../api/algorithmApi";

test("delete algorithm", async ({ page }) => {
  const algorithmName = "delete-algorithm";
  const algo = await createAlgorithm(algorithmName);

  // link to algorithms page
  await page.goto("/#/jobs?&experiment=main");
  await page.getByTestId("left-sidebar-link-algorithms").click();

  // find the algorithm row by name and click delete
  const algorithmRow = page
    .getByTestId("hk-grid")
    .locator('[role="row"]')
    .filter({
      has: page.locator('[col-id="name"]', { hasText: algorithmName }),
    })
    .first();

  const deleteButtonInRow = algorithmRow
    .getByTestId("algorithm-actions")
    .locator("button")
    .filter({ has: page.locator('[aria-label="delete"]') })
    .first();
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

  const deletedAlgorithmRow = page
    .getByTestId("hk-grid")
    .locator('[role="row"]')
    .filter({
      has: page.locator('[col-id="name"]', { hasText: algorithmName }),
    })
    .first();

  await expect(deletedAlgorithmRow).toBeHidden();
});
