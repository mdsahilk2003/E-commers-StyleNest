@echo off
color 0E
title SETIA COLLECTION - TEMPORARY Backend (No MongoDB)
cls

echo.
echo ========================================
echo   TEMPORARY BACKEND SERVER
echo   (MongoDB Not Required)
echo ========================================
echo.
echo This is a TEMPORARY solution to test login.
echo.
echo For PERMANENT solution:
echo 1. Whitelist IP in MongoDB Atlas
echo 2. Use start-backend.bat instead
echo.
echo ========================================
echo.

cd /d "%~dp0backend"
node temp-server.js

echo.
echo ========================================
echo Server stopped! Press any key to exit.
pause >nul
