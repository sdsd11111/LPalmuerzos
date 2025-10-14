// Variables globales
const heroSection = document.getElementById('hero-plato-del-dia');
const platosContainer = document.getElementById('platos-dinamicos-container');
const API_URL = '/api/platos-activos';
let platosData = [];
let currentPlatoIndex = 0;
let slideInterval;

// Imagen por defecto si no hay imagen del plato
const DEFAULT_IMAGE = '/images/hero-bg.jpg';

// Función para formatear la URL de la imagen
function formatImageUrl(url, plato) {
    console.log('🖼️ Formateando URL de imagen:', { url, plato });
    
    // Si el plato tiene una URL completa, usarla directamente
    if (plato && plato.imagen_url_completa) {
        // Asegurarse de que la URL sea accesible
        let imageUrl = plato.imagen_url_completa;
        
        // Si la URL de Supabase tiene doble 'platos/platos/', corregirla
        if (imageUrl.includes('/platos/platos/')) {
            imageUrl = imageUrl.replace('/platos/platos/', '/platos/');
            console.log('🔄 URL corregida (doble platos):', imageUrl);
        }
        
        // Si la URL no comienza con http, agregar el dominio de Supabase
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
            imageUrl = `https://slsdowttijjlwdexzkum.supabase.co/storage/v1/object/public/platos/${imageUrl}`;
            console.log('🔗 URL convertida a Supabase:', imageUrl);
        }
        
        console.log('✅ Usando imagen_url_completa:', imageUrl);
        return imageUrl;
    }
    
    // Si no hay URL, devolver cadena vacía
    if (!url) {
        console.warn('⚠️ No se proporcionó URL de imagen');
        return '';
    }
    
    // Si la URL ya es completa, devolverla tal cual
    if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) {
        console.log('🔗 URL ya es completa:', url);
        return url;
    }
    
    // Para cualquier otro caso, construir la URL completa de Supabase
    const filename = url.split('/').pop();
    const supabaseUrl = `https://slsdowttijjlwdexzkum.supabase.co/storage/v1/object/public/platos/${filename}`;
    console.log('📂 Construyendo URL de Supabase:', supabaseUrl);
    return supabaseUrl;
}

// Función para mostrar imágenes sin overlay oscuro
function mostrarImagenClara(imageUrl) {
    if (!heroSection) {
        console.error('❌ Elemento hero no encontrado');
        return false;
    }

    console.log('🖼️ Aplicando imagen sin overlay:', imageUrl);

    // 1. Eliminar cualquier estilo en línea que pueda contener gradientes
    heroSection.removeAttribute('style');
    
    // 2. Eliminar cualquier overlay existente
    const existingOverlays = document.querySelectorAll('.hero-overlay, #hero-background');
    existingOverlays.forEach(el => el.remove());

    // 3. Aplicar la imagen directamente al heroSection
    heroSection.style.backgroundImage = `url('${imageUrl}')`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
    heroSection.style.backgroundRepeat = 'no-repeat';
    
    // 4. Asegurar que no haya opacidad ni filtros
    heroSection.style.opacity = '1';
    heroSection.style.filter = 'none';
    
    // 5. Crear un estilo global para prevenir overlays
    const styleId = 'hero-no-overlay-style';
    let style = document.getElementById(styleId);
    
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #hero-plato-del-dia {
                background-image: url('${imageUrl}') !important;
                background-size: cover !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
            }
            #hero-plato-del-dia:before {
                content: none !important;
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    } else {
        // Actualizar solo la URL de la imagen si el estilo ya existe
        style.textContent = style.textContent.replace(
            /background-image: url\('([^']*)'\) !important/, 
            `background-image: url('${imageUrl}') !important`
        );
    }
    
    console.log('✅ Fondo actualizado sin overlay oscuro');
    return true;
}

// Función auxiliar para forzar la actualización del fondo
function actualizarFondoHero() {
    const hero = document.getElementById('hero-plato-del-dia');
    if (hero) {
        // Forzar la eliminación de cualquier estilo en línea no deseado
        const bgImage = window.getComputedStyle(hero).backgroundImage;
        if (bgImage.includes('gradient')) {
            hero.style.backgroundImage = bgImage.replace(/linear-gradient\([^)]+\),\s*/, '');
        }
    }
}

// Ejecutar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verificar y corregir el fondo después de un pequeño retraso
    setTimeout(actualizarFondoHero, 100);
    
    // También verificar cuando se actualice el DOM
    const observer = new MutationObserver(actualizarFondoHero);
    observer.observe(document.body, { childList: true, subtree: true });
});

// Función de emergencia para limpiar completamente cualquier overlay oscuro
function eliminarOverlayOscuro() {
    if (!heroSection) return false;

    console.log('🚨 Eliminando cualquier overlay oscuro...');

    // Obtener el estilo actual
    const estiloActual = heroSection.getAttribute('style') || '';

    // Buscar y eliminar cualquier overlay oscuro
    let estiloLimpio = estiloActual;

    // Eliminar linear-gradient con rgba negro
    estiloLimpio = estiloLimpio.replace(/linear-gradient\(rgba\(0,\s*0,\s*0,\s*0\.\d+\),\s*rgba\(0,\s*0,\s*0,\s*0\.\d+\)\),\s*/g, '');

    // Eliminar cualquier rgba negro con opacidad
    estiloLimpio = estiloLimpio.replace(/rgba\(0,\s*0,\s*0,\s*0\.\d+\)/g, '');

    // Aplicar el estilo limpio
    heroSection.setAttribute('style', estiloLimpio);

    // Verificar que no quede ningún overlay oscuro
    const estiloFinal = heroSection.getAttribute('style') || '';
    const tieneOverlayOscuro = estiloFinal.includes('rgba(0, 0, 0, 0.') || estiloFinal.includes('linear-gradient(rgba(0, 0, 0, 0.');

    if (tieneOverlayOscuro) {
        console.warn('⚠️ Aún hay overlay oscuro detectado, limpiando completamente...');
        heroSection.removeAttribute('style');
        heroSection.style.cssText = '';
        return false;
    } else {
        console.log('✅ Overlay oscuro eliminado completamente');
        return true;
    }
}

// Función para monitorear y corregir automáticamente cualquier overlay oscuro
function iniciarCorreccionAutomatica() {
    if (!heroSection) return;

    console.log('🔄 Iniciando corrección automática de imágenes...');

    // Verificar cada 500ms si hay overlay oscuro
    const intervaloCorreccion = setInterval(() => {
        eliminarOverlayOscuro();
    }, 500);

    // También monitorear cambios en el elemento
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // Pequeño delay antes de corregir
                setTimeout(() => {
                    eliminarOverlayOscuro();
                }, 100);
            }
        });
    });

    observer.observe(heroSection, {
        attributes: true,
        attributeFilter: ['style']
    });

    console.log('✅ Corrección automática iniciada');

    // Devolver controles para detener si es necesario
    return {
        detener: () => {
            clearInterval(intervaloCorreccion);
            observer.disconnect();
            console.log('🛑 Corrección automática detenida');
        }
    };
}

// Función para limpiar completamente el hero y aplicar imagen fresca
function limpiarYMostrarHero(imageUrl) {
    if (!heroSection) return;

    console.log('🧹 Limpiando completamente el hero...');

    // Remover cualquier estilo existente
    heroSection.removeAttribute('style');
    heroSection.style.cssText = '';

    // Aplicar imagen limpia después de limpiar
    setTimeout(() => {
        mostrarImagenHero(imageUrl);
    }, 10);
}

// Función para mostrar un plato específico
function showPlato(index) {
    console.log('🍽️ Mostrando plato en índice:', index);
    
    if (!platosData || !platosData.length) {
        console.warn('⚠️ No hay datos de platos disponibles');
        return;
    }
    
    currentPlatoIndex = (index + platosData.length) % platosData.length;
    const plato = platosData[currentPlatoIndex];
    
    console.log('📌 Mostrando plato:', plato);
    
    // Usar directamente la URL completa de la imagen del plato
    let imageUrl = plato.imagen_url_completa || plato.imagen_url;
    
    console.log('🔍 Datos del plato:', {
        id: plato.id,
        titulo: plato.titulo,
        imagen_url: plato.imagen_url,
        imagen_url_completa: plato.imagen_url_completa,
        imageUrlSeleccionada: imageUrl
    });
    
    // Aplicar imagen directamente usando la función simplificada
    if (imageUrl) {
        console.log('🔄 Aplicando imagen del plato completamente clara');
        mostrarImagenClara(imageUrl);
        eliminarOverlayOscuro(); // Doble verificación
    } else {
        console.warn('⚠️ No se encontró URL de imagen para el plato');
        mostrarImagenClara('/images/hero-bg.jpg');
        eliminarOverlayOscuro();
    }
    
    // Función para formatear el precio
    const formatPrice = (value) => {
        console.log('🔢 Formateando precio:', value);
        
        // Si el valor es 0, devolver $0.00
        if (value === 0 || value === '0' || value === '0.00') {
            console.log('🔢 Precio es cero, mostrando $0.00');
            return '$0.00';
        }
        
        // Si el valor es undefined, null o string vacío, devolver cadena vacía
        if (value === undefined || value === null || value === '') {
            console.log('🔍 Valor no válido para formatear');
            return '';
        }
        
        // Si el valor ya está formateado como moneda, devolverlo tal cual
        if (typeof value === 'string' && value.startsWith('$')) {
            console.log('💰 Valor ya formateado:', value);
            return value;
        }
        
        // Convertir a número
        let num;
        if (typeof value === 'number') {
            num = value;
        } else if (typeof value === 'string') {
            // Eliminar cualquier caracter que no sea número, punto o coma
            const cleanValue = value.replace(/[^0-9.,]/g, '');
            // Reemplazar coma por punto para el parseo
            num = parseFloat(cleanValue.replace(',', '.'));
        } else {
            console.log('⚠️ Tipo de valor no soportado:', typeof value, value);
            return '';
        }
        
        if (isNaN(num)) {
            console.log('⚠️ No se pudo convertir a número:', value);
            return '';
        }
        
        // Formatear a 2 decimales y agregar símbolo de moneda
        const formatted = `$${num.toFixed(2).replace(/\.?0+$/, '')}`;
        console.log('✅ Precio formateado:', formatted);
        return formatted;
    };
    
    // Obtener el precio, priorizando 'precio' sobre 'valor_formateado' y luego 'valor'
    let precioAMostrar = '';
    
    if (plato.precio !== undefined && plato.precio !== null) {
        precioAMostrar = plato.precio;
    } else if (plato.valor_formateado) {
        // Extraer el valor numérico de valor_formateado
        const valorNumerico = plato.valor_formateado.replace(/[^0-9.,]/g, '').replace(',', '.');
        precioAMostrar = parseFloat(valorNumerico) || 0;
    } else if (plato.valor !== undefined && plato.valor !== null) {
        precioAMostrar = plato.valor;
    }
    
    // Formatear el precio para mostrar
    let valorMostrar = formatPrice(precioAMostrar);
    
    // Depuración detallada
    console.log('📋 Datos del plato:', {
        id: plato.id,
        titulo: plato.titulo,
        descripcion: plato.descripcion,
        precio: plato.precio,
        valor: plato.valor,
        valor_formateado: plato.valor_formateado,
        precioAMostrar: precioAMostrar,
        valorMostrado: valorMostrar,
        'Tipo de precio': typeof plato.precio,
        'Tipo de valor': typeof plato.valor,
        'Tipo de precioAMostrar': typeof precioAMostrar,
        'Plato completo': JSON.parse(JSON.stringify(plato)) // Para evitar referencias circulares
    });
    
    // Asegurarse de que el precio se muestre aunque sea 0
    if (valorMostrar === '' && (precioAMostrar === 0 || plato.precio === 0 || plato.valor === 0)) {
        console.log('🔵 Mostrando precio cero');
        valorMostrar = '$0.00';
    }
    
    platosContainer.innerHTML = `
        <div class="plato-content text-center max-w-3xl mx-auto px-4 transform transition-all duration-500 ease-in-out">
            <h3 class="text-3xl md:text-5xl font-bold font-playfair text-white mb-4">
                ${plato.titulo || 'Plato del Día'}
            </h3>
            <p class="text-lg md:text-xl text-gray-200 mb-6">
                ${plato.descripcion || 'Deliciosa especialidad del chef preparada con los mejores ingredientes.'}
            </p>
            <p class="text-4xl font-bold text-[#FF8C42] mb-8 animate-pulse">
                ${valorMostrar}
            </p>
            <div class="flex justify-center space-x-4">
                <button onclick="navegarPlato(-1)" class="nav-button bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button onclick="navegarPlato(1)" class="nav-button bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div class="flex justify-center mt-6 space-x-2">
                ${platosData.map((_, i) => `
                    <button onclick="irAPlato(${i})" 
                            class="w-3 h-3 rounded-full ${i === currentPlatoIndex ? 'bg-[#FF8C42] w-6' : 'bg-white bg-opacity-50'}
                                   transition-all duration-300">
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// Función para navegar entre platos
function navegarPlato(direction) {
    const newIndex = (currentPlatoIndex + direction + platosData.length) % platosData.length;
    showPlato(newIndex);
    resetAutoSlide();
}

// Función para ir a un plato específico
function irAPlato(index) {
    if (index >= 0 && index < platosData.length) {
        showPlato(index);
        resetAutoSlide();
    }
}

// Función para iniciar el carrusel automático
function startAutoSlide() {
    stopAutoSlide();
    if (platosData.length > 1) {
        slideInterval = setInterval(() => {
            const nextIndex = (currentPlatoIndex + 1) % platosData.length;
            showPlato(nextIndex);
        }, 5000); // Cambiar de plato cada 5 segundos
    }
}

// Función para detener el carrusel automático
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Función para reiniciar el temporizador de cambio automático
function resetAutoSlide() {
    stopAutoSlide();
    if (platosData.length > 1) {
        startAutoSlide();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Función para normalizar los datos del plato
    function normalizePlato(plato) {
        // Crear un nuevo objeto para evitar modificar el original
        const normalized = { ...plato };
        
        // Si el plato tiene 'valor' pero no 'precio', copiar el valor a precio
        if (normalized.valor !== undefined && normalized.precio === undefined) {
            console.log(`🔧 Normalizando plato ${normalized.id}: copiando valor (${normalized.valor}) a precio`);
            normalized.precio = normalized.valor;
        }
        
        console.log('🔍 Plato normalizado:', {
            id: normalized.id,
            titulo: normalized.titulo,
            precio: normalized.precio,
            valor: normalized.valor
        });
        
        return normalized;
    }

    // Función para obtener los platos de la API
    async function fetchPlatos() {
        try {
            console.log('🔍 Obteniendo platos de:', API_URL);
            const response = await fetch(API_URL, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error en la respuesta del servidor');
            }
            
            let data = await response.json();
            console.log('📦 Platos recibidos:', data);
            
            if (!Array.isArray(data)) {
                console.warn('⚠️ La respuesta no es un arreglo:', data);
                renderPlatos([]);
                return;
            }
            
            // Normalizar los datos antes de renderizarlos
            data = data.map(normalizePlato);
            
            // Verificar las URLs de las imágenes
            console.log('🔍 URLs de imágenes en la respuesta:');
            data.forEach((plato, index) => {
                console.log(`  Plato ${index + 1} (${plato.titulo}):`);
                console.log(`    - imagen_url: ${plato.imagen_url}`);
                console.log(`    - imagen_url_completa: ${plato.imagen_url_completa}`);
            });
            
            console.log(`✅ Se encontraron ${data.length} platos activos`, data);
            
            // Guardar los datos para uso posterior
            platosData = data;
            
            // Mostrar el primer plato si hay datos
            if (platosData.length > 0) {
                showPlato(0);
            }
            
            return data;
            
        } catch (error) {
            console.error('Error al cargar los platos:', error);
            
            // Mostrar un mensaje de error en la interfaz
            if (platosContainer) {
                platosContainer.innerHTML = `
                    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-2xl mx-auto" role="alert">
                        <div class="flex">
                            <div class="py-1">
                                <svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="font-bold">Error al cargar el menú del día</p>
                                <p class="text-sm">${error.message || 'Por favor, intente recargar la página.'}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Mostrar imagen por defecto en caso de error
            if (heroSection) {
                console.log('🔧 Aplicando imagen por defecto completamente clara');
                mostrarImagenClara(DEFAULT_IMAGE);
                eliminarOverlayOscuro();
            }
        }
    }

    // Función para normalizar los datos del plato
    function normalizePlato(plato) {
        // Crear una copia del plato para no modificar el original directamente
        const normalized = { ...plato };
        
        // Asegurarse de que el precio y el valor sean números
        const parseNumber = (value) => {
            if (value === undefined || value === null) return undefined;
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
                // Si ya es un string con formato de moneda, limpiarlo
                if (value.startsWith('$')) {
                    value = value.substring(1);
                }
                // Eliminar cualquier caracter que no sea número, punto o coma
                const cleanValue = value.replace(/[^0-9.,]/g, '').replace(',', '.');
                const num = parseFloat(cleanValue);
                return isNaN(num) ? undefined : num;
            }
            return undefined;
        };
        
        // Procesar precio y valor
        const precio = parseNumber(plato.precio);
        const valor = parseNumber(plato.valor);
        const valorFormateado = plato.valor_formateado || '';
        
        // Si tenemos valor_formateado, intentar extraer el valor numérico
        let valorDeFormateado = null;
        if (valorFormateado && typeof valorFormateado === 'string' && valorFormateado.startsWith('$')) {
            const valorLimpio = valorFormateado.replace(/[^0-9.,]/g, '').replace(',', '.');
            valorDeFormateado = parseFloat(valorLimpio);
            if (isNaN(valorDeFormateado)) valorDeFormateado = null;
        }
        
        // Asignar valores normalizados
        // Prioridad: 1. precio, 2. valor, 3. valor_formateado, 4. 0
        normalized.precio = precio !== undefined ? precio : 
                          (valor !== undefined ? valor : 
                          (valorDeFormateado !== null ? valorDeFormateado : 0));
                          
        normalized.valor = valor !== undefined ? valor : 
                         (precio !== undefined ? precio : 
                         (valorDeFormateado !== null ? valorDeFormateado : 0));
        
        // Si el precio es 0 pero tenemos un valor en valor_formateado, usarlo
        if (normalized.precio === 0 && valorDeFormateado !== null) {
            normalized.precio = valorDeFormateado;
            normalized.valor = valorDeFormateado;
        }
        
        // Asegurarse de que el precio sea un número válido
        if (isNaN(normalized.precio)) {
            console.warn(`⚠️ Precio no válido para el plato ${plato.id || 'desconocido'}:`, plato.precio);
            normalized.precio = 0;
            normalized.valor = 0;
        }
        
        // Agregar el valor formateado si no existe
        if (!normalized.valor_formateado && normalized.precio !== undefined) {
            normalized.valor_formateado = `$${normalized.precio.toFixed(2).replace(/\.?0+$/, '')}`;
        }
        
        console.log('🔍 Plato normalizado:', {
            id: normalized.id,
            titulo: normalized.titulo,
            precio: normalized.precio,
            valor: normalized.valor,
            valor_formateado: normalized.valor_formateado,
            tipoPrecio: typeof normalized.precio,
            tipoValor: typeof normalized.valor,
            originalPrecio: plato.precio,
            originalValor: plato.valor,
            valorFormateadoOriginal: plato.valor_formateado
        });
        
        return normalized;
    }

    // Función para renderizar los platos
    function renderPlatos(platos) {
        if (!platosContainer) return;
        
        console.log('🎨 Renderizando platos:', platos);
        
        if (!platos || platos.length === 0) {
            platosContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-white text-lg">No hay platos disponibles en este momento.</p>
                </div>
            `;
            
            // Mostrar imagen por defecto cuando no hay platos
            if (heroSection) {
                console.log('🔧 Aplicando imagen por defecto completamente clara');
                mostrarImagenClara(DEFAULT_IMAGE);
                eliminarOverlayOscuro();
            }
            return;
        }
        
        // Normalizar los datos de los platos
        platosData = platos.map(normalizePlato);
        
        console.log('📊 Platos normalizados:', platosData);
        
        // Mostrar el primer plato si hay datos
        if (platosData.length > 0) {
            console.log('🔄 Mostrando el primer plato de la lista');
            showPlato(0);
        } else {
            // Si no hay platos, mostrar imagen por defecto
            console.log('📷 No hay platos disponibles, mostrando imagen por defecto');
            if (heroSection) {
                console.log('🔧 Aplicando imagen por defecto completamente clara');
                mostrarImagenClara(DEFAULT_IMAGE);
                eliminarOverlayOscuro();
            }
        }
        
        // Si hay más de un plato, iniciar el carrusel
        if (platosData.length > 1) {
            startAutoSlide();
        }
    }

    // Inicializar solo si el contenedor existe
    if (platosContainer) {
        fetchPlatos();
        
        // Pausar el carrusel cuando el mouse está sobre él
        platosContainer.addEventListener('mouseenter', stopAutoSlide);
        platosContainer.addEventListener('mouseleave', () => {
            if (platosData.length > 1) {
                startAutoSlide();
            }
        });
        
        // Soporte para navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                navegarPlato(-1);
            } else if (e.key === 'ArrowRight') {
                navegarPlato(1);
            }
        });
    }

    // Función para verificar el estado actual del hero
    window.checkHeroStatus = function() {
        if (heroSection) {
            console.log('🔍 Estado actual del hero:');
            console.log('  - backgroundImage:', heroSection.style.backgroundImage);
            console.log('  - backgroundSize:', heroSection.style.backgroundSize);
            console.log('  - backgroundPosition:', heroSection.style.backgroundPosition);
            console.log('  - backgroundRepeat:', heroSection.style.backgroundRepeat);
            console.log('  - Elemento completo:', heroSection);
        } else {
            console.error('❌ No se encontró el elemento heroSection');
        }
    };

    // Función para forzar la aplicación de una imagen específica SIN overlay
    window.forceCleanImage = function(imageUrl) {
        console.log('🔧 Forzando aplicación de imagen completamente clara:', imageUrl);
        mostrarImagenClara(imageUrl);
        eliminarOverlayOscuro();
    };

    // Función para monitorear cambios en tiempo real del elemento hero
    window.startHeroMonitoring = function() {
        if (heroSection) {
            console.log('🔍 Iniciando monitoreo del elemento hero...');

            // Monitorear cambios en el elemento
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        console.warn('🚨 ¡CAMBIO DETECTADO! El estilo del hero fue modificado:');
                        console.log('  - Antes:', mutation.oldValue);
                        console.log('  - Ahora:', heroSection.getAttribute('style'));
                        console.log('  - Elemento completo:', heroSection);

                        // Si se detecta un overlay oscuro, limpiarlo inmediatamente
                        const currentStyle = heroSection.getAttribute('style');
                        if (currentStyle && currentStyle.includes('linear-gradient(rgba(0, 0, 0, 0.7)') || currentStyle.includes('rgba(0, 0, 0, 0.7)')) {
                            console.warn('🚨 ¡OVERLAY OSCURO DETECTADO! Limpiando inmediatamente...');
                            const cleanBackground = currentStyle.replace(/linear-gradient\(rgba\(0, 0, 0, 0\.7\), rgba\(0, 0, 0, 0\.75\)\),?\s*/g, '');
                            heroSection.setAttribute('style', cleanBackground);
                            console.log('✅ Overlay oscuro eliminado automáticamente');
                        }
                    }
                });
            });

            observer.observe(heroSection, {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: ['style']
            });

            console.log('✅ Monitoreo iniciado. Se detectará cualquier cambio en el estilo del hero.');
            return observer;
        } else {
            console.error('❌ No se puede iniciar monitoreo: elemento heroSection no encontrado');
    };
    img.src = imageUrl;
    // Forzar la actualización del fondo inmediatamente
    heroSection.style.backgroundImage = `url('${imageUrl}')`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
    heroSection.style.backgroundRepeat = 'no-repeat';
    // Eliminar el overlay oscuro
    heroSection.style.backgroundImage = `url('${imageUrl}')`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
    heroSection.style.backgroundRepeat = 'no-repeat';
}

            // Configuración del observador
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        // Prevenir la aplicación de estilos no deseados
                        if (heroSection && 
                            heroSection.style && 
                            heroSection.style.backgroundImage && 
                            typeof heroSection.style.backgroundImage.includes === 'function' &&
                            heroSection.style.backgroundImage.includes('gradient')) {
                            
                            const cleanImage = heroSection.style.backgroundImage
                                .replace(/linear-gradient\(rgba\(\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]*\),?\s*/, '');
                            heroSection.style.backgroundImage = cleanImage;
                        }
                    }
                });
            });

            try {
                observer.observe(heroSection, {
                    attributes: true,
                    attributeFilter: ['style'],
                    childList: false,
                    subtree: false
                });

                console.log('✅ Protección del elemento hero activada');
                return { 
                    observer: observer, 
                    checkInterval: checkInterval 
                };
            } catch (error) {
                console.error('❌ Error al configurar el observador:', error);
                return null;
            }
        } else {
            console.error('❌ No se puede proteger: elemento heroSection no encontrado');
            return null;
        }
    };

    // Función de emergencia para limpiar completamente el elemento hero
    window.emergencyHeroClean = function() {
        if (heroSection) {
            console.log('🚨 EJECUTANDO LIMPIEZA DE EMERGENCIA DEL HERO...');

            // Limpiar completamente el elemento
            heroSection.removeAttribute('style');
            heroSection.style.cssText = '';

            // Aplicar estilos limpios manualmente
            heroSection.style.backgroundImage = 'none';
            heroSection.style.background = 'none';
            heroSection.style.backgroundColor = 'transparent';

            // Forzar limpieza después de un pequeño delay
            setTimeout(() => {
                heroSection.style.backgroundImage = 'none';
                heroSection.style.background = 'none';
                heroSection.style.backgroundColor = 'transparent';
                console.log('✅ Limpieza de emergencia completada');
            }, 50);

            return true;
        } else {
            console.error('❌ No se puede limpiar: elemento heroSection no encontrado');
            return false;
        }
    };

    // Función para diagnosticar problemas potenciales del navegador
    window.diagnoseBrowserIssues = function() {
        console.log('🔍 DIAGNOSTICANDO POSIBLES PROBLEMAS DEL NAVEGADOR...');

        const results = {
            userAgent: navigator.userAgent,
            vendor: navigator.vendor,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            language: navigator.language,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'No disponible'
        };

        console.table(results);

        // Detectar extensiones potencialmente problemáticas
        if (window.chrome && chrome.runtime && chrome.runtime.onConnect) {
            console.warn('⚠️ Se detectó Chrome extension API - podría haber extensiones interfiriendo');
        }

        // Verificar si hay scripts externos cargados
        const scripts = document.querySelectorAll('script[src]');
        console.log(`📊 Scripts externos cargados: ${scripts.length}`);
        scripts.forEach((script, index) => {
            console.log(`  ${index + 1}. ${script.src}`);
        });

        return results;
    };

    // Función para inicializar todas las protecciones automáticamente
    window.initHeroProtection = function() {
        console.log('🚀 INICIALIZANDO PROTECCIONES AVANZADAS DEL HERO...');

        // 1. Iniciar monitoreo en tiempo real
        const monitoring = window.startHeroMonitoring ? window.startHeroMonitoring() : null;

        // 2. Iniciar protección contra modificaciones externas
        const protection = window.protectHeroElement ? window.protectHeroElement() : null;

        // 3. Iniciar corrección automática de overlays oscuros
        const autoCorrection = window.iniciarCorreccionAutomatica ? window.iniciarCorreccionAutomatica() : null;

        // 4. Diagnosticar posibles problemas del navegador
        const diagnosis = window.diagnoseBrowserIssues ? window.diagnoseBrowserIssues() : null;

        console.log('✅ Todas las protecciones inicializadas correctamente');
        console.log('🔧 Funciones disponibles:');
        console.log('  - checkHeroStatus() - Ver estado actual');
        console.log('  - forceCleanImage(url) - Forzar imagen limpia');
        console.log('  - clearHeroBackground() - Limpiar fondo');
        console.log('  - emergencyHeroClean() - Limpieza de emergencia');
        console.log('  - stopHeroMonitoring(monitoring) - Detener monitoreo');
        console.log('  - stopHeroProtection(protection) - Detener protección');
        console.log('  - autoCorrection.detener() - Detener corrección automática');

        return { monitoring, protection, autoCorrection, diagnosis };
    };

    // Auto-inicializar las protecciones cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Pequeño delay para asegurar que todo esté cargado
            setTimeout(() => {
                if (window.initHeroProtection) {
                    window.initHeroProtection();
                }
            }, 100);
        });
    } else {
        // DOM ya cargado, inicializar inmediatamente
        setTimeout(() => {
            if (window.initHeroProtection) {
                window.initHeroProtection();
            }
        }, 100);
    }
});

// Inicialización segura de las funciones globales
if (typeof window !== 'undefined') {
    window.emergencyHeroClean = window.emergencyHeroClean || function() {
        console.warn('Función emergencyHeroClean no está implementada');
    };
    
    window.initHeroProtection = window.initHeroProtection || function() {
        console.warn('Función initHeroProtection no está implementada');
        return { monitoring: null, protection: null, autoCorrection: null, diagnosis: null };
    };
}