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

test("download job result", async ({ page }) => {
  const resourceName = generateTestName("jobDownload");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

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
    // download is only available once the job completed
    const downloadButton = jobRow.getLocator().getByTestId("download");
    await expect(downloadButton).toBeVisible({ timeout: 120_000 });

    const downloadPromise = page.waitForEvent("download");
    await downloadButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBeTruthy();
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
