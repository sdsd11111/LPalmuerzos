const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta a la base de datos
const dbPath = path.join(__dirname, 'database.sqlite');

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos SQLite');
  
  // Obtener todas las tablas
  db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
    if (err) {
      console.error('❌ Error al obtener las tablas:', err.message);
      db.close();
      return;
    }
    
    console.log('\n📋 Tablas en la base de datos:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
      
      // Obtener la estructura de cada tabla
      db.all(`PRAGMA table_info(${table.name});`, [], (err, columns) => {
        if (err) {
          console.error(`  ❌ Error al obtener la estructura de ${table.name}:`, err.message);
          return;
        }
        
        console.log(`\n  Estructura de ${table.name}:`);
        console.table(columns.map(col => ({
          'Columna': col.name,
          'Tipo': col.type,
          'No Nulo': col.notnull ? 'Sí' : 'No',
          'Valor por defecto': col.dflt_value || 'NULL',
          'Clave primaria': col.pk ? 'Sí' : 'No'
        })));
      });
    });
    
    // Obtener datos de ejemplo
    db.all("SELECT * FROM PlatosDelDia LIMIT 5;", [], (err, rows) => {
      if (err) {
        console.error('❌ Error al obtener datos de PlatosDelDia:', err.message);
        db.close();
        return;
      }
      
      console.log('\n📊 Datos de ejemplo de PlatosDelDia:');
      console.table(rows);
      
      // Cerrar la conexión
      db.close();
    });
  });
});
