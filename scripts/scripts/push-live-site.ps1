# Push cognitive-pwa changes to GitHub (AIFlashcards) without breaking deploy history.
# Run from repo root:  .\cognitive-pwa\scripts\push-live-site.ps1

$ErrorActionPreference = "Stop"
$Pwa = Split-Path $PSScriptRoot -Parent
$Root = Split-Path $Pwa -Parent
$DeployDir = Join-Path (Split-Path $Root -Parent) "studyassistantai-deploy"

if (-not (Test-Path $DeployDir)) {
  git -C $Root worktree add $DeployDir cognitive-flashcard-main
}

# Sync app source (deploy repo has PWA at root, not cognitive-pwa/)
$dirs = @("src", "public", "scripts")
foreach ($d in $dirs) {
  $src = Join-Path $Pwa $d
  $dst = Join-Path $DeployDir $d
  if (Test-Path $src) {
    Copy-Item $src $dst -Recurse -Force
  }
}
foreach ($f in @("index.html", "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts")) {
  Copy-Item (Join-Path $Pwa $f) (Join-Path $DeployDir $f) -Force
}

Push-Location $DeployDir
git add -A
$status = git status --porcelain
if ($status) {
  git commit -m "Sync PWA from cognitive-pwa"
}
git push aiflashcards HEAD:main
Pop-Location
Write-Host "Pushed to https://github.com/eugeNEOusxr/AIFlashcards (main)"
