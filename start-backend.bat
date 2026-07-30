@echo off
color 0A
title SETIA COLLECTION - Backend Server
cls

echo.
echo ========================================
echo   SETIA COLLECTION - Backend Server
echo ========================================
echo.
echo Starting backend server...
echo.
echo IMPORTANT: Keep this window OPEN!
echo If you close it, login will NOT work.
echo.
echo ========================================
echo.

cd /d "%~dp0backend"
node server.js

echo.
echo ========================================
echo Server stopped! Press any key to exit.
pause >nul
