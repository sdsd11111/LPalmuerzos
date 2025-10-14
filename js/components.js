// Función para obtener la ruta base del sitio
function getBasePath() {
    // Si estamos en la raíz, la ruta es './', de lo contrario es '../../'
    return window.location.pathname.includes('/menu/') ? '../' : './';
}

// Función para cargar componentes
function loadComponents() {
    const basePath = getBasePath();
    
    // Cargar header
    fetch(`${basePath}components/header.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const headerContainer = document.getElementById('header-component');
            if (headerContainer) {
                headerContainer.innerHTML = html;
                initializeHeader();
            }
        })
        .catch(error => console.error('Error cargando el header:', error));

    // Cargar footer
    fetch(`${basePath}components/footer.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const footerContainer = document.getElementById('footer-component');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(error => console.error('Error cargando el footer:', error));
}

// Inicializar funcionalidad del header
function initializeHeader() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const closeMenuBtn = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuDropdownBtn = document.getElementById('menuDropdownBtn');
    const menuDropdown = document.getElementById('menuDropdown');

    function toggleMenu() {
        sidebar.classList.toggle('-translate-x-full');
        sidebarOverlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('-translate-x-full') ? '' : 'hidden';
    }

    if (menuToggle && closeMenuBtn && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);
        sidebarOverlay.addEventListener('click', toggleMenu);
    }

    // Toggle dropdown menu
    if (menuDropdownBtn && menuDropdown) {
        menuDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuDropdown.classList.toggle('hidden');
            const icon = menuDropdownBtn.querySelector('i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (menuDropdownBtn && !menuDropdownBtn.contains(e.target) && 
            menuDropdown && !menuDropdown.contains(e.target)) {
            menuDropdown.classList.add('hidden');
            const icon = menuDropdownBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadComponents);
