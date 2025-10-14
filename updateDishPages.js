const fs = require('fs');
const path = require('path');

// Rutas
const platosDir = path.join(__dirname, 'public', 'menu', 'platos');
const templatePath = path.join(platosDir, '_template.html');

// Función para formatear el nombre del plato
function formatPlatoName(filename) {
    return filename
        .replace(/\.html$/, '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Leer la plantilla
fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
        console.error('❌ Error al leer la plantilla:', err);
        return;
    }

    // Leer archivos de platos
    fs.readdir(platosDir, (err, files) => {
        if (err) {
            console.error('❌ Error al leer la carpeta de platos:', err);
            return;
        }

        // Filtrar solo archivos HTML que no sean la plantilla
        const htmlFiles = files.filter(file => 
            file.endsWith('.html') && file !== '_template.html' && file !== 'index.html'
        );

        if (htmlFiles.length === 0) {
            console.log('ℹ️ No se encontraron archivos de platos para actualizar.');
            return;
        }

        console.log(`🔄 Procesando ${htmlFiles.length} archivos de platos...`);
        let processed = 0;
        let errors = 0;

        htmlFiles.forEach(file => {
            const filePath = path.join(platosDir, file);
            
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    console.error(`❌ Error al leer ${file}:`, err);
                    errors++;
                    checkCompletion();
                    return;
                }

                try {
                    // Extraer el contenido del body
                    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                    const bodyContent = bodyMatch ? bodyMatch[1] : content;

                    // Crear el contenido actualizado
                    const platoName = formatPlatoName(file);
                    const updatedContent = template
                        .replace(/\$\{PLATO_NOMBRE\}/g, platoName)
                        .replace('<!-- Contenido específico del plato irá aquí -->', bodyContent);

                    // Escribir el archivo actualizado
                    fs.writeFile(filePath, updatedContent, 'utf8', err => {
                        if (err) {
                            console.error(`❌ Error al escribir ${file}:`, err);
                            errors++;
                        } else {
                            console.log(`✅ Actualizado: ${file}`);
                        }
                        processed++;
                        checkCompletion();
                    });
                } catch (error) {
                    console.error(`❌ Error al procesar ${file}:`, error);
                    errors++;
                    processed++;
                    checkCompletion();
                }
            });
        });

        function checkCompletion() {
            if (processed === htmlFiles.length) {
                console.log(`\n✨ Proceso completado!`);
                console.log(`✅ Archivos actualizados: ${htmlFiles.length - errors}`);
                if (errors > 0) {
                    console.log(`❌ Errores: ${errors}`);
                }
                console.log('\nReinicia el servidor para ver los cambios.');
            }
        }
    });
});
