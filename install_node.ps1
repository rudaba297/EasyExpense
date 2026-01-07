# PowerShell script to download and install Node.js
# Run this with: powershell -ExecutionPolicy Bypass -File install_node.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   EasyExpense - Node.js Auto Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "[ERROR] This script requires Administrator privileges" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run PowerShell as Administrator and try again" -ForegroundColor Yellow
    Write-Host "Right-click -> Run with PowerShell (Run as Administrator)" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Download Node.js
Write-Host "[1/3] Downloading Node.js (LTS)..." -ForegroundColor Yellow
$nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
$installerPath = "$env:TEMP\node-installer.msi"

try {
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "[SUCCESS] Download complete!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Download failed: $_" -ForegroundColor Red
    Write-Host "Please download manually from: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Install Node.js
Write-Host ""
Write-Host "[2/3] Installing Node.js..." -ForegroundColor Yellow
Write-Host "This may take a minute..." -ForegroundColor Cyan

try {
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait
    Write-Host "[SUCCESS] Node.js installed!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Installation failed: $_" -ForegroundColor Red
    pause
    exit 1
}

# Verify
Write-Host ""
Write-Host "[3/3] Verifying installation..." -ForegroundColor Yellow

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

try {
    $nodeVer = & "C:\Program Files\nodejs\node.exe" -v
    $npmVer = & "C:\Program Files\nodejs\npm.cmd" -v
    
    Write-Host "Node Version: $nodeVer" -ForegroundColor White
    Write-Host "Npm Version:  $npmVer" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: You doubtless need to RESTART your terminal/VS Code" -ForegroundColor Yellow
    Write-Host "to use 'node' and 'npm' commands." -ForegroundColor Yellow
    Write-Host ""
} catch {
    Write-Host "[WARNING] Could not verify version, but installation finished." -ForegroundColor Yellow
    Write-Host "Please restart your computer or terminal." -ForegroundColor Yellow
}

pause
