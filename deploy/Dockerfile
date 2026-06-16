FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de configuracion del workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY tsconfig.json ./

# Copiar todo el codigo fuente
COPY apps ./apps
COPY libs ./libs

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Construir el frontend de Panel
WORKDIR /app/apps/Panel
RUN pnpm run build

# --- Imagen final ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar la carpeta generada en el paso anterior
COPY --from=builder /app/apps/Panel/.output ./apps/Panel/.output

# Configurar variables de entorno
ENV PORT=3000
ENV NODE_ENV=production

# Exponer el puerto
EXPOSE 3000

# Levantar el servidor de produccion
CMD ["node", "apps/Panel/.output/server/index.mjs"]
