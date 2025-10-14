const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta donde se guardará la base de datos (en la raíz del proyecto)
const DB_PATH = path.join(__dirname, '../database.sqlite');

// Crear una conexión a la base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
    inicializarBaseDeDatos();
  }
});

// Función para inicializar la base de datos
function inicializarBaseDeDatos() {
  // Crear tabla PlatosDelDia si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS PlatosDelDia (
      id_plato INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      valor REAL NOT NULL,
      imagen_url TEXT,
      activo INTEGER DEFAULT 0,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla:', err.message);
    } else {
      console.log('Tabla PlatosDelDia lista');
    }
  });
}

// Función para ejecutar consultas con promesas
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Función para ejecutar operaciones de inserción/actualización
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

module.exports = { db, query, run };
