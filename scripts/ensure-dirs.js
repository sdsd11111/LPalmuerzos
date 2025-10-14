const fs = require('fs');
const path = require('path');

// Directorios a verificar/crear
const directories = [
  path.join(__dirname, '..', 'public', 'images', 'platos'),
  path.join(__dirname, '..', 'public', 'admin'),
  path.join(__dirname, '..', 'logs')
];

console.log('🔍 Verificando directorios...');

let allDirsExist = true;

directories.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`📂 Creando directorio: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Directorio creado: ${dir}`);
    } else {
      console.log(`✅ El directorio ya existe: ${dir}`);
    }
    
    // Verificar permisos de escritura
    try {
      const testFile = path.join(dir, '.writetest');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`   ✅ Permisos de escritura en: ${dir}`);
    } catch (error) {
      console.error(`   ❌ Sin permisos de escritura en: ${dir}`, error);
      allDirsExist = false;
    }
    
  } catch (error) {
    console.error(`❌ Error al verificar/crear directorio ${dir}:`, error);
    allDirsExist = false;
  }
});

if (!allDirsExist) {
  console.error('⚠️ Advertencia: Algunos directorios no tienen los permisos necesarios');
  console.log('💡 Ejecuta el script con permisos de administrador o verifica los permisos de las carpetas');
  process.exit(1);
}

console.log('✅ Todos los directorios están listos');

// Exportar para usar en otros scripts si es necesario
module.exports = { directories };
