const fs = require('fs');
const path = require('path');

// Datos actualizados de los platos basados en la información proporcionada
const platosActualizados = [
    {
        id: "espagueti_pollo_champinones",
        nombre: "Espagueti di Pollo con Champiñones",
        descripcion_corta: "Espagueti cocido al dente bañado en una deliciosa salsa bechamel flameada al vino blanco con trozos de pollo y champiñones frescos.",
        preparacion_detallada: "Espagueti cocido al dente bañado en una deliciosa salsa de pollo con champiñones. La salsa es una bechamel flameada al vino blanco.",
        categoria: "Pastas",
        ingredientes: ["Espagueti", "Pechuga de pollo", "Champiñones", "Salsa bechamel", "Vino blanco", "Queso parmesano"],
        tiempo_preparacion: "30 minutos",
        dificultad: "Media",
        precio: "$8.50",
        acompanamientos: ["Pan de ajo"]
    },
    {
        id: "risotto_marinero",
        nombre: "Risotto Marinero",
        descripcion_corta: "Exquisito risotto italiano con una selección de mariscos frescos, aromatizado con vino blanco y terminado con queso parmesano.",
        preparacion_detallada: "Se utiliza un arroz italiano y una variedad de mariscos. Después de la cocción, se agrega queso parmesano. Aromatizado con vino blanco.",
        categoria: "Pastas",
        ingredientes: ["Arroz arborio", "Mezcla de mariscos", "Vino blanco", "Caldo de pescado", "Queso parmesano", "Mantequilla", "Cebolla", "Ajo"],
        tiempo_preparacion: "35 minutos",
        dificultad: "Alta",
        precio: "$10.50"
    },
    {
        id: "fettuccini_los_sartenes",
        nombre: "Fettuccini a Los Sartenes",
        descripcion_corta: "Pasta tipo cinta cocida al dente con trozos de lomo de res sellados, glaseados con vino blanco y bañados en salsa italiana con queso parmesano.",
        preparacion_detallada: "Pasta tipo cinta cocida al dente. Se sellan trozos de lomo de res y se glasean con vino blanco. Se agrega pimienta y se sirve con una salsa italiana y queso parmesano.",
        categoria: "Pastas",
        ingredientes: ["Fettuccini", "Lomo de res", "Vino blanco", "Salsa italiana", "Queso parmesano", "Pimienta negra"],
        tiempo_preparacion: "25 minutos",
        dificultad: "Media",
        precio: "$9.50"
    },
    // ... (más platos con la misma estructura)
    {
        id: "salmon",
        nombre: "Salmón",
        descripcion_corta: "Salmón glaseado al whisky en una salsa de frambuesas frescas, acompañado de deditos de plátano y vegetales grillados.",
        preparacion_detallada: "Salmón glaseado al whisky en una salsa de frambuesas frescas. Acompañado de deditos de plátano y vegetales grillados.",
        categoria: "Pescados",
        ingredientes: ["Filete de salmón", "Whisky", "Frambuesas", "Plátano", "Vegetales mixtos", "Mantequilla", "Sal", "Pimienta"],
        tiempo_preparacion: "25 minutos",
        dificultad: "Media",
        precio: "$12.50",
        acompanamientos: ["Deditos de plátano", "Vegetales grillados"]
    }
];

// Ruta al archivo platos.json
const platosJsonPath = path.join(__dirname, 'public', 'data', 'platos.json');

// Leer el archivo JSON existente
let platosData = { platos: [] };

try {
    const data = fs.readFileSync(platosJsonPath, 'utf8');
    platosData = JSON.parse(data);
} catch (error) {
    console.error('Error al leer el archivo platos.json:', error);
}

// Actualizar los platos existentes y agregar los nuevos
platosActualizados.forEach(platoActualizado => {
    const index = platosData.platos.findIndex(p => p.id === platoActualizado.id);
    
    if (index !== -1) {
        // Actualizar plato existente
        platosData.platos[index] = { ...platosData.platos[index], ...platoActualizado };
    } else {
        // Agregar nuevo plato
        platosData.platos.push(platoActualizado);
    }
});

// Ordenar los platos por categoría
platosData.platos.sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre));

// Guardar los cambios en el archivo
fs.writeFileSync(
    platosJsonPath, 
    JSON.stringify(platosData, null, 2), 
    'utf8'
);

console.log('Archivo platos.json actualizado exitosamente!');
