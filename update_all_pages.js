const fs = require('fs');
const path = require('path');

// Lista de archivos a actualizar
const pages = [
    'menu/especialidades.html',
    'menu/pescados-mariscos.html',
    'menu/pastas.html',
    'menu/carnes.html',
    'menu/vegetariano.html',
    'menu/parrilladas.html',
    'menu/ensaladas-sopas.html',
    'menu/postres.html',
    'menu/bebidas.html',
    'sobre-nosotros.html',
    'galeria.html',
    'contacto.html'
];

// Plantilla base para el contenido de las páginas
const baseTemplate = (content) => `
    <!-- Componente Header -->
    <div id="header-component">
        <!-- El contenido del header se cargará aquí mediante JavaScript -->
    </div>

    <!-- Contenido principal -->
    <main class="min-h-screen">
        ${content}
    </main>

    <!-- Componente Footer -->
    <div id="footer-component">
        <!-- El contenido del footer se cargará aquí mediante JavaScript -->
    </div>
    
    <!-- Scripts -->
    <script src="../js/components.js"></script>
    <script src="../js/main.js"></script>
`;

// Función para actualizar un archivo
function updateFile(filePath) {
    try {
        // Leer el contenido actual del archivo
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Extraer solo el contenido entre <body> y </body>
        const bodyContentMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (!bodyContentMatch) {
            console.log(`No se encontró el cuerpo en ${filePath}`);
            return false;
        }
        
        // Extraer el contenido principal (excluyendo header y footer existentes)
        const mainContent = bodyContentMatch[1]
            .replace(/<header[\s\S]*?<\/header>/gi, '')
            .replace(/<div[^>]*id=["']header-component["'][\s\S]*?<\/div>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<div[^>]*id=["']footer-component["'][\s\S]*?<\/div>/gi, '')
            .replace(/<script[^>]*src=["']\.\.\/js\/components\.js["'][^>]*><\/script>/gi, '')
            .replace(/<script[^>]*src=["']\.\.\/js\/main\.js["'][^>]*><\/script>/gi, '')
            .trim();
        
        // Crear el nuevo contenido con la estructura deseada
        const newContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${getPageTitle(filePath)}</title>
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
    ${baseTemplate(mainContent)}
</body>
</html>`;

        // Escribir el nuevo contenido en el archivo
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Actualizado: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error al actualizar ${filePath}:`, error.message);
        return false;
    }
}

// Función para obtener el título de la página basado en el nombre del archivo
function getPageTitle(filePath) {
    const fileName = path.basename(filePath, '.html');
    const titles = {
        'especialidades': 'Especialidades de la Casa | Los Sartenes',
        'pescados-mariscos': 'Pescados y Mariscos | Los Sartenes',
        'pastas': 'Pastas | Los Sartenes',
        'carnes': 'Res, Cerdo y Aves | Los Sartenes',
        'vegetariano': 'Opciones Vegetarianas | Los Sartenes',
        'parrilladas': 'Festival y Parrilladas | Los Sartenes',
        'ensaladas-sopas': 'Ensaladas y Sopas | Los Sartenes',
        'postres': 'Postres e Infantil | Los Sartenes',
        'bebidas': 'Bebidas y Cócteles | Los Sartenes',
        'sobre-nosotros': 'Sobre Nosotros | Los Sartenes',
        'galeria': 'Galería | Los Sartenes',
        'contacto': 'Contacto | Los Sartenes'
    };
    return titles[fileName] || 'Los Sartenes';
}

// Procesar todos los archivos
console.log('🚀 Iniciando actualización de páginas...\n');

let updatedCount = 0;
pages.forEach(page => {
    const filePath = path.join(__dirname, page);
    if (fs.existsSync(filePath)) {
        if (updateFile(filePath)) {
            updatedCount++;
        }
    } else {
        console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    }
});

console.log(`\n✨ Proceso completado. Se actualizaron ${updatedCount} de ${pages.length} archivos.`);
