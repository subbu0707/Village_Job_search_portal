@echo off
REM Village Jobs Hub - Complete Startup Script
REM This script will:
REM 1. Install backend dependencies
REM 2. Install frontend dependencies
REM 3. Start backend on port 4000
REM 4. Start frontend on port 5173

echo.
echo ======================================================
echo  Village Jobs Hub - Full Stack Setup
echo ======================================================
echo.

REM Get project root
set PROJECT_ROOT=%~dp0
cd /d %PROJECT_ROOT%

echo [1/4] Checking backend dependencies...
cd backend_mysql
if not exist node_modules (
    echo [INSTALLING] Backend npm packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Backend npm install failed
        pause
        exit /b 1
    )
    echo [OK] Backend packages installed
) else (
    echo [OK] Backend packages already installed
)
cd ..

echo.
echo [2/4] Checking frontend dependencies...
cd frontend
if not exist node_modules (
    echo [INSTALLING] Frontend npm packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Frontend npm install failed
        pause
        exit /b 1
    )
    echo [OK] Frontend packages installed
) else (
    echo [OK] Frontend packages already installed
)
cd ..

echo.
echo ======================================================
echo  Starting Village Jobs Hub
echo ======================================================
echo.
echo Backend URL:  http://localhost:4000
echo Frontend URL: http://localhost:5173
echo.
echo IMPORTANT: Two terminal windows will open
echo - Window 1: Backend Server (Keep running)
echo - Window 2: Frontend Dev Server (Keep running)
echo.
pause

echo.
echo [3/4] Starting Backend Server...
echo This window will be used by the backend
start cmd /k "cd /d %PROJECT_ROOT%backend_mysql && npm start"

timeout /t 3 /nobreak

echo.
echo [4/4] Starting Frontend Server...
echo This window will be used by the frontend
start cmd /k "cd /d %PROJECT_ROOT%frontend && npm run dev"

echo.
echo ======================================================
echo Both servers started!
echo Opening browser...
echo ======================================================
echo.

timeout /t 3 /nobreak

REM Open browser
start http://localhost:5173

echo.
echo Server startup complete!
echo - Backend:  http://localhost:4000
echo - Frontend: http://localhost:5173
echo.
echo Keep both terminal windows open while developing.
echo.
