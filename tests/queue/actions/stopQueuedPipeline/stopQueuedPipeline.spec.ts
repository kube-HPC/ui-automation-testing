import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import { LONG_RUNNING_ALGORITHM_IMAGE } from "../../../../api/mocks/Algorithms/algorithmPayload";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../api/pipelineApi";
import { getNamePrefix, gotoRootSection } from "../../../../helpers/global";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("cancel and confirm stopping a queued pipeline", async ({ page }) => {
  const resourceName = generateTestName("stopQueuedPipeline");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;
  const fullPipelineName = getNamePrefix(pipelineName);

  try {
    await createPipelineWithAlgorithm(
      pipelineName,
      algorithmName,
      LONG_RUNNING_ALGORITHM_IMAGE,
      1,
    );

    await gotoRootSection(page, NamesLeftLink.PIPELINES);
    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await pipelineRow.hkGridGetActionButton("run").click();
    await page.getByRole("button", { name: "Run check" }).click();

    await getSideBarLeftLink(page, NamesLeftLink.JOBS).click();
    const firstJobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      pipelineName,
    );
    await expect(firstJobRow.getLocator()).toBeVisible();

    await getSideBarLeftLink(page, NamesLeftLink.PIPELINES).click();
    await pipelineRow.hkGridGetActionButton("run").click();
    await page.getByRole("button", { name: "Run check" }).click();

    await getSideBarLeftLink(page, NamesLeftLink.QUEUE).click();
    const stopButton = page.getByTestId(
      `queue-pipeline-stop-${fullPipelineName}`,
    );
    await expect(stopButton).toBeVisible({ timeout: 30000 });
    await stopButton.click();
    await page
      .getByTestId(`queue-pipeline-stop-cancel-${fullPipelineName}`)
      .click();
    await expect(stopButton).toBeVisible();

    await stopButton.click();
    await page
      .getByTestId(`queue-pipeline-stop-confirm-${fullPipelineName}`)
      .click();
    await expect(stopButton).toHaveCount(0, { timeout: 30000 });
  } finally {
    try {
      await gotoRootSection(page, NamesLeftLink.JOBS);
      const jobRows = page
        .getByTestId("hk-grid")
        .getByRole("row")
        .filter({ hasText: fullPipelineName });

      for (const jobRow of await jobRows.all()) {
        await jobRow.hover();
        const stopButton = jobRow.getByTestId("stop");
        if ((await stopButton.isVisible()) && (await stopButton.isEnabled())) {
          await stopButton.click({ timeout: 5000 });
        }
      }
    } finally {
      await deletePipeline(pipelineName).catch(console.error);
      await deleteAlgorithm(algorithmName).catch(console.error);
    }
  }
});
