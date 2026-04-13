import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";

test("edit algorithm", async ({ page }) => {
  const algorithmName = "edit-algorithm";

  await createAlgorithm(algorithmName);

  try {
    await page.goto(process.env.BASE_URL || "http://localhost:9050/");
    await page.getByTestId("left-sidebar-link-algorithms").click();

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    const editButtonInRow = algorithmRow.hkGridGetActionButton(page, "edit");
    await editButtonInRow.click();

    await expect(page.getByTestId("popup-drawer")).toContainText(algorithmName);
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
