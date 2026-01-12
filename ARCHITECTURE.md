# BusinessHub - System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BUSINESSHUB PORTAL                             │
│                     Multi-Business Management System                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                               │
│                     (React + TypeScript + Vite)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  UI COMPONENTS (Material-UI + Custom Theme)                      │ │
│  │  • GitHub Monokai Dark Theme (#282c34, #61AFEF)                 │ │
│  │  • Responsive Sidebar Navigation                                 │ │
│  │  • Dashboard, Admin Panel, Business Pages                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  STATE MANAGEMENT (Zustand)                                      │ │
│  │  • Auth Store (user, token, login/logout)                        │ │
│  │  • Business Store (businesses, selectedBusiness)                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  DATA LAYER (React Query + Axios)                                │ │
│  │  • API Client with JWT interceptors                              │ │
│  │  • Automatic caching & invalidation                              │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  REAL-TIME (Socket.io Client)                                    │ │
│  │  • WebSocket connection with auth                                │ │
│  │  • Event listeners: new_email, new_call, calendar_update         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▼
                            HTTP/REST + WebSocket
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVER LAYER                               │
│                  (Node.js + Express + TypeScript)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  AUTHENTICATION & AUTHORIZATION                                   │ │
│  │  • JWT token generation & validation                             │ │
│  │  • Password hashing (bcrypt)                                     │ │
│  │  • Role-based access control (ADMIN, MANAGER, ASSISTANT)         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  API ROUTES                                                       │ │
│  │  • /api/auth          - Login, Register                          │ │
│  │  • /api/users         - User management                          │ │
│  │  • /api/businesses    - Business CRUD                            │ │
│  │  • /api/emails        - Email proxy (coming soon)                │ │
│  │  • /api/calendar      - Calendar events (coming soon)            │ │
│  │  • /api/documents     - File management (coming soon)            │ │
│  │  • /api/phone         - SIP integration (coming soon)            │ │
│  │  • /api/tasks         - Task management (coming soon)            │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  WEBSOCKET SERVER (Socket.io)                                    │ │
│  │  • Authentication middleware                                      │ │
│  │  • Business room management                                       │ │
│  │  • Real-time event broadcasting                                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  BUSINESS LOGIC                                                   │ │
│  │  • Permission checking                                            │ │
│  │  • Business isolation                                             │ │
│  │  • User-business relationship management                         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▼
                            Sequelize ORM / Redis
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────┐    ┌───────────────────────────────┐  │
│  │  POSTGRESQL DATABASE       │    │  REDIS CACHE                  │  │
│  ├────────────────────────────┤    ├───────────────────────────────┤  │
│  │  • users                   │    │  • Session storage            │  │
│  │  • businesses              │    │  • Real-time data cache       │  │
│  │  • departments             │    │  • Rate limiting              │  │
│  │  • permissions             │    └───────────────────────────────┘  │
│  │  • tasks                   │                                        │
│  │  • email_accounts          │                                        │
│  │  • calendar_events         │                                        │
│  │  • documents               │                                        │
│  │  • sip_accounts            │                                        │
│  │  • call_logs               │                                        │
│  └────────────────────────────┘                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS (Phase 2+)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐│
│  │ Proton Mail  │  │ Calendar     │  │ Network      │  │ SIP Server ││
│  │ Bridge       │  │ Services     │  │ Drives       │  │            ││
│  │ (IMAP/SMTP)  │  │ (CalDAV)     │  │ (SMB/NFS)    │  │ (WebRTC)   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW EXAMPLE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. User Login:                                                         │
│     Client → POST /api/auth/login → Server validates → Returns JWT     │
│                                                                         │
│  2. Fetch Businesses:                                                   │
│     Client → GET /api/businesses (JWT) → Server checks permissions      │
│     → Queries PostgreSQL → Returns filtered businesses                  │
│                                                                         │
│  3. Create Business (Admin):                                            │
│     Client → POST /api/businesses (JWT) → Server validates role         │
│     → Creates in PostgreSQL → Returns new business                      │
│                                                                         │
│  4. Real-time Notification:                                             │
│     External event → Server → Socket.io broadcasts to business room     │
│     → All connected clients receive update → UI updates                 │
│                                                                         │
│  5. Permission Check:                                                   │
│     Client action → Server middleware → Check permissions table         │
│     → Grant/Deny access → Return result                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        SECURITY ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  AUTHENTICATION                                                   │ │
│  │  • Passwords hashed with bcrypt (salt rounds: 10)               │ │
│  │  • JWT tokens with expiration (default: 7 days)                 │ │
│  │  • Token stored in localStorage with auto-refresh               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  AUTHORIZATION                                                    │ │
│  │  • Role-based access (3 levels: ADMIN, MANAGER, ASSISTANT)      │ │
│  │  • Granular permissions per business                             │ │
│  │  • Permission types: emails, calendar, documents, phone, tasks   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  DATA PROTECTION                                                  │ │
│  │  • HTTPS in production (TLS 1.3)                                 │ │
│  │  • CORS policy enforcement                                        │ │
│  │  • SQL injection prevention (parameterized queries)              │ │
│  │  • XSS protection (Content-Security-Policy headers)              │ │
│  │  • Rate limiting on API endpoints                                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Development:                                                           │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Local Machine                                                  │   │
│  │  • Client (Vite dev server) - Port 3000                        │   │
│  │  • Server (nodemon) - Port 3001                                │   │
│  │  • PostgreSQL - Port 5432                                      │   │
│  │  • Redis - Port 6379                                           │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Docker Compose:                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Container Network                                              │   │
│  │  ├─ businesshub-client   (port 3000)                          │   │
│  │  ├─ businesshub-server   (port 3001)                          │   │
│  │  ├─ businesshub-db       (port 5432)                          │   │
│  │  └─ businesshub-redis    (port 6379)                          │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Production (Recommended):                                              │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Load Balancer / Reverse Proxy (nginx)                         │   │
│  │  ├─ HTTPS termination                                          │   │
│  │  ├─ Static file serving (client build)                        │   │
│  │  └─ Proxy to Node.js app                                      │   │
│  │                                                                 │   │
│  │  Application Servers (PM2 cluster)                             │   │
│  │  └─ Multiple Node.js processes                                 │   │
│  │                                                                 │   │
│  │  Database (PostgreSQL managed service)                         │   │
│  │  └─ Automated backups, replication                             │   │
│  │                                                                 │   │
│  │  Cache (Redis managed service)                                 │   │
│  │  └─ High availability, persistence                             │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         SCALING CONSIDERATIONS                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  • Horizontal scaling: Multiple Node.js instances behind load balancer │
│  • Database: Read replicas for heavy read workloads                    │
│  • Redis: Cluster mode for distributed caching                         │
│  • WebSocket: Sticky sessions or Redis adapter for multi-instance      │
│  • Static assets: CDN distribution                                     │
│  • File storage: Object storage (S3, MinIO) for documents              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
