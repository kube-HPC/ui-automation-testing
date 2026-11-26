import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { gotoRootSection } from "../../../../helpers/global";
import { NamesLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("algorithm overview version time table tab", async ({ page }) => {
  const algorithmName = generateTestName("ver-time-table");

  await createAlgorithm(algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    await algorithmRow.hkGridGetActionButton("overview").click();

    await page.getByRole("tab", { name: "Version Time Table" }).click();

    const timestampHeader = page.getByRole("columnheader", {
      name: "Timestamp",
    });
    await expect(timestampHeader).toBeVisible();
    await timestampHeader.click();

    const editButton = page.getByRole("button", { name: "Edit", exact: true });
    await expect(editButton).toBeEnabled();
    await editButton.click();
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
