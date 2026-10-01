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
  const resourceName = generateTestName("pipelineVersions");
  const algorithmName = `${resourceName}algorithm`;
  const pipelineName = `${resourceName}pipeline`;
  const copiedPipelineName = `${pipelineName}-copy`;
  const updatedDescription = `description-${resourceName}`;

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
    const overviewButton =
      pipelineRowForOverview.hkGridGetActionButton("overview");
    await overviewButton.click();

    await page.getByRole("tab", { name: "Versions" }).click();
    await page.locator(".anticon.anticon-right > svg > path").first().click();
    await expect(page.getByText(`"${updatedDescription}"`)).toBeVisible();
    await page.getByRole("button", { name: "save" }).first().click();

    const pipelineNameInput = page.getByRole("textbox", {
      name: "Enter pipeline name",
    });
    await pipelineNameInput.fill(copiedPipelineName);
    await page.getByRole("button", { name: "Save Pipeline" }).click();

    await gotoRootSection(page, NamesLeftLink.PIPELINES);
    const copiedPipelineRow = hkGridFindRowByColumnText(
      page,
      "name",
      copiedPipelineName,
    );
    await expect(copiedPipelineRow.getLocator()).toBeVisible();

    const deleteCopiedPipelineButton =
      copiedPipelineRow.hkGridGetActionButton("delete");
    await deleteCopiedPipelineButton.click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(copiedPipelineRow.getLocator()).toBeHidden();
  } finally {
    await deletePipeline(copiedPipelineName).catch(console.error);
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
