# --- Etapa 1: Construcción ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias con npm
RUN npm install

# Copiar todo el código fuente del frontend
COPY . .

# Construir el frontend de Nuxt
RUN npm run build

# --- Etapa 2: Imagen final ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar solo la carpeta generada en el build (.output)
COPY --from=builder /app/.output ./.output

# Configurar variables de entorno requeridas por Nuxt
ENV PORT=3000
ENV NODE_ENV=production
# HOST 0.0.0.0 es necesario para exponerlo en Docker
ENV HOST=0.0.0.0 

# Exponer el puerto
EXPOSE 3000

# Levantar el servidor de producción
CMD ["node", ".output/server/index.mjs"]