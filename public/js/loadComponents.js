// Función para cargar componentes
async function loadComponent(elementId, path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Error al cargar ${path}: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            // Inicializar el menú móvil después de cargar el header
            if (elementId === 'header-container') {
                initMobileMenu();
            }
        }
    } catch (error) {
        console.error('Error al cargar el componente:', error);
    }
}

// Función para inicializar el menú móvil
function initMobileMenu() {
    // Toggle del menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuDropdownBtns = document.querySelectorAll('.menu-category-btn');

    if (menuToggle && sidebar && sidebarOverlay) {
        // Abrir menú
        menuToggle.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        // Cerrar menú
        const closeSidebar = () => {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        };

        closeMenu?.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Manejar menús desplegables
    menuDropdownBtns.forEach(button => {
        button.addEventListener('click', function() {
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

    // Cerrar menú al hacer clic en un enlace del menú
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar header
    loadComponent('header-container', '/components/header.html');
    
    // Cargar footer
    loadComponent('footer-container', '/components/footer.html');
    
    // Añadir clase al body cuando se carga la página
    document.body.classList.add('bg-gray-50');
});

// Manejar el scroll para el header fijo
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
