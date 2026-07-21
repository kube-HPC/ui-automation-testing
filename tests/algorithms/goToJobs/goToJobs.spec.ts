import { test, expect } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../api/algorithmApi";
import { gotoRoot } from "../../../helpers/global";
import {
  getSideBarLeftLink,
  NamesLeftLink,
} from "../../../helpers/sideBarLeft";
import { generateTestName } from "../../../helpers/testDataFactory";

test("go to jobs button", async ({ page }) => {
  // Create a new alg
  const algName = generateTestName("goToJobsAlgorithm");

  try {
    const createdAlgorithm = await createAlgorithm(algName);
    // Go to algorithms
    await gotoRoot(page);
    await getSideBarLeftLink(page, NamesLeftLink.ALGORITHMS).click();
    // Run the algorithm
    await page
      .getByRole("row", { name: createdAlgorithm.name })
      .getByTestId("run")
      .click();
    // Click popup
    await page.getByRole("link", { name: "Jobs", exact: true }).click();
    // Expect it to move us to Jobs
    await expect(page).toHaveURL(/#\/jobs(?:\?|$)/);
  } finally {
    await deleteAlgorithm(algName).catch(console.error);
  }
});
