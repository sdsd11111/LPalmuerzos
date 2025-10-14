# Etapa de construcción
FROM node:16-alpine AS builder

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY .npmrc ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:16-alpine

# Crear directorio de la aplicación
WORKDIR /app

# Copiar dependencias de producción desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copiar la aplicación construida
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js .
COPY --from=builder /app/.env* ./

# Crear directorio para subidas
RUN mkdir -p /app/public/uploads

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
