import { spawn } from "node:child_process";
import { BASE_URL_ROOT } from "../config/env.js";

const url = process.argv[2] || process.env.CODEGEN_URL || BASE_URL_ROOT;

const args = ["playwright", "codegen", "--viewport-size=1920,1080", url];

const child = spawn("npx", args, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));
