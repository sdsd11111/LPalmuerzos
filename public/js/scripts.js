// Funcionalidad del menú móvil
document.addEventListener('DOMContentLoaded', function() {
    // Toggle del menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuDropdownBtns = document.querySelectorAll('.menu-category-btn');

    // Función para cerrar el menú
    const closeSidebar = () => {
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // Abrir menú
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (sidebar) {
                sidebar.classList.remove('-translate-x-full');
                if (sidebarOverlay) sidebarOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Cerrar menú
    if (closeMenu) {
        closeMenu.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Manejar menús desplegables
    menuDropdownBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const submenu = this.nextElementSibling;
            const icon = this.querySelector('i');

            if (submenu && submenu.classList.contains('menu-subcategory')) {
                // Cerrar otros submenús abiertos
                document.querySelectorAll('.menu-subcategory').forEach(item => {
                    if (item !== submenu) {
                        item.classList.add('hidden');
                        const btn = item.previousElementSibling;
                        if (btn) {
                            const ico = btn.querySelector('i');
                            if (ico) ico.style.transform = 'rotate(0deg)';
                        }
                    }
                });

                // Alternar el submenú actual
                submenu.classList.toggle('hidden');

                // Rotar el ícono
                if (icon) {
                    icon.style.transition = 'transform 0.3s ease';
                    if (submenu.classList.contains('hidden')) {
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        icon.style.transform = 'rotate(180deg)';
                    }
                }
            }
        });
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Cerrar menú al presionar la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
});

// Efecto de scroll para el header
let lastScroll = 0;
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('shadow-md');
            return;
        }

        if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
            // Scroll hacia abajo
            header.classList.add('-translate-y-full');
            header.classList.remove('shadow-md');
        } else {
            // Scroll hacia arriba
            header.classList.remove('-translate-y-full');
            header.classList.add('shadow-md');
        }

        lastScroll = currentScroll;
    });
}
