import { Locator, Page } from "@playwright/test";

export class AntTableRow {
  constructor(private readonly row: Locator) {}

  /**
   * Returns the action button located within this grid row.
   *
   * @param actionTestId - The test ID of the action button to locate.
   * @param actionsContainerTestId - Optional test ID of the container holding action buttons.
   * @returns A Playwright Locator for the requested action button.
   */
  antTableGetActionButton(
    actionTestId: string,
    actionsContainerTestId?: string,
  ): Locator {
    if (actionsContainerTestId) {
      return this.row
        .getByTestId(actionsContainerTestId)
        .getByTestId(actionTestId)
        .first();
    }

    // In many Ant tables the button test-id is directly on the button itself.
    return this.row.getByTestId(actionTestId).first();
  }

  getLocator(): Locator {
    return this.row;
  }
}

/**
 * Finds the first Ant Design table row that contains the given text.
 *
 * @param page - The Playwright page instance.
 * @param text - Text to match inside the row.
 * @returns An AntTableRow representing the first matching row.
 */
export function antTableFindRowByText(page: Page, text: string): AntTableRow {
  const row = page
    .getByTestId("tableAntd")
    .getByRole("row")
    .filter({ hasText: text })
    .first();

  return new AntTableRow(row);
}

/**
 * Returns the text values of all body rows for the given column header.
 *
 * @param page - The Playwright page instance.
 * @param columnName - The exact name of the column header.
 * @returns An array of trimmed text values from the column.
 * @throws Error if the column header is not found.
 */
export async function antTableGetColumnValues(
  page: Page,
  columnName: string,
): Promise<string[]> {
  const table = page.getByTestId("tableAntd");

  const headers = await table.locator("thead th").allInnerTexts();
  const columnIndex = headers.findIndex((h) => h.trim() === columnName);
  if (columnIndex === -1) {
    throw new Error(
      `Column "${columnName}" not found. Headers: ${headers.join(", ")}`,
    );
  }

  const cells = table
    .locator("tbody tr.ant-table-row")
    .locator(`td:nth-child(${columnIndex + 1})`);

  return (await cells.allInnerTexts()).map((t) => t.trim());
}
