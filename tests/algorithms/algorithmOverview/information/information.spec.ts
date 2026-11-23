import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { NamesLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { getNamePrefix, gotoRootSection } from "../../../../helpers/global";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("algorithm overview information tab", async ({ page }) => {
  const algorithmName = generateTestName("infoAlgorithm");
  const algorithmFullName = getNamePrefix(algorithmName);

  await createAlgorithm(algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    await algorithmRow.hkGridGetActionButton("overview").click();

    await page.getByRole("tab", { name: "Information" }).click();
    await expect(
      page.getByText(`"${algorithmFullName}"`).first(),
    ).toBeVisible();

    await page.getByTestId("json-switch-tab-table").click();
    await expect(page.getByTestId("json-table-value-name")).toContainText(
      algorithmFullName,
    );
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
