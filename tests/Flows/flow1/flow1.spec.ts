import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/#/jobs?&experiment=main");
  await page.getByRole("link", { name: "algorithms" }).click();
  await page.getByRole("button", { name: "play-circle" }).nth(3).click();
});
