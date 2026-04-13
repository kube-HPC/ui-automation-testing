import { expect, test } from "@playwright/test";
import { createAlgorithm } from "../../../../api/algorithmApi";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";

test("edit algorithm", async ({ page }) => {
  const algorithmName = "edit-algorithm";

  // create algorithm to edit
  const algo = await createAlgorithm(algorithmName);

  // link to algorithms page
  await page.goto(process.env.BASE_URL || "http://localhost:9050/");
  await page.getByTestId("left-sidebar-link-algorithms").click();

  // find the algorithm row by name and click edit
  const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
  const editButtonInRow = algorithmRow.hkGridGetActionButton(page, "edit");
  await editButtonInRow.click();
  // assert edit drawer is open with correct algorithm details
  await expect(page.getByTestId("popup-drawer")).toContainText(algorithmName);
});
