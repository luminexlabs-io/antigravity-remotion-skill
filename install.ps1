# Installs the skill for Google Antigravity.
# Usage:  .\install.ps1            -> global (App + IDE): ~/.gemini/config/skills
#         .\install.ps1 -Cli       -> global (Antigravity CLI): ~/.gemini/antigravity-cli/skills
#         .\install.ps1 -Project C:\path\to\project -> workspace: <project>/.agents/skills
param(
  [switch]$Cli,
  [string]$Project
)
$ErrorActionPreference = "Stop"
$src = Join-Path $PSScriptRoot ".agents/skills/remotion-motion-graphics"
if ($Project) { $dest = Join-Path $Project ".agents/skills" }
elseif ($Cli) { $dest = Join-Path $HOME ".gemini/antigravity-cli/skills" }
else { $dest = Join-Path $HOME ".gemini/config/skills" }
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item $src $dest -Recurse -Force
Write-Host "Installed to $dest/remotion-motion-graphics"
