import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";
import { generateTestName } from "../../../../helpers/testDataFactory";

test("run algorithm", async ({ page }) => {
  const algorithmName = generateTestName("runAlgorithm");

  await createAlgorithm(algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.ALGORITHMS).click();

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    const runButtonInRow = algorithmRow.hkGridGetActionButton("run");
    await runButtonInRow.click();

    await getSideBarLeftLink(page, NamesLeftLink.JOBS).click();
    const jobRow = hkGridFindRowByColumnText(
      page,
      "pipeline.name",
      algorithmName,
    );

    await expect(jobRow.getLocator()).toContainText(algorithmName);
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
