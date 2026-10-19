import { expect, test } from "@playwright/test";
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

test("jobs filter by tags", async ({ page }) => {
  const resourceName = generateTestName("jobsFilterTags");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.PIPELINES).click();

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    const runButton = pipelineRow.hkGridGetActionButton("run");
    await runButton.click();

    await page.locator(".anticon.anticon-plus > svg").first().click();
    await page.getByRole("textbox").first().fill("testTag");
    await page.getByRole("textbox").first().press("Enter");
    await page.getByRole("button", { name: "Run check" }).click();
    await page.getByRole("link", { name: "Jobs", exact: true }).click();

    await page.getByTestId("autoComplete-tags").click();
    await page.getByTestId("autoComplete-tags").fill("testTag");
    await page.getByTestId("autoComplete-tags").press("Enter");

    const jobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      pipelineName,
    );
    await expect(jobRow.getLocator()).toContainText(pipelineName);
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
