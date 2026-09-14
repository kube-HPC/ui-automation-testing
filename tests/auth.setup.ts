import path from "path";
import { expect, test as setup } from "@playwright/test";
import { gotoRoot } from "../helpers/global";
import { generateTestName } from "../helpers/testDataFactory";
import { getKeycloakCredentials } from "../config/env";

const authStatePath = path.resolve(__dirname, "../playwright/.auth/user.json");

setup("authenticate once for UI tests", async ({ page }) => {
  const runId = generateTestName("authSetup");
  setup.info().annotations.push({ type: "runId", description: runId });

  const { username, password } = getKeycloakCredentials();

  await gotoRoot(page);
  await page.getByPlaceholder("Username").click();
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  // await page.waitForTimeout(3000); // Adjust the timeout as needed
  await expect(page.getByTestId("header-avatar")).toBeVisible();
  await page.context().storageState({ path: authStatePath });
});
