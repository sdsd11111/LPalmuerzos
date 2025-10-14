@echo off
echo ============================================
echo INICIANDO CONSTRUCCION EN VERCEL (Windows)
echo ============================================

echo.
echo INSTALANDO DEPENDENCIAS...
echo --------------------------------------------
npm install
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

echo.
echo VERIFICANDO ESTRUCTURA...
echo --------------------------------------------
if not exist public mkdir public
if not exist public\admin mkdir public\admin
if not exist public\images mkdir public\images
if not exist public\images\platos mkdir public\images\platos

echo.
echo EJECUTANDO PRE-CONSTRUCCION...
echo --------------------------------------------
npm run prebuild
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

echo.
echo GENERANDO PAGINAS DE PLATOS...
echo --------------------------------------------
node generate_dish_pages.js
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

echo.
echo COPIANDO ARCHIVOS ESTATICOS...
echo --------------------------------------------
if exist admin xcopy /E /I /Y admin public\admin
if exist css xcopy /E /I /Y css public\css
if exist js xcopy /E /I /Y js public\js

echo.
echo CONSTRUCCION COMPLETADA CON EXITO
echo ============================================
echo Directorio de salida: %CD%\public
echo ============================================

exit /b 0
