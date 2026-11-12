import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../../api/algorithmApi";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../../api/pipelineApi";
import { gotoRootSection } from "../../../../../helpers/global";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../../helpers/testDataFactory";

test("job extended pipeline tab download and copy json", async ({ page }) => {
  const resourceName = generateTestName("jobExtendedPipeline");
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
    await page
      .getByRole("tab", { name: "extended pipeline", exact: true })
      .click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("jobs-download-flow-input").click();
    const download = await downloadPromise;
    expect(await download.failure()).toBeNull();
    expect(download.suggestedFilename()).not.toBe("");

    await page.getByRole("button", { name: "Copy", exact: true }).click();
    await expect(
      page.getByText("JSON Copied to Clipboard").first(),
    ).toBeVisible();

    await page.getByTestId("json-switch-tab-table").click();
    await expect(page.getByTestId("json-table-value-name")).toContainText(
      pipelineName,
    );
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
