import { readFileSync, readdirSync } from "node:fs";
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

function getLineNumber(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text[i] === "\n") {
      line += 1;
    }
  }
  return line;
}

function normalizeTitle(title) {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

function isQuote(char) {
  return char === '"' || char === "'" || char === "`";
}

function extractStringValue(expression) {
  const trimmed = expression.trim();
  if (trimmed.length < 2) {
    return null;
  }

  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if (!isQuote(first) || first !== last) {
    return null;
  }

  if (first === "`" && trimmed.includes("${")) {
    return null;
  }

  return trimmed.slice(1, -1);
}

function parseFirstArgument(source, argStartIndex) {
  let i = argStartIndex;
  let roundDepth = 0;
  let squareDepth = 0;
  let curlyDepth = 0;
  let inString = false;
  let stringQuote = "";
  let escaped = false;

  for (; i < source.length; i += 1) {
    const ch = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === stringQuote) {
        inString = false;
        stringQuote = "";
      }

      continue;
    }

    if (isQuote(ch)) {
      inString = true;
      stringQuote = ch;
      continue;
    }

    if (ch === "(") {
      roundDepth += 1;
      continue;
    }

    if (ch === ")") {
      if (roundDepth === 0 && squareDepth === 0 && curlyDepth === 0) {
        break;
      }
      roundDepth = Math.max(0, roundDepth - 1);
      continue;
    }

    if (ch === "[") {
      squareDepth += 1;
      continue;
    }

    if (ch === "]") {
      squareDepth = Math.max(0, squareDepth - 1);
      continue;
    }

    if (ch === "{") {
      curlyDepth += 1;
      continue;
    }

    if (ch === "}") {
      curlyDepth = Math.max(0, curlyDepth - 1);
      continue;
    }

    if (
      ch === "," &&
      roundDepth === 0 &&
      squareDepth === 0 &&
      curlyDepth === 0
    ) {
      break;
    }
  }

  return source.slice(argStartIndex, i);
}

function findTestCallStarts(source) {
  const starts = [];
  const pattern = /(^|[^\w$.])test(?:\.(only|skip|fixme|fail))?\s*\(/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const prefixLength = match[1] ? match[1].length : 0;
    const callIndex = match.index + prefixLength;
    const openParenIndex = source.indexOf("(", callIndex);
    if (openParenIndex !== -1) {
      starts.push(openParenIndex + 1);
    }
  }

  return starts;
}

function collectViolations(filePath) {
  const source = readFileSync(filePath, "utf8");
  const argStarts = findTestCallStarts(source);
  const staticTitles = [];
  const dynamicTitles = [];

  for (const argStart of argStarts) {
    const firstArg = parseFirstArgument(source, argStart);
    const line = getLineNumber(source, argStart);
    const stringValue = extractStringValue(firstArg);

    if (stringValue === null) {
      dynamicTitles.push({
        filePath: toRepoPath(filePath),
        line,
        expression: firstArg.trim(),
      });
      continue;
    }

    staticTitles.push({
      filePath: toRepoPath(filePath),
      line,
      title: stringValue,
      normalizedTitle: normalizeTitle(stringValue),
    });
  }

  return { staticTitles, dynamicTitles };
}

function main() {
  const specFiles = walkFiles(TESTS_DIR)
    .filter((filePath) => filePath.endsWith(".spec.ts"))
    .sort((a, b) => a.localeCompare(b));

  const allStaticTitles = [];
  const allDynamicTitles = [];

  for (const filePath of specFiles) {
    const { staticTitles, dynamicTitles } = collectViolations(filePath);
    allStaticTitles.push(...staticTitles);
    allDynamicTitles.push(...dynamicTitles);
  }

  const byNormalizedTitle = new Map();
  for (const entry of allStaticTitles) {
    const existing = byNormalizedTitle.get(entry.normalizedTitle) || [];
    existing.push(entry);
    byNormalizedTitle.set(entry.normalizedTitle, existing);
  }

  const duplicates = [...byNormalizedTitle.values()]
    .filter((entries) => entries.length > 1)
    .sort((a, b) => a[0].normalizedTitle.localeCompare(b[0].normalizedTitle));

  if (allDynamicTitles.length > 0 || duplicates.length > 0) {
    console.error("Test title policy violations found:");

    if (allDynamicTitles.length > 0) {
      console.error("\nDynamic test titles are not allowed:");
      for (const item of allDynamicTitles) {
        console.error(`- ${item.filePath}:${item.line} -> ${item.expression}`);
      }
      console.error(
        "Use a static string as the first argument of test()/test.only()/test.skip()/test.fixme()/test.fail().",
      );
    }

    if (duplicates.length > 0) {
      console.error(
        "\nDuplicate test titles detected (normalized comparison):",
      );
      for (const group of duplicates) {
        console.error(`- \"${group[0].title}\"`);
        for (const item of group) {
          console.error(`  ${item.filePath}:${item.line}`);
        }
      }
      console.error(
        "Rename duplicate titles so each test title is unique across tests/**/*.spec.ts.",
      );
    }

    process.exit(1);
  }

  console.log("Test title policy passed (unique + static titles).");
}

main();
