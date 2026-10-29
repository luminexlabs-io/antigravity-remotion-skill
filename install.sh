#!/bin/sh
# Installs the skill for Google Antigravity.
#   ./install.sh                 -> global (App + IDE): ~/.gemini/config/skills
#   ./install.sh --cli           -> global (Antigravity CLI): ~/.gemini/antigravity-cli/skills
#   ./install.sh --project DIR   -> workspace: DIR/.agents/skills
set -e
SRC="$(cd "$(dirname "$0")" && pwd)/.agents/skills/remotion-motion-graphics"
DEST="$HOME/.gemini/config/skills"
case "$1" in
  --cli) DEST="$HOME/.gemini/antigravity-cli/skills" ;;
  --project) DEST="${2:?project dir required}/.agents/skills" ;;
esac
mkdir -p "$DEST"
cp -r "$SRC" "$DEST/"
echo "Installed to $DEST/remotion-motion-graphics"
