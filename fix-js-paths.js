const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const publicDir = path.join(__dirname, 'public');

// Función para actualizar las rutas en un archivo
function updateFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error al leer el archivo ${filePath}:`, err);
      return;
    }

    // Actualizar rutas de scripts
    let updatedContent = data
      .replace(/src="\.\.\/js\//g, 'src="/js/')
      .replace(/href="\.\.\/css\//g, 'href="/css/');

    // Solo escribir si hay cambios
    if (updatedContent !== data) {
      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          console.error(`Error al escribir el archivo ${filePath}:`, err);
          return;
        }
        console.log(`Actualizado: ${filePath}`);
      });
    }
  });
}

// Función para recorrer directorios recursivamente
function processDirectory(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`Error al leer el directorio ${directory}:`, err);
      return;
    }

    entries.forEach(entry => {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        // Si es un directorio, procesarlo recursivamente
        processDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        // Si es un archivo HTML, actualizarlo
        updateFile(fullPath);
      }
    });
  });
}

// Iniciar el proceso
console.log('Actualizando rutas de archivos...');
processDirectory(publicDir);
