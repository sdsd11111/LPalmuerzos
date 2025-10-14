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
        
        // Remove any existing menu scripts
        content = content.replace(/<script[^>]*mobile-menu[^>]*><\/script>/g, '');
        content = content.replace(/<script[^>]*menu-fix[^>]*><\/script>/g, '');
        
        // Add the new mobile menu fix script before the closing body tag
        if (!content.includes('mobile-menu-fix.js')) {
            const scriptTag = '    <script src="/js/mobile-menu-fix.js"></script>\n</body>';
            content = content.replace('</body>', scriptTag);
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${dish}.html`);
        } else {
            console.log(`ℹ️  Already updated: ${dish}.html`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${dish}.html:`, error.message);
    }
});

console.log('\n¡Todas las páginas de platos han sido actualizadas con el menú móvil!');
