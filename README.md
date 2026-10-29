# Antigravity Remotion Skill — Motion Graphics Videos with Google Antigravity

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Antigravity Skill](https://img.shields.io/badge/Google-Antigravity%20Skill-4285F4)](https://antigravity.google/docs/skills)
[![Remotion](https://img.shields.io/badge/Built%20for-Remotion-00C2A8)](https://remotion.dev)

An [Antigravity agent skill](https://antigravity.google/docs/skills) that teaches the agent to make and edit professional motion-graphics videos with [Remotion](https://remotion.dev) (React + TypeScript): springs, staggered choreography, color grades, film grain, Ken Burns, captions and sound design, followed by a mandatory **render, inspect frames, fix, re-render** loop.

Adapted from [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) for Antigravity's skill layout, tooling and Windows environments.

## What changed from the Claude version

| Area | Claude version | This version |
|---|---|---|
| Location | `~/.claude/skills/` | `.agents/skills/` (workspace) or `~/.gemini/config/skills/` (global) |
| Shell commands | bash (`which`, `for` loops) | Cross-platform Node scripts; works in PowerShell |
| Verification | Inline bash loop | `scripts/verify-frames.mjs` (reads composition length, writes stills) |
| Env checks | Manual hints | `scripts/check-env.mjs` (Node, ffmpeg, Chrome, Playwright) |
| Review | Claude looks at frames | Frames go into a walkthrough artifact; Remotion Studio can be driven by the Antigravity browser agent |
| Description | Aggressive "ALWAYS" trigger | Third-person, keyword-rich description as Antigravity recommends |
| Body structure | Free-form | Goal, Instructions, Constraints, Resources |
| Bundle | `.skill` zip | Plain folder, no build step |

## Layout

```
.agents/skills/remotion-motion-graphics/
├── SKILL.md                  # Goal, 10 motion rules, 7-step workflow, constraints
├── scripts/
│   ├── scaffold.mjs          # New project from the tested starter
│   ├── check-env.mjs         # Preflight: Node, ffmpeg, Chrome
│   ├── lint-rules.mjs        # Deterministic rule check (non-deterministic code, <Video>, etc.)
│   └── verify-frames.mjs     # Render check stills from a composition
├── references/
│   ├── motion-patterns.md    # Copy-paste component library
│   └── design-rules.md       # Palettes, type, pacing, sound, checklist
└── assets/starter/           # Tested starter project (theme, layers, motion components, scenes)
examples/                     # Four finished Remotion compositions (golden examples)
```

## Install

Antigravity discovers skills from these locations ([docs](https://antigravity.google/docs/skills)):

| Scope | Path |
|---|---|
| Workspace (all surfaces) | `<project>/.agents/skills/` |
| Global, App and IDE | `~/.gemini/config/skills/` |
| Global, CLI | `~/.gemini/antigravity-cli/skills/` |
| Legacy (still read) | `.agent/skills/`, `~/.gemini/antigravity/skills/` |

Use the installer:

```powershell
# Windows
.\install.ps1                          # global, App + IDE
.\install.ps1 -Cli                     # global, Antigravity CLI
.\install.ps1 -Project C:\my\project   # one project
```

```bash
# macOS / Linux
./install.sh                           # global, App + IDE
./install.sh --cli
./install.sh --project ~/my/project
```

Or just copy `.agents/skills/remotion-motion-graphics` into any of the paths above. If you open this repo itself as an Antigravity workspace, the skill is already active.

## Usage

Antigravity shows the agent each skill's name and description, and loads the full instructions when your request matches. You can also call it explicitly:

- "Make a 5 second logo sting for my brand" (or `/remotion-motion-graphics` in the App)
- "Build a vertical Reel intro, dark tech look"
- "My Remotion video looks flat and generic, fix it"
- "Add word-synced captions to `public/clip.mp4`"

Requirements: Node 18+, and ideally ffmpeg on PATH for encode checks. Run `node .agents/skills/remotion-motion-graphics/scripts/check-env.mjs` to see what you have.

## Examples

```bash
cd examples
npm install
npm run audio            # synthesize SFX and music, no downloads
npm run render:selffix   # or render:codeedit / render:profile / render:focuscat
```

## License

[MIT](LICENSE). Copyright (c) 2026 umorfaruksupto. Derived from the MIT-licensed [claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) by haidrrrry, whose copyright notice is retained in the license.

## Working well with Gemini models

The skill is written for Gemini-driven agents in Antigravity:

- Short, imperative, numbered instructions, with the rules that models usually get wrong listed explicitly (Remotion pitfalls, command hygiene).
- Non-interactive commands only (`npm init -y`, `--overwrite`), and long-running servers (`remotion studio`) are started in the background.
- PowerShell-safe commands; all helper scripts are plain Node.
- Rule compliance is checked by `lint-rules.mjs` rather than left to the model's judgment, and visual quality by `verify-frames.mjs` stills that the agent must look at before delivering.

Tip: for best results use a Gemini Pro-tier model for building scenes. If a render fails, ask the agent to run `check-env.mjs` and `lint-rules.mjs` and fix what they report.
