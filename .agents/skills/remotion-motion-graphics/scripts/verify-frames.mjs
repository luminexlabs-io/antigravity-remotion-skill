#!/usr/bin/env node
// Render still frames from a Remotion composition for visual inspection.
// Usage: node verify-frames.mjs <CompId> [--entry src/index.ts] [--out out/check]
//                               [--frames 15,45,90] [--browser <path>]
// If --frames is omitted, frames are sampled at 5 evenly spaced points taken from
// the composition's real duration (via `remotion compositions`).
// Run from the Remotion project root. Output PNGs are what you open and LOOK at.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const args = process.argv.slice(2);
const compId = args[0];
if (!compId || compId.startsWith("--")) {
  console.error("Usage: node verify-frames.mjs <CompId> [--entry src/index.ts] [--out out/check] [--frames 15,45] [--browser path]");
  process.exit(1);
}
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : fallback;
};
const entry = opt("entry", "src/index.ts");
const outPrefix = opt("out", "out/check");
const browser = opt("browser");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const sh = process.platform === "win32"; // .cmd shims need a shell on Windows
const base = browser ? [`--browser-executable=${browser}`] : [];

let frames = opt("frames")?.split(",").map(Number);
if (!frames) {
  const listing = execFileSync(npx, ["remotion", "compositions", entry, ...base], { encoding: "utf8", shell: sh });
  const line = listing.split(/\r?\n/).find((l) => l.trim().startsWith(compId));
  // Remotion prints duration as e.g. "450 (15.00 sec)"
  const duration = Number(line?.match(/(\d+)\s*\(\s*[\d.]+\s*sec/)?.[1]);
  if (!duration) {
    console.error(`Could not read duration for "${compId}". Pass --frames explicitly.\n${listing}`);
    process.exit(1);
  }
  frames = [0.05, 0.25, 0.5, 0.75, 0.97].map((p) => Math.min(duration - 1, Math.round(duration * p)));
}

mkdirSync(dirname(outPrefix), { recursive: true });
for (const f of frames) {
  const file = `${outPrefix}_${String(f).padStart(4, "0")}.png`;
  execFileSync(npx, ["remotion", "still", entry, compId, file, `--frame=${f}`, "--overwrite", ...base], {
    stdio: "inherit",
    shell: sh,
  });
  console.log(`FRAME ${f} -> ${file}`);
}
