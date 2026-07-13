import { Locator, Page } from "@playwright/test";

// get link from left sidebar
export function getSideBarLeftLink(page: Page, linkName: string): Locator {
  return page.getByTestId(`left-sidebar-link-${linkName}`);
}
