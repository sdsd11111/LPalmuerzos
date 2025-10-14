#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando verificación previa al inicio...\n');

// Ejecutar verificación de variables de entorno
try {
  console.log('🔍 Verificando variables de entorno...');
  require('./check-env');
  console.log('✅ Variables de entorno verificadas\n');
} catch (error) {
  console.error('❌ Error en la verificación de variables de entorno:', error.message);
  process.exit(1);
}

// Ejecutar verificación de directorios
try {
  console.log('🔍 Verificando estructura de directorios...');
  require('./ensure-dirs');
  console.log('✅ Directorios verificados\n');
} catch (error) {
  console.error('❌ Error en la verificación de directorios:', error.message);
  process.exit(1);
}

// Verificar dependencias instaladas
try {
  console.log('📦 Verificando dependencias...');
  execSync('npm list --depth=0', { stdio: 'inherit' });
  console.log('✅ Dependencias verificadas\n');
} catch (error) {
  console.warn('⚠️  Advertencia: No se pudieron verificar las dependencias');
  console.log('💡 Ejecuta `npm install` si es necesario\n');
}

// Verificar si hay migraciones pendientes (si aplica)
const migrationsDir = path.join(__dirname, '..', 'migrations');
if (fs.existsSync(migrationsDir)) {
  try {
    const files = fs.readdirSync(migrationsDir);
    if (files.length > 0) {
      console.log('⚠️  Advertencia: Hay migraciones pendientes en la carpeta migrations/');
      console.log('💡 Asegúrate de aplicar las migraciones necesarias\n');
    }
  } catch (error) {
    console.warn('⚠️  No se pudieron verificar las migraciones:', error.message);
  }
}

console.log('✨ ¡Verificación completada con éxito!');
console.log('   Puedes iniciar el servidor con: npm start\n');

// Si llegamos hasta aquí, todo está bien
process.exit(0);
