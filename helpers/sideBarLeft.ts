import { Locator, Page } from "@playwright/test";

export const NamesLeftLink = {
  OBSERVABILITY: "observability",
  JOBS: "jobs",
  ALGORITHMS: "algorithms",
  PIPELINES: "pipelines",
  ADMINISTRATION: "administration",
  DRIVERS: "drivers",
  WORKERS: "workers",
  QUEUE: "queue",
  DATASOURCES: "datasources",
  CPU: "cpu",
  MEMORY_AND_STORAGE: "Memory & Storage",
  ERROR_LOG: "Error Log",
} as const;

export type SideBarLeftLinkName =
  (typeof NamesLeftLink)[keyof typeof NamesLeftLink];

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
export function getSideBarLeftLink(
  page: Page,
  linkName: SideBarLeftLinkName,
): Locator {
  return page.getByTestId(`left-sidebar-link-${linkName}`);
}
