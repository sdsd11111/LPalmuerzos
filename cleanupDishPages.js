const fs = require('fs');
const path = require('path');

// Rutas
const platosDir = path.join(__dirname, 'public', 'menu', 'platos');
const bebidasPath = path.join(__dirname, 'public', 'menu', 'bebidas.html');

// Leer el archivo de bebidas para extraer el header y footer
fs.readFile(bebidasPath, 'utf8', (err, bebidasContent) => {
    if (err) {
        console.error('❌ Error al leer el archivo de bebidas:', err);
        return;
    }

    // Extraer el header (desde el inicio hasta el final del div#header-component)
    const headerStart = '<div id="header-component"';
    const headerEnd = '</div>';
    const headerContent = bebidasContent.includes(headerStart) ? 
        getContentBetween(bebidasContent, headerStart, headerEnd) + headerEnd : '';
    
    // Extraer el footer (desde <footer hasta el final del archivo)
    const footerStart = '<footer';
    const footerEnd = '</footer>';
    const footerContent = bebidasContent.includes(footerStart) ? 
        getContentBetween(bebidasContent, footerStart, footerEnd) + footerEnd : '';
    
    if (!headerContent || !footerContent) {
        console.error('❌ No se pudo extraer el header o el footer del archivo de bebidas');
        return;
    }

    // Leer todos los archivos de platos
    fs.readdir(platosDir, (err, files) => {
        if (err) {
            console.error('❌ Error al leer la carpeta de platos:', err);
            return;
        }

        // Filtrar solo archivos HTML que no sean la plantilla
        const htmlFiles = files.filter(file => 
            file.endsWith('.html') && 
            file !== '_template.html' && 
            file !== 'index.html' &&
            !file.startsWith('_')
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
            
            // Extraer el título del nombre del archivo
            const platoName = file
                .replace(/\.html$/, '')
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Crear el contenido limpio
            const cleanContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${platoName} | Los Sartenes</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        body { 
            font-family: 'Open Sans', sans-serif;
            padding-top: 4rem;
        }
        .font-playfair { 
            font-family: 'Playfair Display', serif; 
        }
        main { 
            min-height: calc(100vh - 16rem); 
            padding: 2rem 0;
        }
        header { 
            z-index: 1000 !important; 
        }
    </style>
</head>
<body class="bg-gray-100" data-initialized="true">
    ${headerContent}

    <main class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-3xl font-bold text-center mb-8 font-playfair">${platoName}</h1>
            
            <!-- El contenido específico del plato se cargará aquí -->
            <div id="plato-content">
                <!-- Contenido dinámico irá aquí -->
            </div>
        </div>
    </main>

    ${footerContent}

    <!-- Scripts -->
    <script src="/js/scripts.js"></script>
    <script>
        // Inicializar el menú móvil
        document.addEventListener('DOMContentLoaded', function() {
            // Tu código de inicialización del menú aquí
        });
    </script>
</body>
</html>`;

            // Escribir el archivo limpio
            fs.writeFile(filePath, cleanContent, 'utf8', err => {
                if (err) {
                    console.error(`❌ Error al escribir ${file}:`, err);
                    errors++;
                } else {
                    console.log(`✅ Limpiado: ${file}`);
                }
                processed++;
                checkCompletion();
            });
        });

        function getContentBetween(str, startStr, endStr) {
            const startIndex = str.indexOf(startStr);
            const endIndex = str.indexOf(endStr, startIndex + startStr.length);
            if (startIndex === -1 || endIndex === -1) return '';
            return str.substring(startIndex, endIndex + endStr.length);
        }

        function checkCompletion() {
            if (processed === htmlFiles.length) {
                console.log(`\n✨ Proceso completado!`);
                console.log(`✅ Archivos limpiados: ${htmlFiles.length - errors}`);
                if (errors > 0) {
                    console.log(`❌ Errores: ${errors}`);
                }
                console.log('\nReinicia el servidor para ver los cambios.');
            }
        }
    });
});
