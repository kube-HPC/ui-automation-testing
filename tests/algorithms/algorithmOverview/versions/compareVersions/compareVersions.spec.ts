import { expect, test } from "@playwright/test";
import {
  createAlgorithm,
  deleteAlgorithm,
} from "../../../../../api/algorithmApi";
import { getKeycloakCredentials } from "../../../../../config/env";
import { gotoRootSection } from "../../../../../helpers/global";
import { NamesLeftLink } from "../../../../../helpers/sideBarLeft";
import { antTableFindRowByText } from "../../../../../helpers/tableAntd";
import { hkGridFindRowByColumnText } from "../../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../../helpers/testDataFactory";

test("algorithm versions compare", async ({ page }) => {
  const { username } = getKeycloakCredentials();
  const resourceName = generateTestName("algVer");
  const algorithmName = `${resourceName}alg`;
  const copiedAlgorithmName = `${algorithmName}-c`;
  const updatedDescription = `des-${resourceName}`;

  await createAlgorithm(algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    await expect(algorithmRow.getLocator()).toBeVisible();

    const algorithmRowForEdit = hkGridFindRowByColumnText(
      page,
      "name",
      algorithmName,
    );
    const editButton = algorithmRowForEdit.hkGridGetActionButton("edit");
    await editButton.click();

    const descriptionInput = page.getByTestId(
      "add-algorithm-main-description-input",
    );
    await descriptionInput.fill(updatedDescription);

    await page.getByRole("button", { name: "Save" }).click();

    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    const algorithmRowForOverview = hkGridFindRowByColumnText(
      page,
      "name",
      algorithmName,
    );

    const overviewButton =
      algorithmRowForOverview.hkGridGetActionButton("overview");
    await overviewButton.click();

    await page.getByRole("tab", { name: "Versions" }).click();

    const versionsTableCheckboxs = page.getByTestId("versions-table-checkbox");
    await versionsTableCheckboxs.nth(0).click();
    await versionsTableCheckboxs.nth(1).click();

    await page.getByTestId("algorithm-versions-compare-button").click();
    await page.locator("button").filter({ hasText: "Close" }).click();

    await page.getByRole("tab", { name: "Version Time Table" }).click();
    const developerRow = antTableFindRowByText(page, username);
    await expect(developerRow.getLocator()).toBeVisible();
  } finally {
    await deleteAlgorithm(copiedAlgorithmName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
