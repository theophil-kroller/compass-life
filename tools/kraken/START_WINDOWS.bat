@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
 py -3 kraken_sync.py
) else (
 python kraken_sync.py
)
echo.
pause
