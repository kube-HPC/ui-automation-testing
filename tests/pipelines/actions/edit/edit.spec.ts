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

test("edit pipeline", async ({ page }) => {
  const resourceName = generateTestName("editPipeline");
  const algorithmName = `${resourceName}algorithm`;
  const pipelineName = `${resourceName}pipeline`;
  const updatedDescription = "test edit pipeline";

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await expect(pipelineRow.getLocator()).toBeVisible();

    const editButtonInRow = pipelineRow.hkGridGetActionButton("edit");
    await editButtonInRow.click();

    const descriptionInput = page.getByTestId(
      "add-pipeline-initial-description-input",
    );
    await descriptionInput.click();
    await descriptionInput.fill(updatedDescription);

    const nextButton = page.getByRole("button", { name: "Next right" });
    await nextButton.click();
    await page.waitForTimeout(1000);
    await nextButton.click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Submit check" }).click();
    await page.waitForTimeout(2000);
    const editedPipelineRow = hkGridFindRowByColumnText(
      page,
      "name",
      pipelineName,
    );
    const editButtonAfterSave = editedPipelineRow.hkGridGetActionButton("edit");
    await editButtonAfterSave.click();
    await page.waitForTimeout(2000);
    await expect(descriptionInput).toHaveValue(updatedDescription);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
