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

test("delete pipeline", async ({ page }) => {
  const resourceName = generateTestName("deletePipeline");
  const algorithmName = `${resourceName}algorithm`;
  const pipelineName = `${resourceName}pipeline`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await expect(pipelineRow.getLocator()).toBeVisible();

    const deleteButtonInRow = pipelineRow.hkGridGetActionButton("delete");
    await deleteButtonInRow.click();

    const confirmButtonInPopup = page.getByRole("button", {
      name: "Confirm",
    });
    await confirmButtonInPopup.click();

    const deletedPipelineRow = hkGridFindRowByColumnText(
      page,
      "name",
      pipelineName,
    );
    await expect(deletedPipelineRow.getLocator()).toBeHidden();
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
