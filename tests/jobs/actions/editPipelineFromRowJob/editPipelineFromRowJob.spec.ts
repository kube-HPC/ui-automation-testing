import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../api/pipelineApi";
import { gotoRootSection } from "../../../../helpers/global";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("edit pipeline from job row", async ({ page }) => {
  const resourceName = generateTestName("editPipelineFromJob");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;
  const updatedDescription = "edited from job row";

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await pipelineRow.hkGridGetActionButton("run").click();
    await page.getByRole("button", { name: "Run check" }).click();
    await getSideBarLeftLink(page, NamesLeftLink.JOBS).click();

    const jobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      pipelineName,
    );
    jobRow.getLocator().hover();
    await jobRow.getLocator().getByTestId("pipeline-name-edit").click();

    const descriptionInput = page.getByTestId(
      "add-pipeline-initial-description-input",
    );
    await descriptionInput.fill(updatedDescription);
    const nextButton = page.getByRole("button", { name: "Next right" });
    await nextButton.click();
    await nextButton.click();
    await page.getByRole("button", { name: "Submit check" }).click();

    await getSideBarLeftLink(page, NamesLeftLink.JOBS).click();
    await jobRow.getLocator().getByTestId("pipeline-name-edit").click();
    await expect(descriptionInput).toHaveValue(updatedDescription);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
