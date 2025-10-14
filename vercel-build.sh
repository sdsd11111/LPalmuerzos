#!/bin/bash
set -e

echo "============================================"
echo "🚀 INICIANDO CONSTRUCCION EN VERCEL"
echo "============================================"

# Verificar si estamos en entorno de producción
if [ "$VERCEL_ENV" = "production" ]; then
    echo "🔵 MODO: PRODUCCION"
else
    echo "🟡 MODO: DESARROLLO"
fi

# 1. Instalar dependencias
echo
echo "📦 INSTALANDO DEPENDENCIAS..."
echo "--------------------------------------------"
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# 2. Crear estructura de directorios
echo
echo "📂 CREANDO ESTRUCTURA DE DIRECTORIOS..."
echo "--------------------------------------------"

# Directorio principal
if [ ! -d "public" ]; then
    echo "Creando directorio public..."
    mkdir -p public
fi

# Directorios necesarios
directories=(
    "public/images/platos"
    "public/admin"
    "public/css"
    "public/js"
    "public/components"
    "public/menu"
)

for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "Creando directorio: $dir"
        mkdir -p "$dir"
    fi
done

# 3. Copiar archivos estáticos
echo
echo "📄 COPIANDO ARCHIVOS ESTATICOS..."
echo "--------------------------------------------"

# Copiar archivos HTML
if ls *.html 1> /dev/null 2>&1; then
    echo "Copiando archivos HTML..."
    cp -f *.html public/
fi

# Copiar directorios estáticos
dirs_to_copy=(
    "components"
    "css"
    "js"
    "images"
    "menu"
)

for dir in "${dirs_to_copy[@]}"; do
    if [ -d "$dir" ]; then
        echo "Copiando directorio: $dir"
        cp -R "$dir" public/
    fi
done

# 4. Configurar panel de administración
echo
echo "👨‍💻 CONFIGURANDO PANEL DE ADMINISTRACION..."
echo "--------------------------------------------"

if [ -d "admin" ]; then
    echo "Copiando archivos del panel de administración..."
    cp -R admin public/
fi

# 5. Verificar archivos necesarios
echo
echo "🔍 VERIFICANDO ARCHIVOS NECESARIOS..."
echo "--------------------------------------------"

missing_files=0
required_files=(
    "public/index.html"
    "public/admin/index.html"
    "server.js"
    "package.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Archivo no encontrado: $file"
        missing_files=$((missing_files + 1))
    else
        echo "✅ Archivo encontrado: $file"
    fi
done

if [ $missing_files -gt 0 ]; then
    echo
    echo "❗ Se encontraron $missing_files archivos faltantes"
    exit 1
fi

# 6. Verificar variables de entorno
echo
echo "🔐 VERIFICANDO VARIABLES DE ENTORNO..."
echo "--------------------------------------------"

missing_vars=0
required_vars=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Variable de entorno no definida: $var"
        missing_vars=$((missing_vars + 1))
    else
        echo "✅ Variable de entorno definida: $var"
    fi
done

if [ $missing_vars -gt 0 ]; then
    echo
    echo "❗ Faltan $missing_vars variables de entorno requeridas"
    exit 1
fi

# 7. Construcción completada
echo
echo "============================================"
echo "✅ CONSTRUCCION COMPLETADA CON EXITO"
echo "============================================"
echo
echo "📂 Directorio de salida: $(pwd)/public"
echo "🌍 Entorno: $VERCEL_ENV"
echo "📅 Fecha: $(date)"
echo

exit 0
