// Asegurar que el menú móvil funcione correctamente
document.addEventListener('DOMContentLoaded', function() {
    // Función para inicializar el menú móvil
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const closeMenuBtn = document.getElementById('closeMenu');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        function toggleMenu(open = null) {
            const isOpening = open === null ? sidebar.classList.contains('-translate-x-full') : open;
            
            if (isOpening) {
                // Abrir menú
                sidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                // Cerrar menú
                sidebar.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }

        // Agregar event listeners
        if (menuToggle) {
            menuToggle.addEventListener('click', () => toggleMenu(true));
        }
        
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => toggleMenu(false));
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => toggleMenu(false));
        }
    }

    // Inicializar el menú móvil
    initMobileMenu();

    // Inicializar menús desplegables
    function initDropdowns() {
        const dropdownButtons = document.querySelectorAll('.menu-category-btn');
        
        dropdownButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const submenu = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Cerrar todos los submenús
                document.querySelectorAll('.menu-subcategory').forEach(menu => {
                    if (menu !== submenu) {
                        menu.classList.add('hidden');
                        const btn = menu.previousElementSibling;
                        if (btn && btn.classList.contains('menu-category-btn')) {
                            const icon = btn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-chevron-up');
                                icon.classList.add('fa-chevron-down');
                            }
                            btn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Alternar el submenú actual
                if (submenu && submenu.classList.contains('menu-subcategory')) {
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-down');
                        icon.classList.toggle('fa-chevron-up');
                    }
                    submenu.classList.toggle('hidden');
                    this.setAttribute('aria-expanded', String(!isExpanded));
                }
            });
            
            // Inicializar estado
            const submenu = button.nextElementSibling;
            if (submenu && submenu.classList.contains('menu-subcategory')) {
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('aria-haspopup', 'true');
                
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
        
        // Cerrar menús al hacer clic fuera
        document.addEventListener('click', function() {
            document.querySelectorAll('.menu-subcategory').forEach(menu => {
                menu.classList.add('hidden');
                const btn = menu.previousElementSibling;
                if (btn && btn.classList.contains('menu-category-btn')) {
                    const icon = btn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    
    // Inicializar menús desplegables
    initDropdowns();
});
