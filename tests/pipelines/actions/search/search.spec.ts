import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../api/pipelineApi";
import { gotoRoot } from "../../../../helpers/global";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("search pipeline", async ({ page }) => {
  const resourceName = generateTestName("searchpipeline");
  const algorithmName = resourceName + "algorithm";
  const pipelineName = resourceName + "pipeline";

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.PIPELINES).click();

    await page.locator("#qPipelineName").fill(pipelineName);
    await page.locator("#qPipelineName").press("Enter");

    const dataRows = page
      .getByTestId("hk-grid")
      .locator('[role="row"][row-index]');

    await expect(dataRows).toHaveCount(1);

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await expect(pipelineRow.getLocator()).toContainText(pipelineName);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
