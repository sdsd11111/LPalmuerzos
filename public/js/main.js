document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuDropdownBtn = document.getElementById('menuDropdownBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoIframe = videoPlayer ? videoPlayer.querySelector('iframe') : null;
    
    // Funcionalidad del acordeón de preguntas frecuentes
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('svg');
        
        // Configurar el estado inicial
        answer.style.maxHeight = '0';
        
        question.addEventListener('click', () => {
            // Cerrar todas las respuestas
            faqQuestions.forEach(item => {
                if (item !== question) {
                    const otherAnswer = item.nextElementSibling;
                    const otherIcon = item.querySelector('svg');
                    
                    otherAnswer.style.maxHeight = '0';
                    otherIcon.classList.remove('rotate-45');
                    otherIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>';
                    item.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Alternar la respuesta actual
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                answer.style.maxHeight = '0';
                icon.classList.remove('rotate-45');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>';
                question.setAttribute('aria-expanded', 'false');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.add('rotate-45');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6"/>';
                question.setAttribute('aria-expanded', 'true');
                
                // Desplazamiento suave para mantener la pregunta visible
                question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
        
        // Soporte para teclado
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // Abrir menú lateral
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Cerrar menú lateral
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Eventos para cerrar el menú
    if (closeMenu) closeMenu.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Toggle del menú desplegable
    if (menuDropdownBtn) {
        menuDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            menuDropdown.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !sidebar.classList.contains('-translate-x-full')) {
            closeSidebar();
        }
    });
    
    // Funcionalidad del reproductor de video
    if (videoThumbnail && videoPlayer && videoIframe) {
        // Agregar clase de transición para suavizar los cambios
        videoPlayer.classList.add('transition-opacity', 'duration-300');
        
        videoThumbnail.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener la URL del iframe desde el atributo data-src
            const videoSrc = videoIframe.getAttribute('data-src');
            
            // Configurar la URL del iframe con parámetros mejorados
            videoIframe.src = videoSrc;
            
            // Mostrar el reproductor y ocultar el thumbnail con transición
            videoThumbnail.style.opacity = '0';
            videoThumbnail.style.pointerEvents = 'none';
            
            // Pequeño retraso para permitir la transición
            setTimeout(() => {
                videoThumbnail.style.display = 'none';
                videoPlayer.classList.remove('hidden');
                videoPlayer.style.opacity = '1';
                
                // Enfocar el reproductor para controles de teclado
                videoIframe.focus();
            }, 200);
        });
    }
    
    // Cerrar el reproductor cuando se hace clic fuera de él
    document.addEventListener('click', function(e) {
        if (videoPlayer && !videoPlayer.contains(e.target) && 
            videoThumbnail && !videoThumbnail.contains(e.target)) {
            
            if (!videoPlayer.classList.contains('hidden')) {
                // Suavizar la transición al cerrar
                videoPlayer.style.opacity = '0';
                
                // Pequeño retraso para permitir la transición
                setTimeout(() => {
                    videoPlayer.classList.add('hidden');
                    
                    // Restaurar el thumbnail
                    videoThumbnail.style.display = 'block';
                    videoThumbnail.style.opacity = '1';
                    videoThumbnail.style.pointerEvents = 'auto';
                    
                    // Limpiar el src para detener el video
                    if (videoIframe) {
                        videoIframe.src = '';
                    }
                }, 300);
            }
        }
    });
    
    // Prevenir que los clics dentro del reproductor cierren el modal
    if (videoPlayer) {
        videoPlayer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});
