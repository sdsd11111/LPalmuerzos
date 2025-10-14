Write-Host "============================================"
Write-Host "INICIANDO CONSTRUCCION EN VERCEL (PowerShell)"
Write-Host "============================================"

# Instalar dependencias
Write-Host "`nINSTALANDO DEPENDENCIAS..."
Write-Host "--------------------------------------------"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Verificar estructura de directorios
Write-Host "--------------------------------------------"
$directories = @(
    "public",
    "public\admin",
    "public\images",
    "public\images\platos",
    "public\css",
    "public\js"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        Write-Host "Creando directorio: $dir"
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Pre-construcción
Write-Host "`nEJECUTANDO PRE-CONSTRUCCION..."
Write-Host "--------------------------------------------"
npm run prebuild
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en pre-construcción" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Generar páginas de platos
Write-Host "`nGENERANDO PAGINAS DE PLATOS..."
Write-Host "--------------------------------------------"
node generate_dish_pages.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al generar páginas de platos" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Copiar archivos estáticos
Write-Host "`nCOPIANDO ARCHIVOS ESTATICOS..."
Write-Host "--------------------------------------------"
$copyOperations = @(
    @{Source = "admin"; Destination = "public\admin"},
    @{Source = "css"; Destination = "public\css"},
    @{Source = "js"; Destination = "public\js"}
)

foreach ($op in $copyOperations) {
    if (Test-Path $op.Source) {
        Write-Host "Copiando $($op.Source) a $($op.Destination)"
        Copy-Item -Path $op.Source -Destination $op.Destination -Recurse -Force
    }
}

# Mensaje de éxito
Write-Host "`n[SUCCESS] CONSTRUCCION COMPLETADA"
Write-Host "============================================"
$outputDir = Join-Path -Path (Get-Location) -ChildPath "public"
Write-Host "Directorio de salida: $outputDir"
Write-Host "============================================"

exit 0
