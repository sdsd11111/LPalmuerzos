const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://hmljlcwfmxflxilhgmha.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'tu_clave_anon_de_supabase';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'public', 'images', 'platos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const titulo = req.body.titulo || 'plato';
    const nombreArchivo = titulo
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + path.extname(file.originalname).toLowerCase();
    
    cb(null, nombreArchivo);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

// RUTAS DE LA API
app.get('/api/test', (req, res) => {
  res.json({ message: '¡La API está funcionando correctamente con Supabase!' });
});

// Obtener platos activos
app.get('/api/platos-activos', async (req, res) => {
  try {
    const { data: platos, error } = await supabase
      .from('platos')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error) throw error;
    res.json(platos);
  } catch (error) {
    console.error('Error al obtener platos activos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo plato
app.post('/api/platos', upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, valor, orden, activo } = req.body;
    
    let imagen_url = '';
    if (req.file) {
      imagen_url = `/images/platos/${req.file.filename}`;
    }
    
    const { data: plato, error } = await supabase
      .from('platos')
      .insert([
        { 
          titulo, 
          descripcion, 
          valor: parseFloat(valor), 
          imagen_url, 
          orden: parseInt(orden) || 0, 
          activo: activo === '1' || activo === true,
          creado_en: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(plato);
  } catch (error) {
    console.error('Error al crear el plato:', error);
    res.status(500).json({ error: error.message });
  }
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Ruta para el panel de administración
app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Ruta para la página principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
  console.log(`🌐 Visita http://localhost:${PORT}`);
});

// Manejo de errores
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  server.close(() => process.exit(1));
});
