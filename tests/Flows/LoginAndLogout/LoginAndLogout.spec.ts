import { test, expect } from "@playwright/test";
import { gotoRoot } from "../../../helpers/global";

test("LoginAndLogout", async ({ page }) => {
  const isKeycloakEnabled =
    (process.env.VITE_KEYCLOAK_ENABLE || "").toUpperCase() === "TRUE";
  const username = process.env.KEYCLOAK_USERNAME;
  const password = process.env.KEYCLOAK_PASSWORD;

  // Open HKube login page
  await gotoRoot(page);

  if (isKeycloakEnabled) {
    if (!username || !password) {
      throw new Error(
        "Missing KEYCLOAK_USERNAME/KEYCLOAK_PASSWORD while Keycloak auth is enabled.",
      );
    }

    //  Fill username
    await page.getByPlaceholder("Username").click();
    await page.getByPlaceholder("Username").fill(username);

    //  Fill password
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill(password);

    //  Click Log In
    await page.getByRole("button", { name: "Log In" }).click();

    //  If user menu is visible, log out
    if (await page.getByTestId("header-avatar").isVisible()) {
      await page.getByTestId("header-avatar").click();
      await page.getByTestId("link-logout").click();

      // Verify that we returned to login screen
      await expect(
        page.getByRole("heading", { name: "Hkube Log In" }),
      ).toBeVisible();
    }
  }
});
