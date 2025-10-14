// Función para inicializar el menú desplegable
function initMenuDropdowns() {
    // Seleccionar todos los botones de categoría
    const categoryButtons = document.querySelectorAll('.menu-category-btn');
    
    // Agregar manejador de eventos a cada botón
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Obtener el submenú asociado
            const submenu = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (submenu && submenu.classList.contains('menu-subcategory')) {
                // Cerrar todos los demás submenús
                document.querySelectorAll('.menu-subcategory').forEach(menu => {
                    if (menu !== submenu) {
                        menu.classList.add('hidden');
                        // Restablecer el ícono de los demás botones
                        const otherIcons = document.querySelectorAll('.menu-category-btn i');
                        otherIcons.forEach(i => {
                            if (i !== icon) {
                                i.classList.remove('fa-chevron-up');
                                i.classList.add('fa-chevron-down');
                            }
                        });
                    }
                });
                
                // Alternar la visibilidad del submenú actual
                submenu.classList.toggle('hidden');
                
                // Alternar el ícono
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
                
                // Actualizar atributo aria-expanded
                const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
                this.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });
    
    // Cerrar menús al hacer clic fuera de ellos
    document.addEventListener('click', function() {
        document.querySelectorAll('.menu-subcategory').forEach(menu => {
            menu.classList.add('hidden');
        });
        
        document.querySelectorAll('.menu-category-btn i').forEach(icon => {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        });
    });
}

// Inicializar el menú cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Esperar un momento para asegurar que el header se haya cargado
        setTimeout(initMenuDropdowns, 500);
    });
} else {
    // Si el DOM ya está cargado
    setTimeout(initMenuDropdowns, 500);
}

// También inicializar cuando se cargue el header dinámicamente
document.addEventListener('headerLoaded', initMenuDropdowns);
