import { expect, test } from "@playwright/test";
import { deleteAlgorithm } from "../../../api/algorithmApi";
import { getSideBarLeftLink } from "../../../helpers/sideBarLeft";
import { hkGridFindRowByColumnText } from "../../../helpers/tableHkGrid";
import { getNamePrefix, gotoRoot } from "../../../helpers/global";

test("flow form new algorithm", async ({ page }) => {
  const algorithmName = getNamePrefix(`new-algorithm`);

  try {
    await gotoRoot(page);
    await getSideBarLeftLink(page, "algorithms").click();

    // click button New Algorithm
    await page.getByRole("button", { name: "New Algorithm" }).click();

    // fill the form Algorithm Name
    await page.getByRole("textbox", { name: "* Algorithm Name :" }).click();
    await page
      .getByRole("textbox", { name: "* Algorithm Name :" })
      .fill(algorithmName);

    // fill the form Description
    await page.getByRole("textbox", { name: "Description :" }).click();
    await page
      .getByRole("textbox", { name: "Description :" })
      .fill("Description test");

    // click on the tab Docker image
    await page.getByText("Docker image").click();
    await page.getByRole("textbox", { name: "* Algorithm Image :" }).click();

    // fill the form Algorithm Image
    await page
      .getByRole("textbox", { name: "* Algorithm Image :" })
      .fill("hkube/algorithm-example-python");

    // click on the tab Resources
    await page
      .locator(".anticon.anticon-caret-right > svg > path")
      .first()
      .click();

    // fill the form CPU Usage
    await page.getByRole("spinbutton", { name: "CPU Usage :" }).dblclick();
    await page.getByRole("spinbutton", { name: "CPU Usage :" }).fill("0.2");

    //  click save button
    await page.getByRole("button", { name: "Save" }).click();

    // verify that the algorithm is displayed in the algorithms list
    await getSideBarLeftLink(page, "algorithms").click();
    const algorithmRow = hkGridFindRowByColumnText(page, "name", algorithmName);
    expect(algorithmRow.getLocator()).toContainText(algorithmName);
  } finally {
    // delete the algorithm
    await deleteAlgorithm("new-algorithm").catch(console.error);
  }
});
