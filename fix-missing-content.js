const fs = require('fs');
const path = require('path');

// Lista de archivos de platos que necesitan contenido
const platos = [
    "camarones_al_ajillo",
    "chuleta_de_cerdo_en_salsa_de_pina",
    "tilapia_a_los_sartenes",
    "crema_de_camaron",
    "locro_de_papa_clasico",
    "crema_de_verduras",
    "sopa_de_pollo",
    "sarten_de_lomo_a_la_pimienta",
    "bistec_a_los_sartenes",
    "chuleta_en_salsa_de_champinones",
    "sarten_de_costillas_bbq",
    "cecina_a_los_sartenes",
    "sarten_de_pollo_en_salsa_de_portobellos",
    "sarten_de_alitas",
    "sarten_frutos_del_mar",
    "camaron_a_los_sartenes",
    "sarten_de_langostinos_al_grill",
    "espagueti_con_mariscos",
    "fettuccini_a_los_sartenes",
    "espagueti_di_pollo_con_champinones"
];

// Directorio de los archivos HTML
const platosDir = path.join(__dirname, 'public', 'menu', 'platos');

// Plantilla HTML para el contenido del plato
const platoTemplate = (platoId) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${platoId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Los Sartenes</title>
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
                <div id="plato-content">
                    <!-- El contenido del plato se cargará aquí mediante JavaScript -->
                </div>
            </div>
        </main>
        <!-- Footer -->
        <div id="footer-component"></div>
        
        <!-- Scripts -->
        <script src="/js/components.js"></script>
        <script>
            // Mapeo de nombres de archivo a IDs de platos
            const platoMap = {
                'espagueti_di_pollo_con_champinones': 'espagueti_pollo_champinones',
                'sarten_frutos_del_mar': 'frutos_mar',
                'fettuccini_a_los_sartenes': 'fettuccini_los_sartenes',
                'espagueti_con_mariscos': 'espagueti_mariscos',
                'sarten_de_langostinos_al_grill': 'langostinos_grill',
                'sarten_de_alitas': 'alitas_bbq',
                'sarten_de_pollo_en_salsa_de_portobellos': 'pollo_portobellos',
                'cecina_a_los_sartenes': 'cecina_los_sartenes',
                'sarten_de_costillas_bbq': 'costillas_bbq',
                'chuleta_en_salsa_de_champinones': 'chuleta_champinones',
                'bistec_a_los_sartenes': 'bistec_los_sartenes',
                'sarten_de_lomo_a_la_pimienta': 'lomo_pimienta',
                'sopa_de_pollo': 'sopa_pollo',
                'crema_de_verduras': 'crema_verduras',
                'locro_de_papa_clasico': 'locro_papa',
                'crema_de_camaron': 'crema_camaron',
                'tilapia_a_los_sartenes': 'tilapia_los_sartenes',
                'chuleta_de_cerdo_en_salsa_de_pina': 'chuleta_pina',
                'camarones_al_ajillo': 'camarones_ajillo',
                'sarten_de_pollo_a_los_sartenes': 'pollo_los_sartenes',
                'sarten_de_picadillo': 'picadillo',
                'pollo_a_la_andaluza': 'pollo_andaluz',
                'camarones_fredd': 'camarones_fredd',
                'filet_mignon': 'filet_mignon',
                'ensalada_los_sartenes': 'ensalada_los_sartenes',
                'ensalada_cesar': 'ensalada_cesar',
                'ensalada_campera': 'ensalada_campera',
                'gordon_blue': 'gordon_blue'
            };

            // Obtener el ID del plato del nombre del archivo
            const platoId = '${platoId}';
            const platoKey = platoMap[platoId] || platoId;

            // Cargar los datos del plato
            fetch('/data/platos.json')
                .then(response => response.json())
                .then(data => {
                    const plato = data.platos.find(p => p.id === platoKey);
                    if (plato) {
                        // Actualizar el título de la página
                        document.title = `${plato.nombre} | Los Sartenes`;
                        
                        // Actualizar el contenido del plato
                        const platoContent = document.getElementById('plato-content');
                        if (platoContent) {
                            platoContent.innerHTML = `
                                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-playfair">${plato.nombre}</h1>
                                <div class="w-24 h-1 bg-orange-500 mb-6"></div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <div class="bg-gray-100 rounded-lg overflow-hidden mb-4">
                                            <img src="/images/platos/${plato.id}.jpg" alt="${plato.nombre}" class="w-full h-64 object-cover">
                                        </div>
                                        <div class="grid grid-cols-3 gap-4 mb-6">
                                            <div class="bg-white p-4 rounded-lg shadow text-center">
                                                <i class="fas fa-clock text-orange-500 text-xl mb-2"></i>
                                                <p class="text-sm text-gray-600">Tiempo</p>
                                                <p class="font-semibold">${plato.tiempo_preparacion || 'No especificado'}</p>
                                            </div>
                                            <div class="bg-white p-4 rounded-lg shadow text-center">
                                                <i class="fas fa-utensils text-orange-500 text-xl mb-2"></i>
                                                <p class="text-sm text-gray-600">Dificultad</p>
                                                <p class="font-semibold">${plato.dificultad || 'Media'}</p>
                                            </div>
                                            <div class="bg-white p-4 rounded-lg shadow text-center">
                                                <i class="fas fa-tag text-orange-500 text-xl mb-2"></i>
                                                <p class="text-sm text-gray-600">Precio</p>
                                                <p class="font-semibold">${plato.precio || 'Consultar'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Descripción</h2>
                                        <p class="text-gray-700 mb-6">${plato.descripcion_corta || 'Descripción detallada del plato.'}</p>
                                        
                                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Ingredientes</h2>
                                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                                            ${(plato.ingredientes || ['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3']).map(ingrediente => 
                                                `<li class="flex items-center">
                                                    <span class="text-orange-500 mr-2">•</span>
                                                    <span>${ingrediente}</span>
                                                </li>`
                                            ).join('')}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-8">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <i class="fas fa-utensils text-orange-500 text-2xl"></i>
                                        </div>
                                        <div class="ml-3">
                                            <h3 class="text-lg font-medium text-orange-800">¿Te gustaría probar este plato?</h3>
                                            <div class="mt-2">
                                                <p class="text-orange-700">Visítanos en nuestro restaurante en Loja y disfruta de una experiencia gastronómica inolvidable.</p>
                                            </div>
                                            <div class="mt-4">
                                                <a href="/contacto.html" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                                    Reservar ahora
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los datos del plato:', error);
                });
        </script>
    </body>
    </html>
`;

// Crear o actualizar los archivos de los platos
platos.forEach(platoId => {
    const filePath = path.join(platosDir, `${platoId}.html`);
    
    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
        // Leer el contenido actual del archivo
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si el archivo ya tiene el contenido del plato
        if (!content.includes('plato-content')) {
            // Si no tiene el contenido, reescribir el archivo completo
            fs.writeFileSync(filePath, platoTemplate(platoId), 'utf8');
            console.log(`Actualizado: ${filePath}`);
        } else {
            console.log(`El archivo ${filePath} ya tiene contenido.`);
        }
    } else {
        // Si el archivo no existe, crearlo
        fs.writeFileSync(filePath, platoTemplate(platoId), 'utf8');
        console.log(`Creado: ${filePath}`);
    }
});

console.log('\n¡Proceso completado!');
