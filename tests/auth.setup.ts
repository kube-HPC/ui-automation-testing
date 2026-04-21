import path from "path";
import { expect, test as setup } from "@playwright/test";
import { gotoRoot } from "../helpers/global";

const authStatePath = path.resolve(__dirname, "../playwright/.auth/user.json");

setup("authenticate once for UI tests", async ({ page }) => {
  const username = process.env.KEYCLOAK_USERNAME;
  const password = process.env.KEYCLOAK_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Missing KEYCLOAK_USERNAME/KEYCLOAK_PASSWORD while Keycloak auth is enabled.",
    );
  }

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
