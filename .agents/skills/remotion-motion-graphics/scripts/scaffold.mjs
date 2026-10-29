#!/usr/bin/env node
// Create a working Remotion project from the skill's tested starter template.
// Usage: node scaffold.mjs <target-dir> [--install]
// The starter has the theme, 5-layer stack (BgMesh/Grade/Grain/Vignette), Entrance /
// WordReveal / SceneExit / Spark, two example scenes and a "Main" composition.
// Edit the scenes; do not rewrite the components from scratch.
import { cpSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const target = resolve(process.argv[2] ?? "");
if (!process.argv[2]) {
  console.error("Usage: node scaffold.mjs <target-dir> [--install]");
  process.exit(1);
}
if (existsSync(join(target, "src")) || (existsSync(target) && readdirSync(target).includes("package.json"))) {
  console.error(`Refusing to overwrite an existing project in ${target}. Edit it in place instead.`);
  process.exit(1);
}
const starter = join(dirname(fileURLToPath(import.meta.url)), "../assets/starter");
cpSync(starter, target, { recursive: true });
console.log(`Scaffolded Remotion project at ${target}`);
if (process.argv.includes("--install")) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npm, ["install", "--no-audit", "--no-fund"], { cwd: target, stdio: "inherit", shell: process.platform === "win32" });
}
