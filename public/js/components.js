// Wrap everything in an IIFE to prevent global scope pollution
(function() {
    // Check if components are already initialized
    if (window.componentsInitialized) return;
    window.componentsInitialized = true;

    // Variables para el manejo de menús
    let currentOpenMenu = null;
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let dropdownEventListeners = [];

    // Función para obtener la ruta base del sitio
    function getBasePath() {
        // Para los componentes, siempre usamos la ruta absoluta desde la raíz
        return '/';
    }

    // Función para cargar componentes
    function loadComponents() {
        // Usar ruta absoluta para los componentes
        const headerPath = '/components/header.html';
        const footerPath = '/components/footer.html';
        
        // Cargar header
        fetch(headerPath)
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
        fetch(footerPath)
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

// Función para cerrar todos los menús
function closeAllMenus(except = null) {
    document.querySelectorAll('.menu-subcategory').forEach(menu => {
        if (menu !== except) {
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
}

// Función para inicializar los menús desplegables
function initializeDropdowns() {
    const menuButtons = document.querySelectorAll('.menu-category-btn');
    
    // Limpiar event listeners anteriores
    dropdownEventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    dropdownEventListeners = [];
    
    // Función para registrar event listeners y guardar referencias
    function addDropdownListener(element, type, listener) {
        element.addEventListener(type, listener);
        dropdownEventListeners.push({ element, type, listener });
    }

    function toggleMenu(button, forceState = null) {
        const submenu = button.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (!submenu || !submenu.classList.contains('menu-subcategory')) return;
        
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const shouldShow = forceState !== null ? forceState : !isExpanded;
        
        // Cerrar todos los menús primero si se está abriendo uno nuevo
        if (shouldShow) {
            closeAllMenus(submenu);
        }
        
        // Alternar el menú actual
        submenu.classList.toggle('hidden', !shouldShow);
        button.setAttribute('aria-expanded', shouldShow);
        
        // Actualizar el ícono
        if (icon) {
            icon.classList.toggle('fa-chevron-down', !shouldShow);
            icon.classList.toggle('fa-chevron-up', shouldShow);
        }
        
        currentOpenMenu = shouldShow ? button : null;
    }

    menuButtons.forEach(button => {
        const submenu = button.nextElementSibling;
        
        // Configurar atributos ARIA
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        
        if (submenu && submenu.classList.contains('menu-subcategory')) {
            // Configurar eventos para el botón del menú
            const handleButtonClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(button);
            };
            
            // Usar tanto click como touchstart para mejor soporte móvil
            addDropdownListener(button, 'click', handleButtonClick);
            if (isTouchDevice) {
                addDropdownListener(button, 'touchend', handleButtonClick);
            }
            
            // Prevenir que el clic en el submenú lo cierre
            addDropdownListener(submenu, 'click', (e) => {
                e.stopPropagation();
            });
            
            // Mejorar accesibilidad con teclado
            addDropdownListener(button, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu(button);
                } else if (e.key === 'Escape') {
                    closeAllMenus();
                    button.focus();
                }
            });
        }
    });
    
    // Cerrar menús al hacer clic fuera
    const handleOutsideClick = (e) => {
        if (!e.target.closest('.menu-category-btn') && !e.target.closest('.menu-subcategory')) {
            closeAllMenus();
            currentOpenMenu = null;
        }
    };
    
    // Usar mousedown en lugar de click para mejor manejo en móviles
    addDropdownListener(document, 'mousedown', handleOutsideClick);
    if (isTouchDevice) {
        addDropdownListener(document, 'touchstart', handleOutsideClick);
    }
    
    // Manejar teclado para accesibilidad
    addDropdownListener(document, 'keydown', (e) => {
        if (e.key === 'Escape' && currentOpenMenu) {
            closeAllMenus();
            currentOpenMenu.focus();
            currentOpenMenu = null;
        }
    });
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
    let cleanupDropdowns = null;

    function toggleMenu(open = null) {
        const isOpening = open === null ? sidebar.classList.contains('-translate-x-full') : open;
        
        if (isOpening) {
            // Abrir menú
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Limpiar cualquier inicialización previa
            if (cleanupDropdowns && typeof cleanupDropdowns === 'function') {
                cleanupDropdowns();
            }
            
            // Inicializar dropdowns después de que se complete la transición
            setTimeout(() => {
                initializeDropdowns();
            }, 50);
        } else {
            // Cerrar menú
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Cerrar todos los submenús
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
        }
    }

    // Configurar eventos del menú
    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMenu(true));
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Función para manejar el menú desplegable principal
    function setupMainMenu() {
        let menuBtn = document.getElementById('menuDropdownBtn');
        let menu = document.getElementById('menuDropdown');
        
        if (!menuBtn || !menu) return;
        
        // Función para actualizar el estado del menú
        function updateMenuState(shouldShow) {
            menu.classList.toggle('hidden', !shouldShow);
            menuBtn.setAttribute('aria-expanded', shouldShow);
            
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down', !shouldShow);
                icon.classList.toggle('fa-chevron-up', shouldShow);
            }
        }
        
        // Función para manejar clics en el botón del menú
        function handleMenuClick(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            updateMenuState(!isExpanded);
            
            // Si se está abriendo, inicializar los dropdowns
            if (!isExpanded) {
                initializeDropdowns();
            }
        }
        
        // Función para cerrar el menú
        function closeMenu() {
            updateMenuState(false);
        }
        
        // Configurar eventos
        menuBtn.onclick = handleMenuClick;
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Inicializar el menú cerrado
        updateMenuState(false);
        
        // Configurar el botón
        menuBtn.setAttribute('aria-haspopup', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
    }
    
    // Inicializar el menú principal
    setupMainMenu();

    // Inicializar dropdowns cuando se carga la página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDropdowns);
    } else {
        initializeDropdowns();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Cerrar el menú móvil si está abierto
                    if (!sidebar.classList.contains('-translate-x-full')) {
                        toggleMenu(false);
                    }
                    
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
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
    
    // Asegurarse de que el contenido se cargue incluso si el DOM ya está listo
    window.addEventListener('load', function() {
        // Verificar si el contenido ya se cargó
        const platoContent = document.getElementById('plato-content');
        if (platoContent && !platoContent.hasChildNodes()) {
            // Si no hay contenido, intentar cargarlo
            loadPlatoContent();
        }
    });
    
    // Función para cargar el contenido específico del plato
    function loadPlatoContent() {
        const platoContent = document.getElementById('plato-content');
        if (!platoContent) return;
        
        // Obtener el nombre del plato de la URL
        const pathParts = window.location.pathname.split('/');
        const platoId = pathParts[pathParts.length - 1].replace('.html', '');
        
        // Mapeo de nombres de archivo a IDs de platos
        const platoMap = {
            'espagueti_di_pollo_con_champinones': 'espagueti_pollo_champinones',
            'sarten_frutos_del_mar': 'frutos_mar',
            // Agregar más mapeos según sea necesario
        };
        
        const platoKey = platoMap[platoId] || platoId;
        
        // Hacer fetch al archivo JSON de platos
        fetch('/data/platos.json')
            .then(response => response.json())
            .then(data => {
                // Buscar el plato en el JSON
                const plato = data.platos.find(p => p.id === platoKey);
                
                if (plato) {
                    // Generar el contenido del plato
                    const content = `
                        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                            <!-- Imagen del plato - TAMAÑO MÁXIMO -->
                            <div class="h-[500px] md:h-[700px] w-full overflow-hidden">
                                <img 
                                    src="/images/platos/${plato.id}.jpg" 
                                    alt="${plato.nombre} - Los Sartenes Loja" 
                                    class="w-full h-full object-cover object-center"
                                    style="min-height: 500px;"
                                    onerror="this.onerror=null; this.src='/images/platos/sample.jpg'; this.alt='Imagen no disponible'"
                                >
                            </div>
                            
                            <div class="p-8">
                                <!-- Título y categoría -->
                                <div class="mb-8 text-center">
                                    <span class="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                                        ${plato.categoria}
                                    </span>
                                    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                                        ${plato.nombre}
                                    </h1>
                                    <div class="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
                                    
                                    <!-- Información destacada -->
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
                                        <div class="bg-white p-6 rounded-xl shadow-md text-center border border-gray-100">
                                            <div class="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <i class="fas fa-clock text-2xl text-orange-500"></i>
                                            </div>
                                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Tiempo</p>
                                            <p class="text-lg font-semibold text-gray-900">${plato.tiempo_preparacion || 'No especificado'}</p>
                                        </div>
                                        <div class="bg-white p-6 rounded-xl shadow-md text-center border border-gray-100">
                                            <div class="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <i class="fas fa-utensils text-2xl text-orange-500"></i>
                                            </div>
                                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Dificultad</p>
                                            <p class="text-lg font-semibold text-gray-900">${plato.dificultad || 'Media'}</p>
                                        </div>
                                        <div class="bg-white p-6 rounded-xl shadow-md text-center border border-gray-100">
                                            <div class="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <i class="fas fa-tag text-2xl text-orange-500"></i>
                                            </div>
                                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Precio</p>
                                            <p class="text-lg font-semibold text-gray-900">${plato.precio || 'Consultar'}</p>
                                        </div>
                                    </div>
                                </div>
                            <!-- Descripción e ingredientes en dos columnas -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                                <!-- Columna de descripción -->
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                        <i class="fas fa-book-open text-orange-500 mr-2"></i>
                                        Descripción
                                    </h2>
                                    <div class="prose max-w-none text-gray-600">
                                        <p class="leading-relaxed">${plato.descripcion_larga || plato.descripcion_corta || 'Descripción detallada del plato.'}</p>
                                    </div>
                                </div>
                                
                                <!-- Columna de ingredientes -->
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                        <i class="fas fa-clipboard-list text-orange-500 mr-2"></i>
                                        Ingredientes
                                    </h2>
                                    <ul class="grid grid-cols-1 gap-3">
                                        ${(plato.ingredientes || ['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3']).map(ingrediente => 
                                            `<li class="flex items-start">
                                                <span class="flex-shrink-0 mt-1">
                                                    <svg class="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span class="ml-3 text-gray-700">${ingrediente}</span>
                                            </li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            </div>
                            
                            <!-- Llamado a la acción -->
                            <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 md:p-10 mb-12">
                                <div class="max-w-4xl mx-auto text-center">
                                    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">¿Listo para disfrutar de este delicioso plato?</h3>
                                    <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                        Visítanos en nuestro acogedor restaurante en Loja y déjate sorprender por nuestros sabores únicos y atención personalizada.
                                    </p>
                                    <div class="flex flex-col sm:flex-row justify-center gap-4">
                                        <a href="/contacto.html" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105">
                                            <i class="fas fa-calendar-alt mr-2"></i>
                                            Reservar mesa
                                        </a>
                                        <a href="/menu.html" class="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300">
                                            <i class="fas fa-utensils mr-2"></i>
                                            Ver más platos
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    
                    platoContent.innerHTML = content;
                } else {
                    // Si no se encuentra el plato, mostrar un mensaje de error
                    platoContent.innerHTML = `
                        <div class="text-center py-12">
                            <i class="fas fa-utensils text-5xl text-gray-400 mb-4"></i>
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">Plato no encontrado</h2>
                            <p class="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar la información de este plato.</p>
                            <a href="/menu.html" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                Volver al menú
                            </a>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error cargando los datos del plato:', error);
                platoContent.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">Error al cargar el plato</h2>
                        <p class="text-gray-600 mb-6">Ocurrió un error al cargar la información del plato. Por favor, intenta de nuevo más tarde.</p>
                        <button onclick="window.location.reload()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                            Reintentar
                        </button>
                    </div>
                `;
            });
    }
})(); // End of IIFE
