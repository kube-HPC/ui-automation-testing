import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("run algorithm params", async ({ page }) => {
  const algorithmName = generateTestName("runAlgorithm");

  await createAlgorithm(algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.ALGORITHMS).click();

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    const runButtonInRow = algorithmRow.hkGridGetActionButton("run");
    await runButtonInRow.hover();
    await page.waitForTimeout(2000); // wait for the job row to be visible

    const inputTextbox = page.getByRole("textbox", {
      name: 'ex. {"key": "value"} Or [1,"2',
    });
    await inputTextbox.fill("[1,2,3]");
    await page.getByRole("button", { name: "plus Add Input" }).click();
    await page.locator("#runAlgorithm_inputs_1").fill('{"key":"pwkeytest"}');
    await page.getByRole("button", { name: "Run" }).click();
    await getSideBarLeftLink(page, NamesLeftLink.JOBS).click();

    const jobRow = await hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      algorithmName,
    );
    await expect(jobRow.getLocator()).toBeVisible();
    await jobRow.getLocator().hover();

    const overviewButtonInJobRow = jobRow.hkGridGetActionButton("overview");
    await overviewButtonInJobRow.click();
    await page.getByRole("tab", { name: "extended pipeline" }).click();
    await expect(page.getByText("pwkeytest")).toBeVisible();
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
