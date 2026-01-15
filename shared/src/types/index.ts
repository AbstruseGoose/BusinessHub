// User and Authentication Types
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ASSISTANT = 'ASSISTANT'
}

export * from './integrations';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  mustChangePassword?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Business Types
export interface Business {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Department Types
export interface Department {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Task {
  id: string;
  businessId: string;
  departmentId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Email Types
export interface EmailAccount {
  id: string;
  businessId: string;
  email: string;
  displayName: string;
  isActive: boolean;
}

export interface Email {
  id: string;
  accountId: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  bodyHtml?: string;
  receivedAt: Date;
  isRead: boolean;
  hasAttachments: boolean;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  businessId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  attendees?: string[];
  isAllDay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Document Types
export interface Document {
  id: string;
  businessId: string;
  departmentId?: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedById: string;
  createdAt: Date;
  updatedAt: Date;
}

// SIP Phone Types
export interface SIPAccount {
  id: string;
  businessId: string;
  username: string;
  displayName: string;
  server: string;
  port: number;
  isActive: boolean;
}

export interface CallLog {
  id: string;
  sipAccountId: string;
  direction: 'inbound' | 'outbound';
  phoneNumber: string;
  duration: number;
  startedAt: Date;
  endedAt?: Date;
  status: 'completed' | 'missed' | 'rejected';
}

// Permission Types
export interface Permission {
  userId: string;
  businessId: string;
  departmentId?: string;
  canAccessEmails: boolean;
  canAccessCalendar: boolean;
  canAccessDocuments: boolean;
  canAccessPhone: boolean;
  canManageTasks: boolean;
  canAccessIntegrations: boolean;
  canManageDepartments: boolean;
  grantedAt: Date;
}

// Dashboard Config Types
export interface DashboardWidget {
  id: string;
  type: 'stats' | 'recent_tasks' | 'calendar' | 'emails' | 'chart' | 'custom';
  position: number;
  config?: any;
}

export interface DashboardConfig {
  id: string;
  businessId: string;
  userId?: string;
  config: {
    widgets: string[];
    statsToShow: string[];
    layout?: 'grid' | 'list';
  };
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// WebSocket Event Types
export enum WebSocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  NEW_EMAIL = 'new_email',
  NEW_CALL = 'new_call',
  CALENDAR_UPDATE = 'calendar_update',
  TASK_UPDATE = 'task_update'
}

export interface WebSocketMessage<T = any> {
  event: WebSocketEvent;
  data: T;
  timestamp: Date;
}
