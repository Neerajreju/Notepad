@echo off
rem Builds dist\StudyNotepad-Setup.exe (Windows). Needs Python 3.9+ on this PC only; the installer itself needs nothing.
setlocal
cd /d "%~dp0"

set PY=.venv\Scripts\python.exe
if not exist "%PY%" (
  py -3 -m venv .venv || goto :fail
)

"%PY%" -m pip install --quiet -r requirements.txt pyinstaller || goto :fail

set SRC=%~dp0
set BUILD=%TEMP%\StudyNotepadBuild
rem Building outside the project folder avoids file locks from OneDrive and similar sync tools.
if exist "%BUILD%" rmdir /s /q "%BUILD%"

"%PY%" -m PyInstaller --noconfirm --windowed --name StudyNotepad --icon "%SRC%assets\app.ico" ^
  --workpath "%BUILD%\work" --distpath "%BUILD%\dist" --specpath "%BUILD%" ^
  --add-data "%SRC%index.html;." --add-data "%SRC%app.js;." --add-data "%SRC%styles.css;." --add-data "%SRC%highlighter.js;." ^
  --collect-all webview --collect-data googleapiclient --collect-data google_auth_oauthlib ^
  "%SRC%main.py" || goto :fail

powershell.exe -NoProfile -ExecutionPolicy Bypass -File installer\make_setup.ps1 -AppDir "%BUILD%\dist\StudyNotepad" || goto :fail

echo.
echo Done. Share dist\StudyNotepad-Setup.exe
exit /b 0

:fail
echo.
echo Build failed.
exit /b 1
