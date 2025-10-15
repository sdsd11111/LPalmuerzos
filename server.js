require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // En producción, permite cualquier origen
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    // En desarrollo, permite localhost y la URL de Vercel
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:9000',
      'https://lp-almuerzos.vercel.app',
      'https://sartenes.vercel.app'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Content-Length'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'Content-Type'],
  maxAge: 86400 // 24 hours
};

// Configuración de express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para loggear todas las solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Aplicar CORS a todas las rutas
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware para agregar headers CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:9000',
    'https://lp-almuerzos.vercel.app',
    'https://sartenes.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar, Content-Type');
  
  // Responder inmediatamente a las solicitudes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware de manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('❌ Error en el servidor:', err);
  
  // Manejar errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // Manejar errores de autenticación
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'No autorizado',
      message: err.message || 'Token inválido o expirado',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // Manejar errores de base de datos
  if (err.code === '23505') { // Violación de restricción única en PostgreSQL
    return res.status(409).json({
      error: 'Conflicto',
      message: 'El recurso ya existe',
      details: err.detail,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // Error genérico del servidor
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Configuración de Multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF).'));
    }
  }
});

// Middleware para manejar errores de Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'Archivo demasiado grande',
        message: 'El archivo excede el tamaño máximo permitido (10MB)'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Demasiados archivos',
        message: 'Solo se permite subir un archivo a la vez'
      });
    }
  } else if (err) {
    return res.status(400).json({ 
      error: 'Error al procesar el archivo',
      message: err.message
    });
  }
  next(err);
});

// Rutas de la API
app.get('/api/test', (req, res) => {
  res.json({ message: '¡API funcionando correctamente con Supabase!' });
});

// Obtener todos los platos
app.get('/api/platos', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo plato
app.post('/api/platos', upload.single('imagen'), async (req, res, next) => {
  try {
    const platoData = req.body;
    
    // Procesar la imagen si se subió
    if (req.file) {
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const fileName = `${Date.now()}${fileExt}`;
      const filePath = `platos/${fileName}`;
      
      // Subir la imagen a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('platos')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Obtener la URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('platos')
        .getPublicUrl(filePath);
      
      platoData.imagen_url = urlData.publicUrl;
    }
    
    // Insertar el plato en la base de datos
    const { data, error } = await supabase
      .from('platos')
      .insert([platoData])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      data: data[0]
    });
    
  } catch (error) {
    next(error);
  }
});

// Actualizar un plato existente
app.put('/api/platos/:id', upload.single('imagen'), async (req, res, next) => {
  try {
    const platoId = req.params.id;
    const platoData = { ...req.body };
    
    // Procesar la imagen si se subió
    if (req.file) {
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const fileName = `${Date.now()}${fileExt}`;
      const filePath = `platos/${fileName}`;
      
      // Subir la nueva imagen a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('platos')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Obtener la URL pública de la nueva imagen
      const { data: urlData } = supabase.storage
        .from('platos')
        .getPublicUrl(filePath);
      
      platoData.imagen_url = urlData.publicUrl;
      
      // Obtener la URL de la imagen anterior para eliminarla
      const { data: platoActual } = await supabase
        .from('platos')
        .select('imagen_url')
        .eq('id', platoId)
        .single();
      
      // Eliminar la imagen anterior si existe
      if (platoActual && platoActual.imagen_url) {
        const oldFilePath = platoActual.imagen_url.split('/').pop();
        await supabase.storage
          .from('platos')
          .remove([oldFilePath]);
      }
    }
    
    // Actualizar el plato en la base de datos
    const { data, error } = await supabase
      .from('platos')
      .update(platoData)
      .eq('id', platoId)
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data[0]
    });
    
  } catch (error) {
    next(error);
  }
});

// Eliminar un plato
app.delete('/api/platos/:id', async (req, res, next) => {
  try {
    const platoId = req.params.id;
    
    // Obtener la información del plato para eliminar su imagen
    const { data: plato, error: fetchError } = await supabase
      .from('platos')
      .select('imagen_url')
      .eq('id', platoId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Eliminar la imagen del almacenamiento si existe
    if (plato && plato.imagen_url) {
      const filePath = plato.imagen_url.split('/').pop();
      await supabase.storage
        .from('platos')
        .remove([filePath]);
    }
    
    // Eliminar el plato de la base de datos
    const { error } = await supabase
      .from('platos')
      .delete()
      .eq('id', platoId);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Plato eliminado correctamente'
    });
    
  } catch (error) {
    next(error);
  }
});

// Obtener un plato por ID
app.get('/api/platos/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Plato no encontrado' });
    
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Obtener platos activos
app.get('/api/platos-activos', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('platos')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
