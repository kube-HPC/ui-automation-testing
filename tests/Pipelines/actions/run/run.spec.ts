import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../api/pipelineApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";

test("run pipeline and check jobs via link", async ({ page }) => {
  const suffix = Math.random().toString(36).substring(2, 8);
  const algorithmName = `run-pipe-${suffix}`;
  const pipelineName = `run-pipe-${suffix}`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, "pipelines").click();

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    const runButton = pipelineRow.hkGridGetActionButton("run");
    await runButton.click();

    await page.getByRole("button", { name: "Run check" }).click();

    await page.getByRole("link", { name: "Jobs", exact: true }).click();

    const jobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      pipelineName,
    );
    await expect(jobRow.getLocator()).toBeVisible();
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
