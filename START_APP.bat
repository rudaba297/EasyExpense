@echo off
REM =============================================
REM EasyExpense - Start App
REM =============================================

echo.
echo ========================================
echo   Starting EasyExpense...
echo ========================================
echo.

REM Check XAMPP
if not exist "C:\xampp\xampp-control.exe" (
    echo [ERROR] XAMPP not found at C:\xampp
    pause
    exit
)

echo [1/2] Starting XAMPP Control Panel...
start "" "C:\xampp\xampp-control.exe"

echo [2/2] Opening Application...
timeout /t 3 > nul
start "" "http://localhost/EasyExpense/frontend/signup.html"

echo.
echo Done! Please ensure Apache and MySQL are running in XAMPP.
echo.
pause
