FROM node:20-alpine
WORKDIR /app

# instalar dependências
COPY package*.json ./
RUN npm ci --omit=dev

# copiar fonte e rodar
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]

