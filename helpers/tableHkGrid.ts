import { Locator, Page } from "@playwright/test";

export class HkGridRow {
  constructor(private readonly row: Locator) {}

  hkGridGetActionButton(
    page: Page,
    ariaLabel: string,
    actionsContainerTestId = "buttons-actions",
  ): Locator {
    return this.row
      .getByTestId(actionsContainerTestId)
      .locator("button")
      .filter({ has: page.locator(`[aria-label="${ariaLabel}"]`) })
      .first();
  }

  getLocator(): Locator {
    return this.row;
  }
}

export function hkGridFindRowByColumnText(
  page: Page,
  columnId: string,
  text: string,
): HkGridRow {
  const row = page
    .getByTestId("hk-grid")
    .locator('[role="row"]')
    .filter({
      has: page.locator(`[col-id="${columnId}"]`, { hasText: text }),
    })
    .first();

  return new HkGridRow(row);
}
