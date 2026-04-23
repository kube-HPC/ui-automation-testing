import { Locator, Page } from "@playwright/test";

export function getSideBarLeftLink(page: Page, linkName: string): Locator {
  return page.getByTestId(`left-sidebar-link-${linkName}`);
}
