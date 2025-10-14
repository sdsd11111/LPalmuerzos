# 🍽️ Sistema de Gestión de Menú - Los Sartenes

Sistema de gestión de menú para el restaurante Los Sartenes que incluye un panel de administración para gestionar los platos del día y una API RESTful para consumir los platos activos.

[![Node.js CI](https://github.com/tu-usuario/los-sartenes/actions/workflows/node.js.yml/badge.svg)](https://github.com/tu-usuario/los-sartenes/actions/workflows/node.js.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 🌟 Características

- 🖥️ Panel de administración intuitivo
- 🔄 API RESTful completa
- 📱 Diseño responsivo
- 🔐 Autenticación segura
- 📸 Carga de imágenes
- 🚀 Despliegue fácil
- 📊 Gestión de menús en tiempo real

## 🚀 Empezando

### 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm (v8 o superior) o yarn
- Supabase (para la base de datos)
- Navegador web moderno

### 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/los-sartenes.git
   cd los-sartenes
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configuración del entorno**
   - Copiar el archivo `.env.example` a `.env`
   - Configurar las variables de entorno necesarias

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   El servidor estará disponible en [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de Supabase
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_supabase

# Configuración de sesión
SESSION_SECRET=tu_secreto_de_sesion_seguro

# Configuración de CORS (opcional)
ALLOWED_ORIGINS=http://localhost:3000,https://tudominio.com
```

## 🏗️ Estructura del Proyecto

```
los-sartenes/
├── public/                 # Archivos estáticos
│   ├── images/             # Imágenes del sitio
│   ├── css/                # Hojas de estilo
│   └── js/                 # Scripts del cliente
├── admin/                  # Panel de administración
├── components/             # Componentes reutilizables
2. Iniciar el servidor en producción:
   ```bash
   NODE_ENV=production node server.js
   ```

## 📚 Documentación de la API

La API está disponible en `/api` con los siguientes endpoints:

### Obtener platos activos
```
GET /api/platos-activos
```

### Panel de administración
```
GET /admin
```

## 🛠️ Desarrollo

### Scripts disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con recarga automática
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código automáticamente

### Convenciones de código

- Usar ES6+ sintax
- Seguir el estándar de JavaScript
- Documentar funciones y componentes
- Escribir pruebas para nuevo código

## 🤝 Contribuyendo

¡Las contribuciones son bienvenidas! Por favor lee la [guía de contribución](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Para soporte o consultas, por favor contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com).

## Uso

1. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   O en producción:
   ```bash
   npm start
   ```

2. Acceder al panel de administración:
   ```
   http://localhost:3000/admin
   ```

3. La API estará disponible en:
   ```
   GET    /api/platos-activos    - Obtener todos los platos activos
   GET    /api/platos            - Obtener todos los platos (admin)
   POST   /api/platos            - Crear un nuevo plato (admin)
   PUT    /api/platos/:id        - Actualizar un plato (admin)
   DELETE /api/platos/:id        - Eliminar un plato (admin)
   POST   /api/platos/:id/toggle - Cambiar estado activo/inactivo (admin)
   ```

## Estructura del Proyecto

```
.
├── config/               # Configuraciones
│   └── db.js            # Configuración de la base de datos
├── database/
│   └── migrations/      # Migraciones de la base de datos
│       └── 001_create_platos_del_dia.sql
├── models/              # Modelos de datos
│   └── PlatoDelDia.js
├── public/              # Archivos estáticos
├── routes/              # Rutas de la API
│   └── api/
│       └── platos.js
├── admin/               # Panel de administración
│   └── index.html
├── .env                 # Variables de entorno (crear manualmente)
├── package.json         # Dependencias y scripts
└── server.js            # Punto de entrada de la aplicación
```

## Desarrollo

- **Modo desarrollo con recarga automática**:
  ```bash
  npm run dev
  ```

- **Crear una nueva migración**:
  Crea un nuevo archivo SQL en `database/migrations/` con el siguiente formato:
  `002_descriptive_migration_name.sql`

## Despliegue

Para producción, se recomienda:

1. Configurar un servidor web como Nginx o Apache como proxy inverso
2. Usar PM2 para gestionar el proceso de Node.js:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "los-sartenes"
   pm2 save
   pm2 startup
   ```

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado para Los Sartenes © 2025
