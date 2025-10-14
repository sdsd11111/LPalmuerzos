const fs = require('fs');
const path = require('path');

// List of all dish pages to update
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
const headerSnippet = `    <!-- Componente Header -->
    <div id="header-component">
        <!-- El contenido del header se cargará aquí mediante JavaScript -->
    </div>`;

const scriptSnippet = `    <!-- Cargar componentes y scripts necesarios -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js"></script>
    <script src="/js/components.js"></script>`;

// Process each dish page
dishPages.forEach(dish => {
    const filePath = path.join(platosDir, `${dish}.html`);
    
    // Skip if file doesn't exist
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove any existing header
        content = content.replace(/<header[\s\S]*?<\/header>/, '');
        content = content.replace(/<div id="header-component">[\s\S]*?<\/div>/, '');
        
        // Remove any existing header scripts
        content = content.replace(/<script[^>]*mobile-menu[^>]*><\/script>/g, '');
        content = content.replace(/<script[^>]*menu-fix[^>]*><\/script>/g, '');
        
        // Add header component after opening body tag
        if (!content.includes('id="header-component"')) {
            content = content.replace('<body>', '<body>\n' + headerSnippet);
        }
        
        // Add necessary scripts before closing body tag
        if (!content.includes('components.js')) {
            content = content.replace('</body>', scriptSnippet + '\n</body>');
        }
        
        // Ensure Font Awesome CSS is in the head
        if (!content.includes('font-awesome')) {
            const fontAwesomeLink = '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">\n    <link rel="stylesheet" href="/css/styles.css">';
            content = content.replace('</title>', '</title>\n' + fontAwesomeLink);
        }
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${dish}.html`);
    } catch (error) {
        console.error(`❌ Error processing ${dish}.html:`, error.message);
    }
});

console.log('\n¡Se han actualizado los encabezados de todas las páginas de platos!');
