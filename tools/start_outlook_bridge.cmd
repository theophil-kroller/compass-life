@echo off
setlocal
cd /d "%~dp0\.."
echo Compass Outlook Bridge 0.5.77.24 - nur klassisches Outlook fuer Windows
where py >nul 2>nul
if errorlevel 1 (
 echo Python Launcher fehlt. Bitte Python 3.10+ mit py Launcher installieren.
 pause
 exit /b 1
)
py -c "import win32com.client" >nul 2>nul
if errorlevel 1 (
 echo pywin32 fehlt. Installiere es einmalig mit: py -m pip install pywin32
 pause
 exit /b 1
)
set /p COMPASS_ORIGIN=HTTPS-Adresse deiner Compass-Seite, ohne abschliessenden Pfad (z.B. https://meine-seite.pages.dev): 
if "%COMPASS_ORIGIN%"=="" (
 echo Bitte Website-Origin eingeben.
 pause
 exit /b 1
)
py tools\outlook_bridge.py --serve --origin "%COMPASS_ORIGIN%"
pause
