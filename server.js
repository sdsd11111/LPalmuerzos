require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000; // Cambiado a 3000 para desarrollo local
const isProduction = process.env.NODE_ENV === 'production';

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Función para verificar y crear el bucket si no existe
async function ensureBucketExists() {
  try {
    console.log('Verificando si el bucket "platos" existe...');
    const { data: bucketExists } = await supabase.storage.getBucket('platos');
    
    if (!bucketExists) {
      console.log('El bucket "platos" no existe, creándolo...');
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('platos', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 1024 * 1024 * 5, // 5MB
      });
      
      if (createError) {
        console.error('Error al crear el bucket:', createError);
        if (createError.message.includes('already exists')) {
          console.log('El bucket ya existe, continuando...');
        } else {
          throw createError;
        }
      } else {
        console.log('Bucket "platos" creado exitosamente');
      }
    } else {
      console.log('El bucket "platos" ya existe');
    }
  } catch (error) {
    console.error('Error al verificar/crear el bucket:', error);
  }
}

// Función para configurar las políticas del bucket
async function configureBucketPolicies() {
  try {
    console.log('Configurando políticas del bucket "platos"...');
    
    // Política de lectura pública
    const { error: readPolicyError } = await supabase.rpc('create_or_update_policy', {
      policy_name: 'Permitir lectura pública',
      table_name: 'objects',
      using: "bucket_id = 'platos'",
      with_check: "bucket_id = 'platos'"
    });
    
    if (readPolicyError) {
      if (!readPolicyError.message.includes('already exists')) {
        console.error('Error al configurar política de lectura:', readPolicyError);
      } else {
        console.log('Política de lectura ya configurada');
      }
    } else {
      console.log('Política de lectura configurada correctamente');
    }
    
    // Política de subida para autenticados
    const { error: uploadPolicyError } = await supabase.rpc('create_or_update_policy', {
      policy_name: 'Permitir subida a autenticados',
      table_name: 'objects',
      using: "bucket_id = 'platos' AND auth.role() = 'authenticated'",
      with_check: "bucket_id = 'platos' AND auth.role() = 'authenticated'"
    });
    
    if (uploadPolicyError) {
      if (!uploadPolicyError.message.includes('already exists')) {
        console.error('Error al configurar política de subida:', uploadPolicyError);
      } else {
        console.log('Política de subida ya configurada');
      }
    } else {
      console.log('Política de subida configurada correctamente');
    }
    
  } catch (error) {
    console.error('Error al configurar políticas:', error);
  }
}

// Llamar a las funciones al iniciar el servidor
async function initializeApp() {
  await ensureBucketExists();
  await configureBucketPolicies();
  
  // Iniciar el servidor
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${isProduction ? 'producción' : 'desarrollo'}`);
    console.log(`🔗 Supabase: ${process.env.SUPABASE_URL ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`📂 Directorio público: ${publicPath}`);
    console.log('='.repeat(60));
  });
}

// Iniciar la aplicación
initializeApp().catch(console.error);

// Configurar Multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, PNG, etc.)'), false);
    }
  },
});

// Middleware para manejar errores de Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer (ej: archivo muy grande)
    return res.status(400).json({
      error: 'Error al procesar el archivo',
      details: err.message
    });
  } else if (err) {
    // Otros errores
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: err.message
    });
  }
  next();
});

// Middleware de logs
app.use(morgan('dev'));

// Middleware para parsear JSON
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Add middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if ((req.method === 'POST' || req.method === 'PUT') && req.path === '/api/platos') {
    console.log('=== INICIO DE SOLICITUD', req.method, req.path, '===');
    console.log('Headers:', req.headers);
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file ? 'Sí' : 'No');
  }
  next();
});

// Configuración de CORS
console.log('Configurando CORS...');
const corsOptions = {
  origin: function (origin, callback) {
    // En producción, permite cualquier origen
    if (process.env.NODE_ENV === 'production') {
      console.log('Permitiendo cualquier origen en producción');
      return callback(null, true);
    }
    
    // En desarrollo, permite localhost y la URL de Vercel
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:9000',
      'https://sartenes.vercel.app',
      'https://sartenes-git-main-cristhopheryeah113.vercel.app',
      /^\.*\.vercel\.app$/, // Permite cualquier subdominio de vercel.app
      /^http:\/\/localhost:\d+$/ // Permite cualquier puerto localhost
    ];
    
    console.log('Origen de la solicitud:', origin || 'No especificado');
    
    // Si no hay origen (puede pasar con solicitudes no navegador, como Postman)
    if (!origin) {
      console.log('Permitiendo solicitud sin origen (probablemente no es del navegador)');
      return callback(null, true);
    }
    
    // Verificar si el origen está permitido
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn('Origen no permitido por CORS:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Content-Length'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'Content-Type'],
  maxAge: 86400 // 24 hours
};

// Aplicar CORS a todas las rutas
console.log('Aplicando middleware CORS...');
app.use(cors(corsOptions));

// Middleware para manejar preflight requests
app.options('*', cors(corsOptions));

// Middleware para loggear todas las solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware para manejar preflight requests
app.options('*', cors(corsOptions));

// Middleware para agregar headers CORS manualmente si es necesario
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Responder inmediatamente a las solicitudes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Parsear JSON y datos de formulario
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para log de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Configuración de archivos estáticos
const publicPath = path.join(__dirname, 'public');

// Configuración específica para producción
if (isProduction) {
  console.log('Ejecutando en modo producción');
  // Asegurarse de que las rutas sean correctas en producción
  app.set('trust proxy', 1);
}

// Crear directorio público si no existe
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

// Configuración para servir archivos estáticos
const staticOptions = {
  setHeaders: (res, path) => {
    // Configurar cabeceras de caché para archivos estáticos
    if (path.match(/\.(js|css|json|xml)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    } else if (path.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico)$/i)) {
      // No cache for images in development
      if (!isProduction) {
        res.setHeader('Cache-Control', 'no-store');
      }
    }
  }
};

// Servir archivos estáticos desde la carpeta public
app.use(express.static(publicPath, staticOptions));

// Ruta específica para los componentes
app.use('/components', express.static(path.join(__dirname, 'public', 'components'), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

// Servir archivos estáticos desde la raíz del proyecto para desarrollo
if (!isProduction) {
  app.use(express.static(__dirname, staticOptions));
}

// Ruta para manejar los archivos HTML de los platos
app.get('/menu/platos/:plato', (req, res) => {
  // Asegurarse de que el nombre del archivo termine con .html
  const plato = req.params.plato.endsWith('.html') ? req.params.plato : `${req.params.plato}.html`;
  const filePath = path.join(publicPath, 'menu', 'platos', plato);
  
  console.log(`Buscando archivo de plato: ${filePath}`);
  
  // Verificar si el archivo existe
  if (fs.existsSync(filePath)) {
    console.log(`Enviando archivo: ${filePath}`);
    return res.sendFile(filePath);
  } else {
    console.log(`Archivo no encontrado: ${filePath}`);
    return res.status(404).sendFile(path.join(publicPath, '404.html'));
  }
});

// Ruta para el panel de administración
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(publicPath, 'admin', 'index.html'));
});

// Ruta para servir archivos estáticos
app.get('*', (req, res, next) => {
  // Si la ruta comienza con /api, pasar al siguiente middleware
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Si es un archivo estático (tiene extensión), intentar servirlo
  if (req.path.match(/\.[^/]+$/)) {
    const filePath = path.join(publicPath, req.path);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    return res.status(404).end();
  }
  
  // Para cualquier otra ruta, servir index.html (para SPA)
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Ruta para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV || 'development',
    supabase_configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
  });
});

// Ruta para el favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(publicPath, 'images', 'favicon.ico'));
});

// Ruta para el admin - manejar tanto /admin como /admin/
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(publicPath, 'admin', 'index.html'));
});

// Ruta para los archivos estáticos del admin
app.use('/admin', express.static(path.join(publicPath, 'admin'), {
  setHeaders: (res, path) => {
    // Configurar cabeceras de caché para archivos estáticos
    if (path.match(/\.(js|css|json|xml)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Ruta específica para las páginas de platos (código eliminado por ser una ruta duplicada)

// Capturar cualquier otra ruta bajo /admin y servir el index.html
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(publicPath, 'admin', 'index.html'));
});

// Ruta para los componentes
app.get('/components/*', (req, res) => {
  const filePath = path.join(publicPath, req.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Archivo no encontrado');
  }
});

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'public', 'images', 'platos');
    if (!fs.existsSync(dir)) { 
      fs.mkdirSync(dir, { recursive: true }); 
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const titulo = (req.body.titulo || 'plato').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    cb(null, titulo + path.extname(file.originalname).toLowerCase());
  }
});

// Rutas de la API
app.get('/api/test', (req, res) => {
  res.json({ message: '¡API funcionando correctamente con Supabase!' });
});

// Middleware para log de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if ((req.method === 'POST' || req.method === 'PUT') && req.path === '/api/platos') {
    console.log('=== INICIO DE SOLICITUD', req.method, req.path, '===');
    console.log('Headers:', req.headers);
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file ? 'Sí' : 'No');
  }
  next();
});

// Ruta para crear un nuevo plato
app.post('/api/platos', upload.single('imagen'), async (req, res) => {
  console.log('=== INICIO DE SOLICITUD POST /api/platos ===');
  console.log('Headers:', req.headers);
  
  // Mostrar los campos del body recibidos directamente
  console.log('Body recibido (raw):', req.body);
  
  // Si hay un archivo, mostrarlo
  console.log('Archivo recibido:', req.file ? 'Sí' : 'No');
  
  try {
    // Procesar la imagen si se subió
    let imagen_url = null;
    
    if (req.file) {
      try {
        console.log('Procesando imagen...');
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        // Usar solo el nombre del archivo, sin la carpeta 'platos' ya que ya está en el bucket
        const filePath = fileName;

        console.log('Subiendo imagen a Supabase Storage...');
        const { error: uploadError } = await supabase.storage
          .from('platos')
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
            cacheControl: '3600'
          });

        if (uploadError) {
          console.error('Error al subir la imagen a Supabase:', uploadError);
          return res.status(500).json({ 
            error: 'Error al subir la imagen',
            details: uploadError.message 
          });
        }

        // Obtener la URL pública de la imagen
        const { data: { publicUrl } } = supabase.storage
          .from('platos')
          .getPublicUrl(filePath);

        console.log('Imagen subida correctamente. URL:', publicUrl);
        // Asegurarse de que la URL no tenga 'platos' duplicado
        imagen_url = publicUrl.replace('/platos/platos/', '/platos/');
      } catch (uploadError) {
        console.error('Error al procesar la imagen:', uploadError);
        return res.status(500).json({ 
          error: 'Error al procesar la imagen',
          details: uploadError.message 
        });
      }
    }
    
    // Parsear los campos del formulario
    let titulo, descripcion, precio, activo, id;
    
    // Mostrar los campos recibidos en el body
    console.log('Campos recibidos en el body:');
    for (let key in req.body) {
      console.log(`- ${key}:`, req.body[key]);
    }
    
    // Usar body-parser para analizar el cuerpo de la solicitud
    titulo = req.body.titulo ? req.body.titulo.trim() : '';
    descripcion = req.body.descripcion ? req.body.descripcion.trim() : '';
    
    // Intentar obtener el precio de 'precio' o 'valor'
    precio = req.body.precio || req.body.valor;
    
    // Manejar el valor de 'activo' de diferentes formatos
    activo = (
      req.body.activo === true || 
      req.body.activo === 'true' || 
      req.body.activo === '1' || 
      req.body.activo === 'on' ||
      req.body.activo === 1
    );
    
    id = req.body.id;
    
    console.log('Datos recibidos:', { titulo, descripcion, precio, activo, id });
    console.log('Archivo subido:', req.file ? 'Sí' : 'No');
    
    // Validar campos requeridos
    if (!titulo) {
      console.error('Error: El título es requerido');
      return res.status(400).json({ 
        error: 'El título es requerido',
        field: 'titulo'
      });
    }
    
    // Validar que el precio sea un número válido
    if (precio === undefined || precio === null || precio === '') {
      console.error('Error: El precio es requerido');
      return res.status(400).json({ 
        error: 'El precio es requerido',
        field: 'precio'
      });
    }
    
    const platoId = id && id !== 'undefined' ? id : null;
    
    // imagen_url ya está establecida por el procesamiento de Supabase Storage
    // Si no se subió una nueva imagen, usar la existente del body si existe
    if (!imagen_url && req.body.imagen_url) {
      imagen_url = req.body.imagen_url;
      console.log('Usando imagen existente:', imagen_url);
    }
    
    // Validar campos requeridos
    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ 
        error: 'El título es requerido',
        field: 'titulo'
      });
    }
    
    // Validar que el precio sea un número válido
    if (precio === undefined || precio === null || precio === '') {
      console.error('Error: El precio es requerido');
      return res.status(400).json({ 
        error: 'El precio es requerido',
        field: 'precio'
      });
    }

    let precioNumerico;
    try {
      precioNumerico = parseFloat(precio);
      if (isNaN(precioNumerico) || precioNumerico < 0) {
        throw new Error('Precio inválido');
      }
    } catch (error) {
      console.error('Error al procesar el precio:', error);
      return res.status(400).json({ 
        error: 'El precio debe ser un número válido mayor o igual a 0',
        field: 'precio'
      });
    }
    
    // Redondear a 2 decimales
    const precioFinal = Math.round(precioNumerico * 100) / 100;
    
    const platoData = { 
      titulo: titulo.trim(), 
      descripcion: (descripcion || '').trim(),
      precio: precioFinal,
      activo: activo === 'on' || activo === true || activo === 'true' || activo === '1' || activo === 1,
      ...(imagen_url ? { imagen_url } : {})
    };
    
    console.log('Datos del plato a guardar:', JSON.stringify(platoData, null, 2));
    
    console.log('Datos procesados del plato:', platoData);
    
    console.log('Datos del plato a guardar:', JSON.stringify(platoData, null, 2));
    
    // Si hay un ID, actualizamos el plato existente
    if (platoId) {
      console.log('Actualizando plato existente con ID:', platoId);
      
      // Verificar si el plato existe
      const { data: existingPlato, error: fetchError } = await supabase
        .from('platos')
        .select('*')
        .eq('id', platoId)
        .single();
        
      if (fetchError || !existingPlato) {
        console.error('Error al buscar el plato existente:', fetchError);
        return res.status(404).json({ 
          error: 'Plato no encontrado',
          details: fetchError?.message
        });
      }
      
      // Actualizar el plato
      const { data, error: updateError } = await supabase
        .from('platos')
        .update(platoData)
        .eq('id', platoId)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error al actualizar en Supabase:', updateError);
        throw updateError;
      }
      
      console.log('Plato actualizado exitosamente:', data);
      return res.json(data);
    } 
    // Si no hay ID, creamos un nuevo plato
    else {
      console.log('Creando nuevo plato...');
      try {
        const { data, error: insertError } = await supabase
          .from('platos')
          .insert([platoData])
          .select()
          .single();
          
        if (insertError) {
          console.error('Error al insertar en Supabase:', insertError);
          throw insertError;
        }
        
        console.log('Nuevo plato creado exitosamente:', data);
        return res.status(201).json(data);
      } catch (dbError) {
        console.error('Error en la base de datos:', dbError);
        throw new Error(`Error al guardar en la base de datos: ${dbError.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Error al guardar el plato:', error);
    
    // Si se subió un archivo pero hubo un error, eliminarlo
    if (req.file) {
      const filePath = path.join(__dirname, 'public', 'images', 'platos', req.file.filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Archivo temporal eliminado debido a un error:', filePath);
        }
      } catch (fileError) {
        console.error('Error al eliminar el archivo temporal:', fileError);
      }
    }
    
    // Determinar el código de estado adecuado
    const statusCode = error.statusCode || 500;
    
    // Crear objeto de error de respuesta
    const errorResponse = {
      error: error.message || 'Error al guardar el plato',
      details: error.details || error.toString(),
      code: error.code,
      hint: error.hint,
      timestamp: new Date().toISOString()
    };
    
    // Si es un error de validación, incluir campos adicionales
    if (error.errors) {
      errorResponse.errors = error.errors;
    }
    
    console.error('Enviando respuesta de error:', JSON.stringify(errorResponse, null, 2));
    
    res.status(statusCode).json(errorResponse);
  } finally {
    console.log('=== FIN DE SOLICITUD POST /api/platos ===\n');
  }
});

// Eliminar un plato
app.delete('/api/platos/:id', async (req, res) => {
  try {
    const platoId = req.params.id;
    if (!platoId) {
      return res.status(400).json({ error: 'Se requiere el ID del plato' });
    }

    console.log('Eliminando plato con ID:', platoId);
    
    // Primero obtenemos el plato para poder eliminar su imagen si existe
    const { data: plato, error: fetchError } = await supabase
      .from('platos')
      .select('*')
      .eq('id', platoId)
      .single();

    if (fetchError) throw fetchError;
    
    // Si el plato tiene una imagen, intentamos eliminarla
    if (plato && plato.imagen_url) {
      try {
        const imagePath = path.join(__dirname, 'public', plato.imagen_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Imagen eliminada:', imagePath);
        }
      } catch (fileError) {
        console.error('Error al eliminar la imagen del plato:', fileError);
        // Continuamos con la eliminación del registro aunque falle la eliminación de la imagen
      }
    }
    
    // Eliminamos el registro de la base de datos
    const { error: deleteError } = await supabase
      .from('platos')
      .delete()
      .eq('id', platoId);

    if (deleteError) throw deleteError;
    
    console.log('Plato eliminado exitosamente');
    res.status(200).json({ message: 'Plato eliminado correctamente' });
    
  } catch (error) {
    console.error('❌ Error al eliminar el plato:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el plato',
      details: error.message 
    });
  }
});

// Actualizar un plato existente
app.put('/api/platos/:id', upload.single('imagen'), async (req, res) => {
  let oldImagePath = null;
  
  try {
    const platoId = req.params.id;
    if (!platoId) {
      return res.status(400).json({ error: 'Se requiere el ID del plato' });
    }

    console.log('=== INICIO DE ACTUALIZACIÓN DE PLATO ===');
    console.log('Plato ID:', platoId);
    console.log('Cuerpo de la solicitud:', req.body);
    console.log('Archivo recibido:', req.file);
    
    // Obtener el plato actual primero
    const { data: existingPlato, error: fetchError } = await supabase
      .from('platos')
      .select('*')
      .eq('id', platoId)
      .single();
      
    if (fetchError) {
      console.error('Error al obtener el plato existente:', fetchError);
      throw fetchError;
    }
    
    console.log('Plato existente:', existingPlato);
    
    // Determinar si es solo actualización de estado activo/desactivo
    const isOnlyUpdatingActive = req.body.activo !== undefined && Object.keys(req.body).length === 1;
    
    // Inicializar datos del plato con valores existentes
    let platoData = { ...existingPlato };
    
    // Actualizar solo los campos que se están enviando
    if (req.body.titulo !== undefined) platoData.titulo = req.body.titulo;
    if (req.body.descripcion !== undefined) platoData.descripcion = req.body.descripcion;
    
    // Manejar el precio
    if (req.body.precio !== undefined) {
      const precio = parseFloat(req.body.precio);
      if (isNaN(precio)) {
        throw new Error('El precio debe ser un número válido');
      }
      platoData.precio = precio;
    }
    
    // Manejar el estado activo
    if (req.body.activo !== undefined) {
      platoData.activo = (req.body.activo === 'on' || req.body.activo === true || req.body.activo === 'true');
    }
    
    console.log('Datos actualizados del plato:', platoData);
    
    // Si es solo actualización de estado activo/desactivo, actualizar solo ese campo
    if (isOnlyUpdatingActive) {
      platoData.activo = req.body.activo === true || req.body.activo === 'true';
      console.log('Actualizando solo el estado activo a:', platoData.activo);
      
      // Actualizar solo el campo activo en la base de datos
      const { data: updatedPlato, error: updateError } = await supabase
        .from('platos')
        .update({ 
          activo: platoData.activo
        })
        .eq('id', platoId)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      console.log('Estado activo actualizado exitosamente:', updatedPlato);
      return res.json(updatedPlato);
    }
    
    // Manejo de la imagen
    if (req.file) {
      // Si se sube una nueva imagen
      platoData.imagen_url = '/images/platos/' + req.file.filename;
      
      // Guardar la ruta de la imagen anterior para eliminarla después
      if (existingPlato && existingPlato.imagen_url) {
        oldImagePath = path.join(__dirname, 'public', existingPlato.imagen_url);
      }
    } else if (req.body.imagen_url === '' || req.body.imagen_url === null || req.body.imagen_url === 'null') {
      // Si se envía una cadena vacía o null, eliminar la imagen
      platoData.imagen_url = null;
      
      // Guardar la ruta de la imagen anterior para eliminarla después
      if (existingPlato && existingPlato.imagen_url) {
        oldImagePath = path.join(__dirname, 'public', existingPlato.imagen_url);
      }
    }
    // Si no hay cambios en la imagen, mantener la existente
    
    console.log('Actualizando plato con datos:', platoData);
    
    console.log('Intentando actualizar en Supabase con datos:', platoData);
    
    // Preparar los datos para actualizar
    const updateData = {
      titulo: platoData.titulo,
      descripcion: platoData.descripcion,
      precio: platoData.precio,
      activo: platoData.activo
    };
    
    // Si hay una nueva URL de imagen, incluirla
    if (platoData.imagen_url !== undefined) {
      updateData.imagen_url = platoData.imagen_url;
    }
    
    console.log('Actualizando plato con datos:', updateData);
    
    // Actualizar el plato en la base de datos
    const { data: updatedPlato, error: updateError } = await supabase
      .from('platos')
      .update(updateData)
      .eq('id', platoId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error al actualizar en Supabase:', {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
        status: updateError.status
      });
      throw updateError;
    }
    
    // Si la actualización fue exitosa y hay una imagen anterior, eliminarla
    if (oldImagePath && fs.existsSync(oldImagePath)) {
      try {
        fs.unlinkSync(oldImagePath);
        console.log('Imagen anterior eliminada:', oldImagePath);
      } catch (fileError) {
        console.error('Error al eliminar la imagen anterior:', fileError);
        // No fallamos la operación si no se puede eliminar la imagen anterior
      }
    }
    
    console.log('Plato actualizado exitosamente:', updatedPlato);
    res.json(updatedPlato);
    
  } catch (error) {
    console.error('❌ Error al actualizar el plato:', error);
    
    // Si hubo un error y se subió un archivo, eliminarlo
    if (req.file) {
      const tempPath = path.join(__dirname, 'public', 'images', 'platos', req.file.filename);
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
          console.log('Archivo temporal eliminado debido a un error:', tempPath);
        } catch (fileError) {
          console.error('Error al eliminar el archivo temporal:', fileError);
        }
      }
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar el plato',
      details: error.message 
    });
  }
});

// Obtener un plato por ID
app.get('/api/platos/:id', async (req, res) => {
  try {
    const platoId = req.params.id;
    if (!platoId) {
      return res.status(400).json({ error: 'Se requiere el ID del plato' });
    }
    
    console.log('Obteniendo plato con ID:', platoId);
    
    const { data: plato, error } = await supabase
      .from('platos')
      .select('*')
      .eq('id', platoId)
      .single();
      
    if (error) throw error;
    
    if (!plato) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    
    console.log('Plato encontrado:', plato);
    res.json(plato);
    
  } catch (error) {
    console.error('❌ Error al obtener el plato:', error);
    res.status(500).json({ 
      error: 'Error al obtener el plato',
      details: error.message 
    });
  }
});

// Obtener todos los platos para el panel de administración
app.get('/api/platos', async (req, res) => {
  try {
    console.log('Solicitando lista de platos...');
    
    // Verificar la conexión con Supabase
    if (!supabase) {
      console.error('Error: Supabase no está configurado correctamente');
      return res.status(500).json({ 
        error: 'Error de configuración del servidor',
        details: 'Supabase no está configurado correctamente'
      });
    }
    
    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .order('id', { ascending: false }); // Ordenar por ID descendente por defecto

    if (error) {
      console.error('Error en la consulta a Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      return res.status(500).json({ 
        error: 'Error al consultar la base de datos',
        details: error.message,
        code: error.code
      });
    }
    
    if (!data || !Array.isArray(data)) {
      console.warn('La respuesta de Supabase no es un arreglo:', data);
      return res.json([]);
    }
    
    console.log(`Se encontraron ${data.length} platos`);
    
    // Mapear los campos para el frontend
    const platos = data.map(item => ({
      id: item.id,
      titulo: item.titulo || 'Sin título',
      descripcion: item.descripcion || '',
      valor: item.precio || 0,
      activo: item.activo !== false, // Por defecto true si no está definido
      imagen_url: item.imagen_url || ''
    }));
    
    // Asegurarse de que la respuesta sea siempre un arreglo
    return res.json(platos || []);
    
  } catch (error) {
    console.error('❌ Error inesperado al cargar platos:', {
      message: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({ 
      error: 'Error inesperado al cargar los platos',
      details: error.message 
    });
  }
});

// Obtener platos activos para la vista pública
app.get('/api/platos-activos', async (req, res) => {
  try {
    console.log('Solicitando platos activos...');
    
    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .eq('activo', true)
      .order('id', { ascending: false }); // Ordenar por ID descendente para mostrar los más recientes primero

    if (error) {
      console.error('Error en la consulta a Supabase:', error);
      throw error;
    }
    
    if (!data || !Array.isArray(data)) {
      console.warn('La respuesta de Supabase no es un arreglo:', data);
      return res.json([]);
    }
    
    console.log(`Se encontraron ${data.length} platos activos`);
    
    // Mapear los campos para la vista pública
    const platos = data.map(item => {
      // Asegurar que el valor sea un número válido
      let valor = 0;
      if (item.valor !== undefined && item.valor !== null) {
        // Si es un número, usarlo directamente
        if (typeof item.valor === 'number') {
          valor = item.valor;
        } 
        // Si es un string, intentar convertirlo a número
        else if (typeof item.valor === 'string') {
          // Eliminar cualquier caracter que no sea número o punto decimal
          const valorLimpio = item.valor.replace(/[^0-9.]/g, '');
          valor = parseFloat(valorLimpio) || 0;
        }
      }
      
      // Usar el precio si existe, de lo contrario usar el valor
      let precioFinal = 0;
      
      // Si hay un precio definido, usarlo como valor principal
      if (item.precio !== undefined && item.precio !== null) {
          precioFinal = typeof item.precio === 'number' ? 
                      item.precio : 
                      (typeof item.precio === 'string' ? parseFloat(item.precio.replace(/[^0-9.]/g, '')) || 0 : 0);
      } 
      // Si no hay precio pero sí hay valor, usarlo
      else if (valor !== undefined && valor !== null) {
          precioFinal = valor;
      }
      
      // Asegurarse de que el precio sea un número válido
      precioFinal = isNaN(precioFinal) ? 0 : precioFinal;
      
      // Crear el objeto de respuesta
      const platoResponse = {
        id: item.id,
        titulo: item.titulo || 'Sin título',
        descripcion: item.descripcion || '',
        precio: precioFinal,
        // Asegurarse de que valor sea igual a precioFinal si precioFinal es diferente de 0
        valor: precioFinal !== 0 ? precioFinal : valor,
        // Mantener el valor como string formateado
        valor_formateado: `$${precioFinal.toFixed(2)}`,
        imagen_url: item.imagen_url || '',
        // Asegurarse de que la URL de la imagen sea accesible en Supabase Storage
        imagen_url_completa: item.imagen_url 
          ? item.imagen_url.includes('supabase.co/storage/') 
            ? item.imagen_url.replace('/platos/platos/', '/platos/') // Corregir doble 'platos' en la URL
            : item.imagen_url.startsWith('http')
              ? item.imagen_url
              : `https://slsdowttijjlwdexzkum.supabase.co/storage/v1/object/public/platos/${item.imagen_url}`
          : ''
      };
      
      console.log('🔍 URL de la imagen del plato:', {
        id: item.id,
        titulo: item.titulo,
        imagen_url: item.imagen_url,
        imagen_url_completa: platoResponse.imagen_url_completa
      });
      
      console.log('📋 Datos del plato enviados al frontend:', {
        id: platoResponse.id,
        titulo: platoResponse.titulo,
        precio: platoResponse.precio,
        valor: platoResponse.valor,
        valor_formateado: platoResponse.valor_formateado
      });
      
      return platoResponse;
    });
    
    // Ordenar por ID de forma descendente para mostrar los más recientes primero
    platos.sort((a, b) => b.id - a.id);
    
    res.json(platos);
    
  } catch (error) {
    console.error('❌ Error al obtener platos activos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los platos',
      details: error.message 
    });
  }
});

// Ruta para el panel de administración
app.get('/admin*', (req, res) => {
  // Try to serve from admin directory first (development)
  const adminPath = path.join(__dirname, 'admin', 'index.html');
  const publicAdminPath = path.join(__dirname, 'public', 'admin', 'index.html');
  
  // Check if the file exists in either location
  const fileToServe = fs.existsSync(publicAdminPath) ? publicAdminPath : 
                     fs.existsSync(adminPath) ? adminPath : null;
  
  if (!fileToServe) {
    console.error('No se pudo encontrar el archivo del panel de administración en ninguna ubicación');
    return res.status(404).send('Panel de administración no encontrado');
  }
  
  console.log(`Sirviendo panel de administración desde: ${fileToServe}`);
  res.sendFile(fileToServe, (err) => {
    if (err) {
      console.error('Error al cargar el panel de administración:', err);
      res.status(500).send('Error al cargar el panel de administración');
    }
  });
});

// Servir archivos estáticos para rutas no manejadas por la API
app.use((req, res, next) => {
  // Si la solicitud comienza con /api, devolver 404
  if (req.path.startsWith('/api/')) {
    console.warn(`Ruta API no encontrada: ${req.method} ${req.originalUrl}`);
    return res.status(404).json({ 
      error: 'Endpoint no encontrado',
      path: req.path 
    });
  }
  
  // Si no es una ruta de API, servir archivos estáticos
  next();
});

// Ruta para la página principal
app.get('*', (req, res, next) => {
  // Si es una ruta de API, continuar al siguiente middleware
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Si es un archivo estático, continuar al siguiente middleware
  if (req.path.match(/\.(js|css|json|xml|jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)$/)) {
    return next();
  }
  
  // Intentar servir el archivo solicitado
  const filePath = path.join(publicPath, req.path);
  
  // Si el archivo existe, servirlo
  if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {
    return res.sendFile(filePath);
  }
  
  // Si no es un archivo, servir el index.html (para SPA)
  const indexPath = path.join(publicPath, 'index.html');
  
  // Verificar si el archivo index.html existe
  if (!fs.existsSync(indexPath)) {
    console.error('Archivo index.html no encontrado en:', indexPath);
    return res.status(500).send('Error interno del servidor: archivo de inicio no encontrado');
  }
  
  // Enviar el archivo index.html
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error al cargar la página principal:', err);
      res.status(500).send('Error al cargar la página principal');
    }
  });
});

// Middleware para manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  
  // Si los encabezados ya se enviaron, delegar al manejador de errores predeterminado de Express
  if (res.headersSent) {
    return next(err);
  }
  
  // Enviar respuesta de error
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  const env = process.env.NODE_ENV || 'development';
  
  console.log('='.repeat(60));
  console.log(`🚀 Servidor iniciado en http://${host}:${port}`);
  console.log(`🌍 Entorno: ${env}`);
  console.log(`🔗 Supabase: ${process.env.SUPABASE_URL ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`📂 Directorio público: ${path.join(__dirname, 'public')}`);
  console.log(`📂 Directorio de imágenes: ${path.join(__dirname, 'public', 'images', 'platos')}`);
  console.log('='.repeat(60));
  
  // Verificar directorios importantes
  const dirsToCheck = [
    { path: path.join(__dirname, 'public'), name: 'Público' },
    { path: path.join(__dirname, 'public', 'images', 'platos'), name: 'Imágenes de platos' },
    { path: path.join(__dirname, 'admin'), name: 'Admin' }
  ];
  
  dirsToCheck.forEach(dir => {
    const exists = fs.existsSync(dir.path);
    const writable = exists ? (fs.statSync(dir.path).mode & 0o200) !== 0 : false;
    console.log(`📂 ${dir.name}: ${exists ? '✅ Existe' : '❌ No existe'} ${exists ? (writable ? '(Escritura habilitada)' : '(Solo lectura)') : ''}`);
  });
  
  console.log('='.repeat(60));
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
  
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  // Mensajes de error amigables
  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requiere privilegios elevados`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind} ya está en uso`);
      console.log(`💡 Intenta usar un puerto diferente configurando la variable de entorno PORT`);
      process.exit(1);
      break;
    default:
      console.error('❌ Error desconocido:', error);
      throw error;
  }
});

// Manejo de cierre limpio
process.on('SIGTERM', () => {
  console.log('\n🔽 Recibida señal SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('👋 Servidor cerrado');
    process.exit(0);
  });
  
  // Forzar cierre después de 5 segundos si es necesario
  setTimeout(() => {
    console.error('⚠️ Forzando cierre del servidor...');
    process.exit(1);
  }, 5000);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  console.error('⚠️ Excepción no capturada:', error);
  // No salir del proceso en desarrollo para permitir la depuración
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Manejo de promesas rechazadas no manejadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Promesa rechazada no manejada:', reason);
  // Opcional: registrar el error o cerrar recursos
});
