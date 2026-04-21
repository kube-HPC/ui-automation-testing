import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";
import { gotoRoot } from "../../../../helpers/global";

test("run algorithm", async ({ page }) => {
  const algorithmName = "run-algorithm";

  await createAlgorithm(algorithmName);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, "algorithms").click();

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    const runButtonInRow = algorithmRow.hkGridGetActionButton(page, "run");
    await runButtonInRow.click();

    await getSideBarLeftLink(page, "jobs").click();
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
