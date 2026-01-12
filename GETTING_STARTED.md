# Getting Started with BusinessHub

## Initial Setup Complete! ✅

Your BusinessHub portal has been created with the following structure:

### ✨ What's Included

**Frontend (React + TypeScript):**
- ✅ GitHub Monokai dark theme with light blue accents
- ✅ Material-UI components
- ✅ Multi-business management interface
- ✅ Dashboard with statistics
- ✅ Admin panel for user/business management
- ✅ Authentication pages
- ✅ Placeholder pages for Email, Calendar, Documents, Phone, Tasks
- ✅ Real-time WebSocket integration
- ✅ Responsive sidebar navigation

**Backend (Node.js + Express + TypeScript):**
- ✅ JWT authentication system
- ✅ Role-based access control (Admin, Manager, Assistant)
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Business and user management APIs
- ✅ Permission system
- ✅ WebSocket server for real-time updates
- ✅ Redis integration for caching

**Database Schema:**
- ✅ Users table with roles
- ✅ Businesses table
- ✅ Permissions table (granular access control)
- ✅ Departments, tasks, emails, calendar, documents, SIP accounts tables (ready for phase 2)

## 🚀 Next Steps

### 1. Start the Database (Choose one option)

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d postgres redis
```

**Option B: Using Local PostgreSQL**
```bash
# Make sure PostgreSQL and Redis are running locally
# Default ports: PostgreSQL 5432, Redis 6379
```

### 2. Review and Edit Configuration

Edit the `.env` file to configure:
- Database connection
- JWT secret (IMPORTANT: Change in production!)
- Proton Bridge settings (for email integration)
- SIP server settings (for phone integration)

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### 4. Create Your First Admin User

1. Open http://localhost:3000
2. Click "Sign In" (you'll see the login page)
3. Register a new account (this will be an Assistant by default)
4. Promote yourself to Admin:

```bash
# Connect to your database
psql -d businesshub -U businesshub_user

# Update your user role
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
\q
```

5. Logout and login again to see the Admin panel

### 5. Create Your First Business

1. Login as Admin
2. Navigate to "Admin" in the sidebar
3. Click "Add Business"
4. Fill in:
   - Business name
   - Description
   - Brand color (default is light blue)
5. Click "Create"

### 6. Grant Permissions to Your Assistant

1. Go to Admin → Users & Permissions tab
2. Select a user
3. Click "Edit" 
4. Grant permissions for each business:
   - Email access
   - Calendar access
   - Document access
   - Phone access
   - Task management

## 📝 Development Commands

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Start only frontend
npm run dev:server       # Start only backend

# Build
npm run build            # Build both
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Production
npm start                # Start production server

# Docker
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

## 🎨 Theme Customization

The GitHub Monokai dark theme is defined in:
- `client/src/theme/colors.ts` - Color palette
- `client/src/theme/index.ts` - MUI theme configuration

Primary colors:
- Background: `#282c34`
- Accent Blue: `#61AFEF`
- Text: `#abb2bf`

## 🔧 Tech Stack Reference

**Frontend:**
- React 18 + TypeScript
- Vite (fast build tool)
- Material-UI (MUI)
- Zustand (state management)
- React Query (data fetching)
- Socket.io client
- React Router

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL + Sequelize
- Redis
- JWT authentication
- Socket.io
- Bcrypt for password hashing

## 📚 Roadmap

### Phase 1 ✅ (Complete)
- Core structure
- Authentication & authorization
- Business management
- Admin panel
- Dark theme UI

### Phase 2 (Next)
- Proton Mail email integration
- Calendar integration
- Document management with network drives
- Task management system

### Phase 3 (Future)
- SIP softphone integration
- Call logging
- Advanced notifications
- Mobile app

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Check what's using the port
lsof -i :3000  # or :3001
# Kill the process or change the port in .env
```

**Database connection failed:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432
# Check your .env DATABASE_URL
```

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🔒 Security Notes

- Change JWT_SECRET in .env before production
- Use strong passwords
- Keep dependencies updated
- Use HTTPS in production
- Set proper CORS origins
- Don't commit .env file

## 📖 Documentation

- Full README: `/workspaces/BusinessHub/README.md`
- API Routes: `/server/src/routes/`
- Frontend Components: `/client/src/components/`
- Database Schema: `/server/src/database/init.sql`

## 💡 Tips

- Use the keyboard shortcut `Ctrl+K` (or `Cmd+K`) for quick navigation
- The sidebar auto-collapses on mobile devices
- Business colors are customizable per business
- WebSocket automatically reconnects on disconnect
- All timestamps are UTC in the database

---

**Need Help?** Check the README.md file or contact your system administrator.

**Ready to start?** Run `npm run dev` and open http://localhost:3000! 🎉
