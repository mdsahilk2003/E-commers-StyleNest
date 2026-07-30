@echo off
color 0B
title SETIA COLLECTION - Frontend
cls

echo.
echo ========================================
echo   SETIA COLLECTION - Frontend
echo ========================================
echo.
echo Starting frontend server...
echo.
echo Browser will open automatically at:
echo http://localhost:5173
echo.
echo ========================================
echo.

cd /d "%~dp0frontend"
npm run dev

echo.
echo ========================================
echo Server stopped! Press any key to exit.
pause >nul
