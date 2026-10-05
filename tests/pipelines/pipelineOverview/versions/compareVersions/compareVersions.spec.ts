import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../../api/algorithmApi";
import { getKeycloakCredentials } from "../../../../../config/env";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../../api/pipelineApi";
import { gotoRootSection } from "../../../../../helpers/global";
import { NamesLeftLink } from "../../../../../helpers/sideBarLeft";
import { antTableFindRowByText } from "../../../../../helpers/tableAntd";
import { hkGridFindRowByColumnText } from "../../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../../helpers/testDataFactory";

test("pipeline versions compare", async ({ page }) => {
  const { username } = getKeycloakCredentials();
  const resourceName = generateTestName("pipVer");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pipe`;
  const copiedPipelineName = `${pipelineName}-c`;
  const updatedDescription = `des-${resourceName}`;

  await createPipelineWithAlgorithm(pipelineName, algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await expect(pipelineRow.getLocator()).toBeVisible();

    const pipelineRowForEdit = hkGridFindRowByColumnText(
      page,
      "name",
      pipelineName,
    );
    const editButton = pipelineRowForEdit.hkGridGetActionButton("edit");
    await editButton.click();

    const descriptionInput = page.getByTestId(
      "add-pipeline-initial-description-input",
    );
    await descriptionInput.fill(updatedDescription);

    const nextButton = page.getByRole("button", { name: "Next right" });
    await nextButton.click();
    await nextButton.click();
    await page.getByRole("button", { name: "Submit check" }).click();

    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    const pipelineRowForOverview = hkGridFindRowByColumnText(
      page,
      "name",
      pipelineName,
    );

    const overviewButton =
      pipelineRowForOverview.hkGridGetActionButton("overview");
    await overviewButton.click();

    await page.getByRole("tab", { name: "Versions" }).click();

    const versionsTableCheckboxs = page.getByTestId("versions-table-checkbox");
    await versionsTableCheckboxs.nth(0).click();
    await versionsTableCheckboxs.nth(1).click();

    await page.getByTestId("versions-compare-button").click();
    await page.locator("button").filter({ hasText: "Close" }).click();

    await page.getByRole("tab", { name: "Version Time Table" }).click();
    const developerRow = antTableFindRowByText(page, username);
    await expect(developerRow.getLocator()).toBeVisible();
  } finally {
    await deletePipeline(copiedPipelineName).catch(console.error);
    await deletePipeline(pipelineName).catch(console.error);
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
