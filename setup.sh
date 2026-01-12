#!/bin/bash

# BusinessHub Setup Script

echo "🚀 Setting up BusinessHub..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created. Please edit it with your configuration.${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Install root dependencies
echo -e "${BLUE}📦 Installing root dependencies...${NC}"
npm install

# Install workspace dependencies
echo -e "${BLUE}📦 Installing workspace dependencies...${NC}"
npm install --workspaces

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit .env file with your configuration"
echo "2. Start PostgreSQL and Redis (or use: docker-compose up -d postgres redis)"
echo "3. Run 'npm run dev' to start the development servers"
echo ""
echo -e "${BLUE}Development:${NC}"
echo "  npm run dev              - Start both client and server"
echo "  npm run dev:client       - Start only client (port 3000)"
echo "  npm run dev:server       - Start only server (port 3001)"
echo ""
echo -e "${BLUE}Docker:${NC}"
echo "  docker-compose up -d     - Start all services with Docker"
echo ""
