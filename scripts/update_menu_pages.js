const fs = require('fs');
const path = require('path');

// Configuración de las páginas del menú
const menuPages = [
    {
        id: 'especialidades',
        title: 'Especialidades de la Casa',
        image: 'especialidades-bg.jpg',
        description: 'Los platos más destacados de nuestro menú'
    },
    {
        id: 'pescados-mariscos',
        title: 'Pescados y Mariscos',
        image: 'pescados-mariscos-bg.jpg',
        description: 'Frescos sabores del mar'
    },
    {
        id: 'pastas',
        title: 'Pastas',
        image: 'pastas-bg.jpg',
        description: 'Deliciosas pastas preparadas al instante'
    },
    {
        id: 'carnes',
        title: 'Res, Cerdo y Aves',
        image: 'carnes-bg.jpg',
        description: 'Cortes selectos y preparaciones únicas'
    },
    {
        id: 'vegetariano',
        title: 'Opciones Vegetarianas',
        image: 'vegetariano-bg.jpg',
        description: 'Sabores frescos y naturales'
    },
    {
        id: 'parrilladas',
        title: 'Festival y Parrilladas',
        image: 'parrilladas-bg.jpg',
        description: 'Para compartir en buena compañía'
    },
    {
        id: 'ensaladas-sopas',
        title: 'Ensaladas y Sopas',
        image: 'ensaladas-sopas-bg.jpg',
        description: 'Platos ligeros y deliciosos'
    },
    {
        id: 'postres',
        title: 'Postres e Infantil',
        image: 'postres-bg.jpg',
        description: 'El mejor final para tu comida'
    },
    {
        id: 'bebidas',
        title: 'Bebidas y Cócteles',
        image: 'bebidas-bg.jpg',
        description: 'Para acompañar tu comida'
    }
];

// Función para generar el contenido HTML de una página de menú
function generateMenuPage(page) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | Los Sartenes</title>
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
    <div id="header-component" class="fixed top-0 left-0 right-0 z-50">
        <!-- El contenido del header se cargará aquí mediante JavaScript -->
    </div>

    <!-- Hero Section -->
    <section class="mt-20 h-screen w-full bg-cover bg-center" style="background-image: url('../img/menu/${page.image}');">
        <div class="h-full flex items-center justify-center bg-[#1A531A] bg-opacity-70">
            <div class="text-center text-white px-4">
                <h1 class="text-4xl md:text-6xl font-bold mb-6 font-serif">${page.title}</h1>
                <p class="text-xl md:text-2xl mb-8">${page.description}</p>
                <a href="#menu" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block">Ver Menú</a>
            </div>
        </div>
    </section>

    <!-- Contenido principal -->
    <main id="menu" class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <!-- El contenido específico del menú se cargará aquí -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Los ítems del menú se agregarán aquí dinámicamente -->
        </div>
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
}

// Ruta al directorio de menú (subir un nivel desde scripts)
const menuDir = path.join(__dirname, '..', 'menu');
if (!fs.existsSync(menuDir)) {
    fs.mkdirSync(menuDir, { recursive: true });
}

// Generar cada página de menú
console.log('🚀 Generando páginas de menú...\n');

let createdCount = 0;
menuPages.forEach(page => {
    const filePath = path.join(menuDir, `${page.id}.html`);
    const content = generateMenuPage(page);
    
    // Hacer una copia de seguridad si el archivo ya existe
    if (fs.existsSync(filePath)) {
        const backupPath = `${filePath}.bak`;
        fs.copyFileSync(filePath, backupPath);
        console.log(`✅ Copia de seguridad creada: ${backupPath}`);
    }
    
    // Escribir el nuevo contenido
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Página generada: ${filePath}`);
    createdCount++;
});

console.log(`\n✨ Proceso completado. Se generaron ${createdCount} páginas de menú.`);
