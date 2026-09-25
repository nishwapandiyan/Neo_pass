[CmdletBinding()]
param(
    [string]$OutputDirectory = ''
)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $OutputDirectory) { $OutputDirectory = [IO.Path]::Combine($scriptDir, '..', 'dist', 'chromium') }

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
$manifest = Get-Content -LiteralPath (Join-Path $projectRoot 'manifest.json') -Raw | ConvertFrom-Json
$releaseRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
$extensionRoot = Join-Path $releaseRoot 'extension'
$archivePath = Join-Path $releaseRoot ("NeoExamShield-$($manifest.version)-chromium.zip")

if (Test-Path -LiteralPath $extensionRoot) {
    Remove-Item -LiteralPath $extensionRoot -Recurse -Force
}
if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}
New-Item -ItemType Directory -Path $extensionRoot -Force | Out-Null

foreach ($item in @('contentScript.js', 'devtools.js', 'manifest.json', 'metadata.json', 'nptel.txt', 'popup.html', 'popup.js', 'worker.js', 'data', 'images', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'package.json')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $item) -Destination $extensionRoot -Recurse -Force
}
Compress-Archive -Path (Join-Path $extensionRoot '*') -DestinationPath $archivePath -CompressionLevel Optimal
Write-Output "Created $archivePath"
