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

// Script to add to each page
const headerScript = `
    <!-- Cargar componentes del header -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Cargar header
        fetch('/components/header.html')
            .then(response => response.text())
            .then(html => {
                const headerContainer = document.getElementById('header-component');
                if (headerContainer) {
                    headerContainer.innerHTML = html;
                    
                    // Get all menu elements
                    const menuToggle = document.getElementById('menuToggle');
                    const closeMenuBtn = document.getElementById('closeMenu');
                    const sidebar = document.getElementById('sidebar');
                    const sidebarOverlay = document.getElementById('sidebarOverlay');
                    const menuDropdownBtn = document.getElementById('menuDropdownBtn');
                    const menuDropdown = document.getElementById('menuDropdown');
                    
                    // Toggle sidebar
                    if (menuToggle && sidebar && sidebarOverlay) {
                        menuToggle.addEventListener('click', (e) => {
                            e.stopPropagation();
                            sidebar.classList.toggle('-translate-x-full');
                            sidebarOverlay.classList.toggle('hidden');
                            document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden';
                        });
                        
                        closeMenuBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            closeMenu();
                        });
                        
                        sidebarOverlay.addEventListener('click', (e) => {
                            e.stopPropagation();
                            closeMenu();
                        });
                    }
                    
                    // Close menu function
                    function closeMenu() {
                        if (sidebar && sidebarOverlay) {
                            sidebar.classList.add('-translate-x-full');
                            sidebarOverlay.classList.add('hidden');
                            document.body.style.overflow = '';
                        }
                    }
                    
                    // Toggle menu dropdown
                    if (menuDropdownBtn && menuDropdown) {
                        menuDropdownBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            menuDropdown.classList.toggle('hidden');
                            const icon = menuDropdownBtn.querySelector('i');
                            if (icon) {
                                icon.classList.toggle('fa-chevron-down');
                                icon.classList.toggle('fa-chevron-up');
                            }
                        });
                    }
                    
                    // Handle submenu clicks
                    document.querySelectorAll('.menu-category-btn').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const submenu = this.nextElementSibling;
                            const icon = this.querySelector('i');
                            
                            if (submenu && submenu.classList.contains('menu-subcategory')) {
                                // Toggle the current submenu
                                submenu.classList.toggle('hidden');
                                
                                // Toggle the icon
                                if (icon) {
                                    icon.classList.toggle('fa-chevron-down');
                                    icon.classList.toggle('fa-chevron-up');
                                }
                                
                                // Close other submenus
                                document.querySelectorAll('.menu-subcategory').forEach(otherSubmenu => {
                                    if (otherSubmenu !== submenu) {
                                        otherSubmenu.classList.add('hidden');
                                        const otherButton = otherSubmenu.previousElementSibling;
                                        if (otherButton && otherButton.classList.contains('menu-category-btn')) {
                                            const otherIcon = otherButton.querySelector('i');
                                            if (otherIcon) {
                                                otherIcon.classList.remove('fa-chevron-up');
                                                otherIcon.classList.add('fa-chevron-down');
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    });
                    
                    // Close menu when clicking on a link
                    document.querySelectorAll('#sidebar a').forEach(link => {
                        link.addEventListener('click', (e) => {
                            // Only close if it's not a dropdown toggle
                            if (!link.classList.contains('menu-category-btn')) {
                                closeMenu();
                            }
                        });
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener('click', () => {
                        if (menuDropdown && !menuDropdown.classList.contains('hidden')) {
                            menuDropdown.classList.add('hidden');
                            const icon = menuDropdownBtn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-chevron-up');
                                icon.classList.add('fa-chevron-down');
                            }
                        }
                    });
                }
            })
            .catch(error => console.error('Error loading header:', error));
    });
    </script>`;

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
        
        // Remove any existing header scripts
        content = content.replace(/<script[^>]*Cargar componentes del header[\s\S]*?<\/script>/g, '');
        
        // Add the header script before the closing body tag
        content = content.replace('</body>', headerScript + '\n</body>');
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${dish}.html`);
    } catch (error) {
        console.error(`❌ Error processing ${dish}.html:`, error.message);
    }
});

console.log('\n¡Se han actualizado los submenús de todas las páginas de platos!');
