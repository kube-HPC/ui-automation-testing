import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../api/algorithmApi";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../api/pipelineApi";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../helpers/global";
import { generateTestName } from "../../../helpers/testDataFactory";

test("stop a worker", async ({ page }) => {
  const resourceName = generateTestName("stopAWorker");
  const algorithmName = `${resourceName}algorithm`;
  const pipelineName = `${resourceName}pipeline`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.PIPELINES).click();

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await pipelineRow.hkGridGetActionButton("run").click();
    await page.getByRole("button", { name: "Run check" }).click();

    const workersLink = getSideBarLeftLink(page, NamesLeftLink.WORKERS);
    if (!(await workersLink.isVisible())) {
      await getSideBarLeftLink(page, NamesLeftLink.OBSERVABILITY).click();
    }
    await expect(workersLink).toBeVisible();
    await workersLink.click();

    await page.getByTestId("stop-worker").first().click();
    await page.getByRole("button", { name: "Yes" }).click();

    await expect(page.getByRole("button", { name: "Yes" })).toBeHidden();
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
