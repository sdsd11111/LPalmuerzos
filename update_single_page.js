const fs = require('fs');
const path = require('path');

// Función para actualizar una sola página
function updateSinglePage(filePath) {
    try {
        // Leer el contenido actual del archivo
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extraer el contenido principal (excluyendo header y footer)
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (!bodyMatch) {
            console.log('No se encontró el cuerpo del documento');
            return false;
        }
        
        // Extraer el contenido principal
        let mainContent = bodyMatch[1]
            .replace(/<header[\s\S]*?<\/header>/gi, '')
            .replace(/<div[^>]*id=["']header-component["'][\s\S]*?<\/div>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<div[^>]*id=["']footer-component["'][\s\S]*?<\/div>/gi, '')
            .replace(/<script[^>]*src=["'].*?components\.js["'][^>]*><\/script>/gi, '')
            .replace(/<script[^>]*src=["'].*?main\.js["'][^>]*><\/script>/gi, '')
            .trim();
        
        // Obtener el título de la página
        const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
        const pageTitle = titleMatch ? titleMatch[1] : 'Los Sartenes';
        
        // Crear el nuevo contenido
        const newContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="bg-white">
    <!-- Componente Header -->
    <div id="header-component">
        <!-- El contenido del header se cargará aquí mediante JavaScript -->
    </div>

    <!-- Contenido principal -->
    <main class="min-h-screen">
        ${mainContent}
    </main>

    <!-- Componente Footer -->
    <div id="footer-component">
        <!-- El contenido del footer se cargará aquí mediante JavaScript -->
    </div>
    
    <!-- Scripts -->
    <script src="../js/components.js"></script>
    <script src="../js/main.js"></script>
</body>
</html>`;

        // Hacer una copia de seguridad del archivo original
        const backupPath = filePath + '.bak';
        fs.writeFileSync(backupPath, content, 'utf8');
        
        // Escribir el nuevo contenido
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        console.log(`✅ Página actualizada: ${filePath}`);
        console.log(`   Se creó una copia de seguridad en: ${backupPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error al actualizar ${filePath}:`, error.message);
        return false;
    }
}

// Obtener la ruta del archivo desde los argumentos de la línea de comandos
const filePath = process.argv[2];
if (!filePath) {
    console.log('Por favor, proporciona la ruta del archivo a actualizar');
    console.log('Ejemplo: node update_single_page.js menu/especialidades.html');
    process.exit(1);
}

// Actualizar el archivo
updateSinglePage(path.join(__dirname, filePath));
