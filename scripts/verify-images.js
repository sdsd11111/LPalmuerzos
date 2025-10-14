const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const platosDir = path.join(imagesDir, 'platos');

// Verificar si el directorio de imágenes existe
if (!fs.existsSync(imagesDir)) {
  console.error('❌ El directorio de imágenes no existe:', imagesDir);
  console.log('Creando directorio de imágenes...');
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Verificar si el directorio de platos existe
if (!fs.existsSync(platosDir)) {
  console.log('📂 El directorio de platos no existe, creando...');
  fs.mkdirSync(platosDir, { recursive: true });
}

// Listar archivos en el directorio de platos
try {
  const files = fs.readdirSync(platosDir);
  console.log(`\n📂 Contenido del directorio ${platosDir}:`);
  
  if (files.length === 0) {
    console.log('   (vacío)');
  } else {
    files.forEach((file, index) => {
      const filePath = path.join(platosDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${index + 1}. ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  }
  
  console.log('\n✅ Verificación completada. Asegúrate de que las imágenes de los platos estén en el directorio mostrado arriba.');
  console.log('   Las imágenes deben tener el mismo nombre que se usa en la base de datos (ej: nombre-del-plato.jpg)');
  
} catch (error) {
  console.error('❌ Error al leer el directorio de platos:', error);
}
