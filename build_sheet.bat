@echo off
setlocal
rem Runs build_sheet.py from this folder, so it works from a double-click or any prompt.
rem Add "nopause" as an argument (build.bat nopause) to skip the final "press any key".

cd /d "%~dp0"

set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
    echo Python 3 was not found. Install it from python.org and tick "Add python.exe to PATH".
    goto :fail
)

%PY% build_sheet.py
if errorlevel 1 goto :fail

echo.
echo Build finished.
if /i not "%~1"=="nopause" pause
exit /b 0

:fail
echo.
echo Build FAILED.
if /i not "%~1"=="nopause" pause
exit /b 1