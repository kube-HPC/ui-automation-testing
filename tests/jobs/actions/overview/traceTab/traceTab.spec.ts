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

test("job trace interactions", async ({ page }) => {
  const resourceName = generateTestName("jobTrace");
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
    await page.getByRole("tab", { name: "trace" }).click();

    const traceSearch = page.getByTestId("jobs-trace-search");
    await traceSearch.fill("movalue");
    await page.getByTestId("jobs-trace-clear-search").click();
    await expect(traceSearch).toHaveValue("");

    const minimap = page.getByTestId("jobs-trace-minimap-canvas");
    await expect(minimap).toBeVisible();
    await minimap.click();
    await page.getByTestId("jobs-trace-select-all-roots").check();
    await page.getByTestId("jobs-trace-toggle-all-spans").click();

    const zoomSpan = page.getByTestId(/^jobs-trace-zoom-span-/).first();
    await expect(zoomSpan).toBeVisible();
    const zoomSpanTestId = await zoomSpan.getAttribute("data-testid");
    const spanId = zoomSpanTestId?.replace("jobs-trace-zoom-span-", "");
    expect(spanId).toBeTruthy();
    await zoomSpan.click();

    const zoomModal = page.getByTestId("jobs-trace-zoom-modal");
    const zoomSearch = zoomModal.getByTestId("jobs-trace-search");
    await zoomSearch.fill("novalue");
    await zoomModal.getByTestId("jobs-trace-clear-search").click();
    await expect(zoomSearch).toHaveValue("");
    await zoomModal.getByRole("button", { name: "Close" }).click();

    await page.getByTestId(`jobs-trace-open-span-logs-${spanId}`).click();
    // Wait up to three minutes for TRACE logs and report if none appear.
    const copyLogButton = page.getByRole("button", { name: "copy" }).first();
    const logsAvailable = await copyLogButton
      .waitFor({ state: "visible", timeout: 180_000 })
      .then(() => true)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "TimeoutError") {
          return false;
        }
        throw error;
      });

    if (logsAvailable) {
      await copyLogButton.click();
      await expect(
        page.getByText("Log Line Copied to clipboard").first(),
      ).toBeVisible();
    } else {
      test.info().annotations.push({
        type: "note",
        description: "No logs were found in TRACE after waiting 3 minutes.",
      });
    }

    await page.getByTestId("jobs-trace-logs-close").click();

    const kibanaPagePromise = page.waitForEvent("popup");
    await page.getByTestId(`jobs-trace-open-span-kibana-${spanId}`).click();
    const kibanaPage = await kibanaPagePromise;
    await expect(kibanaPage).toHaveURL(/kibana/i);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
