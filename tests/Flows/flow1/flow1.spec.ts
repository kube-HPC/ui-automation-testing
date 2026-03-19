import { test, expect } from "@playwright/test";

test.use({
  viewport: {
    height: 1080,
    width: 1920,
  },
});

test("test", async ({ page }) => {
  await page.goto("/#/jobs?&experiment=main");
  await page.getByRole("link", { name: "pipelines" }).click();
  await page.getByRole("button", { name: "down" }).click();
  await page.getByTestId("NewButtonSelect-add-pipeline").click();
  await page.locator(".ant-drawer-mask").click();
});
