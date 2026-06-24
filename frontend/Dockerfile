# Imagen del frontend React + Vite (ARMD-AI) en modo desarrollo
FROM node:20-slim

WORKDIR /app

# Instala dependencias dentro del contenedor (Linux), no se reusan las de Windows.
COPY package.json package-lock.json* ./
RUN npm install

# El codigo fuente se monta como volumen (ver docker-compose.yml).

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
