import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../api/pipelineApi";
import { gotoRootSection } from "../../../../helpers/global";
import { NamesLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("pipeline versions", async ({ page }) => {
  const resourceName = generateTestName("pipVer");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pipe`;
  const copiedPipelineName = `${pipelineName}-c`;
  const updatedDescription = `des-${resourceName}`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await expect(pipelineRow.getLocator()).toBeVisible();

    const pipelineRowForEdit = hkGridFindRowByColumnText(
      page,
      "name",
      pipelineName,
    );
    const editButton = pipelineRowForEdit.hkGridGetActionButton("edit");
    await editButton.click();

    const descriptionInput = page.getByTestId(
      "add-pipeline-initial-description-input",
    );
    await descriptionInput.fill(updatedDescription);

    const nextButton = page.getByRole("button", { name: "Next right" });
    await nextButton.click();
    await nextButton.click();
    await page.getByRole("button", { name: "Submit check" }).click();

    const pipelineRowForOverview = hkGridFindRowByColumnText(
      page,
      "name",
      pipelineName,
    );

    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const overviewButton =
      pipelineRowForOverview.hkGridGetActionButton("overview");
    await overviewButton.click();

    await page.getByRole("tab", { name: "Versions" }).click();

    await page.getByTestId("versions-table-expandable").first().click();

    // await page.getByTestId("json-switch-tab-json").click();

    await expect(page.getByText(`"${updatedDescription}"`)).toBeVisible();

    await page.waitForTimeout(3000);
    // check actions version save as new

    const saveCurrentVersionButton = page
      .locator('[data-testid="save-current-version"]:visible')
      .first();
    await expect(saveCurrentVersionButton).toBeVisible();
    await saveCurrentVersionButton.click();

    await page
      .getByRole("textbox", { name: "Enter pipeline name" })
      .fill(copiedPipelineName);
    await page.getByRole("button", { name: "Save Pipeline" }).click();

    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const pipelineRowForOverviewStep2 = hkGridFindRowByColumnText(
      page,
      "name",
      pipelineName,
    );

    const overviewButtonStep2 =
      pipelineRowForOverviewStep2.hkGridGetActionButton("overview");
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
    await deletePipeline(copiedPipelineName).catch(console.error);
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
