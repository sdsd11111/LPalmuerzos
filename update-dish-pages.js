const fs = require('fs');
const path = require('path');

// Leer el archivo JSON con los datos de los platos
const platos = require('./public/data/platos.json');

// Directorio de los archivos HTML de los platos
const platosDir = path.join(__dirname, 'public', 'menu', 'platos');

// Función para generar el contenido HTML de un plato
function generatePlatoContent(plato) {
    return `
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
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
                            <p class="font-semibold">${plato.tiempo_preparacion}</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow text-center">
                            <i class="fas fa-utensils text-orange-500 text-xl mb-2"></i>
                            <p class="text-sm text-gray-600">Dificultad</p>
                            <p class="font-semibold">${plato.dificultad}</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow text-center">
                            <i class="fas fa-tag text-orange-500 text-xl mb-2"></i>
                            <p class="text-sm text-gray-600">Precio</p>
                            <p class="font-semibold">${plato.precio}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Descripción</h2>
                    <p class="text-gray-700 mb-6">${plato.descripcion_corta}</p>
                    
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Ingredientes</h2>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                        ${plato.ingredientes.map(ingrediente => 
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
        </div>
    </div>
    `;
}

// Actualizar cada archivo de plato
platos.platos.forEach(plato => {
    const filePath = path.join(platosDir, `${plato.id}.html`);
    
    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
        // Leer el contenido actual del archivo
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si el archivo ya tiene el contenido del plato
        if (!content.includes('plato-content')) {
            // Insertar el contenido del plato en el div plato-content
            const platoContent = `
            <!-- Contenido principal -->
            <main class="bg-gray-50 py-8">
                <div id="plato-content">
                    ${generatePlatoContent(plato)}
                </div>
            </main>
            `;
            
            // Insertar después del header y antes del footer
            content = content.replace(
                /<div id="header-component">[\s\S]*?<\/div>\s*<div class="h-16"><\/div>/,
                `$&\n            ${platoContent}`
            );
            
            // Escribir el archivo actualizado
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Actualizado: ${filePath}`);
        } else {
            console.log(`El archivo ${filePath} ya tiene contenido.`);
        }
    } else {
        console.log(`El archivo ${filePath} no existe.`);
    }
});

console.log('\n¡Proceso completado!');
