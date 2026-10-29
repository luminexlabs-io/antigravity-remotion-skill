---
name: remotion-motion-graphics
description: Creates and edits professional motion graphics videos with Remotion (React-based video) inside Google Antigravity. Use whenever the user wants to make or edit a video, animate something, build an intro/outro/logo sting, make a Reel/Short/TikTok/promo/launch video, add animated text or word-synced captions to footage, composite images and B-roll into a video, or mentions Remotion, motion graphics, or video rendering. Also use when an existing Remotion project looks basic, generic, flat, or amateur. Read this skill BEFORE writing any Remotion code.
---

# Remotion Motion Graphics (Antigravity edition)

Remotion renders React components frame-by-frame into video. Code quality is not the
bottleneck — **motion design craft is**. Untrained generation produces linear easing,
opacity-only fades, simultaneous entrances, flat colors, and no texture: the
"generic AI video" look. This skill exists to prevent it.

## Goal
Deliver a finished, verified MP4 (or still/GIF) that looks like it was cut by a motion
designer, plus the editable Remotion source.

## Non-negotiable rules (apply to EVERY composition)

1. **NEVER use linear interpolation.** Every `interpolate()` gets an easing curve;
   every entrance prefers `spring()`. Always `extrapolateLeft/Right: "clamp"`.
2. **Entrances animate 2–3 properties together** (opacity + translateY + scale).
   A lone fade is forbidden.
3. **Stagger everything.** Lists, words, rays, cards: 3–6 frame offsets. Nothing
   enters simultaneously.
4. **Exits exist and are faster than entrances** (~10 frames vs ~20).
5. **Five-layer stack in every scene**, bottom to top: background mesh → assets →
   graphics/type → color grade → grain + vignette. Never a flat solid background.
6. **Every still image gets Ken Burns** (slow scale 1→1.08 + pan). Every video asset
   uses `<OffthreadVideo>`, never `<Video>`.
7. **Idle elements breathe**: anything on screen >2s gets sin-wave micro-motion.
8. **All timing derives from `fps`** via `useVideoConfig()`. No magic frame numbers.
9. **One theme object** at the top of the project (colors, easings, spring presets,
   fonts). Never inline a hex color or easing in a component.
10. **Render, inspect frames, fix, re-render.** Never deliver an unverified render.
    See Step 6.

## Instructions

### Step 1 — Scope
Decide: duration, fps (30 default; 60 only for heavy fast motion), dimensions
(1080×1920 Reels/Shorts, 1920×1080 landscape), available assets (images, footage,
audio, logos), and new composition vs. edit of an existing project. If the request is
missing any of these and no sensible default exists, ask once, briefly; otherwise
pick defaults and state them.
If editing an existing project: read `src/` fully first, find the theme (or create
one), and fix violations of the rules above before adding features.

### Step 2 — Preflight and setup
Run the environment check (works on Windows, macOS and Linux — do not use `which`
or bash loops, the user may be on PowerShell):
```
node .agents/skills/remotion-motion-graphics/scripts/check-env.mjs
```
Use the path where this skill actually lives if it is installed globally. It reports
Node version, ffmpeg/ffprobe, and Chrome candidates.

New project — ALWAYS start from the tested starter, never from a blank file. It already
contains the theme, the 5-layer stack (BgMesh, Grade, Grain, Vignette), Entrance,
WordReveal, SceneExit, Spark, two example scenes and a working `Main` composition:
```
node .agents/skills/remotion-motion-graphics/scripts/scaffold.mjs <project-dir> --install
```
Then edit `src/theme.ts` (palette/fonts to the user's brand), rewrite the scenes in
`src/scenes/`, and update `SCENES` / `FPS` / size in `src/Root.tsx`. Reuse the existing
components; add new ones in the same style. Do not regenerate them from scratch.
Structure: `src/index.ts` (registerRoot) → `src/Root.tsx` → `src/scenes/*.tsx` →
`src/components/*.tsx`. User assets go in `public/`, loaded via `staticFile()`.
For an existing project, skip scaffolding and edit in place.

### Step 3 — Build
Read `references/motion-patterns.md` for the reusable component implementations
(BgMesh, Grade, Grain, Vignette, KenBurns, WordReveal, Stagger, Counter, Spark,
transitions, parallax, captions). Compose scenes from those patterns. For pacing,
rhythm, typography, palettes and sound design, read `references/design-rules.md`.

Scene rhythm: HIT → hold (15–20 still frames) → build → HIT. Something must move
in the first 15 frames. Never >90 frames without a new visual element.

### Remotion pitfalls (read before coding; these are the usual model mistakes)
- All animation must be a pure function of `useCurrentFrame()`. No CSS `transition`,
  CSS `animation`, `@keyframes`, `setTimeout`, `useState`-driven motion, or
  `Math.random()` (use `random("seed")` from `remotion`). They render wrong or flicker.
- Use `<Img>` (not `<img>`), `<OffthreadVideo>` (not `<Video>`), `<Audio>` /
  `staticFile()` for anything in `public/`. Use `<Sequence from durationInFrames>` for
  timing; inside it `useCurrentFrame()` is relative to the sequence start.
- Install every `remotion` and `@remotion/*` package at the SAME exact version (no
  mixed versions, e.g. `npm install --save-exact`), or Remotion errors at startup.
- Entry file calls `registerRoot(RemotionRoot)`; each `<Composition>` needs `id`,
  `component`, `durationInFrames`, `fps`, `width`, `height`. The `<CompId>` in commands
  is that `id`.
- Use `AbsoluteFill` for layers; stack order = JSX order.

### Command hygiene (the terminal is non-interactive)
- Always pass non-interactive flags: `npm init -y`, `npx --yes ...`, `--overwrite` on
  renders. Never run a command that waits for input.
- `npx remotion studio` is long-running: start it as a background command, read its
  URL from the output, and stop it when done. Never run it in the foreground.
- On Windows use PowerShell-safe syntax: forward-slash relative paths, no `&&` chains
  assumed, no `$(...)`, `export`, `rm -rf`, or `/dev/null`. One command per call is safest.
- Keep output small: pass `--log=error` to render commands if logs are noisy.

### Step 4 — Lint (deterministic rule check)
```
node .agents/skills/remotion-motion-graphics/scripts/lint-rules.mjs src
```
Fix every `ERROR` (non-deterministic or non-rendering code). Review each `WARN`; fix
unless it is intentional (e.g. a spring-driven `interpolate` that overshoots on purpose).
Do this BEFORE rendering — it is far cheaper than finding the bug in a render.

### Step 5 — Render
```
npx remotion render src/index.ts <CompId> out/video.mp4 --codec h264 --crf 17 --overwrite
```
Remotion downloads Chrome Headless Shell on first run. If that fails (offline,
locked-down network), take a path from `check-env.mjs` output and pass
`--browser-executable=<path>`. If full Chrome errors with "Old Headless mode has been
removed", use a Playwright `headless_shell` binary instead.

Renders can take minutes. Run them as a background terminal command and keep going
(e.g. write the next scene) instead of blocking; check the command status when done.
If Antigravity's terminal policy asks for approval for `npm`/`npx`, that is expected.

### Step 6 — VERIFY (mandatory, never skip)
Generate stills of the exact frames, then actually open and look at them:
```
node .agents/skills/remotion-motion-graphics/scripts/verify-frames.mjs <CompId>
# or choose frames: ... <CompId> --frames 15,45,90,150
```
It writes `out/check_NNNN.png`. View each image (read the file as an image; in
Antigravity, embed them in your walkthrough artifact so the user can see what you saw).
If ffmpeg exists, also confirm the encoded file:
`ffmpeg -v error -ss 1.5 -i out/video.mp4 -frames:v 1 check.png` and
`ffprobe -v error -show_entries format=duration -of csv=p=0 out/video.mp4`.

For interactive checks you can also run `npx remotion studio src/index.ts` and open
the printed localhost URL with the Antigravity browser agent to scrub the timeline
and take screenshots. Stills remain the source of truth for the final render.

Look for, and fix, in order of frequency:
- **Spacing bugs**: `gap`/`margin` in `em` resolves against the PARENT font-size
  (often 16px), not the text size — use px values in flex containers around big type.
- Text overflowing or touching frame edges (keep critical content in the middle 75%
  vertically for 9:16 — platform UI covers top/bottom).
- Elements visible before their entrance or after their exit (missing clamp).
- Color/contrast failures: hero color on >1 element per frame, dim text unreadable
  over the grade.
- Layer order mistakes (grain/vignette on top, grade above content).

Fix → re-render → re-extract → re-inspect. Deliver only after a clean pass, then run
the final checklist at the bottom of `references/design-rules.md`.

### Step 7 — Deliver
Report the output path, duration/fps/resolution, and what you verified. In Antigravity,
summarize in a walkthrough artifact with 3–4 key frames. State anything you could not
verify (e.g. audio not auditioned).

## Editing the user's existing footage
Put the file in `public/`, render it as the asset layer with
`<OffthreadVideo src={staticFile("clip.mp4")} />`, set composition duration from the
clip length, and stack graphics/grade/grain above it. Get duration and fps with
`ffprobe` first. For word-synced captions over speech, see the captions section of
`references/motion-patterns.md`.

## Constraints (do NOT)
- Do not use emoji as icons. They render as platform glyphs that ignore the palette
  and break the one-hero-color rule. Draw glyphs with CSS/SVG in theme colors.
- Do not ship silent just because no SFX assets exist. Synthesize a minimal kit as
  16-bit WAVs from a Node script (whoosh, pop, thump, pad) into `public/sfx/` — see
  `examples/scripts/gen-sfx.mjs`. No downloads, fully deterministic.
- Do not build one giant component; make themed, reusable pieces.
- Do not let `durationInFrames` drift from scene content (dead air).
- Do not forget `--overwrite` on re-renders and then inspect a stale file.
- Do not rely on system default fonts for hero text; load a display font via
  `@remotion/google-fonts` or `@font-face` + `staticFile`.
- Do not describe the result instead of rendering and verifying it.
- Do not download media or fonts from untrusted sources; prefer user-provided or
  generated assets.
- Do not use bash-only syntax (`for ... do`, `which`, `/dev/null`) in commands; use
  the Node scripts so it works in PowerShell too.

## Resources
- `references/motion-patterns.md` — copy-paste component library. Read before writing components.
- `references/design-rules.md` — palettes, typography, scene architecture, sound design, pre-delivery checklist.
- `assets/starter/` — tested starter Remotion project (theme, layers, motion components, example scenes).
- `scripts/scaffold.mjs` — copies the starter into a new project dir.
- `scripts/check-env.mjs` — cross-platform environment preflight.
- `scripts/lint-rules.mjs` — deterministic check for non-rendering or non-deterministic code.
- `scripts/verify-frames.mjs` — render verification stills for a composition.
- Golden examples: the repo's `examples/` Remotion project (four finished compositions).
