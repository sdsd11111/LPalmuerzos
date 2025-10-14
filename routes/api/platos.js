const express = require('express');
const router = express.Router();
const PlatoDelDia = require('../../models/PlatoDelDia');

// =============================================
// RUTA DE PRUEBA - VERIFICAR QUE EL ROUTER FUNCIONA
// =============================================
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: '✅ El router de Platos está funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// =============================================
// RUTAS CRUD PARA PLATOS
// =============================================

// Obtener todos los platos
// RUTA: GET /api/platos
router.get('/platos', async (req, res, next) => {
  console.log('📥 Petición GET a /api/platos');
  try {
    const platos = await PlatoDelDia.findAll();
    console.log(`📋 Se encontraron ${platos.length} platos`);
    res.json({
      success: true,
      count: platos.length,
      data: platos
    });
  } catch (error) {
    console.error('❌ Error al obtener los platos:', error);
    next(error);
  }
});

// Obtener platos activos
// RUTA: GET /api/platos/activos
router.get('/platos/activos', async (req, res, next) => {
  console.log('📥 Petición GET a /api/platos/activos');
  try {
    const platos = await PlatoDelDia.findActive();
    console.log(`📋 Se encontraron ${platos.length} platos activos`);
    res.json({
      success: true,
      count: platos.length,
      data: platos
    });
  } catch (error) {
    console.error('❌ Error al obtener platos activos:', error);
    next(error);
  }
});

// Obtener un plato por ID
// RUTA: GET /api/platos/:id
router.get('/platos/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(`📥 Petición GET a /api/platos/${id}`);
  
  try {
    const plato = await PlatoDelDia.findById(id);
    
    if (!plato) {
      console.log(`⚠️ No se pudo encontrar el plato con ID ${id}`);
      return res.status(404).json({ 
        success: false,
        error: 'Plato no encontrado' 
      });
    }
    
    console.log(`✅ Plato encontrado: ${plato.titulo}`);
    res.json({
      success: true,
      data: plato
    });
  } catch (error) {
    console.error(`❌ Error al obtener el plato con ID ${id}:`, error);
    next(error);
  }
});

// Crear un nuevo plato
// RUTA: POST /api/platos
router.post('/platos', async (req, res, next) => {
  console.log('📥 Petición POST a /api/platos');
  console.log('📦 Datos recibidos:', req.body);
  
  const { titulo, descripcion, valor, imagen_url, activo } = req.body;
  
  // Validación de campos requeridos
  if (!titulo || !descripcion || valor === undefined) {
    console.warn('⚠️ Faltan campos requeridos');
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan campos requeridos: título, descripción y valor son obligatorios' 
    });
  }
  
  try {
    const id = await PlatoDelDia.create({
      titulo,
      descripcion,
      valor,
      imagen_url: imagen_url || null,
      activo: activo !== undefined ? activo : true
    });
    
    console.log(`✅ Plato creado con ID: ${id}`);
    
    // Obtener el plato recién creado para devolverlo
    const nuevoPlato = await PlatoDelDia.findById(id);
    
    res.status(201).json({
      success: true,
      message: 'Plato creado exitosamente',
      data: nuevoPlato
    });
  } catch (error) {
    console.error('❌ Error al crear el plato:', error);
    next(error);
  }
});

// Actualizar un plato existente
// RUTA: PUT /api/platos/:id
router.put('/platos/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(`📥 Petición PUT a /api/platos/${id}`);
  console.log('📦 Datos recibidos:', req.body);
  
  try {
    const { titulo, descripcion, valor, imagen_url, activo } = req.body;
    
    const platoActualizado = await PlatoDelDia.update(id, {
      titulo,
      descripcion,
      valor,
      imagen_url,
      activo
    });
    
    if (!platoActualizado) {
      console.log(`⚠️ No se pudo actualizar el plato con ID ${id}: no encontrado`);
      return res.status(404).json({ 
        success: false,
        error: 'Plato no encontrado' 
      });
    }
    
    console.log(`✅ Plato con ID ${id} actualizado correctamente`);
    res.json({
      success: true,
      message: 'Plato actualizado exitosamente',
      data: platoActualizado
    });
  } catch (error) {
    console.error(`❌ Error al actualizar el plato con ID ${id}:`, error);
    next(error);
  }
});

// Eliminar un plato
// RUTA: DELETE /api/platos/:id
router.delete('/platos/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(`📥 Petición DELETE a /api/platos/${id}`);
  
  try {
    const platoEliminado = await PlatoDelDia.delete(id);
    
    if (!platoEliminado) {
      console.log(`⚠️ No se pudo eliminar el plato con ID ${id}: no encontrado`);
      return res.status(404).json({ 
        success: false,
        error: 'Plato no encontrado' 
      });
    }
    
    console.log(`✅ Plato con ID ${id} eliminado correctamente`);
    res.json({
      success: true,
      message: 'Plato eliminado exitosamente',
      data: platoEliminado
    });
  } catch (error) {
    console.error(`❌ Error al eliminar el plato con ID ${id}:`, error);
    next(error);
  }
});

// Cambiar estado de un plato (activar/desactivar)
// RUTA: POST /api/platos/:id/toggle
router.post('/platos/:id/toggle', async (req, res, next) => {
  const { id } = req.params;
  console.log(`📥 Petición POST a /api/platos/${id}/toggle`);
  
  try {
    const plato = await PlatoDelDia.toggleStatus(id);
    
    if (!plato) {
      console.log(`⚠️ No se pudo cambiar el estado del plato con ID ${id}: no encontrado`);
      return res.status(404).json({ 
        success: false,
        error: 'Plato no encontrado' 
      });
    }
    
    console.log(`✅ Estado del plato con ID ${id} cambiado a: ${plato.activo ? 'activo' : 'inactivo'}`);
    res.json({
      success: true,
      message: `Plato ${plato.activo ? 'activado' : 'desactivado'} exitosamente`,
      data: plato
    });
  } catch (error) {
    console.error(`❌ Error al cambiar el estado del plato con ID ${id}:`, error);
    next(error);
  }
});

// =============================================
// MANEJADOR DE ERRORES DEL ROUTER
// =============================================
router.use((err, req, res, next) => {
  console.error('❌ Error en la API de Platos:', err);
  
  // Determinar el código de estado (predeterminado: 500)
  const statusCode = err.statusCode || 500;
  
  // Construir la respuesta de error
  const errorResponse = {
    success: false,
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString()
  };
  
  // Solo incluir detalles del error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
});

// =============================================
// EXPORTAR ROUTER
// =============================================
console.log('✅ Rutas de la API de Platos configuradas correctamente');

// Verificar que el router tenga las rutas esperadas
console.log('Rutas registradas en el router de platos:');
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    const methods = Object.keys(r.route.methods).map(m => m.toUpperCase()).join(', ');
    console.log(`- ${methods.padEnd(8)} /api${r.route.path}`);
  }
});

module.exports = router;
