import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import { LONG_RUNNING_ALGORITHM_IMAGE } from "../../../../api/mocks/Algorithms/algorithmPayload";
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

test("run pause and stop job", async ({ page }) => {
  const resourceName = generateTestName("runPauseStop");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;

  await createPipelineWithAlgorithm(
    pipelineName,
    algorithmName,
    LONG_RUNNING_ALGORITHM_IMAGE,
  );

  try {
    await gotoRootSection(page, NamesLeftLink.PIPELINES);
    await hkGridFindRowByColumnText(page, "name", pipelineName)
      .hkGridGetActionButton("run")
      .click();
    await page.getByRole("button", { name: "Run check" }).click();
    await getSideBarLeftLink(page, NamesLeftLink.JOBS).click();

    const jobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      pipelineName,
    );
    await jobRow.getLocator().hover();

    const pauseButton = jobRow.getLocator().getByTestId("pause");

    await expect(pauseButton).toBeVisible();
    await pauseButton.click();
    await page.waitForTimeout(3000);

    // resume click
    await pauseButton.click();
    await page.waitForTimeout(3000);

    const stopButton = jobRow.getLocator().getByTestId("stop");
    await expect(stopButton).toBeVisible();
    await stopButton.click();
    // stopping a job may end as stopped or failed depending on worker timing
    await expect(jobRow.getLocator()).toContainText(/stopped|failed/i);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
