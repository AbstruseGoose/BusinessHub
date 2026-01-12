FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY client ./client
COPY shared ./shared

# Build application
RUN npm run build:client

# Install serve to serve the static files
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "client/dist", "-l", "3000"]
