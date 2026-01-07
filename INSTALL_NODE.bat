@echo off
REM =============================================
REM EasyExpense - Install Node.js
REM =============================================

echo.
echo ========================================
echo   Installing Node.js...
echo ========================================
echo.
echo Requesting Administrator privileges...

powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -File ""%~dp0install_node.ps1""'"

echo.
echo If a window appeared, please click 'Yes' to allow installation.
echo.
pause
