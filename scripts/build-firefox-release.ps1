[CmdletBinding()]
param(
    [string]$OutputDirectory = ''
)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $OutputDirectory) { $OutputDirectory = [IO.Path]::Combine($scriptDir, '..', 'dist', 'firefox') }

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path

# Use the pre-built Firefox manifest (MV3, gecko settings, no Chrome-only permissions)
$ffManifestPath = Join-Path $projectRoot 'manifest.firefox.json'
if (-not (Test-Path -LiteralPath $ffManifestPath)) {
    Write-Error "manifest.firefox.json not found at $ffManifestPath"
    exit 1
}
$manifest = Get-Content -LiteralPath $ffManifestPath -Raw | ConvertFrom-Json

$releaseRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
$extensionRoot = Join-Path $releaseRoot 'extension'
$archivePath = Join-Path $releaseRoot ("NeoExamShield-$($manifest.version)-firefox.zip")

if (Test-Path -LiteralPath $extensionRoot) {
    Remove-Item -LiteralPath $extensionRoot -Recurse -Force
}
if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}
New-Item -ItemType Directory -Path $extensionRoot -Force | Out-Null

foreach ($item in @('contentScript.js', 'devtools.js', 'metadata.json', 'nptel.txt', 'popup.html', 'popup.js', 'worker.js', 'data', 'images', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'package.json')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $item) -Destination $extensionRoot -Recurse -Force
}

# Copy the Firefox-specific manifest as manifest.json inside the bundle
Copy-Item -LiteralPath $ffManifestPath -Destination (Join-Path $extensionRoot 'manifest.json') -Force

Compress-Archive -Path (Join-Path $extensionRoot '*') -DestinationPath $archivePath -CompressionLevel Optimal
Write-Output "Created $archivePath"
