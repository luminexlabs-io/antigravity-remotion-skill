#!/usr/bin/env node
// Preflight for Remotion work. Cross-platform (Windows / macOS / Linux).
// Usage: node <skill>/scripts/check-env.mjs
// Prints a JSON report: node version, ffmpeg/ffprobe presence, Chromium candidates.
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const run = (cmd) => {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
};

const isWin = process.platform === "win32";
const which = (bin) => run(isWin ? `where ${bin}` : `command -v ${bin}`)?.split(/\r?\n/)[0] ?? null;

const chromeCandidates = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  process.env.PROGRAMFILES && join(process.env.PROGRAMFILES, "Google/Chrome/Application/chrome.exe"),
  process.env["PROGRAMFILES(X86)"] && join(process.env["PROGRAMFILES(X86)"], "Google/Chrome/Application/chrome.exe"),
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter((p) => p && existsSync(p));

// Playwright's cache holds headless_shell builds that work when full Chrome refuses headless.
const pwRoots = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(homedir(), ".cache/ms-playwright"),
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "ms-playwright")].filter(Boolean);
const playwright = [];
for (const root of pwRoots) {
  if (existsSync(root)) playwright.push(...readdirSync(root).filter((d) => /chromium/i.test(d)).map((d) => join(root, d)));
}

const report = {
  platform: process.platform,
  node: process.version,
  npm: run("npm --version"),
  ffmpeg: which("ffmpeg"),
  ffprobe: which("ffprobe"),
  chromeCandidates,
  playwrightChromium: playwright,
  note: "Remotion auto-downloads Chrome Headless Shell on first render. Only pass --browser-executable if that fails.",
};
console.log(JSON.stringify(report, null, 2));
if (!report.node || Number(process.versions.node.split(".")[0]) < 18) {
  console.error("Node 18+ required for Remotion.");
  process.exit(1);
}
