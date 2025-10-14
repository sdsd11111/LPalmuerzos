const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Variables de entorno requeridas
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'NODE_ENV'
];

console.log('🔍 Verificando variables de entorno...');

// Verificar archivo .env
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró el archivo .env');
  console.log('💡 Crea un archivo .env basado en .env.example');
  process.exit(1);
}

// Verificar variables de entorno requeridas
let allVarsPresent = true;

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Variable de entorno faltante: ${varName}`);
    allVarsPresent = false;
  } else {
    console.log(`✅ ${varName}: ${varName.endsWith('_KEY') ? '***' + process.env[varName].slice(-4) : process.env[varName]}`);
  }
});

if (!allVarsPresent) {
  console.error('\n❌ Faltan variables de entorno requeridas');
  console.log('💡 Asegúrate de que todas las variables requeridas estén definidas en tu archivo .env');
  process.exit(1);
}

// Verificar configuración de Supabase
if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.startsWith('http')) {
  console.warn('⚠️  ADVERTENCIA: SUPABASE_URL parece no ser una URL válida');
}

console.log('\n✅ Configuración de entorno verificada correctamente');

// Exportar para usar en otros scripts si es necesario
module.exports = { requiredEnvVars };
