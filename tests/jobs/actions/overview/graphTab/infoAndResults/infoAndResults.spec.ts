import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../../../api/algorithmApi";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../../../api/pipelineApi";
import { gotoRootSection } from "../../../../../../helpers/global";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../../../helpers/testDataFactory";

test("job info and results download and copy json", async ({ page }) => {
  const resourceName = generateTestName("infoAndResults");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;

  try {
    await createPipelineWithAlgorithm(pipelineName, algorithmName);
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
    await expect(jobRow.getLocator()).toContainText(/completed|failed/i, {
      timeout: 120_000,
    });
    await jobRow.getLocator().hover();
    await jobRow.hkGridGetActionButton("overview").click();

    await page.getByRole("tab", { name: "Info & Results" }).click();
    const completedFilter = page.getByTestId(
      "jobs-task-status-filter-completed",
    );
    await completedFilter.check();
    await expect(completedFilter).toBeChecked();
    await page.getByTestId("jobs-clear-task-status-filters").click();
    await expect(completedFilter).not.toBeChecked();

    const resultsPanel = page.getByRole("tabpanel");
    const rightArrow = resultsPanel.getByRole("img", {
      name: "right",
      exact: true,
    });
    if (await rightArrow.count()) {
      await rightArrow.click();
    }

    const downloadButton = resultsPanel.getByTestId(
      /^jobs-download-node-results-/,
    );
    await expect(downloadButton).toHaveCount(1);
    const downloadPromise = page.waitForEvent("download");
    await downloadButton.click();
    const download = await downloadPromise;
    expect(await download.failure()).toBeNull();
    expect(download.suggestedFilename()).not.toBe("");

    await page.getByTestId("json-switch-tab-json").click();
    await page.getByRole("button", { name: "Copy", exact: true }).click();
    await expect(
      page.getByText("JSON Copied to Clipboard").first(),
    ).toBeVisible();

    await page.getByTestId("json-switch-tab-table").click();
    await expect(page.getByTestId("json-table-value-status")).toContainText(
      /completed|failed/i,
    );
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
