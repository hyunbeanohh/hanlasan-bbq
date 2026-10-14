param(
    [ValidateSet('check', 'build', 'deploy')]
    [string]$Mode = 'check',
    [string]$Distribution = 'Ubuntu'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
$configRoot = Join-Path $env:APPDATA 'xdg.config'

function Convert-ToWslPath([string]$WindowsPath) {
    $normalizedPath = $WindowsPath.Replace('\', '/')
    $result = & wsl.exe -d $Distribution -- wslpath -a -u $normalizedPath
    if ($LASTEXITCODE -ne 0) { throw "Cannot resolve WSL path: $WindowsPath" }
    return ($result | Select-Object -Last 1).Trim()
}

$linuxRepo = Convert-ToWslPath $repoRoot
$authPath = Join-Path $configRoot '.wrangler/config/default.toml'
if (-not (Test-Path -LiteralPath $authPath)) { throw 'Run pnpm exec wrangler login in Windows first.' }
# Pipe credentials directly to WSL: its Windows mount may not expose the auth
# file created by the Windows credential environment. Never log this input.
Get-Content -LiteralPath $authPath -Raw | & wsl.exe -d $Distribution -- bash "$linuxRepo/scripts/cloudflare-wsl.sh" $Mode $linuxRepo
if ($LASTEXITCODE -ne 0) { throw "Cloudflare $Mode failed (exit $LASTEXITCODE)." }
