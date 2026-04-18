@echo off
title CareerCompass - Smart Career Path Recommendation System
echo.
echo ============================================================
echo   CareerCompass - Smart Career Path Recommendation System
echo ============================================================
echo.
echo Starting server and client...
echo.
echo  Server:  http://localhost:5000
echo  Client:  http://localhost:5173
echo.
echo  Admin Login: admin@careercompass.com / admin123
echo.
echo ============================================================
echo.

cd /d "%~dp0"
npm run dev
