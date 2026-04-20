# Village Jobs Hub - PowerShell Startup Script
# This script sets up and runs both frontend and backend

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Village Jobs Hub - Full Stack Setup" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Function to install npm packages
function Install-NpmPackages {
    param(
        [string]$Directory,
        [string]$Name
    )
    
    Write-Host "[1/2] Checking $Name dependencies..." -ForegroundColor Yellow
    
    $NpmPath = Join-Path $Directory "node_modules"
    
    if (-not (Test-Path $NpmPath)) {
        Write-Host "[INSTALLING] $Name npm packages..." -ForegroundColor Green
        
        Push-Location $Directory
        & npm install
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: $Name npm install failed" -ForegroundColor Red
            Pop-Location
            exit 1
        }
        
        Write-Host "[OK] $Name packages installed" -ForegroundColor Green
        Pop-Location
    } else {
        Write-Host "[OK] $Name packages already installed" -ForegroundColor Green
    }
}

# Install backend dependencies
Install-NpmPackages -Directory "$ProjectRoot\backend_mysql" -Name "Backend"

Write-Host ""

# Install frontend dependencies
Install-NpmPackages -Directory "$ProjectRoot\frontend" -Name "Frontend"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Starting Village Jobs Hub" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL:  http://localhost:4000" -ForegroundColor Magenta
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "IMPORTANT: Two PowerShell windows will open" -ForegroundColor Yellow
Write-Host "- Window 1: Backend Server (Keep running)" -ForegroundColor Yellow
Write-Host "- Window 2: Frontend Dev Server (Keep running)" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue..."

Write-Host ""
Write-Host "[2/2] Starting Backend Server..." -ForegroundColor Yellow
$BackendPath = Join-Path $ProjectRoot "backend_mysql"
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$BackendPath'; npm start`""

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "[3/2] Starting Frontend Server..." -ForegroundColor Yellow
$FrontendPath = Join-Path $ProjectRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$FrontendPath'; npm run dev`""

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Both servers started!" -ForegroundColor Cyan
Write-Host "Opening browser..." -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:5173"

Write-Host "Server startup complete!" -ForegroundColor Green
Write-Host "- Backend:  http://localhost:4000" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Keep both terminal windows open while developing." -ForegroundColor Cyan
Write-Host ""
