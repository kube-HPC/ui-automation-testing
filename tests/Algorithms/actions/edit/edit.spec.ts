import { expect, test } from "@playwright/test";
import { createAlgorithm, deleteAlgorithm } from "../../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../../helpers/tableHkGrid";

test("edit algorithm", async ({ page }) => {
  const algorithmName = "edit-algorithm";

  await createAlgorithm(algorithmName);

  try {
    await page.goto(process.env.BASE_URL || "http://localhost:9050/");
    await getSideBarLeftLink(page, "algorithms").click();

    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    const editButtonInRow = algorithmRow.hkGridGetActionButton(page, "edit");
    await editButtonInRow.click();

    await page.getByRole("textbox", { name: "Description :" }).click();
    await page
      .getByRole("textbox", { name: "Description :" })
      .fill("test edit");

    await page.getByRole("button", { name: "Save" }).click();
    await editButtonInRow.click();

    await expect(
      page.getByRole("textbox", { name: "Description :" }),
    ).toHaveValue("test edit");
  } finally {
    await deleteAlgorithm(algorithmName).catch(console.error);
  }
});
