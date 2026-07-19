import { readdirSync } from "node:fs";
import { join, posix, relative } from "node:path";

const ROOT = process.cwd();
const TESTS_DIR = join(ROOT, "tests");
const CAMEL_CASE = /^[a-z][a-zA-Z0-9]*$/;

function walkEntries(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const dirs = [];
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      dirs.push(fullPath);
      const child = walkEntries(fullPath);
      dirs.push(...child.dirs);
      files.push(...child.files);
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return { dirs, files };
}

function toRepoPath(absolutePath) {
  return relative(ROOT, absolutePath).split("/").join(posix.sep);
}

function getNameStem(fileName) {
  if (fileName.endsWith(".spec.ts")) {
    return fileName.slice(0, -".spec.ts".length);
  }

  if (fileName.endsWith(".setup.ts")) {
    return fileName.slice(0, -".setup.ts".length);
  }

  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return fileName;
  }

  return fileName.slice(0, lastDotIndex);
}

function main() {
  const { dirs, files } = walkEntries(TESTS_DIR);

  const testDirectories = dirs
    .map((dirPath) => toRepoPath(dirPath))
    .sort((a, b) => a.localeCompare(b));

  const directoryViolations = testDirectories.filter((dirPath) => {
    const name = dirPath.split("/").at(-1) || "";
    return !CAMEL_CASE.test(name);
  });

  const testFiles = files
    .map((filePath) => toRepoPath(filePath))
    .sort((a, b) => a.localeCompare(b));

  const fileViolations = testFiles.filter((filePath) => {
    const fileName = filePath.split("/").at(-1) || "";
    const stem = getNameStem(fileName);
    return !CAMEL_CASE.test(stem);
  });

  const violations = [...directoryViolations, ...fileViolations];

  if (violations.length > 0) {
    console.error("Found naming policy violations under tests:");
    if (directoryViolations.length > 0) {
      console.error("Directory violations (must be camelCase):");
      for (const dirPath of directoryViolations) {
        console.error(`- ${dirPath}`);
      }
    }

    if (fileViolations.length > 0) {
      console.error(
        "File violations (name before extension must be camelCase):",
      );
      for (const filePath of fileViolations) {
        console.error(`- ${filePath}`);
      }
    }

    console.error("Use camelCase only: ^[a-z][a-zA-Z0-9]*$");
    process.exit(1);
  }

  console.log("Folder and file naming policy passed (camelCase).\n");
}

main();
