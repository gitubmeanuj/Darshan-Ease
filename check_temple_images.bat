@echo off
REM Temple Images Setup Verification Script
REM This script checks if all temple images are present in the backend assets folder

echo.
echo ========================================
echo   Temple Images Setup Verification
echo ========================================
echo.

cd /d "%~dp0darshan-backend\assets\images" 2>nul
if errorlevel 1 (
    echo [ERROR] Images folder not found!
    echo Please ensure images are in: darshan-backend\assets\images\
    exit /b 1
)

echo Current images in folder:
echo.
dir /b *.jpg 2>nul
echo.

REM Check for required images
set "missing=0"

if not exist "Badrinath.jpg" (
    echo [WARNING] Missing: Badrinath.jpg
    set "missing=1"
)
if not exist "Rameswaram.jpg" (
    echo [WARNING] Missing: Rameswaram.jpg
    set "missing=1"
)
if not exist "temple1.jpg" (
    echo [WARNING] Missing: temple1.jpg
    set "missing=1"
)
if not exist "Vrindavan.jpg" (
    echo [WARNING] Missing: Vrindavan.jpg
    set "missing=1"
)
if not exist "Kedarnath.jpg" (
    echo [TODO] Missing: Kedarnath.jpg - Please download
    set "missing=1"
)
if not exist "Somnath.jpg" (
    echo [TODO] Missing: Somnath.jpg - Please download
    set "missing=1"
)
if not exist "KamakhyaDevi.jpg" (
    echo [TODO] Missing: KamakhyaDevi.jpg - Please download
    set "missing=1"
)
if not exist "KashiVishwanath.jpg" (
    echo [TODO] Missing: KashiVishwanath.jpg - Please download
    set "missing=1"
)
if not exist "Meenakshi.jpg" (
    echo [TODO] Missing: Meenakshi.jpg - Please download
    set "missing=1"
)

echo.
if %missing% equ 0 (
    echo [SUCCESS] All temple images are present!
    echo You can now run: node seed.js
) else (
    echo [INFO] Please download the missing images listed above
    echo See TEMPLE_IMAGES_SETUP.md for download instructions
)
echo.
