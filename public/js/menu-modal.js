// Función para abrir el modal con el contenido de la categoría
function openMenuModal(title, description, imageUrl) {
    const modal = document.getElementById('menuModal');
    const modalContent = document.getElementById('modalContent');
    
    // Crear el contenido del modal
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="h-64 overflow-hidden rounded-lg">
                <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover">
            </div>
            <div class="space-y-4">
                <h3 class="text-2xl font-bold text-[#2E8B57]">${title}</h3>
                <p class="text-gray-600">${description}</p>
                <div class="pt-4">
                    <a href="https://wa.me/593987654321?text=Hola, me interesa el menú de ${encodeURIComponent(title)}" 
                       class="inline-flex items-center justify-center w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                       target="_blank">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.498 14.382v3.3a1 1 0 0 1-1.09.998 14.91 14.91 0 0 1-7.738-2.253 17.23 17.23 0 0 1-5.326-6.6 1 1 0 0 1 .306-1.277l2.5-1.942a1 1 0 0 1 1.21.001l1.68 1.262a1 1 0 0 1 .3 1.24l-1.07 2.14a12.04 12.04 0 0 0 2.25 2.67 12.04 12.04 0 0 0 2.67 2.25l2.14-1.07a1 1 0 0 1 1.24.3l1.262 1.68a1 1 0 0 1 .001 1.21z"/>
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                        </svg>
                        Pedir por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Configurar el botón de cierre
    document.getElementById('closeModal').onclick = () => closeMenuModal();
    
    // Cerrar al hacer clic fuera del contenido
    modal.onclick = (e) => {
        if (e.target === modal) closeMenuModal();
    };
    
    // Cerrar con la tecla ESC
    document.onkeydown = (e) => {
        if (e.key === 'Escape') closeMenuModal();
    };
}

// Función para cerrar el modal
function closeMenuModal() {
    const modal = document.getElementById('menuModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.onkeydown = null; // Eliminar el event listener de teclado
}

// Configurar los botones de "Explora el Menú Completo"
document.addEventListener('DOMContentLoaded', function() {
    // Configurar los botones
    document.querySelectorAll('.menu-button').forEach(button => {
        button.onclick = function() {
            const card = this.closest('.menu-card') || this.closest('.bg-white');
            if (!card) return;
            
            const title = card.querySelector('h3')?.textContent || 'Menú';
            const description = card.querySelector('p')?.textContent || '';
            const image = card.querySelector('img');
            const imageUrl = image ? image.src : '';
            
            openMenuModal(title, description, imageUrl);
        };
    });
});