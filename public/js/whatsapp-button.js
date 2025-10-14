// Function to add WhatsApp button to the page
function addWhatsAppButton() {
    // Check if WhatsApp button already exists
    if (document.getElementById('whatsapp-float')) {
        return;
    }

    // Create WhatsApp button
    const whatsappButton = document.createElement('a');
    whatsappButton.id = 'whatsapp-float';
    whatsappButton.href = 'https://wa.me/593987654321?text=Hola%20Los%20Sartenes,%20me%20gustaría%20hacer%20una%20reserva';
    whatsappButton.className = 'fixed bottom-8 right-8 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-[#128C7E] transition-all duration-300 z-40';
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
    whatsappButton.setAttribute('aria-label', 'Chatea con nosotros por WhatsApp');
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';

    // Add animation class
    whatsappButton.classList.add('whatsapp-float');

    // Add to body
    document.body.appendChild(whatsappButton);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
        }
        .whatsapp-float {
            animation: float 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', addWhatsAppButton);
