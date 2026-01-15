FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY server ./server
COPY shared ./shared

# Build application
RUN npm run build:server

EXPOSE 3001

CMD ["npm", "start"]
