import { expect, test } from "@playwright/test";
import {
  createAlgorithm,
  deleteAlgorithm,
} from "../../../../../api/algorithmApi";
import { gotoRootSection } from "../../../../../helpers/global";
import { NamesLeftLink } from "../../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../../helpers/testDataFactory";

test("algorithm versions", async ({ page }) => {
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

    const algorithmRowForOverview = hkGridFindRowByColumnText(
      page,
      "name",
      algorithmName,
    );

    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    const overviewButton =
      algorithmRowForOverview.hkGridGetActionButton("overview");
    await overviewButton.click();

    await page.getByRole("tab", { name: "Versions" }).click();

    await page.getByTestId("versions-table-expandable").first().click();

    // await page.getByTestId("json-switch-tab-json").click();
    await page.waitForTimeout(3000);
    const jsonBlock = page.getByTestId("react-json-view").first();
    await expect(jsonBlock.getByText(`"${updatedDescription}"`)).toBeVisible();

    await page.waitForTimeout(3000);
    // check actions version save as new

    const saveCurrentVersionButton = page
      .locator('[data-testid="save-current-version"]:visible')
      .first();
    await expect(saveCurrentVersionButton).toBeVisible();
    await saveCurrentVersionButton.click();

    await page
      .getByRole("textbox", { name: "Enter algorithm name" })
      .fill(copiedAlgorithmName);
    await page.getByRole("button", { name: "Save Algorithm" }).click();

    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    const algorithmRowForOverviewStep2 = hkGridFindRowByColumnText(
      page,
      "name",
      algorithmName,
    );

    const overviewButtonStep2 =
      algorithmRowForOverviewStep2.hkGridGetActionButton("overview");
    await overviewButtonStep2.click();

    await page.waitForTimeout(3000);
    // check actions version change
    await page.getByRole("tab", { name: "Versions" }).click();
    await page.getByTestId("update-current-version").nth(1).click();
    await page.getByRole("button", { name: "Change Version" }).click();

    await page.waitForTimeout(3000);
    // check actions version delete

    const deleteCurrentVersionButton = page
      .locator('[data-testid="delete-current-version"]:visible')
      .first();
    await expect(deleteCurrentVersionButton).toBeVisible();
    await deleteCurrentVersionButton.click();

    await page.getByRole("button", { name: "Delete Version" }).click();

    const deleteCurrentVersionButtons = page.getByTestId(
      "delete-current-version",
    );
    await expect(deleteCurrentVersionButtons).toHaveCount(1);
    await expect(deleteCurrentVersionButtons.first()).toBeDisabled();
  } finally {
    await deleteAlgorithm(copiedAlgorithmName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
