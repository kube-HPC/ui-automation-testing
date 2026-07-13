import { Locator, Page } from "@playwright/test";

/**
 * Returns a locator for a link in the left sidebar.
 *
 * Use this to locate a navigation link in the application's left sidebar
 * by its name (e.g. "jobs", "algorithms", or "pipelines").
 *
 * @param page - The Playwright page instance.
 * @param linkName - The name of the sidebar link.
 * @returns A Playwright Locator for the requested sidebar link.
 */
export function getSideBarLeftLink(page: Page, linkName: string): Locator {
  return page.getByTestId(`left-sidebar-link-${linkName}`);
}
