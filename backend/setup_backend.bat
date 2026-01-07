@echo off
REM Setup Backend Envrionment
set "PATH=%PATH%;C:\Program Files\nodejs"

echo [1/3] Initializing...
if not exist package.json call npm init -y

echo [2/3] Installing dependencies...
call npm install express mysql2 bcryptjs cors dotenv body-parser

echo [3/3] Starting server...
start /min node server.js

echo Backend setup complete and server started!
pause
