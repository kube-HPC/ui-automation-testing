import { expect, test } from "@playwright/test";
import { PREFIX } from "../../../../config/env";
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

test("jobs filter by pipeline name", async ({ page }) => {
  const resourceName = generateTestName("jobsFilter");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.PIPELINES).click();

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    const runButton = pipelineRow.hkGridGetActionButton("run");
    await runButton.click();

    await page.getByRole("button", { name: "Run check" }).click();
    await page.getByRole("link", { name: "Jobs", exact: true }).click();

    await page.getByTestId("autoComplete-pipelineName").click();
    await page
      .getByTestId("autoComplete-pipelineName")
      .fill(PREFIX + pipelineName);
    await page.getByTestId("autoComplete-pipelineName").press("Enter");

    const jobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      pipelineName,
    );
    await expect(jobRow.getLocator()).toContainText(PREFIX + pipelineName);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
