import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();
const DOT_GIT_PATH = join(ROOT, ".git");

function resolveGitDirPath(dotGitPath) {
  if (!existsSync(dotGitPath)) {
    throw new Error(
      ".git path was not found. Run this script from repository root.",
    );
  }

  const gitStat = statSync(dotGitPath);

  if (gitStat.isDirectory()) {
    return dotGitPath;
  }

  const content = readFileSync(dotGitPath, "utf8").trim();
  const match = /^gitdir:\s*(.+)$/i.exec(content);

  if (!match) {
    throw new Error("Unsupported .git file format.");
  }

  return resolve(ROOT, match[1]);
}

function main() {
  const gitDir = resolveGitDirPath(DOT_GIT_PATH);
  const hooksDir = join(gitDir, "hooks");
  const hookPath = join(hooksDir, "pre-commit");

  mkdirSync(hooksDir, { recursive: true });

  const hookContent = `#!/usr/bin/env sh
set -eu

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
cd "$ROOT"

npm run check:test-structure
`;

  writeFileSync(hookPath, hookContent, "utf8");
  chmodSync(hookPath, 0o755);

  console.log(`pre-commit hook installed at ${hookPath}`);
  console.log("It will run: npm run check:test-structure");
}

main();
