@echo off
setlocal
pushd "%~dp0\.."
node scripts\delete-all-data.js %*
set EXIT_CODE=%ERRORLEVEL%
popd
exit /b %EXIT_CODE%
