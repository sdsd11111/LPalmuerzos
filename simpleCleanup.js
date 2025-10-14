const fs = require('fs');
const path = require('path');

// Ruta a la carpeta de platos
const platosDir = path.join(__dirname, 'public', 'menu', 'platos');

// Función para capitalizar palabras
function capitalizeWords(str) {
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Plantilla básica
function getTemplate(platoName) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${platoName} | Los Sartenes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        body { font-family: 'Open Sans', sans-serif; padding-top: 4rem; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        main { min-height: calc(100vh - 16rem); padding: 2rem 0; }
    </style>
</head>
<body class="bg-gray-100" data-initialized="true">
    <!-- Header -->
    <div id="header-container"></div>

    <!-- Contenido principal -->
    <main class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-3xl font-bold text-center mb-8 font-playfair">${platoName}</h1>
            
            <!-- El contenido específico del plato se cargará aquí -->
            <div id="plato-content">
                <!-- Contenido dinámico irá aquí -->
            </div>
        </div>
    </main>

    <!-- Footer -->
    <div id="footer-container"></div>

    <!-- Scripts -->
    <script src="/js/loadComponents.js"></script>
    <script src="/js/scripts.js"></script>
</body>
</html>`;
}

// Leer y limpiar archivos de platos
fs.readdir(platosDir, (err, files) => {
    if (err) {
        console.error('Error al leer la carpeta de platos:', err);
        return;
    }

    const htmlFiles = files.filter(file => 
        file.endsWith('.html') && 
        file !== '_template.html' && 
        file !== 'index.html' &&
        !file.startsWith('_')
    );

    console.log(`Encontrados ${htmlFiles.length} archivos para limpiar...`);
    
    let processed = 0;
    let errors = 0;

    htmlFiles.forEach(file => {
        const filePath = path.join(platosDir, file);
        const platoName = capitalizeWords(file.replace(/\.html$/, ''));
        
        fs.writeFile(filePath, getTemplate(platoName), 'utf8', err => {
            if (err) {
                console.error(`Error al limpiar ${file}:`, err);
                errors++;
            } else {
                console.log(`✅ Limpiado: ${file}`);
            }
            
            processed++;
            if (processed === htmlFiles.length) {
                console.log(`\nProceso completado!`);
                console.log(`✅ Archivos limpiados: ${htmlFiles.length - errors}`);
                if (errors > 0) {
                    console.log(`❌ Errores: ${errors}`);
                }
                console.log('\nReinicia el servidor para ver los cambios.');
            }
        });
    });
});
