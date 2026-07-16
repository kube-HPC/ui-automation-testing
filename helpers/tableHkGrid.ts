import { Locator, Page } from "@playwright/test";

export class HkGridRow {
  constructor(private readonly row: Locator) {}

  /**
   * Returns the action button located within this grid row.
   *
   * @param ariaLabel - The test ID of the action button to locate.
   * @param actionsContainerTestId - The test ID of the container holding the action buttons.
   * @returns A Playwright Locator for the requested action button.
   */
  hkGridGetActionButton(
    ariaLabel: string,
    actionsContainerTestId = "buttons-actions",
  ): Locator {
    return this.row
      .getByTestId(actionsContainerTestId)
      .getByTestId(ariaLabel)
      .first();
  }

  getLocator(): Locator {
    return this.row;
  }
}

/**
 * Finds the first grid row where the specified column contains the given text.
 *
 * @param page - The Playwright page instance.
 * @param columnId - The ID of the column to search in.
 * @param text - The text to match within the specified column.
 * @returns An {@link HkGridRow} representing the first matching row.
 */
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
