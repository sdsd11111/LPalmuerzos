const fs = require('fs');
const path = require('path');

const platosDir = path.join(__dirname, 'public', 'menu', 'platos');

// Leer todos los archivos HTML en el directorio de platos
fs.readdir(platosDir, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio:', err);
        return;
    }

    const htmlFiles = files.filter(file => file.endsWith('.html') && file !== '_template.html');
    
    htmlFiles.forEach(file => {
        const filePath = path.join(platosDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Reemplazar el bloque de la imagen con el nuevo diseño
        const newContent = content.replace(
            /<div class="bg-gray-100 rounded-lg overflow-hidden mb-4">\s*<img src="([^"]+)" alt="([^"]+)" class="[^"]+">\s*<\/div>/,
            `<!-- Imagen del plato - TAMAÑO MÁXIMO -->
            <div class="h-[500px] md:h-[700px] w-full overflow-hidden mb-8">
                <img 
                    src="$1" 
                    alt="$2 - Los Sartenes Loja" 
                    class="w-full h-full object-cover object-center"
                    style="min-height: 500px;"
                >
            </div>`
        );
        
        // Escribir el archivo actualizado
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Actualizado: ${file}`);
    });
    
    console.log('\n¡Todas las imágenes han sido actualizadas!');
});
