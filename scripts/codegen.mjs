import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(__dirname, "..", ".env") });

const url =
  process.argv[2] ||
  process.env.CODEGEN_URL ||
  process.env.BASE_URL ||
  "http://localhost:9050/";

const args = ["playwright", "codegen", "--viewport-size=1920,1080", url];

const child = spawn("npx", args, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));
