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

    await page.getByRole("cell", { name: "right" }).first().click();

    await page.getByTestId("on-switch-tab-json").click();

    await expect(page.getByText(`"${updatedDescription}"`)).toBeVisible();
  } finally {
    await deletePipeline(copiedPipelineName).catch(console.error);
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
