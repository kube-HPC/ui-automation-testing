import { Page } from "@playwright/test";
import { getSideBarLeftLink } from "./sideBarLeft";

// goto root page of hkube application
// use to navigate to the root page of the hkube application.
// It will use the BASE_URL environment variable if set, otherwise it will default to "http://localhost:9050/".
export async function gotoRoot(page: Page) {
  await page.goto(process.env.BASE_URL || "http://localhost:9050/");
}

// goto root section jobs, algorithms, pipelines, etc.
// use to navigate to a specific section of the hkube application,
// such as "jobs", "algorithms", or "pipelines".
export async function gotoRootSection(page: Page, section: string) {
  await gotoRoot(page);
  await getSideBarLeftLink(page, section).click();
}

// get name with prefix
// use to get a name with a prefix, which is useful for c
// reating unique names for algorithms, jobs, or pipelines in tests.
// The importance of this is so that if we see algorithms or pipelines that are prefixed,
// we know that they belong to the test.
export function getNamePrefix(name: string): string {
  return `${process.env.PREFIX}${name}`;
}
