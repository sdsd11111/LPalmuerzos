const fs = require('fs');
const path = require('path');

// Function to create a URL-friendly slug
getSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .trim();
};

// Function to generate HTML for a dish page
const generateDishPage = (dish) => {
    const slug = getSlug(dish.name);
    const imagePath = `/images/platos/${slug}.jpg`;
    const fileName = `${slug}.html`;
    
    // Split the description to extract the main description and the secret
    const [mainDescription, secretNote] = dish.description.split('(').map(s => s.trim());
    const secret = secretNote ? secretNote.replace(/\)$/, '').trim() : '';
    
    // Generate the HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dish.name} | Los Sartenes - El Mejor en Loja</title>
    <meta name="description" content="Descubre la receta y preparación de nuestro ${dish.name} en Los Sartenes. El mejor lugar para comer ${dish.name} en Loja, Ecuador.">
    <meta name="keywords" content="${dish.name}, ${dish.name} Loja, restaurante Loja, dónde comer ${dish.name} en Loja, Los Sartenes menú">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body class="bg-white">
    <!-- Componente Header -->
    <div id="header-component"></div>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center bg-cover bg-center" style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${imagePath}');">
        <div class="text-center text-white px-4">
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold mb-6">${dish.name}</h1>
            <p class="text-xl md:text-2xl font-light max-w-3xl mx-auto">${mainDescription}</p>
        </div>
    </section>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-16">
        <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">La Receta Detallada de Nuestro ${dish.name} en Loja</h2>
        
        <!-- Cards Destacadas -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
            <!-- Card 1: Ingredientes Clave -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-green-600 hover:shadow-xl transition-shadow duration-300">
                <div class="p-6">
                    <div class="text-green-600 mb-4">
                        <i class="fas fa-utensils text-4xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">Ingredientes Clave</h3>
                    <p class="text-gray-700">${dish.ingredients || 'Ingredientes seleccionados cuidadosamente para ofrecer el mejor sabor.'}</p>
                </div>
            </div>
            
            <!-- Card 2: El Secreto -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-orange-400 hover:shadow-xl transition-shadow duration-300">
                <div class="p-6">
                    <div class="text-orange-400 mb-4">
                        <i class="fas fa-magic text-4xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">El Secreto</h3>
                    <p class="text-gray-700">${secret || 'Nuestra receta especial que hace que este plato sea único en Loja.'}</p>
                </div>
            </div>
            
            <!-- Card 3: Acompañamiento -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-amber-600 hover:shadow-xl transition-shadow duration-300">
                <div class="p-6">
                    <div class="text-amber-600 mb-4">
                        <i class="fas fa-utensil-spoon text-4xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">Acompañamiento</h3>
                    <p class="text-gray-700">${dish.sides || 'Acompañado de guarniciones que complementan perfectamente el sabor principal.'}</p>
                </div>
            </div>
        </div>
        
        <!-- Imagen Grande del Plato -->
        <figure class="mb-12">
            <img src="${imagePath}" alt="${dish.name} de Los Sartenes" class="w-full h-auto rounded-lg shadow-lg">
            <figcaption class="text-center text-gray-600 mt-2">${dish.name} - Una especialidad de Los Sartenes</figcaption>
        </figure>
        
        <!-- Descripción Detallada -->
        <div class="prose max-w-4xl mx-auto">
            <h3 class="text-2xl font-playfair font-bold mb-4">Preparación del ${dish.name}</h3>
            <p class="text-gray-700 mb-6">${dish.detailedDescription || mainDescription}</p>
            
            ${dish.preparation ? `
            <h4 class="text-xl font-semibold mt-8 mb-4">Modo de Preparación</h4>
            <p class="text-gray-700">${dish.preparation}</p>
            ` : ''}
            
            <div class="mt-8 pt-6 border-t border-gray-200">
                <p class="text-gray-600">Visítanos en <strong>Los Sartenes</strong> para disfrutar de este y otros deliciosos platos en el corazón de Loja.</p>
                <a href="/contacto.html" class="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300">Reserva Ahora</a>
            </div>
        </div>
    </main>

    <!-- Componente Footer -->
    <div id="footer-component"></div>
    
    <!-- Scripts -->
    <script src="/js/components.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>`;

    return { fileName, content: htmlContent };
};

// Dishes data
const dishes = [
    {
        name: 'Espagueti di Pollo con Champiñones',
        description: 'Espagueti cocido al dente bañado en una deliciosa salsa de pollo con champiñones.',
        secret: 'La salsa es una bechamel flameada al vino blanco',
        ingredients: 'Pollo, champiñones, espagueti, crema, especias',
        sides: 'Pan de ajo y ensalada fresca',
        detailedDescription: 'Nuestro Espagueti di Pollo con Champiñones es una deliciosa combinación de pechuga de pollo tierna, champiñones frescos y espagueti al dente, todo bañado en nuestra exquisita salsa bechamel casera flameada con vino blanco. Un plato cremoso y reconfortante que te transportará a la cocina italiana con cada bocado.'
    },
    {
        name: 'Risotto Marinero',
        description: 'Se utiliza un arroz italiano y una variedad de mariscos. Después de la cocción, se agrega queso parmesano.',
        secret: 'Aromatizado con vino blanco y caldo de mariscos',
        ingredients: 'Arroz arborio, mariscos mixtos, caldo de pescado, vino blanco',
        sides: 'Pan rústico tostado',
        detailedDescription: 'Nuestro Risotto Marinero es una explosión de sabores del mar en cada cucharada. Preparado con arroz arborio de la más alta calidad, cocinado lentamente en caldo de mariscos casero y vino blanco, acompañado de una selección de los mariscos más frescos. Finalizado con un toque de queso parmesano y perejil fresco.'
    },
    {
        name: 'Fettuccini a Los Sartenes',
        description: 'Pasta tipo cinta cocida al dente. Se sellan trozos de lomo de res y se glasean con vino blanco. Se agrega pimienta y se sirve con una salsa italiana y queso parmesano.',
        secret: 'El toque final de pimienta recién molida y queso parmesano envejecido',
        ingredients: 'Fettuccini, lomo de res, vino blanco, pimienta negra, queso parmesano',
        sides: 'Pan de ajo y ensalada César',
        detailedDescription: 'Nuestro Fettuccini a Los Sartenes es un homenaje a la cocina italiana con nuestro toque especial. La pasta al dente se combina con tiernos trozos de lomo de res sellados a la perfección y glaseados con un reducción de vino blanco. El plato se completa con nuestra salsa italiana secreta y un generoso espolvoreado de queso parmesano envejecido.'
    },
    // Add more dishes here following the same structure
    {
        name: 'Espagueti Carbonara',
        description: 'Espagueti cocido al dente, emulsionado en una salsa a base de yema de huevo, tocino y queso parmesano, acompañado de pan de ajo y mariscos.',
        secret: 'La combinación perfecta de yemas de huevo y queso pecorino',
        ingredients: 'Espagueti, huevos, panceta, queso pecorino, pimienta negra',
        sides: 'Pan de ajo y ensalada verde',
        detailedDescription: 'Nuestra versión del clásico italiano Espagueti Carbonara es una delicia cremosa preparada con huevos de corral, queso pecorino romano y panceta crujiente. La salsa se crea emulsionando las yemas con el agua de cocción de la pasta, logrando una textura sedosa que envuelve perfectamente cada hebra de espagueti al dente.'
    },
    {
        name: 'Espagueti con Mariscos',
        description: 'Espagueti cocido al dente con una variedad de mariscos en una salsa peruana.',
        secret: 'Salsa Pomodora casera con un toque de ají amarillo',
        ingredients: 'Espagueti, mariscos mixtos, tomates, ajo, vino blanco',
        sides: 'Pan de ajo y limón',
        detailedDescription: 'Nuestro Espagueti con Mariscos es un viaje a las costas peruanas, donde combinamos los frutos del mar más frescos con nuestra salsa Pomodora casera, enriquecida con un toque de ají amarillo. Los mariscos se cocinan al momento para garantizar su frescura y sabor, creando un plato que evoca el auténtico sabor del mar.'
    },
    {
        name: 'Ceviche Peruano',
        description: 'Porción de pescado tierno y camarones marinados en una buena leche de tigre. Está acompañado con tostado, choclo y ensalada fresca.',
        secret: 'El equilibrio perfecto entre el limón, el ají y el cilantro',
        ingredients: 'Pescado blanco, camarones, limón, cebolla morada, ají limo',
        sides: 'Camote, choclo y cancha serrana',
        detailedDescription: 'Nuestro Ceviche Peruano es una explosión de sabores frescos y cítricos. Utilizamos pescado blanco fresco y camarones de primera calidad, marinados en nuestra leche de tigre secreta, preparada con limones verdes recién exprimidos, ají limo y cilantro. Acompañado de camote dulce, choclo tierno y crujiente cancha serrana, es una experiencia gastronómica que te transportará directamente a las costas peruanas.'
    },
    {
        name: 'Sartén de Langostinos al Grill',
        description: 'Langostinos frescos marinados y sellados en vinagreta hindú al grill, acompañado de papas y vegetales.',
        secret: 'Marinado especial con especias hindúes y hierbas frescas',
        ingredients: 'Langostinos, especias, limón, ajo, hierbas',
        sides: 'Papas doradas y vegetales salteados',
        detailedDescription: 'Nuestra Sartén de Langostinos al Grill es una delicia para los amantes de los mariscos. Los langostinos, seleccionados por su tamaño y frescura, son marinados en una exclusiva mezcla de especias hindúes y hierbas frescas antes de ser sellados a la perfección en la parrilla. Servidos sobre una cama de papas doradas y acompañados de vegetales salteados al dente, este plato es una verdadera experiencia de sabores exóticos.'
    },
    {
        name: 'Sartén Frutos del Mar',
        description: 'Variedad de mariscos y verduras, sellados a fuego vivo. Se glasean con vino blanco, fondo de camarón, y se usa aceite de albahaca.',
        secret: 'Cocción perfecta de cada marisco para mantener su textura ideal',
        ingredients: 'Mejillones, calamares, camarones, pescado, vino blanco',
        sides: 'Arroz blanco y limón',
        detailedDescription: 'Nuestra Sartén Frutos del Mar es un festín marino que combina los mejores frutos del mar en un solo plato. Cada ingrediente se cocina por separado para garantizar su punto de cocción perfecto, luego se integran en una sartén con un glaseado de vino blanco y fondo de camarón casero. El toque final de aceite de albahaca fresca realza todos los sabores, creando una armonía perfecta entre los diferentes mariscos y las verduras frescas.'
    },
    {
        name: 'Camarón a Los Sartenes',
        description: '200 gramos de camarón sellados con un poco de ajo, glaseados con vino blanco y fondo de camarón. Se realiza una reducción. Acompañado de papa dorada.',
        secret: 'Reducción de vino blanco y fondos de cocción',
        ingredients: 'Camarones grandes, ajo, vino blanco, mantequilla',
        sides: 'Papa dorada y ensalada',
        detailedDescription: 'Nuestro Camarón a Los Sartenes es una deliciosa preparación donde los camarones más frescos son sellados con ajo y luego glaseados en una reducción de vino blanco y fondos de cocción caseros. El resultado es un plato con camarones jugosos y sabrosos, bañados en una salsa sedosa que realza su sabor natural. Se sirve sobre una cama de papas doradas crujientes, creando un contraste perfecto de texturas.'
    },
    {
        name: 'Sartén de Alitas',
        description: '8 deliciosas alitas al horno, bañadas en una deliciosa salsa BBQ de la casa, acompañado de papa dorada y vegetales.',
        secret: 'Salsa BBQ casera con un toque de miel y especias ahumadas',
        ingredients: 'Alitas de pollo, salsa BBQ, miel, especias',
        sides: 'Papa dorada y vegetales al vapor',
        detailedDescription: 'Nuestra Sartén de Alitas es el plato perfecto para los amantes de los sabores intensos. Ocho jugosas alitas de pollo son horneadas hasta alcanzar una textura crujiente por fuera y jugosa por dentro, para luego ser bañadas en nuestra exclusiva salsa BBQ casera, preparada con miel y una mezcla secreta de especias ahumadas. Acompañadas de papas doradas crujientes y una selección de vegetales frescos al vapor, es un plato que combina perfectamente sabores dulces, picantes y ahumados.'
    },
    {
        name: 'Gordon Blue',
        description: 'Pechuga de pollo rellena de queso y jamón, bañada en una deliciosa salsa de morrones, acompañado de papa dorada y vegetales.',
        secret: 'Cocción perfecta para mantener el queso fundido en su interior',
        ingredients: 'Pechuga de pollo, jamón, queso emmental, pan rallado',
        sides: 'Papa dorada y vegetales salteados',
        detailedDescription: 'Nuestro Gordon Blue es una obra maestra de la cocina clásica, donde una suculenta pechuga de pollo rellena de jamón y queso emmental se envuelve en un crujiente empanado y se hornea a la perfección. Se sirve bañada en nuestra exquisita salsa de morrones, que aporta un toque dulce y ahumado que complementa perfectamente los sabores del relleno. Acompañado de papas doradas crujientes y una selección de vegetales frescos al vapor, es un plato que deleitará a los paladares más exigentes.'
    },
    {
        name: 'Sartén de Pollo en Salsa de Portobellos',
        description: 'Deliciosa pechuga de pollo (suprema) sellada en una deliciosa salsa de portobellos frescos, acompañado de papa dorada y vegetales.',
        secret: 'Salsa cremosa de hongos portobellos con toque de vino blanco',
        ingredients: 'Pechuga de pollo, champiñones portobello, crema, vino blanco',
        sides: 'Papa dorada y vegetales al vapor',
        detailedDescription: 'Nuestra Sartén de Pollo en Salsa de Portobellos es un plato reconfortante donde las suaves pechugas de pollo se sellan a la perfección y se bañan en una rica salsa cremosa de hongos portobello. Los champiñones se cocinan lentamente con ajo, cebolla y un toque de vino blanco, creando una salsa sedosa que realza el sabor del pollo. Servido con papas doradas crujientes y una selección de vegetales frescos al vapor, es un plato que combina sabores terrosos y cremosos en cada bocado.'
    },
    {
        name: 'Pollo Los Sartenes',
        description: 'Deliciosa pechuga sellada a la plancha, en una deliciosa salsa de ajo salteados, acompañado con papa dorada y vegetales.',
        secret: 'Salsa de ajo con perejil fresco y mantequilla',
        ingredients: 'Pechuga de pollo, ajo, mantequilla, perejil',
        sides: 'Papa dorada y vegetales al vapor',
        detailedDescription: 'Nuestro Pollo Los Sartenes es un clásico que nunca pasa de moda. Las pechugas de pollo se sellan a la perfección en la plancha, manteniendo su jugosidad, y se bañan en nuestra exquisita salsa de ajo, preparada con mantequilla derretida, ajo fresco picado y un toque de perejil. El resultado es un plato lleno de sabor, donde la suavidad del pollo se combina con el aroma y sabor intenso del ajo. Acompañado de papas doradas crujientes y una selección de vegetales frescos al vapor, es una opción deliciosa y reconfortante.'
    },
    {
        name: 'Cecina a Los Sartenes',
        description: 'Delicioso lomo de res al grill. Esta preparación es acompañada con mote pillo, papa dorada y vegetales.',
        secret: 'Corte especial de lomo y punto de cocción perfecto',
        ingredients: 'Lomo de res, especias, hierbas',
        sides: 'Mote pillo, papa dorada y vegetales',
        detailedDescription: 'Nuestra Cecina a Los Sartenes es un homenaje a los cortes de carne de primera calidad. Seleccionamos cuidadosamente el lomo de res, que se marina con una mezcla secreta de especias y hierbas antes de ser cocinado al grill a la temperatura perfecta. El resultado es una carne jugosa por dentro y ligeramente ahumada por fuera, que se deshace en la boca. Se sirve acompañada de nuestro tradicional mote pillo, papas doradas crujientes y una selección de vegetales frescos, creando una combinación de sabores y texturas que deleitará a los amantes de la buena carne.'
    },
    {
        name: 'Sartén de Costillas BBQ',
        description: 'Deliciosas costillas al horno en una deliciosa salsa BBQ de la casa, acompañado con vegetales y papas.',
        secret: 'Cocción lenta y salsa BBQ casera con toque ahumado',
        ingredients: 'Costillas de cerdo, salsa BBQ, especias',
        sides: 'Papas fritas y ensalada de col',
        detailedDescription: 'Nuestra Sartén de Costillas BBQ es el plato perfecto para los amantes de la carne. Las costillas de cerdo se cocinan a fuego lento hasta que la carne esté tan tierna que se desprenda del hueso, para luego ser bañadas en nuestra exclusiva salsa BBQ casera, con un equilibrio perfecto entre lo dulce y lo ahumado. El plato se completa con una porción generosa de papas fritas doradas y crujientes, junto con una refrescante ensalada de col que equilibra los sabores. Un festín que te hará chuparte los dedos.'
    },
    {
        name: 'Chuleta en Salsa de Champiñones',
        description: 'Corte ahumado de chuleta al grill, en una deliciosa salsa de champiñones. Para la salsa se hace un buen refrito de ajo y cebolla, fondo de pollo, y se agrega champiñones para hacer una reducción. Acompañado de papa dorada y una ensalada.',
        secret: 'Reducción con vino blanco y hierbas frescas',
        ingredients: 'Chuleta de cerdo, champiñones, vino blanco, crema',
        sides: 'Papa dorada y ensalada fresca',
        detailedDescription: 'Nuestra Chuleta en Salsa de Champiñones es un plato que combina la jugosidad de una chuleta de cerdo perfectamente cocinada al grill con la riqueza de una salsa cremosa de champiñones. La salsa se prepara con champiñones frescos salteados en mantequilla con ajo y cebolla, a los que se les agrega vino blanco y un toque de crema, creando una textura sedosa que realza el sabor de la carne. Acompañada de papas doradas crujientes y una ensalada fresca, es un plato reconfortante que satisface hasta al paladar más exigente.'
    },
    {
        name: 'Bistec a Los Sartenes',
        description: '200 gramos de lomo de res. Se sella la pieza de carne. Se incorporan verduras (pimiento, tomate y cebolla). Se glasea con vino blanco, se agrega un toque de achiote y pasta de tomate. Se acompaña con huevo poché, papa dorada y una buena ensalada.',
        secret: 'Sellado perfecto y reducción con vino blanco',
        ingredients: 'Lomo de res, pimientos, cebolla, tomate, huevo',
        sides: 'Papa dorada y ensalada fresca',
        detailedDescription: 'Nuestro Bistec a Los Sartenes es una deliciosa opción que combina la jugosidad de un corte premium de lomo de res con la frescura de las verduras salteadas. La carne se sella a la perfección para mantener sus jugos y luego se cocina junto con pimientos, cebolla y tomate, que se glasean con vino blanco y se mezclan con un toque de achiote y pasta de tomate para crear una salsa sabrosa. El plato se completa con un huevo poché, cuyas yemas se integran maravillosamente con la carne y las verduras, y se sirve con papas doradas crujientes y una ensalada fresca para equilibrar los sabores.'
    },
    {
        name: 'Sartén de Lomo a La Pimienta',
        description: '200 gramos de lomo de res. La pieza de carne es sellada, glaseada con whisky y vino tinto para una reducción. Se acompaña con papa dorada.',
        secret: 'Reducción con whisky y vino tinto',
        ingredients: 'Lomo de res, pimienta, whisky, vino tinto',
        sides: 'Papa dorada y vegetales al vapor',
        detailedDescription: 'Nuestra Sartén de Lomo a La Pimienta es una experiencia gourmet que deleitará a los amantes de la carne. Un generoso corte de lomo de res de 200 gramos se sella a la perfección para mantener su jugosidad y luego se glasea con una mezcla de whisky de alta calidad y vino tinto, que se reduce hasta obtener una salsa espesa y llena de sabor. El toque de pimienta negra recién molida agrega un contraste picante que realza los sabores de la carne. Acompañado de papas doradas crujientes y una selección de vegetales al vapor, es un plato sofisticado que combina a la perfección con una copa de vino tinto.'
    },
    {
        name: 'Filet Mignon',
        description: '200 gramos de lomo de res, envuelta con tocino, sellada a fuego vivo, glaseada con vino tinto para una reducción. Se incorporan champiñones. Se acompaña con papa dorada y vegetales.',
        secret: 'Corte premium y reducción de vino tinto',
        ingredients: 'Filete de res, tocino, champiñones, vino tinto',
        sides: 'Papa dorada y vegetales al vapor',
        detailedDescription: 'Nuestro Filet Mignon es la máxima expresión de elegancia y sabor. Un tierno corte de lomo de res de 200 gramos, cuidadosamente envuelto en finas láminas de tocino para añadir sabor y jugosidad, se sella a la perfección para crear una costra dorada mientras mantiene su interior jugoso. Se glasea con una reducción de vino tinto que realza los sabores de la carne, y se acompaña de champiñones salteados en mantequilla y hierbas. Servido con papas doradas crujientes y una selección de vegetales frescos al vapor, es una experiencia culinaria que deleitará incluso a los paladares más exigentes.'
    },
    {
        name: 'Sopa de Pollo',
        description: 'Elaborada a base de pechuga de pollo, zanahoria, arvejas y cabello de ángel. Acompañada con un delicioso canguil.',
        secret: 'Caldo de pollo casero de larga cocción',
        ingredients: 'Pechuga de pollo, zanahoria, arvejas, fideos cabello de ángel',
        sides: 'Canguil tostado',
        detailedDescription: 'Nuestra Sopa de Pollo es el abrazo reconfortante que necesitas en cualquier momento. Preparada con un caldo de pollo casero de larga cocción que extrae todo el sabor de los huesos y las verduras, esta sopa combina tiernos trozos de pechuga de pollo, zanahorias dulces, arvejas tiernas y finos fideos cabello de ángel. El toque especial lo da el canguil tostado que se sirve como acompañamiento, añadiendo un contraste crujiente a la textura suave de la sopa. Un plato reconfortante que recuerda a los sabores caseros de siempre.'
    },
    {
        name: 'Crema de Verduras',
        description: 'Se utilizan verduras de temporada. Son selladas a fuego vivo, glaseadas con vino blanco. Se agrega fondo de verduras, toque de crema de leche, sal. Acompañada con crotones de pan.',
        secret: 'Mezcla de verduras de temporada y reducción con vino blanco',
        ingredients: 'Verduras mixtas, cebolla, ajo, crema de leche',
        sides: 'Crotones de pan caseros',
        detailedDescription: 'Nuestra Crema de Verduras es un homenaje a los sabores naturales de la huerta. Seleccionamos cuidadosamente las verduras de temporada más frescas, que se sellan a fuego vivo para potenciar sus sabores y luego se glasean con un toque de vino blanco. La mezcla se cuece lentamente en un fondo de verduras casero y se termina con un toque de crema de leche para darle una textura sedosa y un sabor cremoso. Servida con crotones de pan caseros recién tostados, es una opción ligera pero llena de sabor que resalta la frescura de los ingredientes.'
    },
    {
        name: 'Locro de Papa Clásico',
        description: 'Se utilizan tres variedades de papa (chor, cecilia y chaucha). Se comienza con un buen refrito, se incorpora achiote. Se cocinan muy bien las papas. Acompañada con aguacate, queso fresco y tostado.',
        secret: 'Mezcla de tres variedades de papa y cocción lenta',
        ingredients: 'Papa chor, papa cecilia, papa chaucha, cebolla, ajo, achiote',
        sides: 'Aguacate, queso fresco y tostado',
        detailedDescription: 'Nuestro Locro de Papa Clásico es una receta tradicional que honra los sabores auténticos de la cocina andina. Utilizamos una cuidadosa selección de tres variedades de papa (chor, cecilia y chaucha) que se cocinan lentamente en un refrito de cebolla, ajo y achiote, creando una textura cremosa y un sabor único. Se sirve caliente, acompañado de aguacate en cubos, queso fresco desmenuzado y tostado crujiente, permitiendo que cada comensal personalice su plato según su preferencia. Un plato reconfortante que evoca la tradición y el sabor casero.'
    },
    {
        name: 'Crema de Camarón',
        description: 'Camarones sellados a fuego vivo, glaseados con vino blanco. Se agrega fondo de camarón. Acompañada con cebollas caramelizadas y ensaladas.',
        secret: 'Fondo de camarón casero y reducción con vino blanco',
        ingredients: 'Camarones, cebolla, ajo, vino blanco, crema',
        sides: 'Cebollas caramelizadas y ensalada fresca',
        detailedDescription: 'Nuestra Crema de Camarón es una delicia para los amantes de los mariscos. Los camarones frescos se sellan a fuego vivo para realzar su sabor natural y luego se glasean con un toque de vino blanco. La base de esta crema es un fondo de camarón casero, preparado con las cabezas y cáscaras de los camarones, que le otorga una profundidad de sabor incomparable. Se termina con un toque de crema para darle una textura sedosa y se sirve caliente, acompañada de cebollas caramelizadas que añaden un contraste dulce y una ensalada fresca para equilibrar los sabores. Un plato sofisticado que combina a la perfección con una copa de vino blanco.'
    },
    {
        name: 'Ensalada Los Sartenes',
        description: 'Corte rústico de lechuga romana, acompañado de tomate cherry y aderezo de queso crema. Esto es acompañado con lomitos de pollo y una reducción de aceite balsámico.',
        secret: 'Aderezo de queso crema con hierbas frescas',
        ingredients: 'Lechuga romana, tomate cherry, pechuga de pollo, queso crema',
        sides: 'Pan de ajo',
        detailedDescription: 'Nuestra Ensalada Los Sartenes es una opción fresca y deliciosa que combina texturas y sabores de manera excepcional. La base de lechuga romana crujiente se mezcla con tomates cherry dulces y jugosos, todo bañado en nuestro exclusivo aderezo de queso crema con hierbas frescas. Los lomitos de pollo a la parrilla, jugosos y sazonados a la perfección, se colocan sobre la cama de verduras, y el toque final lo da una reducción de aceite balsámico que añade un contraste dulce y ácido. Se sirve con pan de ajo caliente para completar la experiencia.'
    },
    {
        name: 'Ensalada César',
        description: 'Corte rústico de lechuga romana, parmesano, crotones de pan, aderezo de salsa césar y lomitos de pollo.',
        secret: 'Salsa césar casera con anchoas y huevo',
        ingredients: 'Lechuga romana, queso parmesano, pan, pechuga de pollo',
        sides: 'Pan de ajo',
        detailedDescription: 'Nuestra Ensalada César es una versión mejorada del clásico que todos aman. La lechuga romana fresca y crujiente se mezcla con generosas lascas de queso parmesano añejo y crotones de pan casero, todo bañado en nuestra exclusiva salsa césar casera, preparada con yema de huevo, ajo, mostaza, anchoas y un toque de limón. Los lomitos de pollo a la parrilla, jugosos y sazonados con hierbas, se colocan sobre la ensalada, convirtiéndola en un plato completo y satisfactorio. Se sirve con pan de ajo caliente para mojar en la deliciosa salsa que queda en el plato.'
    },
    {
        name: 'Ensalada Campera',
        description: 'Corte rústico de lechuga, tomate, pimiento, zanahoria, huevo cocido y lomitos de atún en aceite de albahaca.',
        secret: 'Aliño de aceite de oliva con albahaca fresca',
        ingredients: 'Lechuga, tomate, pimiento, zanahoria, huevo, atún',
        sides: 'Pan integral tostado',
        detailedDescription: 'Nuestra Ensalada Campera es una explosión de colores y sabores que evoca la frescura del campo. Una mezcla de lechugas frescas se combina con tomates maduros, pimientos crujientes, zanahorias ralladas y huevo cocido en su punto perfecto. El toque especial lo dan los lomitos de atún de alta calidad, marinados en un delicioso aceite de albahaca que impregna toda la ensalada con su aroma y sabor. El aliño, preparado con aceite de oliva virgen extra, vinagre de manzana y un toque de miel, realza los sabores naturales de los ingredientes. Se sirve con pan integral tostado para una experiencia completa y saludable.'
    },
    {
        name: 'Tilapia a Los Sartenes',
        description: 'Delicioso filete de pescado sellado, glaseado con vino blanco, bañado con una salsa de aceite de albahaca, aceitunas y alcaparras. Acompañado de papas y vegetales.',
        secret: 'Sellado perfecto y salsa de albahaca fresca',
        ingredients: 'Filete de tilapia, vino blanco, albahaca, aceitunas, alcaparras',
        sides: 'Papas doradas y vegetales al vapor',
        detailedDescription: 'Nuestra Tilapia a Los Sartenes es una deliciosa opción para los amantes del pescado. Los filetes de tilapia fresca se sellan a la perfección para mantener su jugosidad y luego se glasean con un toque de vino blanco. La salsa, elaborada con aceite de oliva, albahaca fresca, aceitunas negras y alcaparras, añade un toque mediterráneo que realza el sabor suave del pescado. Se sirve con papas doradas crujientes y una selección de vegetales al vapor, creando un plato equilibrado y lleno de sabor que es tan saludable como delicioso.'
    },
    {
        name: 'Chuleta de Cerdo en Salsa de Piña',
        description: 'Chuleta ahumada sellada al grill en una deliciosa salsa de piña. Para la salsa se sellan cubos de piña, se glasean con vino blanco para neutralizar la acidez, y se agrega una pizca de azúcar. Acompañado con papas doradas y vegetales.',
        secret: 'Equilibrio perfecto entre lo dulce y lo ácido',
        ingredients: 'Chuleta de cerdo, piña, vino blanco, azúcar morena',
        sides: 'Papas doradas y vegetales salteados',
        detailedDescription: 'Nuestra Chuleta de Cerdo en Salsa de Piña es una combinación perfecta de sabores dulces y salados que deleitará tu paladar. La chuleta de cerdo, jugosa y llena de sabor, se sella al grill para crear una costra dorada y se baña en nuestra exquisita salsa de piña. La salsa se prepara sellando cubos de piña fresca, que luego se glasean con vino blanco y un toque de azúcar morena para crear un equilibrio perfecto entre lo dulce y lo ácido. Acompañada de papas doradas crujientes y una selección de vegetales salteados, es un plato que combina texturas y sabores de manera excepcional.'
    },
    {
        name: 'Camarones Fredd',
        description: 'Deliciosos camarones envueltos con tocino en una deliciosa salsa mediterránea a base de fondo de camarón, azafrán y jalapeño. Acompañados de papas doradas y vegetales.',
        secret: 'Cocción perfecta del tocino para mantener los camarones jugosos',
        ingredients: 'Camarones grandes, tocino, azafrán, jalapeño',
        sides: 'Papas doradas y vegetales al vapor',
        detailedDescription: 'Nuestros Camarones Fredd son una verdadera delicia para los amantes de los mariscos. Grandes camarones frescos se envuelven en finas tiras de tocino y se cocinan a la perfección, creando un contraste de texturas entre lo crujiente del tocino y lo jugoso de los camarones. La salsa mediterránea, preparada con un fondo de camarón casero, azafrán y un toque de jalapeño, añade un toque de sofisticación y un ligero picor que realza los sabores. Se sirve con papas doradas crujientes y una selección de vegetales al vapor, creando un plato equilibrado y lleno de sabor que seguramente se convertirá en uno de tus favoritos.'
    },
    {
        name: 'Pollo Andaluz',
        description: 'Deliciosa pechuga al grill en una deliciosa salsa a base de morrones tatemados, fondo de pollo y queso parmesano. Acompañado de pimientos asados, papas doradas y vegetales.',
        secret: 'Salsa de morrones asados y reducción con queso parmesano',
        ingredients: 'Pechuga de pollo, pimientos morrones, queso parmesano, hierbas',
        sides: 'Papas doradas, pimientos asados y vegetales',
        detailedDescription: 'Nuestro Pollo Andaluz es un homenaje a los sabores vibrantes de la cocina mediterránea. Las pechugas de pollo se cocinan al grill hasta alcanzar el punto perfecto de jugosidad y se bañan en una exquisita salsa preparada con morrones asados, que le otorgan un sabor ahumado y ligeramente dulce, y un toque de queso parmesano que añade profundidad y cremosidad. El plato se completa con pimientos asados, papas doradas crujientes y una selección de vegetales frescos, creando una combinación de colores y sabores que evocan el cálido clima andaluz. Una opción saludable y llena de sabor que te transportará directamente al sur de España.'
    },
    {
        name: 'Camarones al Ajillo',
        description: 'Camarones sellados a fuego vivo, glaseados con vino blanco en una salsa de ajo. Acompañados de papas doradas y vegetales.',
        secret: 'Cocción perfecta del ajo para evitar el amargor',
        ingredients: 'Camarones, ajo, vino blanco, perejil',
        sides: 'Papas doradas y vegetales al vapor',
        detailedDescription: 'Nuestros Camarones al Ajillo son una deliciosa opción para los amantes de los sabores intensos. Los camarones frescos se sellan a fuego vivo para mantener su jugosidad y luego se glasean con un toque de vino blanco que realza su sabor natural. La salsa, preparada con abundante ajo fresco cocinado a baja temperatura para evitar que se queme y se vuelva amargo, y un toque de perejil fresco, es el complemento perfecto para estos mariscos. Se sirve con papas doradas crujientes y una selección de vegetales al vapor, creando un plato equilibrado que destaca por su simplicidad y la calidad de sus ingredientes.'
    },
    {
        name: 'Picadillo',
        description: 'Cuatro deliciosos géneros de carne en una exquisita salsa a base de vino blanco, escabeche y ajo. Acompañada con papas doradas y vegetales.',
        secret: 'Cocción lenta de las carnes para lograr la textura perfecta',
        ingredients: 'Carne de res, cerdo, pollo y chorizo, vino blanco, ajo',
        sides: 'Papas doradas y vegetales salteados',
        detailedDescription: 'Nuestro Picadillo es un festín de sabores que combina cuatro tipos diferentes de carne en un solo plato. Seleccionamos cuidadosamente cortes de res, cerdo, pollo y chorizo, que se cocinan lentamente hasta alcanzar una textura tierna y jugosa. La salsa, preparada con vino blanco, escabeche y ajo, impregna cada trozo de carne con un sabor profundo y aromático. Se sirve con papas doradas crujientes y una selección de vegetales salteados, creando un plato contundente y lleno de personalidad que satisfará hasta al más exigente de los paladares. Una opción ideal para compartir y disfrutar en buena compañía.'
    },
    {
        name: 'Salmón',
        description: 'Salmón glaseado al whisky en una salsa de frambuesas frescas. Acompañado de deditos de plátano y vegetales grillados.',
        secret: 'Glaseado con whisky y reducción de frambuesa',
        ingredients: 'Filete de salmón, whisky, frambuesas, miel',
        sides: 'Deditos de plátano y vegetales grillados',
        detailedDescription: 'Nuestro Salmón es una verdadera delicia para los paladares más exigentes. Los filetes de salmón fresco se cocinan a la perfección y se glasean con una mezcla de whisky y miel, creando una capa brillante y llena de sabor. La salsa de frambuesas frescas añade un toque de acidez y dulzor que complementa a la perfección la riqueza del pescado. El plato se completa con crujientes deditos de plátano maduro y una selección de vegetales grillados que añaden color y textura. Una opción sofisticada y llena de matices que combina a la perfección con una copa de vino blanco fresco.'
    }
];

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'public', 'menu', 'platos');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate HTML files for each dish
dishes.forEach(dish => {
    const { fileName, content } = generateDishPage(dish);
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(`Error writing file ${fileName}:`, err);
        } else {
            console.log(`Successfully created: ${fileName}`);
        }
    });
});

console.log('All dish pages have been generated successfully!');
