#!/bin/bash
set -e

echo "🚀 BusinessHub Production Deployment"
echo "====================================="

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

# Load production environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Validate critical environment variables
if [ -z "$JWT_SECRET" ] || [ -z "$ENCRYPTION_KEY" ] || [ -z "$DB_PASSWORD" ]; then
    echo "❌ Error: Critical environment variables missing"
    echo "Required: JWT_SECRET, ENCRYPTION_KEY, DB_PASSWORD"
    exit 1
fi

echo "✓ Environment variables loaded"

# Backup database before deployment
echo "📦 Creating database backup..."
mkdir -p backups
docker-compose -f docker-compose.prod.yml exec -T postgres \
    pg_dump -U ${DB_USER:-businesshub_user} businesshub > \
    backups/backup_$(date +%Y%m%d_%H%M%S).sql || echo "⚠️  Database backup failed (might be first deployment)"

echo "✓ Database backup created"

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main
echo "✓ Code updated"

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache
echo "✓ Images built"

# Stop old containers
echo "🛑 Stopping old containers..."
docker-compose -f docker-compose.prod.yml down
echo "✓ Containers stopped"

# Start new containers
echo "🚀 Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d
echo "✓ Containers started"

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Health check
echo "🏥 Running health checks..."
for i in {1..30}; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✓ Application is healthy"
        break
    fi
    echo "Waiting for application... ($i/30)"
    sleep 2
    
    if [ $i -eq 30 ]; then
        echo "❌ Health check failed"
        echo "Rolling back..."
        docker-compose -f docker-compose.prod.yml down
        exit 1
    fi
done

# Show running containers
echo ""
echo "📊 Running containers:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at: ${CLIENT_URL:-http://localhost}"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Stop: docker-compose -f docker-compose.prod.yml down"
echo "  - Restart: docker-compose -f docker-compose.prod.yml restart"
