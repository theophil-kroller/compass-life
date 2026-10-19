@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
 py -3 kraken_bridge.py
) else (
 python kraken_bridge.py
)
echo.
pause
