# Deployment Guide

## Prerequisites

### Server Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Docker 20.10+
- Docker Compose 2.0+
- Domain name pointing to your server
- SSL certificate (Let's Encrypt recommended)
- Minimum 2GB RAM, 2 CPU cores
- 20GB+ disk space

### Required Secrets
Generate strong random secrets:
```bash
# Generate JWT_SECRET (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate strong database password
openssl rand -base64 32
```

## Initial Server Setup

### 1. Install Docker
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version
```

### 2. Setup Firewall
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### 3. Clone Repository
```bash
cd /opt
sudo git clone https://github.com/AbstruseGoose/BusinessHub.git
cd BusinessHub
sudo chown -R $USER:$USER .
```

## Configuration

### 1. Create Production Environment File
```bash
cp .env.production.example .env.production
nano .env.production
```

Fill in all required values:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Generated secret (64 chars)
- `ENCRYPTION_KEY` - Generated secret (64 chars)
- `DB_PASSWORD` - Strong database password
- `CLIENT_URL` - Your domain (https://yourdomain.com)
- `SENTRY_DSN` (optional) - For error tracking

### 2. Configure Nginx for SSL

#### Option A: Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certificate will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

#### Option B: Custom Certificate
```bash
mkdir -p nginx/ssl
# Copy your certificate files:
cp /path/to/cert.pem nginx/ssl/
cp /path/to/key.pem nginx/ssl/
```

Update `nginx/nginx.conf` to uncomment HTTPS server block and update paths.

## Deployment

### First-Time Deployment
```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Subsequent Deployments
```bash
# Pull latest changes
git pull origin main

# Run deployment script
./deploy.sh
```

### Manual Deployment Steps
If you prefer manual control:

```bash
# Load environment
export $(cat .env.production | grep -v '^#' | xargs)

# Backup database
mkdir -p backups
docker-compose -f docker-compose.prod.yml exec postgres \
    pg_dump -U businesshub_user businesshub > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Build and deploy
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Database Management

### Run Migrations
```bash
docker-compose -f docker-compose.prod.yml exec server npm run db:migrate
```

### Backup Database
```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec postgres \
    pg_dump -U businesshub_user businesshub > backup.sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres \
    psql -U businesshub_user businesshub < backup.sql
```

### Setup Automated Backups
```bash
# Create backup script
cat > /opt/BusinessHub/backup-db.sh << 'EOF'
#!/bin/bash
cd /opt/BusinessHub
mkdir -p backups
docker-compose -f docker-compose.prod.yml exec -T postgres \
    pg_dump -U businesshub_user businesshub | \
    gzip > backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Keep only last 30 days
find backups/ -name "*.sql.gz" -mtime +30 -delete
EOF

chmod +x /opt/BusinessHub/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/BusinessHub/backup-db.sh") | crontab -
```

## Monitoring

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f server
docker-compose -f docker-compose.prod.yml logs -f postgres
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Check Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Health Checks
```bash
# Application health
curl http://localhost/health

# Backend health
curl http://localhost:3001/health

# Database connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## Maintenance

### Update Application
```bash
cd /opt/BusinessHub
git pull origin main
./deploy.sh
```

### Update Dependencies
```bash
# Update npm packages
npm update
git add package-lock.json
git commit -m "Update dependencies"
git push

# Deploy
./deploy.sh
```

### Clean Up Docker Resources
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes (BE CAREFUL!)
docker volume prune

# Full system cleanup (BE VERY CAREFUL!)
docker system prune -a --volumes
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart server
```

## Rollback Procedure

If deployment fails:

```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Checkout previous version
git log --oneline  # Find previous commit
git checkout <previous-commit-hash>

# Restore database if needed
docker-compose -f docker-compose.prod.yml up -d postgres
docker-compose -f docker-compose.prod.yml exec -T postgres \
    psql -U businesshub_user businesshub < backups/backup_TIMESTAMP.sql

# Deploy previous version
./deploy.sh
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if postgres is running
docker-compose -f docker-compose.prod.yml ps postgres

# View postgres logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec postgres \
    psql -U businesshub_user -d businesshub -c "SELECT 1;"
```

### Application Not Starting
```bash
# Check all container logs
docker-compose -f docker-compose.prod.yml logs

# Check specific service
docker-compose -f docker-compose.prod.yml logs server

# Verify environment variables
docker-compose -f docker-compose.prod.yml exec server env
```

### High Memory Usage
```bash
# Check container stats
docker stats

# Restart high-memory container
docker-compose -f docker-compose.prod.yml restart server
```

### SSL Certificate Issues
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Security Checklist

- [ ] Strong passwords for all secrets
- [ ] Firewall configured (only 22, 80, 443 open)
- [ ] SSH key authentication enabled
- [ ] SSL certificate installed and configured
- [ ] Database not exposed to public internet
- [ ] Regular backups configured
- [ ] Monitoring and alerting set up
- [ ] Rate limiting enabled
- [ ] Security headers configured in nginx
- [ ] Regular security updates applied

## Performance Optimization

### Enable Redis Caching
Already configured in production, verify it's working:
```bash
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
# Should return PONG
```

### Database Optimization
```bash
# Run VACUUM and ANALYZE periodically
docker-compose -f docker-compose.prod.yml exec postgres \
    psql -U businesshub_user -d businesshub -c "VACUUM ANALYZE;"
```

### Log Rotation
Docker automatically rotates logs (max 10MB, 3 files), configured in docker-compose.prod.yml.

## Support

For issues or questions:
- Check logs: `docker-compose -f docker-compose.prod.yml logs`
- Review PRODUCTION_CHECKLIST.md
- Check GitHub Issues: https://github.com/AbstruseGoose/BusinessHub/issues
