const fs = require('fs');
const path = require('path');

// List of all dish pages to restore
const dishPages = [
    // Especiales de la Casa
    'salmon', 'picadillo', 'camarones_al_ajillo', 'pollo_andaluz', 'camarones_fredd',
    'chuleta_de_cerdo_en_salsa_de_pina', 'tilapia_a_los_sartenes',
    
    // Ensaladas
    'ensalada_campera', 'ensalada_cesar', 'ensalada_los_sartenes',
    
    // Sopas
    'crema_de_camaron', 'locro_de_papa_clasico', 'crema_de_verduras', 'sopa_de_pollo',
    
    // Res
    'filet_mignon', 'sarten_de_lomo_a_la_pimienta', 'bistec_a_los_sartenes',
    
    // Cerdo
    'chuleta_en_salsa_de_champinones', 'sarten_de_costillas_bbq', 'cecina_a_los_sartenes',
    
    // Aves
    'pollo_los_sartenes', 'sarten_de_pollo_en_salsa_de_portobellos', 'gordon_blue', 'sarten_de_alitas',
    
    // Pescados y Mariscos
    'sarten_frutos_del_mar', 'camaron_a_los_sartenes', 'sarten_de_langostinos_al_grill', 'ceviche_peruano',
    
    // Pastas
    'espagueti_con_mariscos', 'espagueti_carbonara', 'fettuccini_a_los_sartenes', 'risotto_marinero', 'espagueti_di_pollo_con_champinones'
];

const platosDir = path.join(__dirname, 'public', 'menu', 'platos');
const backupDir = path.join(__dirname, 'backup_dish_pages');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Template for dish pages
const dishTemplate = (dishName) => `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dishName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Los Sartenes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        body { font-family: 'Open Sans', sans-serif; padding-top: 0; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        main { min-height: calc(100vh - 16rem); padding: 2rem 0; }
    </style>
</head>
<body class="bg-white flex flex-col min-h-screen">
    <!-- Componente Header -->
    <div id="header-component" class="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
        <!-- El contenido del header se cargará aquí mediante JavaScript -->
    </div>
    
    <!-- Espaciador para el header fijo -->
    <div class="h-16"></div>

    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-playfair">${dishName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
            <div class="w-24 h-1 bg-orange-500 mb-6"></div>
            
            <!-- Imagen del plato -->
            <div class="bg-gray-100 rounded-lg overflow-hidden mb-8">
                <img 
                    src="/images/platos/${dishName}.jpg" 
                    alt="${dishName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Los Sartenes Loja" 
                    class="w-full h-auto"
                    onerror="this.onerror=null; this.src='/images/platos/sample.jpg'; this.alt='Imagen no disponible'"
                >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="bg-white p-4 rounded-lg shadow text-center">
                            <i class="fas fa-clock text-orange-500 text-xl mb-2"></i>
                            <p class="text-sm text-gray-600">Tiempo</p>
                            <p class="font-semibold">30 minutos</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow text-center">
                            <i class="fas fa-utensils text-orange-500 text-xl mb-2"></i>
                            <p class="text-sm text-gray-600">Porciones</p>
                            <p class="font-semibold">2 personas</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow text-center">
                            <i class="fas fa-fire text-orange-500 text-xl mb-2"></i>
                            <p class="text-sm text-gray-600">Dificultad</p>
                            <p class="font-semibold">Media</p>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-6 rounded-lg mb-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-4 font-playfair">Descripción</h2>
                        <p class="text-gray-700 mb-4">Delicioso plato de ${dishName.replace(/-/g, ' ')} preparado con los mejores ingredientes y sazón tradicional.</p>
                        <div class="flex items-center text-orange-500">
                            <span class="font-bold mr-2">Precio:</span>
                            <span class="text-2xl">$12.99</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h2 class="text-xl font-bold text-gray-800 mb-4 font-playfair">Ingredientes</h2>
                        <ul class="space-y-2">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span>Ingrediente principal</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span>Especias seleccionadas</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span>Verduras frescas</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span>Salsa especial de la casa</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span>Guarnición al gusto</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-2xl font-bold text-gray-800 mb-4 font-playfair">Preparación</h2>
                <ol class="space-y-4">
                    <li class="flex">
                        <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-3">1</span>
                        <p class="text-gray-700">Preparar todos los ingredientes frescos.</p>
                    </li>
                    <li class="flex">
                        <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-3">2</span>
                        <p class="text-gray-700">Cocinar los ingredientes principales a fuego medio.</p>
                    </li>
                    <li class="flex">
                        <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-3">3</span>
                        <p class="text-gray-700">Agregar las especias y salsas según la receta.</p>
                    </li>
                    <li class="flex">
                        <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-3">4</span>
                        <p class="text-gray-700">Cocinar hasta que todos los sabores se integren.</p>
                    </li>
                    <li class="flex">
                        <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-3">5</span>
                        <p class="text-gray-700">Servir caliente y disfrutar.</p>
                    </li>
                </ol>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <div id="footer-component"></div>
    
    <!-- Scripts -->
    <script src="/js/components.js"></script>
    <script>
        // Cargar componentes
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar header
            fetch('/components/header.html')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('header-component').innerHTML = html;
                });
            
            // Cargar footer
            fetch('/components/footer.html')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('footer-component').innerHTML = html;
                });
        });
    </script>
</body>
</html>`;

// Process each dish page
dishPages.forEach(dish => {
    const filePath = path.join(platosDir, `${dish}.html`);
    const backupPath = path.join(backupDir, `${dish}.html`);
    
    try {
        // Create backup of current file if it exists
        if (fs.existsSync(filePath)) {
            const currentContent = fs.readFileSync(filePath, 'utf8');
            fs.writeFileSync(backupPath, currentContent, 'utf8');
            console.log(`✅ Backup creado: ${dish}.html`);
        }
        
        // Create new file with template
        const newContent = dishTemplate(dish);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Página restaurada: ${dish}.html`);
        
    } catch (error) {
        console.error(`❌ Error procesando ${dish}.html:`, error.message);
    }
});

console.log('\n¡Todas las páginas de platos han sido restauradas a su formato original!');
console.log(`Se han creado copias de seguridad en: ${backupDir}`);
