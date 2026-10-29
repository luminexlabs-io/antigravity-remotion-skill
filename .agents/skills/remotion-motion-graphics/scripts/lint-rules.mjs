#!/usr/bin/env node
// Deterministic check of the skill's hard rules against a Remotion project's src/.
// Usage (from project root): node lint-rules.mjs [srcDir=src]
// Exit code 1 if any ERROR is found. WARN items need human judgment.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] ?? "src";
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(name)) files.push(p);
  }
})(root);

// [level, message, test(line, wholeFile)]
const checks = [
  ["ERROR", "Math.random() is non-deterministic across frames; use random(seed) from remotion",
    (l) => /Math\.random\s*\(/.test(l)],
  ["ERROR", "CSS transition/animation does not render in Remotion; drive motion with useCurrentFrame()",
    (l) => /\btransition\s*:|\banimation\s*:|@keyframes/.test(l) && !/@remotion\/transitions/.test(l)],
  ["ERROR", "Use <OffthreadVideo> instead of <Video>",
    (l) => /<Video[\s>]/.test(l)],
  ["ERROR", "Use <Img> from remotion instead of <img> (waits for load before rendering)",
    (l) => /<img[\s>]/.test(l)],
  ["WARN", "interpolate() without clamp: add extrapolateLeft/Right: \"clamp\" (fine only when the input is a spring and overshoot is intended)",
    (l, f, i) => /interpolate\s*\(/.test(l) && !/extrapolate/.test(f.split("\n").slice(i, i + 6).join("\n"))],
  ["WARN", "Hard-coded hex color in a component; take it from theme.ts",
    (l, f, i, file) => !/theme\.ts$/.test(file) && /#[0-9a-fA-F]{6}\b/.test(l) && !/^\s*(\/\/|\*)/.test(l)],
  ["WARN", "setTimeout/setInterval/useState-driven animation will not be frame-accurate",
    (l) => /setTimeout|setInterval/.test(l)],
  ["WARN", "Emoji in source: render icons with SVG/CSS in theme colors",
    (l) => /[\u{1F300}-\u{1FAFF}☀-➿]/u.test(l)],
];

let errors = 0, warns = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const [level, msg, test] of checks) {
      if (test(line, text, i, file)) {
        console.log(`${level}  ${relative(process.cwd(), file)}:${i + 1}  ${msg}`);
        level === "ERROR" ? errors++ : warns++;
      }
    }
  });
}
console.log(`\n${files.length} files, ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
