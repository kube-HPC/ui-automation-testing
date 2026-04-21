import { Page } from "@playwright/test";

// goto root page of hkube application
export async function gotoRoot(page: Page) {
  await page.goto(process.env.BASE_URL || "http://localhost:9050/");
}

// get name with prefix
export function getNamePrefix(name: string): string {
  return `${process.env.PREFIX}${name}`;
}
