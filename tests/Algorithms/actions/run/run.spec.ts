import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";

test("run algorithm", async ({ page }) => {
  const algorithmName = "run-algorithm";

  await createAlgorithm(algorithmName);

  try {
    await page.goto(process.env.BASE_URL || "http://localhost:9050/");
    await getSideBarLeftLink(page, "algorithms").click();

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    const runButtonInRow = algorithmRow.hkGridGetActionButton(page, "run"); //play-circle in button run
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
