import { readdirSync, statSync } from "node:fs";
import { join, posix, relative } from "node:path";

const ROOT = process.cwd();
const TESTS_DIR = join(ROOT, "tests");

function walkFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function toRepoPath(absolutePath) {
  return relative(ROOT, absolutePath).split("/").join(posix.sep);
}

function main() {
  const testFiles = walkFiles(TESTS_DIR);

  const emptyFiles = testFiles
    .filter((filePath) => statSync(filePath).size === 0)
    .map((filePath) => toRepoPath(filePath))
    .sort((a, b) => a.localeCompare(b));

  if (emptyFiles.length > 0) {
    console.error("Found empty files under tests (blocked by policy):");
    for (const filePath of emptyFiles) {
      console.error(`- ${filePath}`);
    }
    console.error("Fix by adding content or remove the placeholder files.");
    process.exit(1);
  }

  console.log("No empty files were found under tests.");
}

main();
