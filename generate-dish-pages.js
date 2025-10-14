const fs = require('fs');
const path = require('path');

// Leer el archivo JSON con los datos de los platos
const platos = require('./public/data/platos.json');

// Directorio de salida para los archivos HTML
const outputDir = path.join(__dirname, 'public', 'menu', 'platos');

// Asegurarse de que el directorio de salida exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Función para generar el contenido HTML de un plato
function generateDishPage(plato) {
  const imagePath = `/images/platos/${plato.id}.jpg`;
  const pageUrl = `https://tusitio.com/menu/platos/${plato.id}.html`;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${plato.nombre} | Los Sartenes - Loja, Ecuador</title>
    <meta name="description" content="${plato.descripcion_corta} Disfruta del mejor ${plato.nombre.toLowerCase()} en Loja, Ecuador. Preparado con ingredientes frescos y recetas tradicionales.">
    <meta name="keywords" content="${plato.nombre.toLowerCase()}, ${plato.categoria.toLowerCase()}, restaurante Loja, comida ecuatoriana, ${plato.ingredientes.slice(0, 3).join(', ')}">
    <meta name="author" content="Los Sartenes">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${plato.nombre} | Los Sartenes - Loja">
    <meta property="og:description" content="${plato.descripcion_corta} Disfruta en nuestro restaurante en Loja, Ecuador.">
    <meta property="og:image" content="https://tusitio.com${imagePath}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${pageUrl}">
    <meta property="twitter:title" content="${plato.nombre} | Los Sartenes - Loja">
    <meta property="twitter:description" content="${plato.descripcion_corta} Disfruta en nuestro restaurante en Loja, Ecuador.">
    <meta property="twitter:image" content="https://tusitio.com${imagePath}">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        body { font-family: 'Open Sans', sans-serif; padding-top: 0; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        main { min-height: calc(100vh - 16rem); padding: 2rem 0; }
        .ingredient-item:before {
            content: '•';
            color: #f59e0b;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
        }
    </style>
</head>
<body class="bg-white flex flex-col min-h-screen">
    <!-- Header -->
    <div id="header-component" class="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
        <!-- El contenido del header se cargará aquí mediante JavaScript -->
    </div>
    
    <!-- Espaciador para el header fijo -->
    <div class="h-16"></div>

    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- Imagen del plato -->
            <div class="h-64 md:h-96 overflow-hidden">
                <img src="${imagePath}" alt="${plato.nombre} - Los Sartenes Loja" class="w-full h-full object-cover">
            </div>
            
            <!-- Información del plato -->
            <div class="p-6 md:p-8">
                <!-- Título y categoría -->
                <div class="mb-6">
                    <span class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-2">${plato.categoria}</span>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-playfair">${plato.nombre}</h1>
                    <div class="w-16 h-1 bg-orange-500 mb-4"></div>
                    <p class="text-gray-700 text-lg">${plato.descripcion_corta}</p>
                </div>
                
                <!-- Detalles del plato -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-center">
                            <i class="fas fa-clock text-orange-500 text-2xl mb-2"></i>
                            <h3 class="font-semibold text-gray-800">Tiempo de preparación</h3>
                            <p class="text-gray-600">${plato.tiempo_preparacion}</p>
                        </div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-center">
                            <i class="fas fa-utensils text-orange-500 text-2xl mb-2"></i>
                            <h3 class="font-semibold text-gray-800">Dificultad</h3>
                            <p class="text-gray-600">${plato.dificultad}</p>
                        </div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-center">
                            <i class="fas fa-tag text-orange-500 text-2xl mb-2"></i>
                            <h3 class="font-semibold text-gray-800">Precio</h3>
                            <p class="text-gray-600 font-bold">${plato.precio}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Ingredientes y preparación -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 font-playfair">Ingredientes</h2>
                        <ul class="space-y-2">
                            ${plato.ingredientes.map(ingrediente => 
                                `<li class="ingredient-item text-gray-700">${ingrediente}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 font-playfair">Preparación</h2>
                        <p class="text-gray-700 mb-4">${plato.descripcion_corta} Nuestros chefs preparan este plato con los ingredientes más frescos y técnicas culinarias tradicionales para ofrecerte una experiencia gastronómica única.</p>
                        <p class="text-gray-700">Visítanos en nuestro restaurante en Loja para disfrutar de este y otros deliciosos platos de nuestra carta.</p>
                    </div>
                </div>
                
                <!-- Llamada a la acción -->
                <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
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
            </div>
        </div>
    </main>

    <!-- Footer -->
    <div id="footer-component"></div>
    
    <!-- Scripts -->
    <script src="/js/components.js"></script>
    <script src="/js/scripts.js"></script>
    
    <!-- Schema.org markup for Google -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        "name": "${plato.nombre}",
        "image": ["https://tusitio.com${imagePath}"],
        "description": "${plato.descripcion_corta}",
        "keywords": "${plato.nombre.toLowerCase()}, ${plato.categoria.toLowerCase()}, comida ecuatoriana, restaurante Loja",
        "author": {
            "@type": "Restaurant",
            "name": "Los Sartenes",
            "servesCuisine": "Ecuatoriana",
            "priceRange": "$$",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "[Dirección del restaurante]",
                "addressLocality": "Loja",
                "addressRegion": "Loja",
                "postalCode": "[Código postal]",
                "addressCountry": "EC"
            },
            "telephone": "[Teléfono del restaurante]"
        },
        "prepTime": "PT${plato.tiempo_preparacion.split(' ')[0]}M",
        "recipeCategory": "${plato.categoria}",
        "recipeCuisine": "Ecuatoriana",
        "recipeIngredient": ${JSON.stringify(plato.ingredientes)},
        "recipeInstructions": "${plato.descripcion_corta} Preparado por nuestros chefs expertos con ingredientes frescos y técnicas tradicionales.",
        "recipeYield": "1 porción",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "120"
        },
        "nutrition": {
            "@type": "NutritionInformation",
            "calories": "[Calorías aproximadas] cal"
        }
    }
    </script>
</body>
</html>`;
}

// Generar una página para cada plato
platos.platos.forEach(plato => {
    const htmlContent = generateDishPage(plato);
    const outputPath = path.join(outputDir, `${plato.id}.html`);
    
    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    console.log(`Página generada: ${outputPath}`);
});

console.log('\n¡Proceso completado! Se han generado todas las páginas de platos.');
