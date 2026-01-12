# BusinessHub - Multi-Business Management Portal

A comprehensive web portal for managing multiple businesses with integrated email, calendar, document management, and SIP softphone capabilities.

## 🚀 Features

- **Multi-Business Management**: Organize and switch between different businesses seamlessly
- **Department & Task Organization**: Structure your businesses with departments and tasks
- **Email Management**: Proton Mail proxy integration (coming soon)
- **Calendar Integration**: Manage schedules across all businesses (coming soon)
- **Document Management**: Network drive access for centralized file storage (coming soon)
- **SIP Softphone**: Business phone functionality per business (coming soon)
- **Admin Panel**: Complete user and permission management
- **Real-time Updates**: WebSocket integration for live notifications
- **Dark Theme**: GitHub Monokai inspired dark theme with light blue accents

## 🛠️ Tech Stack

### Backend
- Node.js + Express + TypeScript
- PostgreSQL database
- Redis for caching
- JWT authentication
- Socket.io for real-time features
- Sequelize ORM

### Frontend
- React 18 + TypeScript
- Vite for fast development
- Material-UI (MUI) components
- Zustand for state management
- React Query for data fetching
- Socket.io client

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd /workspaces/BusinessHub
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your settings:
- Database credentials
- JWT secret
- Proton Bridge settings (for email)
- SIP server settings (for phone)

### 3. Database Setup

Start PostgreSQL and create the database:

```bash
# Using Docker
docker-compose up -d postgres redis

# Or manually create database
createdb businesshub
```

The database schema will be automatically created on first run (development mode).

### 4. Run the Application

**Development Mode** (recommended for first-time setup):

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:3000`

**Using Docker** (production-like):

```bash
docker-compose up --build
```

### 5. Create Admin Account

On first login, register through the login page. Then manually update the user role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 📁 Project Structure

```
BusinessHub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Utilities (API, Socket)
│   │   ├── theme/          # Theme configuration
│   │   └── App.tsx         # Main app component
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── database/       # DB config & migrations
│   │   ├── websocket/      # Socket.io setup
│   │   └── index.ts        # Server entry point
│   └── package.json
├── shared/                 # Shared TypeScript types
│   ├── src/
│   │   └── types/          # Common interfaces
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── .env.example            # Environment template
└── package.json            # Root package.json
```

## 🎨 Theme

The portal uses a **GitHub Monokai Dark** theme with **light blue** (#61AFEF) accents:

- Background: Dark gray (#282c34)
- Secondary: Darker gray (#21252b)
- Primary Accent: Light blue (#61AFEF)
- Syntax-inspired colors for various UI elements

## 🔐 User Roles

- **ADMIN**: Full access, can manage users, businesses, and permissions
- **MANAGER**: Can manage business operations
- **ASSISTANT**: Limited access based on granted permissions

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `POST /api/users/:userId/permissions` - Grant permissions
- `DELETE /api/users/:userId/permissions/:businessId` - Revoke permissions

### Businesses
- `GET /api/businesses` - List businesses (filtered by permissions)
- `POST /api/businesses` - Create business (admin only)
- `PUT /api/businesses/:id` - Update business (admin only)
- `DELETE /api/businesses/:id` - Delete business (admin only)

## 🔌 WebSocket Events

- `new_email` - New email received
- `new_call` - Incoming call notification
- `calendar_update` - Calendar event changes
- `task_update` - Task status changes

## 🐳 Docker Deployment

Build and run with Docker Compose:

```bash
docker-compose up -d
```

Services:
- `postgres` - PostgreSQL database (port 5432)
- `redis` - Redis cache (port 6379)
- `server` - Backend API (port 3001)
- `client` - Frontend (port 3000)

## 🔧 Development

### Backend Development

```bash
cd server
npm run dev
```

### Frontend Development

```bash
cd client
npm run dev
```

### Build for Production

```bash
# Build everything
npm run build

# Or build individually
npm run build:server
npm run build:client
```

## 📝 Roadmap

### Phase 1 ✅
- ✅ Project structure
- ✅ Authentication & authorization
- ✅ Business management
- ✅ Admin panel
- ✅ Dark theme UI

### Phase 2 (Coming Soon)
- ⏳ Email integration (Proton Bridge)
- ⏳ Calendar integration
- ⏳ Document management with network drives
- ⏳ Task management system

### Phase 3
- ⏳ SIP softphone integration
- ⏳ Call logs and recording
- ⏳ Advanced notifications
- ⏳ Mobile responsive improvements

## 👤 Support

Contact your system administrator for support and access requests.