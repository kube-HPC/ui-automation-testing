import { Page } from "@playwright/test";
import { getSideBarLeftLink, SideBarLeftLinkName } from "./sideBarLeft";

/**
 * Go to the root page of the HKube application.
 *
 * Use this to navigate to the root page of the HKube application.
 * It uses the BASE_URL environment variable if it is set;
 * otherwise, it defaults to "http://localhost:9050/".
 * @param page - The Playwright page instance.
 */
export async function gotoRoot(page: Page) {
  await page.goto(process.env.BASE_URL || "http://localhost:9050/");
}

/**
 * Go to a specific root section (jobs, algorithms, pipelines, etc.).
 *
 * Use this to navigate to a specific section of the HKube application,
 * such as "jobs", "algorithms", or "pipelines".
 *
 * @param page - The Playwright page instance.
 * @param section - The sidebar section to open.
 */
export async function gotoRootSection(
  page: Page,
  section: SideBarLeftLinkName,
) {
  await gotoRoot(page);
  await getSideBarLeftLink(page, section).click();
}

/**
 * Get a name with the configured test prefix.
 *
 * Use this to generate unique names for algorithms, jobs, or pipelines in tests.
 * The importance of this is that if we see algorithms or pipelines with the configured
 * prefix, we know that they belong to the test.
 *
 * @param name - The base name.
 * @returns The prefixed name.
 */
export function getNamePrefix(name: string): string {
  return `${process.env.PREFIX}${name}`;
}
