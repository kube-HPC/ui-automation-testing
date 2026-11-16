import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import { LONG_RUNNING_ALGORITHM_IMAGE } from "../../../../api/mocks/Algorithms/algorithmPayload";
import {
  createPipelineWithAlgorithm,
  deletePipeline,
} from "../../../../api/pipelineApi";
import { PREFIX } from "../../../../config/env";
import { getNamePrefix, gotoRootSection } from "../../../../helpers/global";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("reorder queued job", async ({ page }) => {
  const resourceName = generateTestName("reorderQueuedJob");
  const algorithmName = `${resourceName}alg`;
  const pipelineName = `${resourceName}pip`;

  await createPipelineWithAlgorithm(
    pipelineName,
    algorithmName,
    LONG_RUNNING_ALGORITHM_IMAGE,
    1,
  );

  try {
    await gotoRootSection(page, NamesLeftLink.PIPELINES);

    let pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await pipelineRow.hkGridGetActionButton("run").click();
    await page.getByRole("button", { name: "Run check" }).click();

    await getSideBarLeftLink(page, NamesLeftLink.JOBS).click();
    const firstJobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      pipelineName,
    );
    await expect(firstJobRow.getLocator()).toBeVisible();

    await getSideBarLeftLink(page, NamesLeftLink.PIPELINES).click();
    pipelineRow = hkGridFindRowByColumnText(page, "name", pipelineName);
    await pipelineRow.hkGridGetActionButton("run").click();
    await page.getByRole("button", { name: "Run check" }).click();

    await getSideBarLeftLink(page, NamesLeftLink.QUEUE).click();
    await page.getByTestId("queue-all-filter").click();
    await page
      .locator(".ant-select-dropdown:visible")
      .getByText("Tag", { exact: true })
      .click();
    await page.getByTestId("queue-edit-toggle").click();
    await page.getByTestId("queue-filter").click();
    await page
      .locator(".ant-select-dropdown:visible")
      .getByText("Jobid", { exact: true })
      .click();

    const fullPipelineName = getNamePrefix(pipelineName);
    const queueTable = page.getByTestId("queue-table");
    const preferredTable = page.getByTestId("preferred-table");
    const queuedRow = queueTable
      .locator("tbody tr")
      .filter({ hasText: fullPipelineName })
      .first();
    const preferredBody = preferredTable.locator("tbody").first();

    await expect(queuedRow).toBeVisible({ timeout: 30000 });
    await expect(preferredBody).toBeVisible();

    // Native HTML5 DnD: drop is registered via dragenter on preferred tbody + dragend on source row.
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await queuedRow.dispatchEvent("dragstart", { dataTransfer });
    await preferredBody.dispatchEvent("dragenter", { dataTransfer });
    await preferredBody.dispatchEvent("dragover", { dataTransfer });
    await preferredBody.dispatchEvent("drop", { dataTransfer });
    await queuedRow.dispatchEvent("dragend", { dataTransfer });

    await expect(
      preferredTable.locator("tbody tr").filter({ hasText: fullPipelineName }),
    ).toBeVisible({ timeout: 30000 });

    await page.getByTestId("preferred-filter").click();
    await page
      .locator(".ant-select-dropdown:visible")
      .getByText("Jobid", { exact: true })
      .click();

    const preferredRow = preferredTable
      .getByRole("row")
      .filter({ hasText: fullPipelineName });
    await expect(preferredRow).toBeVisible({ timeout: 30000 });
    await expect(preferredRow).toHaveAttribute(
      "data-testid",
      /^preferred-row-.+/,
    );
    const preferredRowTestId = await preferredRow.getAttribute("data-testid");
    const jobId = preferredRowTestId!.replace("preferred-row-", "");

    await preferredRow.getByTestId(`preferred-move-to-queue-${jobId}`).click();
    await page.getByTestId(`preferred-move-confirm-${jobId}`).click();
    await expect(queueTable.getByTestId(`queue-row-${jobId}`)).toBeVisible({
      timeout: 30000,
    });
    await expect(
      preferredTable.getByTestId(`preferred-row-${jobId}`),
    ).toHaveCount(0);

    await page.getByTestId("queue-edit-toggle").click();
    await page.getByTestId("queue-all-filter").click();
    await page
      .locator(".ant-select-dropdown:visible")
      .getByText("Jobid", { exact: true })
      .click();

    const allQueueRows = page
      .getByTestId("queue-all-table")
      .getByTestId(/^queue-all-row-/);
    await expect(
      allQueueRows.filter({ hasText: fullPipelineName }),
    ).toBeVisible({
      timeout: 30000,
    });
    await expect(
      allQueueRows.filter({ hasNotText: fullPipelineName }),
      "Clearing the queue must not stop jobs belonging to other pipelines",
    ).toHaveCount(0);
    await page.getByTestId("queue-clear-button").click();
    await page.getByTestId("queue-clear-confirm").click();
    await expect(allQueueRows).toHaveCount(0, { timeout: 30000 });
  } finally {
    try {
      await gotoRootSection(page, NamesLeftLink.JOBS);
      const jobRows = page
        .getByTestId("hk-grid")
        .getByRole("row")
        .filter({ hasText: PREFIX + pipelineName });

      for (const jobRow of await jobRows.all()) {
        await jobRow.hover();
        const stopButton = jobRow.getByTestId("stop");
        if ((await stopButton.isVisible()) && (await stopButton.isEnabled())) {
          await stopButton.click({ timeout: 5000 });
        }
      }
    } finally {
      await deletePipeline(pipelineName).catch(console.error);
      await deleteAlgorithm(algorithmName).catch(console.error);
    }
  }
});
