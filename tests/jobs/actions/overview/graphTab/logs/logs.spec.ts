import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../../../api/algorithmApi";
import { LONG_RUNNING_ALGORITHM_IMAGE } from "../../../../../../api/mocks/Algorithms/algorithmPayload";
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

test("job logs search in kibana", async ({ page }) => {
  const resourceName = generateTestName("jobLogs");
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
    await jobRow.hkGridGetActionButton("overview").click();

    await page.getByRole("tab", { name: "graph" }).click();
    await page.getByTestId("jobs-run-node").click();
    await page.getByTestId("jobs-debug-node").click();

    await page.getByTestId("jobs-log-source-selector").click();
    await page.getByText("All", { exact: true }).click();

    await page.getByTestId("jobs-search-logs").click();
    await page.getByText("online").click();
    await page.getByText("saved").click();

    await page.getByTestId("jobs-search-logs").click();
    await page.getByTestId("jobs-search-logs").fill("run");

    const kibanaPagePromise = page.waitForEvent("popup");
    await page.getByTestId("jobs-search-logs-in-kibana").click();
    const kibanaPage = await kibanaPagePromise;

    await expect(kibanaPage).toHaveURL(/kibana/i);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
