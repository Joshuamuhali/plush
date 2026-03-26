@echo off
echo Clearing caches and restarting dev server...

echo.
echo 1. Clearing Vite cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo.
echo 2. Clearing TypeScript cache...
if exist ".vite" rmdir /s /q ".vite"

echo.
echo 3. Starting dev server...
npm run dev

pause
