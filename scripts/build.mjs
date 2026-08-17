import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "dist");

if (existsSync(output)) rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(join(root, "index.html"), join(output, "index.html"));
cpSync(join(root, "assets"), join(output, "assets"), { recursive: true });

console.log(`Built GitHub Pages site at ${output}`);
