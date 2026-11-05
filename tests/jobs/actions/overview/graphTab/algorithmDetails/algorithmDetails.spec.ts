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

test("algorithm details copy json", async ({ page }) => {
  const resourceName = generateTestName("algorithmDetails");
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
    await jobRow.hkGridGetActionButton("overview").click();

    await page.getByRole("tab", { name: "Algorithm Details" }).click();
    await page.getByTestId("json-switch-tab-json").click();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(
      page.getByText("JSON Copied to Clipboard").first(),
    ).toBeVisible();

    await page.getByTestId("json-switch-tab-table").click();
    await expect(page.getByText("version").first()).toBeVisible();
  } finally {
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
