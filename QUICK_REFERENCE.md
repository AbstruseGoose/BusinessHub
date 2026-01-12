# BusinessHub - Quick Reference

## 🚀 Quick Start Commands

```bash
# First time setup
npm install
cp .env.example .env
# Edit .env with your settings

# Start development
npm run dev

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## 🎨 UI Color Scheme

```css
/* GitHub Monokai Dark Theme */
Background Primary:   #282c34
Background Secondary: #21252b
Accent Blue:         #61AFEF (light blue)
Text Primary:        #abb2bf
Text Bright:         #ffffff

/* Syntax Inspired Colors */
Red:    #e06c75
Green:  #98c379
Yellow: #e5c07b
Blue:   #61afef
Purple: #c678dd
Cyan:   #56b6c2
Orange: #d19a66
```

## 📁 Key Files

```
Configuration:
├── .env                           # Environment variables
├── package.json                   # Root dependencies
├── docker-compose.yml             # Docker setup
└── tsconfig.json                  # TypeScript config

Backend:
├── server/src/index.ts            # Server entry point
├── server/src/routes/             # API endpoints
├── server/src/models/             # Database models
├── server/src/middleware/auth.ts  # Authentication
└── server/src/database/init.sql   # Database schema

Frontend:
├── client/src/main.tsx            # App entry point
├── client/src/App.tsx             # Main app component
├── client/src/theme/              # Theme configuration
├── client/src/stores/             # State management
├── client/src/pages/              # Page components
└── client/src/components/         # Reusable components

Shared:
└── shared/src/types/index.ts      # TypeScript types
```

## 🔐 User Roles

| Role      | Permissions |
|-----------|-------------|
| ADMIN     | Full access - manage everything |
| MANAGER   | Manage business operations |
| ASSISTANT | Limited access based on grants |

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
```

### Businesses
```
GET    /api/businesses       # List accessible businesses
POST   /api/businesses       # Create business (admin)
PUT    /api/businesses/:id   # Update business (admin)
DELETE /api/businesses/:id   # Delete business (admin)
```

### Users
```
GET    /api/users            # List all users (admin)
GET    /api/users/:id        # Get user details
PUT    /api/users/:id        # Update user
POST   /api/users/:userId/permissions  # Grant permissions (admin)
DELETE /api/users/:userId/permissions/:businessId  # Revoke (admin)
```

## 🔌 WebSocket Events

```javascript
// Client connects
socket.emit('join-business', businessId);

// Server emits
socket.on('new_email', (data) => { ... });
socket.on('new_call', (data) => { ... });
socket.on('calendar_update', (data) => { ... });
socket.on('task_update', (data) => { ... });
```

## 💾 Database Tables

```
users           # User accounts
businesses      # Business entities
departments     # Business departments
permissions     # User-business access control
tasks           # Task management
email_accounts  # Email accounts per business
calendar_events # Calendar entries
documents       # Document metadata
sip_accounts    # SIP phone accounts
call_logs       # Phone call history
```

## 🛠️ Development Workflow

### 1. Create a new feature

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# Test locally

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

### 2. Database changes

```bash
# Update models in: server/src/models/
# Update init.sql in: server/src/database/init.sql
# Restart server to apply changes (dev mode auto-syncs)
```

### 3. Add new page

```typescript
// 1. Create page component
// client/src/pages/MyNewPage.tsx

// 2. Add route in App.tsx
<Route path="/my-page" element={<MyNewPage />} />

// 3. Add to sidebar in MainLayout.tsx
{ path: '/my-page', label: 'My Page', icon: <Icon /> }
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f server  # specific service

# Restart a service
docker-compose restart server

# Stop all
docker-compose down

# Rebuild
docker-compose up -d --build

# Database access
docker-compose exec postgres psql -U businesshub_user -d businesshub
```

## 🔍 Debugging

### Backend
```bash
# Check server logs
npm run dev:server

# Database queries (add to code)
console.log(await User.findAll());
```

### Frontend
```bash
# React DevTools in browser
# Check Network tab for API calls
# Console logs
console.log('State:', useAuthStore.getState());
```

### Database
```bash
# Connect to database
psql -d businesshub -U businesshub_user

# Useful queries
SELECT * FROM users;
SELECT * FROM businesses;
SELECT * FROM permissions;
\dt  # List tables
\d users  # Describe table
```

## 📦 Dependencies

### Key Backend Packages
- express - Web framework
- sequelize - ORM
- pg - PostgreSQL client
- jsonwebtoken - JWT auth
- bcrypt - Password hashing
- socket.io - WebSockets
- redis - Caching

### Key Frontend Packages
- react - UI framework
- @mui/material - UI components
- zustand - State management
- react-query - Data fetching
- socket.io-client - WebSocket client
- axios - HTTP client

## ⚡ Performance Tips

1. **Database Indexes**: Already defined in init.sql
2. **Redis Caching**: Use for frequently accessed data
3. **React Query**: Automatic caching and invalidation
4. **Lazy Loading**: Import components dynamically
5. **WebSocket**: Use for real-time updates instead of polling

## 🔧 Customization

### Change Theme Colors
Edit `client/src/theme/colors.ts`

### Modify Database Schema
Edit `server/src/database/init.sql` and models

### Add New Permissions
Update Permission model and UI in AdminPage

### Change Ports
Edit `.env` file:
```
PORT=3001        # Backend
VITE_PORT=3000   # Frontend (in vite.config.ts)
```

## 🚨 Common Issues

**"Cannot find module '@businesshub/shared'"**
```bash
npm install --workspaces
cd shared && npm run build
```

**"Database connection refused"**
```bash
# Check if PostgreSQL is running
docker-compose up -d postgres
# Or start local PostgreSQL service
```

**"Port 3000 already in use"**
```bash
lsof -i :3000
kill -9 <PID>
# Or change port in vite.config.ts
```

**TypeScript errors**
```bash
# Rebuild shared types
cd shared && npm run build
# Restart TypeScript server in VSCode
```

## 📞 Contact

For support, contact your system administrator or project maintainer.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
