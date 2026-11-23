import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../../api/algorithmApi";
import { NamesLeftLink } from "../../../../helpers/sideBarLeft";
import { antTableFindRowByText } from "../../../../helpers/tableAntd";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { getNamePrefix, gotoRootSection } from "../../../../helpers/global";
import { generateTestName } from "../../../../helpers/testDataFactory";

// Resolved by Playwright relative to the repo root (where tests are run from).
const algorithmZipPath = "api/mocks/Algorithms/algoTest.zip";

test("build algorithm from code", async ({ page }) => {
  const algorithmName = generateTestName("buildAlgorithm");
  const algorithmFullName = getNamePrefix(algorithmName);

  try {
    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    await page.getByRole("button", { name: "New Algorithm" }).click();

    await page
      .getByTestId("add-algorithm-main-name-input")
      .fill(algorithmFullName);
    await page.getByText("File").click();
    await page
      .getByTestId("add-algorithm-main-description-input")
      .fill("this test is check build flow");

    await page.getByRole("combobox", { name: "* Environment :" }).click();
    await page.getByTitle("Python").click();

    await page
      .getByTestId("add-algorithm-code-entry-point-input")
      .fill("algoTestRun.py");

    await page
      .getByRole("button", { name: "inbox Click or drag Algorithm" })
      .locator('input[type="file"]')
      .setInputFiles(algorithmZipPath);

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("tab", { name: "Builds" }).click();

    // Build from code can take a few minutes until it completes.
    const buildRow = antTableFindRowByText(page, "completed");
    await expect(buildRow.getLocator()).toBeVisible({ timeout: 300_000 });

    await buildRow.getLocator().locator(".anticon-right").first().click();

    await page.getByRole("button", { name: "copy" }).first().click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBeTruthy();

    const buildsTable = page.getByTestId("tableAntd");
    await buildsTable.getByRole("tab", { name: "Information" }).click();
    await expect(
      buildsTable.getByText(`buildId: "${algorithmFullName}-`).first(),
    ).toBeVisible();

    await page.getByTestId("rerun-build-button").click();
    await page.waitForTimeout(2000);
    await page.getByTestId("cancel-build-button").click();

    await gotoRootSection(page, NamesLeftLink.ALGORITHMS);

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    await expect(algorithmRow.getLocator()).toContainText(algorithmFullName);
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
